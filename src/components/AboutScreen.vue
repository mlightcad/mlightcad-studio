<template>
  <section class="about">
    <header class="about-hero">
      <div class="about-copy">
        <div class="brandline">
          <span class="brand-mark" aria-hidden="true">M</span>
          <span class="wordmark">
            <span class="wordmark-light">MLight</span>
            <span class="wordmark-accent">CAD</span>
          </span>
        </div>
        <h1 class="tagline">{{ t.about.tagline }}</h1>
        <p class="desc">{{ t.about.description }}</p>
        <div class="badges">
          <span class="badge">
            <AppIcon name="code" :size="13" />
            <span>{{ t.about.badgeOpenSource }}</span>
          </span>
          <span class="badge">
            <AppIcon name="bolt" :size="13" />
            <span>{{ t.about.badgeBrowserNative }}</span>
          </span>
          <span class="badge">
            <AppIcon name="shield" :size="13" />
            <span>{{ t.about.badgeDataSafe }}</span>
          </span>
        </div>
      </div>
      <div class="about-art">
        <BlueprintArt variant="frame" />
      </div>
    </header>

    <section class="block">
      <h2 class="block-title">
        <span class="bar" aria-hidden="true" />
        {{ t.about.advantages }}
      </h2>
      <div class="adv-grid">
        <article class="card adv">
          <span class="card-icon">
            <AppIcon name="monitor" :size="20" />
          </span>
          <div class="card-text">
            <h3>{{ t.about.advantageNoServer }}</h3>
            <p>{{ t.about.advantageNoServerDesc }}</p>
          </div>
        </article>
        <article class="card adv">
          <span class="card-icon">
            <AppIcon name="shield" :size="20" />
          </span>
          <div class="card-text">
            <h3>{{ t.about.advantageLocalData }}</h3>
            <p>{{ t.about.advantageLocalDataDesc }}</p>
          </div>
        </article>
        <article class="card adv">
          <span class="card-icon">
            <AppIcon name="rocket" :size="20" />
          </span>
          <div class="card-text">
            <h3>{{ t.about.advantageReady }}</h3>
            <p>{{ t.about.advantageReadyDesc }}</p>
          </div>
        </article>
      </div>
    </section>

    <section class="block">
      <h2 class="block-title">
        <span class="bar" aria-hidden="true" />
        {{ t.about.ecosystem }}
      </h2>
      <div class="eco-grid">
        <button type="button" class="card eco" @click="open(PRODUCT_LINKS.viewer)">
          <span class="card-icon">
            <AppIcon name="eye" :size="20" />
          </span>
          <span class="card-text">
            <span class="eco-title">{{ t.about.productViewer }}</span>
            <span class="eco-desc">{{ t.about.productViewerDesc }}</span>
          </span>
        </button>
        <button type="button" class="card eco" @click="open(PRODUCT_LINKS.editor)">
          <span class="card-icon">
            <AppIcon name="edit" :size="20" />
          </span>
          <span class="card-text">
            <span class="eco-title">{{ t.about.productEditor }}</span>
            <span class="eco-desc">{{ t.about.productEditorDesc }}</span>
          </span>
        </button>
        <button type="button" class="card eco" @click="open(PRODUCT_LINKS.sdk)">
          <span class="card-icon">
            <AppIcon name="cube" :size="20" />
          </span>
          <span class="card-text">
            <span class="eco-title">{{ t.about.productSdk }}</span>
            <span class="eco-desc">{{ t.about.productSdkDesc }}</span>
          </span>
        </button>
        <button type="button" class="card eco" @click="open(PRODUCT_LINKS.engine)">
          <span class="card-icon">
            <AppIcon name="layers" :size="20" />
          </span>
          <span class="card-text">
            <span class="eco-title">{{ t.about.productEngine }}</span>
            <span class="eco-desc">{{ t.about.productEngineDesc }}</span>
          </span>
        </button>
      </div>
    </section>

    <footer class="about-footer">
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
  </section>
</template>

<script setup lang="ts">
import { hostMessages } from '../i18n'
import { openExternal } from '../desktop/links'
import AppIcon from './AppIcon.vue'
import BlueprintArt from './BlueprintArt.vue'

const t = hostMessages

const SITE_LINKS = {
  website: 'https://mlightcad.com',
  docs: 'https://mlightcad.com/cad-viewer/docs/',
  github: 'https://github.com/mlightcad/cad-viewer'
} as const

const PRODUCT_LINKS = {
  viewer: 'https://mlightcad.com/cad-viewer.html',
  editor: 'https://mlightcad.com/cad-editor.html',
  sdk: 'https://mlightcad.com/cad-sdk.html',
  engine: 'https://mlightcad.com/dwg-engine.html'
} as const

const open = (url: string) => {
  void openExternal(url)
}
</script>

<style scoped>
.about {
  display: flex;
  flex-direction: column;
}

.about-hero {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
  align-items: center;
  gap: 12px;
  padding: 0 0 10px;
  overflow: hidden;
}

.about-copy {
  position: relative;
  z-index: 1;
  min-width: 0;
}

.brandline {
  display: flex;
  align-items: center;
  gap: 16px;
}

.brand-mark {
  width: 54px;
  height: 54px;
  flex: none;
  display: grid;
  place-items: center;
  border-radius: 14px;
  background: linear-gradient(150deg, #55a0ff, #1d4ed8);
  box-shadow:
    0 12px 26px rgba(37, 99, 235, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.28);
  color: #fff;
  font-size: 28px;
  font-weight: 700;
  line-height: 1;
}

.wordmark {
  font-size: clamp(30px, 3vw, 38px);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1;
  white-space: nowrap;
}

.wordmark-light {
  color: #f2f6ff;
}

.wordmark-accent {
  background: linear-gradient(120deg, #6aa8ff 0%, #2f7bff 60%, #1d4ed8);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.tagline {
  margin: 14px 0 0;
  font-size: clamp(16px, 1.6vw, 20px);
  font-weight: 600;
  letter-spacing: -0.01em;
  color: #dbe6fb;
}

.desc {
  margin: 6px 0 0;
  font-size: 13.5px;
  color: var(--text-dim);
  line-height: 1.6;
}

.badges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 6px 12px;
  border: 1px solid rgba(96, 165, 250, 0.32);
  border-radius: 999px;
  background: rgba(59, 130, 246, 0.1);
  color: #9cc4ff;
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.08em;
}

.about-art {
  min-width: 0;
  margin-inline-end: -18px;
  opacity: 0.9;
}

.about-art :deep(svg) {
  max-height: 260px;
  width: auto;
  max-width: 100%;
  margin-inline-start: auto;
}

.block {
  margin-top: 16px;
}

.block-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 9px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
}

.bar {
  width: 3px;
  height: 15px;
  border-radius: 2px;
  background: linear-gradient(180deg, #6aa8ff, #2563eb);
}

.adv-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.eco-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.card {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 14px;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.03);
  color: inherit;
  font-family: inherit;
  text-align: start;
}

.card-icon {
  width: 34px;
  height: 34px;
  flex: none;
  display: grid;
  place-items: center;
  border: 1px solid rgba(96, 165, 250, 0.2);
  border-radius: 10px;
  background: rgba(59, 130, 246, 0.12);
  color: #7fb0ff;
}

.card-text {
  min-width: 0;
}

.card-text h3 {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
}

.card-text p {
  margin: 4px 0 0;
  font-size: 12px;
  line-height: 1.55;
  color: var(--text-faint);
}

.eco {
  align-items: center;
  cursor: pointer;
  transition:
    background-color 0.16s ease,
    border-color 0.16s ease,
    transform 0.12s ease;
}

.eco:hover {
  border-color: rgba(96, 165, 250, 0.4);
  background: rgba(59, 130, 246, 0.09);
  transform: translateY(-1px);
}

.eco .card-text {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.eco-title {
  font-size: 13.5px;
  font-weight: 600;
  color: var(--text);
}

.eco-desc {
  font-size: 12px;
  color: var(--text-faint);
}

.about-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 18px;
  padding-top: 12px;
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

@media (max-width: 1180px) {
  .about-art {
    opacity: 0.65;
    margin-inline-end: -120px;
  }
}

@media (max-width: 1040px) {
  .about-hero {
    grid-template-columns: minmax(0, 1fr);
  }

  .about-art {
    position: absolute;
    inset-inline-end: -170px;
    top: -40px;
    width: 500px;
    margin: 0;
    opacity: 0.22;
  }

  .adv-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .eco-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .desc {
    max-width: 420px;
  }
}
</style>
