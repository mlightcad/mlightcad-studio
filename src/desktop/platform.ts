/** True when the app runs inside a Tauri webview (false in a plain browser). */
export const isTauri = (): boolean =>
  typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window
