import { getVersion } from '@tauri-apps/api/app'
import {
  Menu,
  MenuItem,
  PredefinedMenuItem,
  Submenu
} from '@tauri-apps/api/menu'
import { message } from '@tauri-apps/plugin-dialog'

import type { RecentFile } from '../store'
import { hostT } from '../i18n'
import { isTauri } from './platform'
import { APP_TITLE } from './startup'

const isMac = (): boolean => navigator.userAgent.includes('Mac')

/**
 * Handlers the shell could wire to native menu items.
 *
 * The cad-viewer ribbon now owns the File / View / Help menus, so these are no
 * longer attached to any native menu item; keyboard shortcuts that used to live
 * in those menus are handled in `App.vue` via a window keydown listener. The
 * type is kept so callers do not need to change.
 */
export interface MenuHandlers {
  onOpen: () => void | Promise<void>
  onNew: () => void | Promise<void>
  onOpenRecent: (path: string) => void | Promise<void>
  onClearRecent: () => void | Promise<void>
  onCloseDrawing: () => void | Promise<void>
  getRecentFiles: () => RecentFile[]
}

const showAbout = async (): Promise<void> => {
  const version = await getVersion()
  const t = hostT()
  await message(
    `${APP_TITLE} ${version}\n\n` +
      `${t.dialog.aboutDescription}\n\n${t.dialog.aboutDwg}`,
    { title: `${t.menu.about} ${APP_TITLE}`, kind: 'info' }
  )
}

/**
 * macOS requires an application menu. Windows / Linux intentionally get no
 * native menu so the window has no menu bar — the ribbon provides all menus.
 */
const buildAppMenu = async (): Promise<Submenu> =>
  Submenu.new({
    text: APP_TITLE,
    items: [
      await MenuItem.new({
        id: 'app:about',
        text: `${hostT().menu.about} ${APP_TITLE}`,
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

/** Builds (or rebuilds) the native application menu. */
export const rebuildMenu = async (): Promise<void> => {
  if (!isTauri() || !isMac()) return
  const menu = await Menu.new({ items: [await buildAppMenu()] })
  await menu.setAsAppMenu()
}

export const initMenu = async (_nextHandlers: MenuHandlers): Promise<void> => {
  await rebuildMenu()
}
