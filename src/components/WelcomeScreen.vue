<template>
  <div class="welcome">
    <div class="welcome-card">
      <header class="brand">
        <div class="logo" aria-hidden="true">M</div>
        <div class="brand-text">
          <h1>{{ t.title }}</h1>
          <p>{{ t.subtitle }}</p>
        </div>
      </header>

      <div class="actions">
        <button type="button" class="primary" @click="handleOpen">
          {{ t.open }}
        </button>
        <button type="button" class="secondary" @click="$emit('new-drawing')">
          {{ t.newDrawing }}
        </button>
      </div>

      <p class="hint">{{ t.hint }}</p>

      <div class="mode">
        <span class="mode-label">{{ t.openMode }}</span>
        <div class="segmented" role="radiogroup" :aria-label="t.openMode">
          <button
            v-for="mode in modes"
            :key="mode.value"
            type="button"
            class="segment"
            :class="{ 'is-active': openMode === mode.value }"
            role="radio"
            :aria-checked="openMode === mode.value"
            @click="$emit('update:openMode', mode.value)"
          >
            {{ mode.label }}
          </button>
        </div>
      </div>

      <section class="recent">
        <h2>{{ t.recent }}</h2>
        <ul v-if="recentFiles.length">
          <li v-for="file in recentFiles" :key="file.path">
            <button
              type="button"
              class="recent-item"
              :title="file.path"
              @click="$emit('open-path', file.path)"
            >
              <span class="recent-name">{{ file.name }}</span>
              <span class="recent-path">{{ file.path }}</span>
            </button>
          </li>
        </ul>
        <p v-else class="empty">{{ t.noRecent }}</p>
      </section>

      <input
        ref="fileInput"
        type="file"
        accept=".dwg,.dxf"
        hidden
        @change="handleBrowserFile"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { isTauri } from '../desktop/platform'
import { AcEdOpenMode } from '../openOptions'
import type { RecentFile } from '../store'

defineProps<{
  recentFiles: RecentFile[]
  openMode: AcEdOpenMode
}>()

const emit = defineEmits<{
  open: []
  'open-path': [path: string]
  'new-drawing': []
  'update:openMode': [mode: AcEdOpenMode]
  file: [file: File]
}>()

const isZh = navigator.language.toLowerCase().startsWith('zh')

const STRINGS = {
  en: {
    title: 'MLightCAD Studio',
    subtitle: 'Open a DWG or DXF drawing to start',
    open: 'Open Drawing…',
    newDrawing: 'New Drawing',
    hint: 'Tip: drop a .dwg or .dxf file anywhere on this window.',
    openMode: 'Open mode',
    read: 'Read',
    review: 'Review',
    write: 'Edit',
    recent: 'Recent drawings',
    noRecent: 'No recent drawings yet.'
  },
  zh: {
    title: 'MLightCAD Studio',
    subtitle: '打开 DWG 或 DXF 图纸开始工作',
    open: '打开图纸…',
    newDrawing: '新建图纸',
    hint: '提示：可将 .dwg / .dxf 文件直接拖入窗口。',
    openMode: '打开模式',
    read: '仅查看',
    review: '批阅',
    write: '编辑',
    recent: '最近打开',
    noRecent: '暂无最近打开的图纸。'
  }
} as const

const t = isZh ? STRINGS.zh : STRINGS.en

const modes = [
  { value: AcEdOpenMode.Read, label: t.read },
  { value: AcEdOpenMode.Review, label: t.review },
  { value: AcEdOpenMode.Write, label: t.write }
]

const fileInput = ref<HTMLInputElement | null>(null)

const handleOpen = () => {
  if (isTauri()) {
    emit('open')
  } else {
    fileInput.value?.click()
  }
}

const handleBrowserFile = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) {
    emit('file', file)
  }
  input.value = ''
}
</script>

<style scoped>
.welcome {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: safe center;
  justify-content: center;
  overflow-y: auto;
  padding: 24px;
  box-sizing: border-box;
  background: radial-gradient(circle at 20% 15%, #24304a 0%, #12141a 55%, #0b0c10 100%);
  color: #e5eaf3;
  font-family:
    system-ui,
    -apple-system,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    sans-serif;
}

.welcome-card {
  width: min(720px, 100%);
  padding: 28px 32px 32px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  background: rgba(22, 24, 30, 0.86);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(6px);
}

.brand {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logo {
  width: 52px;
  height: 52px;
  flex: none;
  display: grid;
  place-items: center;
  border-radius: 14px;
  background: linear-gradient(135deg, #409eff, #2b6dd8);
  color: #fff;
  font-size: 26px;
  font-weight: 700;
}

.brand-text h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}

.brand-text p {
  margin: 4px 0 0;
  font-size: 14px;
  color: #9aa3b2;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 28px;
}

.actions button {
  padding: 10px 20px;
  border-radius: 10px;
  border: 1px solid transparent;
  font-size: 14px;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease;
}

.primary {
  background: #409eff;
  color: #fff;
}

.primary:hover {
  background: #66b1ff;
}

.secondary {
  background: transparent;
  border-color: rgba(255, 255, 255, 0.22);
  color: #e5eaf3;
}

.secondary:hover {
  border-color: rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.04);
}

.hint {
  margin: 14px 0 0;
  font-size: 13px;
  color: #8b93a1;
}

.mode {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 26px;
}

.mode-label {
  font-size: 13px;
  color: #9aa3b2;
}

.segmented {
  display: inline-flex;
  padding: 3px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.06);
}

.segment {
  padding: 6px 14px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: #b6bdc9;
  font-size: 13px;
  cursor: pointer;
}

.segment.is-active {
  background: rgba(64, 158, 255, 0.22);
  color: #d6e8ff;
}

.recent {
  margin-top: 28px;
}

.recent h2 {
  margin: 0 0 10px;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #8b93a1;
}

.recent ul {
  margin: 0;
  padding: 0;
  list-style: none;
  max-height: 240px;
  overflow-y: auto;
}

.recent-item {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  padding: 10px 12px;
  border: 1px solid transparent;
  border-radius: 10px;
  background: transparent;
  color: inherit;
  text-align: left;
  cursor: pointer;
}

.recent-item:hover {
  border-color: rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.04);
}

.recent-name {
  font-size: 14px;
}

.recent-path {
  font-size: 12px;
  color: #7d8695;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

.empty {
  margin: 0;
  font-size: 13px;
  color: #7d8695;
}
</style>
