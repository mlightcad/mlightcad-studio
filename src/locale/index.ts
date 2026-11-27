import { i18n as viewerI18n } from '@mlightcad/cad-viewer'
import { AcApI18n, type AcApLocale } from '@mlightcad/cad-simple-viewer'

import { COMMAND_DESCRIPTIONS } from './commandDescriptions'
import { LOCALE_OPTIONS, type AppLocale } from '../i18n'

/**
 * Whether the bundled CAD engine ships a message catalog for `locale`.
 *
 * The host UI can offer more languages than the engine (e.g. Japanese and
 * Korean), so everything forwarded to the engine is filtered through this.
 */
const isCoreLocale = (locale: AppLocale): locale is AcApLocale =>
  Object.prototype.hasOwnProperty.call(AcApI18n.messages, locale)

let applyingCoreLocale = false

/**
 * Merge the host app's command descriptions into all viewer locales.
 *
 * `@mlightcad/cad-viewer` ships its own `vue-i18n` instance, so messages must be
 * registered on both registries: `AcApI18n` (framework-free core translation)
 * and `viewerI18n` (the Vue UI).
 */
export const initializeLocale = () => {
  for (const { locale } of LOCALE_OPTIONS) {
    if (!isCoreLocale(locale)) continue
    const messages = COMMAND_DESCRIPTIONS[locale]
    AcApI18n.mergeLocaleMessage(locale, messages)
    viewerI18n.global.mergeLocaleMessage(locale, messages)
  }
}

/**
 * Activates `locale` in the CAD engine, falling back to English for host
 * languages whose engine catalogs are not bundled yet.
 */
export const setCoreLocale = (locale: AppLocale) => {
  const target: AcApLocale = isCoreLocale(locale) ? locale : 'en'
  if (AcApI18n.currentLocale === target) return
  applyingCoreLocale = true
  try {
    AcApI18n.setCurrentLocale(target)
  } finally {
    applyingCoreLocale = false
  }
}

/**
 * Whether {@link setCoreLocale} is currently applying a host-initiated change.
 * `localeChanged` listeners use it to ignore the echo of such a change instead
 * of treating it as a language picked inside the viewer.
 */
export const isApplyingCoreLocale = () => applyingCoreLocale
