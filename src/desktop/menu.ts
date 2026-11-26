import { getVersion } from '@tauri-apps/api/app'
import {
  Menu,
  MenuItem,
  PredefinedMenuItem,
  Submenu
} from '@tauri-apps/api/menu'
import { getCurrentWindow } from '@tauri-apps/api/window'
import { message } from '@tauri-apps/plugin-dialog'
import { openUrl } from '@tauri-apps/plugin-opener'

import type { RecentFile } from '../store'
import { isTauri } from './platform'
import { APP_TITLE } from './startup'

const HOMEPAGE_URL = 'https://github.com/mlightcad/cad-viewer'
const USER_GUIDE_URL = 'https://mlightcad.com/cad-viewer/docs/'

const isMac = (): boolean => navigator.userAgent.includes('Mac')

type MenuEntry = MenuItem | PredefinedMenuItem | Submenu

export interface MenuHandlers {
  onOpen: () => void | Promise<void>
  onNew: () => void | Promise<void>
  onOpenRecent: (path: string) => void | Promise<void>
  onClearRecent: () => void | Promise<void>
  onCloseDrawing: () => void | Promise<void>
  getRecentFiles: () => RecentFile[]
}

let handlers: MenuHandlers | null = null

const showAbout = async (): Promise<void> => {
  const version = await getVersion()
  await message(
    `${APP_TITLE} ${version}\n\n` +
      'Desktop edition of MLightCAD — a fully offline DWG/DXF viewer and editor ' +
      'powered by a browser rendering engine.\n\n' +
      'DWG support is provided by LibreDWG (GPL).',
    { title: `About ${APP_TITLE}`, kind: 'info' }
  )
}

const toggleFullscreen = async (): Promise<void> => {
  const window = getCurrentWindow()
  const fullscreen = await window.isFullscreen()
  await window.setFullscreen(!fullscreen)
}

const buildRecentSubmenu = async (
  recentFiles: RecentFile[]
): Promise<Submenu> => {
  const items: MenuItem[] = recentFiles.length
    ? await Promise.all(
        recentFiles.map(file =>
          MenuItem.new({
            id: `recent:${file.path}`,
            text: file.name,
            action: () => void handlers?.onOpenRecent(file.path)
          })
        )
      )
    : [
        await MenuItem.new({
          id: 'recent:empty',
          text: 'No Recent Drawings',
          enabled: false
        })
      ]

  return Submenu.new({
    text: 'Open Recent',
    items: [
      ...items,
      await PredefinedMenuItem.new({ item: 'Separator' }),
      await MenuItem.new({
        id: 'recent:clear',
        text: 'Clear Recent Drawings',
        enabled: recentFiles.length > 0,
        action: () => void handlers?.onClearRecent()
      })
    ]
  })
}

const buildAppMenu = async (): Promise<Submenu> =>
  Submenu.new({
    text: APP_TITLE,
    items: [
      await MenuItem.new({
        id: 'app:about',
        text: `About ${APP_TITLE}`,
        action: () => void showAbout()
      }),
      await PredefinedMenuItem.new({ item: 'Separator' }),
      await PredefinedMenuItem.new({ item: 'Services' }),
      await PredefinedMenuItem.new({ item: 'Separator' }),
      await PredefinedMenuItem.new({ item: 'Hide' }),
      await PredefinedMenuItem.new({ item: 'HideOthers' }),
      await PredefinedMenuItem.new({ item: 'ShowAll' }),
      await PredefinedMenuItem.new({ item: 'Separator' }),
      await PredefinedMenuItem.new({ item: 'Quit' })
    ]
  })

const buildFileMenu = async (recentFiles: RecentFile[]): Promise<Submenu> =>
  Submenu.new({
    text: 'File',
    items: [
      await MenuItem.new({
        id: 'file:open',
        text: 'Open…',
        accelerator: 'CmdOrCtrl+O',
        action: () => void handlers?.onOpen()
      }),
      await MenuItem.new({
        id: 'file:new',
        text: 'New Drawing',
        accelerator: 'CmdOrCtrl+N',
        action: () => void handlers?.onNew()
      }),
      await PredefinedMenuItem.new({ item: 'Separator' }),
      await MenuItem.new({
        id: 'file:close',
        text: 'Close Drawing',
        accelerator: 'CmdOrCtrl+W',
        action: () => void handlers?.onCloseDrawing()
      }),
      await buildRecentSubmenu(recentFiles),
      await PredefinedMenuItem.new({ item: 'Separator' }),
      await PredefinedMenuItem.new({ item: 'Quit' })
    ]
  })

const buildViewMenu = async (): Promise<Submenu> => {
  const items: MenuEntry[] = []
  if (import.meta.env.DEV) {
    items.push(
      await MenuItem.new({
        id: 'view:reload',
        text: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        action: () => window.location.reload()
      }),
      await PredefinedMenuItem.new({ item: 'Separator' })
    )
  }
  items.push(
    await PredefinedMenuItem.new({ item: 'Separator' }),
    await MenuItem.new({
      id: 'view:fullscreen',
      text: 'Toggle Fullscreen',
      accelerator: isMac() ? 'Ctrl+Command+F' : 'F11',
      action: () => void toggleFullscreen()
    })
  )
  return Submenu.new({ text: 'View', items })
}

const buildHelpMenu = async (): Promise<Submenu> => {
  const items: MenuEntry[] = [
    await MenuItem.new({
      id: 'help:homepage',
      text: 'Project Homepage',
      action: () => void openUrl(HOMEPAGE_URL)
    }),
    await MenuItem.new({
      id: 'help:guide',
      text: 'User Guide',
      action: () => void openUrl(USER_GUIDE_URL)
    })
  ]
  if (!isMac()) {
    items.push(
      await PredefinedMenuItem.new({ item: 'Separator' }),
      await MenuItem.new({
        id: 'help:about',
        text: `About ${APP_TITLE}`,
        action: () => void showAbout()
      })
    )
  }
  return Submenu.new({ text: 'Help', items })
}

/** Builds (or rebuilds) the native application menu. */
export const rebuildMenu = async (): Promise<void> => {
  if (!isTauri() || !handlers) return
  const recentFiles = handlers.getRecentFiles()
  const items = [
    ...(isMac() ? [await buildAppMenu()] : []),
    await buildFileMenu(recentFiles),
    await buildViewMenu(),
    await buildHelpMenu()
  ]
  const menu = await Menu.new({ items })
  await menu.setAsAppMenu()
}

export const initMenu = async (nextHandlers: MenuHandlers): Promise<void> => {
  handlers = nextHandlers
  await rebuildMenu()
}
