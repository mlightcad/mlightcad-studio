import { AcEdCommand } from '@mlightcad/cad-simple-viewer'

import { store } from '../store'

/**
 * Command to close the current drawing and return to the welcome screen.
 */
export class AcApQuitCmd extends AcEdCommand {
  async execute() {
    store.selectedFile = null
    store.selectedPath = null
    store.isNewDrawing = false
  }
}
