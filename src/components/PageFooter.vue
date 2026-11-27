<template>
  <footer class="page-footer">
    <div class="links">
      <button type="button" class="link" @click="open(SITE_LINKS.website)">
        <AppIcon name="globe" :size="14" />
        <span>{{ t.about.website }}</span>
      </button>
      <span class="sep" aria-hidden="true">|</span>
      <button type="button" class="link" @click="open(SITE_LINKS.docs)">
        <AppIcon name="book" :size="14" />
        <span>{{ t.about.docs }}</span>
      </button>
      <span class="sep" aria-hidden="true">|</span>
      <button type="button" class="link" @click="open(SITE_LINKS.github)">
        <AppIcon name="github" :size="15" />
        <span>{{ t.about.github }}</span>
      </button>
    </div>
    <span class="copyright">{{ t.about.copyright }}</span>
  </footer>
</template>

<script setup lang="ts">
import { hostMessages } from '../i18n'
import { openExternal } from '../desktop/links'
import AppIcon from './AppIcon.vue'

const t = hostMessages

const SITE_LINKS = {
  website: 'https://mlightcad.com',
  docs: 'https://mlightcad.com/cad-viewer/docs/',
  github: 'https://github.com/mlightcad/cad-viewer'
} as const

const open = (url: string) => {
  void openExternal(url)
}
</script>

<style scoped>
.page-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 22px;
  padding-top: 14px;
  border-top: 1px solid var(--border);
  font-size: 12px;
  color: var(--text-faint);
}

.links {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.link {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 0;
  border: 0;
  background: none;
  color: var(--text-dim);
  font-family: inherit;
  font-size: 12px;
  cursor: pointer;
  transition: color 0.16s ease;
}

.link:hover {
  color: #9cc4ff;
}

.sep {
  opacity: 0.35;
}

.copyright {
  color: var(--text-faint);
}
</style>
