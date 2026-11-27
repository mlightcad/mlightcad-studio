<template>
  <svg
    class="app-icon"
    viewBox="0 0 24 24"
    :width="size"
    :height="size"
    :fill="name === 'github' ? 'currentColor' : 'none'"
    :stroke="name === 'github' ? 'none' : 'currentColor'"
    stroke-width="1.7"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    v-html="glyph"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

type IconName =
  | 'home'
  | 'info'
  | 'folder'
  | 'plus'
  | 'clock'
  | 'trash'
  | 'dots'
  | 'copy'
  | 'monitor'
  | 'shield'
  | 'rocket'
  | 'eye'
  | 'edit'
  | 'cube'
  | 'layers'
  | 'globe'
  | 'book'
  | 'github'
  | 'chevron'
  | 'check'
  | 'code'
  | 'bolt'
  | 'sidebar'

const props = withDefaults(
  defineProps<{ name: IconName; size?: number }>(),
  { size: 18 }
)

const ICONS: Record<IconName, string> = {
  home: '<path d="M4 10.6 12 4l8 6.6V19a1.6 1.6 0 0 1-1.6 1.6h-4.1v-5.4H9.7v5.4H5.6A1.6 1.6 0 0 1 4 19z"/>',
  info: '<circle cx="12" cy="12" r="8.6"/><path d="M12 11v5.4"/><path d="M12 7.8h.01"/>',
  folder:
    '<path d="M3.6 7.6A2 2 0 0 1 5.6 5.6h3.1l2 2h7.7a2 2 0 0 1 2 2v7.2a2 2 0 0 1-2 2H5.6a2 2 0 0 1-2-2z"/>',
  plus: '<path d="M12 5.2v13.6"/><path d="M5.2 12h13.6"/>',
  clock: '<circle cx="12" cy="12" r="8.4"/><path d="M12 7.4V12l3.1 1.9"/>',
  trash:
    '<path d="M4.6 7.2h14.8"/><path d="M9.6 7.2V5.7A1.7 1.7 0 0 1 11.3 4h1.4a1.7 1.7 0 0 1 1.7 1.7v1.5"/><path d="m6.6 7.2.8 11.1a2 2 0 0 0 2 1.9h5.2a2 2 0 0 0 2-1.9l.8-11.1"/>',
  dots: '<circle cx="5.6" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="18.4" cy="12" r="1.5" fill="currentColor" stroke="none"/>',
  copy: '<rect x="9" y="9" width="10.4" height="10.4" rx="2"/><path d="M15 6.6A2.6 2.6 0 0 0 12.4 4H6.6A2.6 2.6 0 0 0 4 6.6v5.8A2.6 2.6 0 0 0 6.6 15"/>',
  monitor:
    '<rect x="3.4" y="4.4" width="17.2" height="11.4" rx="2"/><path d="M8.8 19.8h6.4"/><path d="M12 15.8v4"/>',
  shield:
    '<path d="M12 3.6 19 6.5v5.2c0 4.2-2.9 7.3-7 8.7-4.1-1.4-7-4.5-7-8.7V6.5z"/><path d="m9.1 11.9 2.1 2.1 3.8-3.9"/>',
  rocket:
    '<path d="M13.6 5.1c2.5-1 4.7-.8 5.3-.2.6.6.8 2.8-.2 5.3-1 2.6-3.2 5.2-5.8 6.8l-2.9.9-4.1-4.1.9-2.9c1.6-2.6 4.2-4.8 6.8-5.8z"/><path d="m8.9 14.9-3.3 3.3"/><path d="m8.2 11.1-2.7 1-.7 1.7 3.4 3.4 1.7-.7 1-2.7"/>',
  eye: '<path d="M2.8 12S6.2 5.8 12 5.8 21.2 12 21.2 12 17.8 18.2 12 18.2 2.8 12 2.8 12z"/><circle cx="12" cy="12" r="2.9"/>',
  edit: '<path d="M4.2 19.8l.9-4.1L16.2 4.6a2 2 0 0 1 2.8 0l.4.4a2 2 0 0 1 0 2.8L8.3 18.9z"/><path d="m14.6 6.2 3.2 3.2"/>',
  cube: '<path d="m12 3.4 7.6 4.3v8.6L12 20.6l-7.6-4.3V7.7z"/><path d="M4.4 7.7 12 12l7.6-4.3"/><path d="M12 12v8.6"/>',
  layers:
    '<path d="m12 3.4 8.3 4.7-8.3 4.7-8.3-4.7z"/><path d="m3.7 12.4 8.3 4.7 8.3-4.7"/><path d="m3.7 16.6 8.3 4.7 8.3-4.7"/>',
  globe:
    '<circle cx="12" cy="12" r="8.4"/><path d="M3.6 12h16.8"/><path d="M12 3.6c2.2 2.3 3.3 5.2 3.3 8.4S14.2 18.1 12 20.4c-2.2-2.3-3.3-5.2-3.3-8.4S9.8 5.9 12 3.6z"/>',
  book: '<path d="M4.2 5.4A2 2 0 0 1 6.2 3.4h13.4v14.9H6.2a2 2 0 0 0-2 2z"/><path d="M4.2 18.3V5.4"/><path d="M18.4 18.3v2.3H6.2"/>',
  github:
    '<path fill="currentColor" stroke="none" d="M12 2.2a9.8 9.8 0 0 0-3.1 19.1c.5.1.7-.2.7-.5v-1.9c-2.7.6-3.3-1.2-3.3-1.2-.4-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.4-1.1.6-1.3-2.2-.2-4.5-1.1-4.5-4.9 0-1.1.4-2 1-2.7-.1-.2-.4-1.2.1-2.6 0 0 .8-.3 2.7 1a9.4 9.4 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.6.6.7 1 1.6 1 2.7 0 3.8-2.3 4.7-4.5 4.9.4.3.7.9.7 1.8v2.7c0 .3.2.6.7.5A9.8 9.8 0 0 0 12 2.2z"/>',
  chevron: '<path d="m7.6 10.2 4.4 4.4 4.4-4.4"/>',
  check: '<path d="m5.4 12.4 4.2 4.2 9-9.2"/>',
  code: '<path d="m8.6 8.2-4.4 3.8 4.4 3.8"/><path d="m15.4 8.2 4.4 3.8-4.4 3.8"/><path d="m13.4 5.4-2.8 13.2"/>',
  bolt: '<path d="M13.1 3.2 6.4 13.2h4.5l-.5 7.6 6.6-9.9h-4.5z"/>',
  sidebar:
    '<rect x="3.4" y="4.4" width="17.2" height="15.2" rx="2"/><path d="M9.6 4.4v15.2"/>'
}

const glyph = computed(() => ICONS[props.name])
</script>

<style scoped>
.app-icon {
  display: block;
  flex: none;
}
</style>
