<template>
  <div class="shell">
    <aside
      class="sidebar"
      :class="{ 'is-collapsed': !sidebarVisible }"
      :aria-hidden="!sidebarVisible"
      :inert="!sidebarVisible"
    >
      <div class="sidebar-inner">
        <div class="brand">
          <div class="brand-mark" aria-hidden="true">M</div>
          <div class="brand-name">
            <span class="brand-name-main">MLightCAD</span>
            <span class="brand-name-sub">Studio</span>
          </div>
        </div>

        <nav class="nav">
          <button
            type="button"
            class="nav-item"
            :class="{ 'is-active': page === 'home' }"
            @click="page = 'home'"
          >
            <AppIcon name="home" :size="18" />
            <span>{{ t.nav.home }}</span>
          </button>
          <button
            type="button"
            class="nav-item"
            :class="{ 'is-active': page === 'about' }"
            @click="page = 'about'"
          >
            <AppIcon name="info" :size="18" />
            <span>{{ t.nav.about }}</span>
          </button>
        </nav>

        <div class="sidebar-foot">
          <span class="foot-brand">MLightCAD</span>
          <span class="foot-tagline">{{ t.footTagline }}</span>
        </div>
      </div>
    </aside>

    <main class="stage">
      <header class="topbar">
        <div class="topbar-start">
          <button
            type="button"
            class="sidebar-toggle"
            :aria-label="sidebarToggleLabel"
            :aria-expanded="sidebarVisible"
            :title="sidebarToggleLabel"
            @click="toggleSidebar"
          >
            <AppIcon name="sidebar" :size="17" />
          </button>
          <div v-if="page === 'about'" class="page-heading">
            <AppIcon name="info" :size="17" />
            <span>{{ t.about.pageTitle }}</span>
          </div>
        </div>
        <div class="topbar-end">
          <div
            ref="localeRoot"
            class="locale"
            :class="{ 'is-open': localeOpen }"
            @keydown.esc.stop="closeLocaleMenu(true)"
          >
            <button
              type="button"
              class="locale-trigger"
              aria-haspopup="listbox"
              :aria-expanded="localeOpen"
              :aria-label="t.language"
              @click="localeOpen = !localeOpen"
            >
              <AppIcon name="globe" :size="15" />
              <span class="locale-label">{{ currentLocaleLabel }}</span>
              <AppIcon name="chevron" :size="14" class="locale-chevron" />
            </button>

            <Transition name="menu">
              <ul v-if="localeOpen" class="locale-menu" role="listbox">
                <li v-for="option in LOCALE_OPTIONS" :key="option.locale">
                  <button
                    type="button"
                    role="option"
                    class="locale-option"
                    :class="{ 'is-active': option.locale === hostLocale }"
                    :aria-selected="option.locale === hostLocale"
                    @click="selectLocale(option.locale)"
                  >
                    <span>{{ option.label }}</span>
                    <AppIcon
                      v-if="option.locale === hostLocale"
                      name="check"
                      :size="14"
                      class="locale-check"
                    />
                  </button>
                </li>
              </ul>
            </Transition>
          </div>
        </div>
      </header>

      <div class="stage-body">
        <Transition name="page" mode="out-in">
          <WelcomeScreen
            v-if="page === 'home'"
            key="home"
            :recent-files="recentFiles"
            @open="emit('open')"
            @open-path="emit('open-path', $event)"
            @new-drawing="emit('new-drawing')"
            @clear-recent="emit('clear-recent')"
            @remove-recent="emit('remove-recent', $event)"
            @file="emit('file', $event)"
          />
          <AboutScreen v-else key="about" />
        </Transition>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'

import type { RecentFile } from '../store'
import {
  hostLocale,
  hostMessages,
  LOCALE_OPTIONS,
  setHostLocale,
  type AppLocale
} from '../i18n'
import AboutScreen from './AboutScreen.vue'
import AppIcon from './AppIcon.vue'
import WelcomeScreen from './WelcomeScreen.vue'

defineProps<{
  recentFiles: RecentFile[]
}>()

const emit = defineEmits<{
  open: []
  'open-path': [path: string]
  'new-drawing': []
  'clear-recent': []
  'remove-recent': [path: string]
  file: [file: File]
}>()

const t = hostMessages

/** Play it safe: the launcher only knows Home and About for now. */
const page = ref<'home' | 'about'>('home')

const SIDEBAR_HIDDEN_KEY = 'mlightcad.sidebar.hidden'

const readSidebarVisible = (): boolean => {
  try {
    return localStorage.getItem(SIDEBAR_HIDDEN_KEY) !== '1'
  } catch {
    return true
  }
}

const sidebarVisible = ref(readSidebarVisible())

const sidebarToggleLabel = computed(() =>
  sidebarVisible.value ? t.value.sidebar.hide : t.value.sidebar.show
)

const toggleSidebar = () => {
  sidebarVisible.value = !sidebarVisible.value
  try {
    localStorage.setItem(SIDEBAR_HIDDEN_KEY, sidebarVisible.value ? '0' : '1')
  } catch {
    // Keep the in-memory state when storage is unavailable.
  }
}

const localeRoot = ref<HTMLElement | null>(null)
const localeOpen = ref(false)

const currentLocaleLabel = computed(
  () => LOCALE_OPTIONS.find((option) => option.locale === hostLocale.value)?.label ?? ''
)

const closeLocaleMenu = (refocus = false) => {
  localeOpen.value = false
  if (refocus) {
    void nextTick(() =>
      localeRoot.value?.querySelector<HTMLButtonElement>('.locale-trigger')?.focus()
    )
  }
}

const selectLocale = (locale: AppLocale) => {
  setHostLocale(locale)
  closeLocaleMenu(true)
}

const onDocumentPointerDown = (event: PointerEvent) => {
  if (!localeRoot.value?.contains(event.target as Node)) closeLocaleMenu()
}

watch(localeOpen, (open) => {
  if (open) document.addEventListener('pointerdown', onDocumentPointerDown)
  else document.removeEventListener('pointerdown', onDocumentPointerDown)
})

onBeforeUnmount(() =>
  document.removeEventListener('pointerdown', onDocumentPointerDown)
)
</script>

<style scoped>
.shell {
  --bg: #070c16;
  --panel: rgba(18, 28, 46, 0.72);
  --border: rgba(120, 160, 220, 0.14);
  --border-strong: rgba(122, 168, 240, 0.28);
  --text: #e9eefb;
  --text-dim: #93a3bd;
  --text-faint: #64748b;
  --accent: #3b82f6;
  --accent-strong: #2563eb;

  position: absolute;
  inset: 0;
  display: flex;
  overflow: hidden;
  background: var(--bg);
  color: var(--text);
  color-scheme: dark;
  font-family:
    system-ui,
    -apple-system,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
}

.sidebar {
  width: 188px;
  flex: none;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: linear-gradient(180deg, #0b1526 0%, #070c16 100%);
  border-inline-end: 1px solid rgba(120, 160, 220, 0.1);
  z-index: 2;
  transition:
    width 0.22s ease,
    border-color 0.22s ease;
}

.sidebar.is-collapsed {
  width: 0;
  border-inline-end-color: transparent;
}

.sidebar-inner {
  width: 188px;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding: 24px 14px 18px;
  box-sizing: border-box;
}

.brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding-bottom: 24px;
}

.brand-mark {
  width: 46px;
  height: 46px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: linear-gradient(150deg, #55a0ff, #1d4ed8);
  box-shadow:
    0 10px 22px rgba(37, 99, 235, 0.38),
    inset 0 1px 0 rgba(255, 255, 255, 0.28);
  color: #fff;
  font-size: 24px;
  font-weight: 700;
  line-height: 1;
}

.brand-name {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  font-size: 12.5px;
  line-height: 1.35;
  text-align: center;
}

.brand-name-main {
  font-weight: 600;
  letter-spacing: 0.01em;
}

.brand-name-sub {
  color: var(--text-dim);
  font-size: 12px;
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: var(--text-dim);
  font-size: 13px;
  font-family: inherit;
  cursor: pointer;
  transition:
    background-color 0.16s ease,
    color 0.16s ease,
    box-shadow 0.16s ease;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text);
}

.nav-item.is-active {
  background: linear-gradient(135deg, #2f74ff, #1e51d6);
  color: #fff;
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.35);
}

.sidebar-foot {
  margin-top: auto;
  padding: 16px 8px 2px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.foot-brand {
  font-size: 11.5px;
  font-weight: 600;
  color: var(--text-dim);
}

.foot-tagline {
  font-size: 10.5px;
  color: var(--text-faint);
}

.stage {
  position: relative;
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  background:
    radial-gradient(
      640px 500px at 82% 26%,
      rgba(96, 165, 250, 0.3),
      rgba(59, 130, 246, 0.14) 38%,
      transparent 68%
    ),
    radial-gradient(
      580px 340px at 68% 46%,
      rgba(37, 99, 235, 0.22),
      transparent 65%
    ),
    linear-gradient(155deg, #050a14 0%, #0c1b36 50%, #071024 100%);
}

.stage::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(96, 165, 250, 0.055) 1px, transparent 1px),
    linear-gradient(90deg, rgba(96, 165, 250, 0.055) 1px, transparent 1px);
  background-size: 52px 52px;
  -webkit-mask-image: radial-gradient(
    120% 95% at 62% 0%,
    #000 0%,
    transparent 74%
  );
  mask-image: radial-gradient(120% 95% at 62% 0%, #000 0%, transparent 74%);
  pointer-events: none;
}

.stage::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(
      ellipse 900px 300px at 50% 115%,
      rgba(37, 99, 235, 0.32),
      rgba(59, 130, 246, 0.12) 30%,
      transparent 65%
    );
  -webkit-mask-image: linear-gradient(
    170deg,
    transparent 0%,
    #000 28%,
    #000 72%,
    transparent 100%
  );
  mask-image: linear-gradient(
    170deg,
    transparent 0%,
    #000 28%,
    #000 72%,
    transparent 100%
  );
}

.topbar {
  position: relative;
  z-index: 3;
  height: 62px;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-inline: 28px;
  border-bottom: 1px solid rgba(120, 160, 220, 0.08);
}

.topbar-start {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.sidebar-toggle {
  flex: none;
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(140, 175, 230, 0.2);
  border-radius: 9px;
  background: rgba(255, 255, 255, 0.04);
  color: var(--text-dim);
  cursor: pointer;
  transition:
    border-color 0.16s ease,
    background-color 0.16s ease,
    color 0.16s ease;
}

.sidebar-toggle:hover {
  border-color: rgba(140, 175, 230, 0.36);
  background: rgba(255, 255, 255, 0.06);
  color: var(--text);
}

.page-heading {
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 13.5px;
  color: var(--text-dim);
  min-width: 0;
}

.topbar-end {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-inline-start: auto;
}

.locale {
  position: relative;
}

.locale-trigger {
  display: flex;
  align-items: center;
  gap: 7px;
  height: 34px;
  padding-inline: 11px 10px;
  border: 1px solid rgba(140, 175, 230, 0.2);
  border-radius: 9px;
  background: rgba(255, 255, 255, 0.04);
  color: var(--text-dim);
  font-family: inherit;
  font-size: 12.5px;
  line-height: 1;
  cursor: pointer;
  transition:
    border-color 0.16s ease,
    background-color 0.16s ease,
    color 0.16s ease;
}

.locale-trigger:hover {
  border-color: rgba(140, 175, 230, 0.36);
  background: rgba(255, 255, 255, 0.06);
  color: var(--text);
}

.locale-trigger:focus-visible {
  outline: none;
  border-color: rgba(122, 168, 240, 0.55);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.16);
}

.locale.is-open .locale-trigger {
  border-color: rgba(122, 168, 240, 0.42);
  background: rgba(255, 255, 255, 0.07);
  color: var(--text);
}

.locale-label {
  color: var(--text);
  white-space: nowrap;
}

.locale-chevron {
  margin-inline-start: 1px;
  color: var(--text-faint);
  transition: transform 0.18s ease;
}

.locale.is-open .locale-chevron {
  transform: rotate(180deg);
}

.locale-menu {
  position: absolute;
  inset-inline-end: 0;
  top: calc(100% + 8px);
  z-index: 20;
  min-width: 100%;
  margin: 0;
  padding: 5px;
  list-style: none;
  border: 1px solid rgba(122, 168, 240, 0.22);
  border-radius: 11px;
  background: rgba(13, 23, 40, 0.96);
  box-shadow:
    0 18px 40px rgba(2, 6, 16, 0.55),
    0 2px 8px rgba(2, 6, 16, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(14px);
}

.locale-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  width: 100%;
  padding: 7px 9px;
  border: 0;
  border-radius: 7px;
  background: transparent;
  color: var(--text-dim);
  font-family: inherit;
  font-size: 12.5px;
  line-height: 1.35;
  text-align: start;
  white-space: nowrap;
  cursor: pointer;
  transition:
    background-color 0.14s ease,
    color 0.14s ease;
}

.locale-option:hover,
.locale-option:focus-visible {
  outline: none;
  background: rgba(96, 150, 255, 0.14);
  color: var(--text);
}

.locale-option.is-active {
  background: rgba(59, 130, 246, 0.16);
  color: var(--text);
}

.locale-check {
  color: var(--accent);
}

.menu-enter-active,
.menu-leave-active {
  transition:
    opacity 0.14s ease,
    transform 0.14s ease;
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

.stage-body {
  position: relative;
  z-index: 1;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 22px 36px 24px;
}

.stage-body > * {
  width: 100%;
  max-width: 1240px;
  margin-inline: auto;
  box-sizing: border-box;
}

.page-enter-active,
.page-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.stage-body::-webkit-scrollbar {
  width: 10px;
}

.stage-body::-webkit-scrollbar-thumb {
  border: 3px solid transparent;
  border-radius: 999px;
  background-clip: content-box;
  background-color: rgba(120, 160, 220, 0.22);
}

.stage-body::-webkit-scrollbar-thumb:hover {
  background-color: rgba(140, 180, 240, 0.36);
}

.shell :focus-visible {
  outline: 2px solid rgba(96, 165, 250, 0.7);
  outline-offset: 2px;
}
</style>
