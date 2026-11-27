<template>
  <svg
    class="blueprint"
    :class="`blueprint--${variant}`"
    viewBox="0 0 640 460"
    fill="none"
    aria-hidden="true"
  >
    <defs>
      <filter id="bp-glow" x="-25%" y="-25%" width="150%" height="150%">
        <feGaussianBlur stdDeviation="2.2" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <radialGradient id="bp-halo" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.45" />
        <stop offset="40%" stop-color="#1d4ed8" stop-opacity="0.22" />
        <stop offset="100%" stop-color="#0b1d3a" stop-opacity="0" />
      </radialGradient>
      <linearGradient id="bp-sweep" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#4f9dff" stop-opacity="0.55" />
        <stop offset="100%" stop-color="#1e40af" stop-opacity="0" />
      </linearGradient>
    </defs>

    <ellipse cx="410" cy="215" rx="340" ry="240" fill="url(#bp-halo)" />

    <!-- Flange / bearing wireframe -->
    <g v-if="variant === 'flange'" class="bp-lines">
      <g class="bp-ghost" filter="url(#bp-glow)">
        <circle cx="452" cy="150" r="150" />
        <circle cx="602" cy="90" r="38" />
        <circle cx="572" cy="42" r="16" />
      </g>

      <g class="bp-axis">
        <path d="M228 232H616" />
        <path d="M430 42V420" />
      </g>

      <g class="bp-strong" filter="url(#bp-glow)">
        <circle cx="430" cy="232" r="128" />
        <circle cx="430" cy="232" r="104" />
        <circle cx="430" cy="232" r="62" />
        <circle cx="430" cy="232" r="30" />
        <circle
          v-for="bolt in boltHoles"
          :key="bolt.key"
          :cx="bolt.x"
          :cy="bolt.y"
          r="12"
        />
      </g>

      <g class="bp-soft">
        <path d="M302 232h256" />
        <path d="M430 104v256" />
        <path d="M430 232 520 156" />
        <path d="M430 232 356 300" />
      </g>

      <g class="bp-dim">
        <path d="M268 104v256" />
        <path d="M262 104h12M262 360h12" />
        <path d="m268 112-3.5 8h7zM268 352l-3.5-8h7z" />
        <path d="M302 388h256" />
        <path d="M302 382v12M558 382v12" />
        <path d="m310 388-8-3.5v7zM550 388l8-3.5v7z" />
      </g>

      <g class="bp-label">
        <text x="286" y="236" transform="rotate(-90 286 236)">Ø256</text>
        <text x="430" y="404" text-anchor="middle">256</text>
        <text x="512" y="140">Ø62</text>
        <text x="332" y="330" text-anchor="end">8 × Ø24</text>
      </g>

      <path class="bp-accent" d="M96 368C214 330 250 214 430 196c118-12 152-44 182-86" />
    </g>

    <!-- Section / frame wireframe -->
    <g v-else class="bp-lines">
      <g class="bp-ghost" filter="url(#bp-glow)">
        <circle cx="470" cy="238" r="170" />
        <circle cx="300" cy="330" r="44" />
      </g>

      <g class="bp-axis">
        <path d="M250 118H600" />
        <path d="M520 68V360" />
      </g>

      <g class="bp-strong" filter="url(#bp-glow)">
        <path d="M330 96 566 130 566 292 330 258z" />
        <path d="M330 96 566 292" />
        <path d="M448 113v162" />
        <circle cx="448" cy="196" r="84" />
        <path d="M542 302h58v58h-58z" />
      </g>

      <g class="bp-soft">
        <path d="M330 96 448 113 448 275 330 258z" />
        <circle cx="470" cy="238" r="140" />
        <path d="M448 196 566 130" />
        <path d="M448 196 330 258" />
      </g>

      <g class="bp-dim">
        <path d="M610 96v196" />
        <path d="M604 96h12M604 292h12" />
        <path d="m610 104-3.5 8h7zM610 284l-3.5-8h7z" />
        <path d="M330 76h236" />
        <path d="M330 70v12M566 70v12" />
        <path d="m338 76-8-3.5v7zM558 76l8-3.5v7z" />
      </g>

      <g class="bp-label">
        <text x="330" y="66">320</text>
        <text x="622" y="196" transform="rotate(-90 622 196)">256</text>
        <text x="448" y="112" text-anchor="middle">R150</text>
      </g>

      <path class="bp-accent" d="M120 372c118-8 176-70 330-82 72-6 118-30 154-70" />
    </g>
  </svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ variant?: 'flange' | 'frame' }>(), {
  variant: 'flange'
})

const boltHoles = Array.from({ length: 8 }, (_, index) => {
  const angle = (Math.PI * 2 * index) / 8 - Math.PI / 2
  return {
    key: `bolt-${index}`,
    x: 430 + Math.cos(angle) * 84,
    y: 232 + Math.sin(angle) * 84
  }
})
</script>

<style scoped>
.blueprint {
  display: block;
  width: 100%;
  height: auto;
  direction: ltr;
  pointer-events: none;
  user-select: none;
}

.bp-lines {
  stroke: #6aa6ff;
}

.bp-ghost {
  stroke-width: 1;
  opacity: 0.16;
}

.bp-axis {
  stroke-width: 0.8;
  stroke-dasharray: 1 7;
  opacity: 0.4;
}

.bp-strong {
  stroke-width: 1.35;
  opacity: 0.72;
}

.bp-soft {
  stroke-width: 0.9;
  opacity: 0.3;
  stroke-dasharray: 5 7;
}

.bp-dim {
  stroke-width: 0.85;
  opacity: 0.42;
}

.bp-label {
  fill: #7fb0ff;
  font-family: ui-monospace, 'SFMono-Regular', Consolas, monospace;
  font-size: 9.5px;
  letter-spacing: 0.12em;
  opacity: 0.6;
}

.bp-accent {
  stroke: url(#bp-sweep);
  stroke-width: 1.6;
  opacity: 0.95;
  filter: drop-shadow(0 0 3px rgba(79, 157, 255, 0.5));
}
</style>
