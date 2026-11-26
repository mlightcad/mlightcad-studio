import { readFile } from '@tauri-apps/plugin-fs'
import { open } from '@tauri-apps/plugin-dialog'

import { isTauri } from './platform'

export const DRAWING_EXTENSIONS = ['dwg', 'dxf']

/** Cross-platform basename (handles both `/` and `\`). */
export const fileNameOf = (path: string): string => {
  const parts = path.split(/[\\/]/)
  return parts[parts.length - 1] || path
}

export const isDrawingPath = (path: string): boolean => {
  const lower = path.toLowerCase()
  return DRAWING_EXTENSIONS.some(ext => lower.endsWith(`.${ext}`))
}

const mimeTypeFor = (name: string): string =>
  name.toLowerCase().endsWith('.dwg') ? 'application/acad' : 'application/dxf'

/** Opens the native file picker and returns the selected drawing path. */
export const pickDrawingFile = async (): Promise<string | null> => {
  if (!isTauri()) return null
  const selected = await open({
    multiple: false,
    directory: false,
    filters: [{ name: 'CAD Drawings', extensions: DRAWING_EXTENSIONS }]
  })
  return typeof selected === 'string' ? selected : null
}

/** Reads a drawing from disk and wraps it in a `File` for `<MlCadViewer>`. */
export const readDrawingFile = async (path: string): Promise<File> => {
  const bytes = await readFile(path)
  const name = fileNameOf(path)
  return new File([bytes], name, { type: mimeTypeFor(name) })
}
