<template>
  <div id="app-root">
    <!-- Welcome screen when no drawing is open -->
    <div v-if="!showViewer" class="welcome-screen">
      <WelcomeScreen
        :recent-files="recentFiles"
        :open-mode="store.openMode"
        @open="openFromDialog"
        @open-path="openPath"
        @new-drawing="handleNewDrawing"
        @update:open-mode="store.openMode = $event"
        @file="handleBrowserFile"
      />
      <!-- Stay on the welcome UI while CAD chunks load -->
      <div v-if="preparingViewer" class="preparing-overlay" aria-live="polite">
        <div class="preparing-spinner" />
        <p>Preparing viewer…</p>
      </div>
    </div>

    <!-- Mount only after the CAD module is ready -->
    <div v-else-if="MlCadViewer" class="viewer-screen">
      <component
        :is="MlCadViewer"
        locale="default"
        :local-file="store.selectedFile ?? undefined"
        :mode="store.openMode"
        :use-main-thread-draw="true"
        :draw-no-plot-layers="false"
        :progressive-rendering="false"
        :circle-sides="ACDB_DRAW_CIRCLE_SIDES_DRAFT"
        :paper-space-background="ACGI_PAPER_SPACE_BACKGROUND"
        :disable-export="false"
        @create="onViewerCreate"
        :base-url="BASE_URL"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { message } from '@tauri-apps/plugin-dialog'
import {
  computed,
  getCurrentInstance,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  shallowRef,
  watch,
  type Component
} from 'vue'

import WelcomeScreen from './components/WelcomeScreen.vue'
import { initDragDrop } from './desktop/dragDrop'
import { initMenu, rebuildMenu } from './desktop/menu'
import {
  fileNameOf,
  isDrawingPath,
  pickDrawingFile,
  readDrawingFile
} from './desktop/openFiles'
import {
  addRecentFile,
  clearRecentFiles,
  listRecentFiles,
  removeRecentFile
} from './desktop/recentFiles'
import { listenOpenFiles, setWindowTitle, takeLaunchFiles } from './desktop/startup'
import {
  ACDB_DRAW_CIRCLE_SIDES_DRAFT,
  ACGI_PAPER_SPACE_BACKGROUND
} from './openOptions'
import { store, type RecentFile } from './store'

const BASE_URL = 'https://cdn.jsdelivr.net/gh/mlightcad/cad-data@main/'

const showViewer = computed(
  () => store.selectedFile != null || store.isNewDrawing
)

const preparingViewer = ref(false)
const recentFiles = ref<RecentFile[]>([])

let i18nInstalled = false
const MlCadViewer = shallowRef<Component>()

// Capture at setup time: `getCurrentInstance()` is null inside async callbacks.
const app = getCurrentInstance()!.appContext.app

const loadCadViewer = async () => {
  if (MlCadViewer.value) return
  const [
    { LIBREDWG_PARSER_WORKER_FILE, AcApSettingManager },
    { registerLibreDwgConverter },
    { initializeLocale },
    { MlCadViewer: Viewer, i18n }
  ] = await Promise.all([
    import('@mlightcad/cad-simple-viewer'),
    import('./registerLibreDwg'),
    import('./locale'),
    import('@mlightcad/cad-viewer')
  ])

  // Isolate this app's persisted prefs from other cad-* apps sharing the origin.
  AcApSettingManager.configure({
    storageKey: 'mlightcad.settings.mlightcad-studio'
  })
  // Merge host command descriptions before the viewer mounts.
  initializeLocale()
  // Opt into GPL DWG support before the viewer opens any drawing.
  registerLibreDwgConverter(`./assets/${LIBREDWG_PARSER_WORKER_FILE}`)
  if (!i18nInstalled) {
    // The viewer's components call `useI18n()`; install its instance once.
    app.use(i18n)
    i18nInstalled = true
  }
  MlCadViewer.value = Viewer as Component
}

/** Warm CAD chunks after first paint so opening a file is faster. */
const prefetchCadStack = () => {
  void Promise.all([
    loadCadViewer(),
    import('@mlightcad/cad-simple-viewer'),
    import('./commands')
  ])
}

const initialize = async () => {
  const { AcApDocManager, AcEdCommandStack } = await import(
    '@mlightcad/cad-simple-viewer'
  )
  const { AcApQuitCmd } = await import('./commands')

  if (import.meta.env.DEV) {
    ;(
      window as Window & { AcApDocManager?: typeof AcApDocManager }
    ).AcApDocManager = AcApDocManager
  }
  const register = AcApDocManager.instance.commandManager
  register.addCommand(
    AcEdCommandStack.SYSTEMT_COMMAND_GROUP_NAME,
    'quit',
    'quit',
    new AcApQuitCmd()
  )
  register.addCommand(
    AcEdCommandStack.SYSTEMT_COMMAND_GROUP_NAME,
    'exit',
    'exit',
    new AcApQuitCmd()
  )
}

const createNewDrawing = async () => {
  const { AcApDocManager, layoutBackgroundColorFromRgb } = await import(
    '@mlightcad/cad-simple-viewer'
  )
  const success = await AcApDocManager.instance.newDocument({
    mode: store.openMode,
    drawNoPlotLayers: false,
    progressiveRendering: false,
    circleSides: ACDB_DRAW_CIRCLE_SIDES_DRAFT,
    sysVars: {
      paperbkcolor: layoutBackgroundColorFromRgb(ACGI_PAPER_SPACE_BACKGROUND)
    }
  })
  if (!success) {
    console.error('Failed to create new drawing')
  }
}

const onViewerCreate = async () => {
  await initialize()
  if (store.isNewDrawing) {
    await nextTick()
    await createNewDrawing()
  }
}

/** Ensure the CAD module is ready, then run `open`. */
const prepareThenOpen = async (open: () => void): Promise<boolean> => {
  if (preparingViewer.value) return false
  preparingViewer.value = true
  try {
    await loadCadViewer()
    open()
    return true
  } catch (error) {
    console.error('Failed to load CAD viewer', error)
    await message('Failed to load the CAD viewer module.', {
      title: 'MLightCAD Studio',
      kind: 'error'
    })
    return false
  } finally {
    preparingViewer.value = false
  }
}

const handleBrowserFile = async (file: File) => {
  await prepareThenOpen(() => {
    store.isNewDrawing = false
    store.selectedFile = file
    store.selectedPath = null
  })
}

const handleNewDrawing = async () => {
  await prepareThenOpen(() => {
    store.selectedFile = null
    store.selectedPath = null
    store.isNewDrawing = true
  })
}

const closeDrawing = () => {
  store.selectedFile = null
  store.selectedPath = null
  store.isNewDrawing = false
}

const openPath = async (path: string) => {
  if (!isDrawingPath(path)) {
    await message(`Unsupported file type:\n${path}`, {
      title: 'MLightCAD Studio',
      kind: 'warning'
    })
    return
  }
  if (preparingViewer.value) return

  let file: File
  try {
    file = await readDrawingFile(path)
  } catch (error) {
    console.error('[studio] failed to read drawing', error)
    // The file may have been moved or deleted: drop it from the recent list.
    recentFiles.value = await removeRecentFile(path)
    await rebuildMenu()
    await message(`Failed to open drawing:\n${path}`, {
      title: 'MLightCAD Studio',
      kind: 'error'
    })
    return
  }

  const opened = await prepareThenOpen(() => {
    store.isNewDrawing = false
    store.selectedFile = file
    store.selectedPath = path
  })
  if (!opened) return

  recentFiles.value = await addRecentFile(path)
  await rebuildMenu()
}

const openPaths = async (paths: string[]) => {
  const drawings = paths.filter(isDrawingPath)
  const ignored = paths.filter(path => !isDrawingPath(path))
  if (ignored.length) {
    console.warn('[studio] ignored non-drawing files:', ignored)
  }
  if (!drawings.length) return
  if (drawings.length > 1) {
    console.warn(
      '[studio] only one drawing can be open at a time; ignoring:',
      drawings.slice(1)
    )
  }
  await openPath(drawings[0])
}

const openFromDialog = async () => {
  const path = await pickDrawingFile()
  if (path) {
    await openPath(path)
  }
}

const menuHandlers = {
  onOpen: openFromDialog,
  onNew: handleNewDrawing,
  onOpenRecent: openPath,
  onClearRecent: async () => {
    recentFiles.value = await clearRecentFiles()
    await rebuildMenu()
  },
  onCloseDrawing: closeDrawing,
  getRecentFiles: () => recentFiles.value
}

watch(
  () => store.selectedPath,
  path => {
    void setWindowTitle(path ? fileNameOf(path) : undefined)
  }
)

let unlistenDragDrop: (() => void) | undefined
let unlistenOpenFiles: (() => void) | undefined

const bootstrapDesktop = async () => {
  recentFiles.value = await listRecentFiles()
  await initMenu(menuHandlers)
  unlistenDragDrop = await initDragDrop(paths => void openPaths(paths))
  unlistenOpenFiles = await listenOpenFiles(paths => void openPaths(paths))
  const launchFiles = await takeLaunchFiles()
  if (launchFiles.length) {
    await openPaths(launchFiles)
  }
}

onMounted(() => {
  void bootstrapDesktop()

  const startPrefetch = () => {
    if (showViewer.value || preparingViewer.value) return
    prefetchCadStack()
  }

  if (typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(startPrefetch, { timeout: 3000 })
  } else {
    window.setTimeout(startPrefetch, 500)
  }
})

onUnmounted(() => {
  unlistenDragDrop?.()
  unlistenOpenFiles?.()
})
</script>

<style scoped>
#app-root {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
}

.welcome-screen {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.preparing-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: rgba(15, 23, 42, 0.32);
  color: #fff;
  font-family: system-ui, sans-serif;
  font-size: 14px;
  z-index: 2;
}

.preparing-spinner {
  width: 36px;
  height: 36px;
  border: 3px solid rgba(255, 255, 255, 0.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: preparing-spin 0.8s linear infinite;
}

@keyframes preparing-spin {
  to {
    transform: rotate(360deg);
  }
}

.viewer-screen {
  width: 100%;
  height: 100%;
}
</style>
