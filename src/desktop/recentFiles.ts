import { load, type Store } from '@tauri-apps/plugin-store'

import type { RecentFile } from '../store'
import { fileNameOf, isDrawingPath } from './openFiles'
import { isTauri } from './platform'

const STORE_FILE = 'recent-files.json'
const STORE_KEY = 'items'
const MAX_RECENT = 10

let storePromise: Promise<Store> | null = null

const getStore = (): Promise<Store> => {
  storePromise ??= load(STORE_FILE, { autoSave: 200 })
  return storePromise
}

export const listRecentFiles = async (): Promise<RecentFile[]> => {
  if (!isTauri()) return []
  const store = await getStore()
  return (await store.get<RecentFile[]>(STORE_KEY)) ?? []
}

const writeRecentFiles = async (items: RecentFile[]): Promise<RecentFile[]> => {
  const store = await getStore()
  await store.set(STORE_KEY, items)
  await store.save()
  return items
}

export const addRecentFile = async (path: string): Promise<RecentFile[]> => {
  if (!isTauri() || !isDrawingPath(path)) return listRecentFiles()
  const current = await listRecentFiles()
  const entry: RecentFile = {
    path,
    name: fileNameOf(path),
    openedAt: Date.now()
  }
  const next = [entry, ...current.filter(item => item.path !== path)].slice(
    0,
    MAX_RECENT
  )
  return writeRecentFiles(next)
}

export const removeRecentFile = async (path: string): Promise<RecentFile[]> => {
  if (!isTauri()) return []
  const current = await listRecentFiles()
  return writeRecentFiles(current.filter(item => item.path !== path))
}

export const clearRecentFiles = async (): Promise<RecentFile[]> => {
  if (!isTauri()) return []
  return writeRecentFiles([])
}
