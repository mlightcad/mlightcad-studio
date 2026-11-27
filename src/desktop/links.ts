import { isTauri } from './platform'

/** Opens a URL in the user's default browser (desktop) or a new tab (web). */
export const openExternal = async (url: string): Promise<void> => {
  if (isTauri()) {
    const { openUrl } = await import('@tauri-apps/plugin-opener')
    await openUrl(url)
    return
  }
  window.open(url, '_blank', 'noopener,noreferrer')
}
