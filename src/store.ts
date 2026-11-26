import { reactive } from 'vue'

import { AcEdOpenMode } from './openOptions'

export interface RecentFile {
  path: string
  name: string
  openedAt: number
}

export const store = reactive<{
  selectedFile: File | null
  /** Absolute path of the opened drawing (desktop only). */
  selectedPath: string | null
  isNewDrawing: boolean
  openMode: AcEdOpenMode
}>({
  selectedFile: null,
  selectedPath: null,
  isNewDrawing: false,
  openMode: AcEdOpenMode.Write
})
