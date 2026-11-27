import type { AppLocale } from '../i18n'

const DESCRIPTIONS: Record<AppLocale, string> = {
  en: 'Exits the application and closes all open drawings',
  zh: '退出应用程序并关闭所有打开的图纸',
  ja: 'アプリケーションを終了し、開いているすべての図面を閉じます',
  ko: '애플리케이션을 종료하고 열려 있는 모든 도면을 닫습니다',
  tr: 'Uygulamadan çıkar ve açık tüm çizimleri kapatır',
  cs: 'Ukončí aplikaci a zavře všechny otevřené výkresy',
  ar: 'يخرج من التطبيق ويغلق جميع الرسومات المفتوحة'
}

/** Descriptions for the desktop-only commands registered by this app. */
export const COMMAND_DESCRIPTIONS = Object.fromEntries(
  Object.entries(DESCRIPTIONS).map(([locale, description]) => [
    locale,
    {
      command: {
        ACAD: {
          quit: { description },
          exit: { description }
        }
      }
    }
  ])
) as Record<
  AppLocale,
  {
    command: {
      ACAD: {
        quit: { description: string }
        exit: { description: string }
      }
    }
  }
>
