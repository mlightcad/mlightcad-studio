import { getCurrentWebview } from '@tauri-apps/api/webview'

import { isTauri } from './platform'

/**
 * Subscribes to native drag & drop. Tauri intercepts HTML5 drops on the
 * window, so file paths arrive here instead of a DOM `drop` event.
 */
export const initDragDrop = async (
  onPaths: (paths: string[]) => void
): Promise<() => void> => {
  if (!isTauri()) return () => {}
  const webview = getCurrentWebview()
  return webview.onDragDropEvent(event => {
    if (event.payload.type === 'drop') {
      onPaths(event.payload.paths)
    }
  })
}
