import { computed, ref } from 'vue'

import {
  LOCALE_OPTIONS,
  MESSAGES,
  type AppLocale,
  type HostMessages
} from './messages'

export { LOCALE_OPTIONS }
export type { AppLocale, HostMessages }

/** Shared with cad-viewer (`useLocale` and its startup locale detection). */
export const LOCALE_STORAGE_KEY = 'preferred_lang'

const SUPPORTED_LOCALES: readonly string[] = Object.keys(MESSAGES)

/** Maps a BCP 47 tag (`zh-CN`, `ja-JP`, …) onto a supported locale. */
const matchLocale = (tag: string | null | undefined): AppLocale | null => {
  if (!tag) return null
  const language = tag.toLowerCase().split('-')[0]
  return SUPPORTED_LOCALES.includes(language) ? (language as AppLocale) : null
}

/** Manual choice made earlier — it always wins over the OS language. */
const readStoredLocale = (): AppLocale | null => {
  try {
    return matchLocale(localStorage.getItem(LOCALE_STORAGE_KEY))
  } catch {
    // Storage can be unavailable in hardened webviews.
    return null
  }
}

/**
 * Webview language as a first guess.
 *
 * WebView2 does not follow the Windows language by default, so
 * {@link initHostLocale} refines this with the real OS locale.
 */
const detectFromNavigator = (): AppLocale | null => {
  const tags = navigator.languages?.length
    ? navigator.languages
    : [navigator.language]
  for (const tag of tags) {
    const locale = matchLocale(tag)
    if (locale) return locale
  }
  return null
}

/** System UI language reported by the OS (Tauri only). */
const detectFromOs = async (): Promise<AppLocale | null> => {
  try {
    const { locale } = await import('@tauri-apps/plugin-os')
    return matchLocale(await locale())
  } catch {
    // Plain browser or missing permission: keep the webview guess.
    return null
  }
}

export const hostLocale = ref<AppLocale>(
  readStoredLocale() ?? detectFromNavigator() ?? 'en'
)

/**
 * Resolves the startup language before the UI mounts.
 *
 * A language the user picked manually is reused as-is; otherwise the locale of
 * the operating system decides. The detected value is not persisted, so the app
 * keeps following the OS until the user makes an explicit choice.
 */
export const initHostLocale = async (): Promise<void> => {
  if (readStoredLocale()) return
  const osLocale = await detectFromOs()
  if (!osLocale || osLocale === hostLocale.value) return
  hostLocale.value = osLocale
  applyDocumentDirection(osLocale)
}

/** Reactive message catalog for Vue templates. */
export const hostMessages = computed<HostMessages>(
  () => MESSAGES[hostLocale.value]
)

/** Non-reactive snapshot for native menus and imperative dialogs. */
export const hostT = (): HostMessages => MESSAGES[hostLocale.value]

const applyDocumentDirection = (locale: AppLocale) => {
  document.documentElement.lang = locale
  document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr'
}

/**
 * Updates the host locale and persists it for both the host and cad-viewer.
 * CAD synchronization is installed by App.vue after the CAD chunks load, so
 * this module deliberately has no CAD imports and stays in the light bundle.
 */
export const setHostLocale = (locale: AppLocale): void => {
  if (locale === hostLocale.value) return
  hostLocale.value = locale
  applyDocumentDirection(locale)
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale)
  } catch {
    // Keep the in-memory locale when storage is unavailable.
  }
}

applyDocumentDirection(hostLocale.value)
