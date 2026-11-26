import { invoke } from '@tauri-apps/api/core'
import { listen } from '@tauri-apps/api/event'
import { getCurrentWindow } from '@tauri-apps/api/window'

import { isTauri } from './platform'

export const APP_TITLE = 'MLightCAD Studio'

/** File paths the app was launched with (file association / CLI argument). */
export const takeLaunchFiles = async (): Promise<string[]> => {
  if (!isTauri()) return []
  try {
    return await invoke<string[]>('take_launch_files')
  } catch (error) {
    console.warn('[studio] failed to read launch files', error)
    return []
  }
}

/** Files forwarded by a second app instance (single-instance plugin). */
export const listenOpenFiles = async (
  onPaths: (paths: string[]) => void
): Promise<() => void> => {
  if (!isTauri()) return () => {}
  return listen<string[]>('open-files', event => onPaths(event.payload))
}

export const setWindowTitle = async (drawingName?: string): Promise<void> => {
  if (!isTauri()) return
  await getCurrentWindow().setTitle(
    drawingName ? `${APP_TITLE} — ${drawingName}` : APP_TITLE
  )
}
