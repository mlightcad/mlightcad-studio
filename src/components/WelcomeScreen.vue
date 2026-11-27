<template>
  <section class="page">
    <div class="hero">
      <div class="hero-copy">
        <h1 class="title">
          <span class="title-light">MLightCAD</span>
          <span class="title-accent">Studio</span>
        </h1>
        <p class="lede">{{ t.welcome.subtitle }}</p>
        <div class="actions">
          <button type="button" class="btn btn-primary" @click="handleOpen">
            <AppIcon name="folder" :size="18" />
            <span>{{ t.welcome.open }}</span>
          </button>
          <button
            type="button"
            class="btn btn-ghost"
            @click="emit('new-drawing')"
          >
            <AppIcon name="plus" :size="17" />
            <span>{{ t.welcome.newDrawing }}</span>
          </button>
        </div>
        <div class="mode">
          <span class="mode-label">{{ t.welcome.openMode }}</span>
          <div class="segmented" role="radiogroup" :aria-label="t.welcome.openMode">
            <button
              v-for="mode in modes"
              :key="mode.value"
              type="button"
              class="segment"
              :class="{ 'is-active': openMode === mode.value }"
              role="radio"
              :aria-checked="openMode === mode.value"
              @click="emit('update:open-mode', mode.value)"
            >
              {{ mode.label }}
            </button>
          </div>
        </div>
      </div>
      <div class="hero-art">
        <BlueprintArt variant="flange" />
      </div>
    </div>

    <section class="recent-panel">
      <header class="recent-head">
        <div class="recent-title">
          <AppIcon name="clock" :size="16" />
          <h2>{{ t.welcome.recent }}</h2>
        </div>
        <button
          v-if="recentFiles.length"
          type="button"
          class="clear"
          @click="emit('clear-recent')"
        >
          <AppIcon name="trash" :size="15" />
          <span>{{ t.welcome.clearRecent }}</span>
        </button>
      </header>

      <ul v-if="recentFiles.length" class="recent-list">
        <li
          v-for="file in recentFiles"
          :key="file.path"
          class="recent-item"
        >
          <button
            type="button"
            class="recent-main"
            :title="file.path"
            @click="emit('open-path', file.path)"
          >
            <span class="file-icon" aria-hidden="true">
              <svg viewBox="0 0 40 46" width="34" height="39">
                <path
                  d="M6 3.5h18.5L34.5 13v26.5a3 3 0 0 1-3 3h-25a3 3 0 0 1-3-3v-33a3 3 0 0 1 3-3z"
                  fill="rgba(59, 130, 246, 0.16)"
                  stroke="rgba(107, 165, 255, 0.6)"
                  stroke-width="1.2"
                />
                <path
                  d="M24 3.8V11a2.4 2.4 0 0 0 2.4 2.4h7.7"
                  fill="none"
                  stroke="rgba(107, 165, 255, 0.5)"
                  stroke-width="1.2"
                />
                <rect
                  x="7.5"
                  y="24"
                  width="23"
                  height="11.5"
                  rx="2.6"
                  fill="#2563eb"
                />
                <text
                  x="19"
                  y="32.4"
                  text-anchor="middle"
                  font-size="6.6"
                  font-weight="700"
                  fill="#ffffff"
                  font-family="system-ui, sans-serif"
                  letter-spacing="0.3"
                >
                  DWG
                </text>
              </svg>
            </span>
            <span class="file-meta">
              <span class="file-name">{{ file.name }}</span>
              <span class="file-path" dir="ltr">{{ file.path }}</span>
            </span>
          </button>

          <time class="file-time" :datetime="new Date(file.openedAt).toISOString()">
            {{ formatTime(file.openedAt) }}
          </time>

          <div class="file-actions">
            <button
              type="button"
              class="icon-btn"
              :aria-label="t.welcome.more"
              :aria-expanded="menuPath === file.path"
              @click.stop="toggleMenu(file.path)"
            >
              <AppIcon name="dots" :size="17" />
            </button>
            <div v-if="menuPath === file.path" class="menu" @click.stop>
              <button type="button" @click="copyPath(file.path)">
                <AppIcon name="copy" :size="15" />
                <span>
                  {{
                    copiedPath === file.path
                      ? t.welcome.copied
                      : t.welcome.copyPath
                  }}
                </span>
              </button>
              <button
                type="button"
                class="danger"
                @click="removeRecent(file.path)"
              >
                <AppIcon name="trash" :size="15" />
                <span>{{ t.welcome.remove }}</span>
              </button>
            </div>
          </div>
        </li>
      </ul>

      <div v-else class="empty">
        <span class="empty-icon">
          <AppIcon name="clock" :size="22" />
        </span>
        <p class="empty-title">{{ t.welcome.noRecent }}</p>
        <p class="empty-hint">{{ t.welcome.noRecentHint }}</p>
      </div>
    </section>

    <input
      ref="fileInput"
      type="file"
      accept=".dwg,.dxf"
      hidden
      @change="handleBrowserFile"
    />
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

import { hostMessages } from '../i18n'
import { AcEdOpenMode } from '../openOptions'
import type { RecentFile } from '../store'
import AppIcon from './AppIcon.vue'
import BlueprintArt from './BlueprintArt.vue'
import { isTauri } from '../desktop/platform'

defineProps<{
  recentFiles: RecentFile[]
  openMode: AcEdOpenMode
}>()

const emit = defineEmits<{
  open: []
  'open-path': [path: string]
  'new-drawing': []
  'update:open-mode': [mode: AcEdOpenMode]
  'clear-recent': []
  'remove-recent': [path: string]
  file: [file: File]
}>()

const t = hostMessages

const modes = computed(() => [
  { value: AcEdOpenMode.Read, label: t.value.welcome.modeRead },
  { value: AcEdOpenMode.Review, label: t.value.welcome.modeReview },
  { value: AcEdOpenMode.Write, label: t.value.welcome.modeWrite }
])

const menuPath = ref<string | null>(null)
const copiedPath = ref<string | null>(null)
let copyTimer: number | undefined

const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp)
  const pad = (value: number) => String(value).padStart(2, '0')
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}`
  )
}

const toggleMenu = (path: string) => {
  menuPath.value = menuPath.value === path ? null : path
}

const closeMenu = () => {
  menuPath.value = null
}

const copyPath = async (path: string) => {
  try {
    await navigator.clipboard.writeText(path)
    copiedPath.value = path
    window.clearTimeout(copyTimer)
    copyTimer = window.setTimeout(() => {
      copiedPath.value = null
    }, 1800)
  } catch {
    // Clipboard access can be denied by the webview; leave the menu as is.
  }
}

const removeRecent = (path: string) => {
  menuPath.value = null
  emit('remove-recent', path)
}

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') closeMenu()
}

onMounted(() => {
  document.addEventListener('click', closeMenu)
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.removeEventListener('click', closeMenu)
  document.removeEventListener('keydown', onKeydown)
  window.clearTimeout(copyTimer)
})

const fileInput = ref<HTMLInputElement | null>(null)

const handleOpen = () => {
  if (isTauri()) {
    emit('open')
  } else {
    fileInput.value?.click()
  }
}

const handleBrowserFile = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) {
    emit('file', file)
  }
  input.value = ''
}
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
}

.hero {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 0.92fr);
  align-items: center;
  gap: 16px;
  padding: 0 0 16px;
  overflow: hidden;
}

.hero-copy {
  position: relative;
  z-index: 1;
  min-width: 0;
}

.title {
  margin: 0;
  font-size: clamp(28px, 2.9vw, 38px);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.1;
  white-space: nowrap;
}

.title-light {
  color: #f2f6ff;
}

.title-accent {
  margin-inline-start: 0.22em;
  background: linear-gradient(120deg, #6aa8ff 0%, #2f7bff 55%, #1d4ed8 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.lede {
  margin: 12px 0 0;
  max-width: 460px;
  font-size: 13.5px;
  line-height: 1.6;
  color: var(--text-dim);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 22px;
}

.mode {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin-top: 18px;
}

.mode-label {
  font-size: 12.5px;
  color: var(--text-faint);
}

.segmented {
  display: inline-flex;
  padding: 3px;
  border: 1px solid rgba(140, 175, 230, 0.18);
  border-radius: 9px;
  background: rgba(255, 255, 255, 0.03);
}

.segment {
  padding: 5px 13px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--text-dim);
  font-family: inherit;
  font-size: 12.5px;
  cursor: pointer;
  transition:
    background-color 0.16s ease,
    color 0.16s ease,
    box-shadow 0.16s ease;
}

.segment:hover {
  color: var(--text);
}

.segment.is-active {
  background: linear-gradient(135deg, #2f74ff, #1e51d6);
  color: #fff;
  box-shadow: 0 6px 14px rgba(37, 99, 235, 0.32);
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  height: 42px;
  padding-inline: 19px;
  border: 1px solid transparent;
  border-radius: 10px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  color: var(--text);
  cursor: pointer;
  transition:
    background-color 0.16s ease,
    border-color 0.16s ease,
    box-shadow 0.16s ease,
    transform 0.12s ease;
}

.btn:active {
  transform: translateY(1px);
}

.btn-primary {
  background: linear-gradient(135deg, #3f8cff, #2563eb);
  color: #fff;
  box-shadow:
    0 14px 28px rgba(37, 99, 235, 0.34),
    inset 0 1px 0 rgba(255, 255, 255, 0.22);
}

.btn-primary:hover {
  background: linear-gradient(135deg, #5198ff, #2f6ff0);
  box-shadow:
    0 16px 32px rgba(37, 99, 235, 0.42),
    inset 0 1px 0 rgba(255, 255, 255, 0.26);
}

.btn-ghost {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(140, 175, 230, 0.28);
  color: var(--text);
}

.btn-ghost:hover {
  background: rgba(59, 130, 246, 0.1);
  border-color: rgba(96, 165, 250, 0.5);
}

.hero-art {
  min-width: 0;
  margin-inline-end: -18px;
  opacity: 0.92;
}

.hero-art :deep(svg) {
  max-height: 260px;
  width: auto;
  max-width: 100%;
  margin-inline-start: auto;
}

.recent-panel {
  border: 1px solid var(--border);
  border-radius: 18px;
  background: linear-gradient(
    180deg,
    rgba(20, 31, 51, 0.72),
    rgba(10, 17, 30, 0.82)
  );
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.38);
  backdrop-filter: blur(10px);
}

.recent-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 18px 20px 14px;
}

.recent-title {
  display: flex;
  align-items: center;
  gap: 9px;
  color: var(--text-dim);
}

.recent-title h2 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: var(--text);
}

.clear {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 6px 10px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--text-dim);
  font-family: inherit;
  font-size: 12.5px;
  cursor: pointer;
  transition:
    background-color 0.16s ease,
    color 0.16s ease;
}

.clear:hover {
  background: rgba(255, 255, 255, 0.06);
  color: var(--text);
}

.recent-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
  padding: 0 14px 14px;
  max-height: 328px;
  overflow-y: auto;
  list-style: none;
}

.recent-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border: 1px solid transparent;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.025);
  transition:
    background-color 0.16s ease,
    border-color 0.16s ease;
}

.recent-item:hover {
  border-color: rgba(96, 165, 250, 0.26);
  background: rgba(59, 130, 246, 0.08);
}

.recent-main {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0;
  border: 0;
  background: none;
  color: inherit;
  font-family: inherit;
  text-align: start;
  cursor: pointer;
}

.file-icon {
  display: flex;
  flex: none;
}

.file-meta {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.file-name {
  font-size: 13.5px;
  color: var(--text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-path {
  font-size: 11.5px;
  color: var(--text-faint);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-time {
  flex: none;
  font-size: 11.5px;
  color: var(--text-faint);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.file-actions {
  position: relative;
  flex: none;
}

.icon-btn {
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--text-dim);
  cursor: pointer;
  transition:
    background-color 0.16s ease,
    color 0.16s ease;
}

.icon-btn:hover {
  background: rgba(255, 255, 255, 0.07);
  color: var(--text);
}

.menu {
  position: absolute;
  top: calc(100% + 6px);
  inset-inline-end: 0;
  z-index: 6;
  min-width: 158px;
  padding: 4px;
  border: 1px solid rgba(120, 160, 220, 0.2);
  border-radius: 10px;
  background: #0f1a2c;
  box-shadow: 0 18px 36px rgba(0, 0, 0, 0.5);
}

.menu button {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 8px 10px;
  border: 0;
  border-radius: 7px;
  background: transparent;
  color: var(--text-dim);
  font-family: inherit;
  font-size: 12.5px;
  text-align: start;
  cursor: pointer;
}

.menu button:hover {
  background: rgba(255, 255, 255, 0.07);
  color: var(--text);
}

.menu button.danger {
  color: #f48a8a;
}

.menu button.danger:hover {
  background: rgba(248, 113, 113, 0.12);
  color: #ffb4b4;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  margin: 0 14px 14px;
  padding: 30px 20px 32px;
  border: 1px dashed rgba(120, 160, 220, 0.18);
  border-radius: 12px;
  text-align: center;
}

.empty-icon {
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  margin-bottom: 8px;
  border-radius: 12px;
  background: rgba(59, 130, 246, 0.12);
  color: #7fb0ff;
}

.empty-title {
  margin: 0;
  font-size: 13px;
  color: var(--text-dim);
}

.empty-hint {
  margin: 0;
  font-size: 12px;
  color: var(--text-faint);
}

.recent-list::-webkit-scrollbar {
  width: 8px;
}

.recent-list::-webkit-scrollbar-thumb {
  border: 2px solid transparent;
  border-radius: 999px;
  background-clip: content-box;
  background-color: rgba(120, 160, 220, 0.22);
}

@media (max-width: 1180px) {
  .hero {
    grid-template-columns: minmax(0, 1fr) minmax(0, 0.8fr);
  }

  .hero-art {
    opacity: 0.75;
    margin-inline-end: 0;
  }
}

@media (max-width: 1040px) {
  .hero {
    grid-template-columns: minmax(0, 1fr);
    min-height: 0;
  }

  .hero-art {
    position: absolute;
    inset-inline-end: -150px;
    top: -30px;
    width: 480px;
    margin: 0;
    opacity: 0.28;
  }

  .lede {
    max-width: 400px;
  }
}
</style>
