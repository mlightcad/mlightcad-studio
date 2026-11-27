import { existsSync, readdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

import {
  examplePeerPackageAliases,
  exampleRollupOutput
} from './vite/rollupOutput'

const __dirname = dirname(fileURLToPath(import.meta.url))

/**
 * Absolute path to dayjs's ESM build.
 *
 * dayjs is not a direct dependency of this app, so pnpm does not hoist it to
 * the top-level `node_modules` and `require.resolve` cannot find it from any
 * package context. Locate it on disk instead: either a top-level hoist (non
 * pnpm) or the `dayjs@<version>` directory inside pnpm's `.pnpm` store. Used
 * by the dev-only alias in `resolve.alias` below.
 */
const dayjsEsmDir = (() => {
  const topLevel = resolve(__dirname, 'node_modules/dayjs/esm')
  if (existsSync(resolve(topLevel, 'index.js'))) return topLevel
  try {
    const pnpmDir = resolve(__dirname, 'node_modules/.pnpm')
    const match = readdirSync(pnpmDir).find(name => name.startsWith('dayjs@'))
    if (match) {
      const esm = resolve(pnpmDir, match, 'node_modules/dayjs/esm')
      if (existsSync(resolve(esm, 'index.js'))) return esm
    }
  } catch {
    /* pnpm store not present */
  }
  return undefined
})()

/**
 * Dev-only Vite plugin that resolves bare `dayjs` imports to dayjs's real ESM
 * build. All three of these make a plain alias insufficient:
 *   1. pnpm does not hoist dayjs (it is not a direct dependency), so it is not
 *      resolvable from its consumers (element-plus, the viewer dist).
 *   2. dayjs's `main` entry is a UMD build (`dayjs.min.js`) with no ESM default
 *      export, which throws a SyntaxError when served raw.
 *   3. The ESM build is laid out inconsistently — `index.js` and `locale/*.js`
 *      are files, but each `plugin/*` is a *directory* containing `index.js`.
 * This resolver probes both shapes. Production rollup already resolves and
 * interops dayjs correctly, so the plugin is only registered in serve mode.
 */
const dayjsEsmResolver = (esmDir: string) => ({
  name: 'dayjs-esm-resolver',
  enforce: 'pre' as const,
  resolveId(source: string): string | null {
    if (source === 'dayjs') {
      return resolve(esmDir, 'index.js')
    }
    if (!source.startsWith('dayjs/')) {
      return null
    }
    const rest = source.slice('dayjs/'.length)
    const noExt = rest.endsWith('.js') ? rest.slice(0, -3) : rest
    // `locale/en.js` is a file; `plugin/customParseFormat(.js)` is a directory
    // with an `index.js`. Probe both.
    const candidates = [
      resolve(esmDir, rest),
      resolve(esmDir, noExt, 'index.js')
    ]
    for (const candidate of candidates) {
      if (existsSync(candidate)) return candidate
    }
    return null
  }
})

/**
 * Runtime assets copied verbatim into `dist/assets`.
 *
 * Keep these names aligned with `@mlightcad/cad-simple-viewer`'s
 * `AcApWorkerAssets` and `@mlightcad/libredwg-converter`.
 */
const LIBREDWG_CONVERTER_PACKAGE = '@mlightcad/libredwg-converter'
const LIBREDWG_PARSER_WORKER_FILE = 'libredwg-parser-worker.js'
const LIBREDWG_PARSER_WASM_FILE = 'libredwg-web.wasm'
const MTEXT_RENDERER_WORKER_FILE = 'mtext-renderer-worker.js'
const VIEWER_RUNTIME_FILE = 'viewer-runtime.iife.js'

const MTEXT_WORKER_SRC = `./node_modules/@mlightcad/cad-simple-viewer/dist/${MTEXT_RENDERER_WORKER_FILE}`
const LIBREDWG_DIST = `./node_modules/${LIBREDWG_CONVERTER_PACKAGE}/dist`
const LIBREDWG_WORKER_SRC = `${LIBREDWG_DIST}/${LIBREDWG_PARSER_WORKER_FILE}`
const LIBREDWG_WASM_SRC = `${LIBREDWG_DIST}/${LIBREDWG_PARSER_WASM_FILE}`
const VIEWER_RUNTIME_SRC = `./node_modules/@mlightcad/cad-html-plugin/dist/${VIEWER_RUNTIME_FILE}`

/**
 * Packages that the viewer loads lazily through dynamic `import()`.
 *
 * They are listed in `optimizeDeps.exclude` so dev mode serves them as-is
 * instead of pre-bundling every vendor chunk up front.
 */
const LAZY_VIEWER_PACKAGES = [
  '@mlightcad/cad-agent-plugin',
  '@mlightcad/cad-html-plugin',
  '@mlightcad/cad-pdf-plugin',
  '@mlightcad/cad-simple-viewer',
  '@mlightcad/cad-svg-plugin',
  '@mlightcad/cad-viewer',
  '@mlightcad/pdf-renderer',
  '@mlightcad/three-renderer'
]

export default defineConfig(({ command, mode }) => {
  const hasViewerRuntime = existsSync(resolve(__dirname, VIEWER_RUNTIME_SRC))
  if (!hasViewerRuntime) {
    console.warn(
      `[mlightcad-studio] ${VIEWER_RUNTIME_FILE} not found — HTML export will be unavailable. ` +
        'Opening DXF/DWG does not require this file.'
    )
  }
  const hasLibreDwgWasm = existsSync(resolve(__dirname, LIBREDWG_WASM_SRC))

  const plugins = [
    vue(),
    viteStaticCopy({
      targets: [
        {
          src: MTEXT_WORKER_SRC,
          dest: 'assets',
          rename: { stripBase: true as const }
        },
        {
          src: LIBREDWG_WORKER_SRC,
          dest: 'assets',
          rename: { stripBase: true as const }
        },
        // The wasm file must sit next to the LibreDWG parser worker.
        ...(hasLibreDwgWasm
          ? [
              {
                src: LIBREDWG_WASM_SRC,
                dest: 'assets',
                rename: { stripBase: true as const }
              }
            ]
          : []),
        ...(hasViewerRuntime
          ? [
              {
                src: VIEWER_RUNTIME_SRC,
                dest: 'assets',
                rename: { stripBase: true as const }
              }
            ]
          : [])
      ]
    })
  ]

  if (mode === 'analyze') {
    plugins.push(visualizer())
  }

  // Redirect bare `dayjs` imports to the ESM build in dev (see dayjsEsmResolver).
  if (command === 'serve' && dayjsEsmDir) {
    plugins.push(dayjsEsmResolver(dayjsEsmDir))
  }

  return {
    // Relative base keeps worker/asset URLs valid under Tauri's custom protocol.
    base: './',
    clearScreen: false,
    envPrefix: ['VITE_', 'TAURI_ENV_*'],
    resolve: {
      // Resolve `three` / renderer entries from this package so nested imports
      // inside the viewer's prebuilt dist still resolve under pnpm. Bare
      // `dayjs` imports are redirected to the ESM build by the dev-only
      // `dayjsEsmResolver` plugin (registered above) instead of an alias,
      // because the ESM layout mixes files and plugin directories.
      alias: examplePeerPackageAliases(__dirname)
    },
    optimizeDeps: {
      // Pre-bundle the PDF stack so the first lazy import of the PDF plugin
      // does not trigger a Vite optimizeDeps full-page reload.
      include:
        command === 'serve'
          ? [
              '@mlightcad/pdf-renderer > pdf-lib',
              '@mlightcad/pdf-renderer > @pdf-lib/fontkit',
              '@mlightcad/pdf-renderer > pdf-lib > @pdf-lib/standard-fonts',
              '@mlightcad/pdf-renderer > pdf-lib > @pdf-lib/upng',
              '@mlightcad/pdf-renderer > pako'
            ]
          : [],
      exclude: command === 'serve' ? LAZY_VIEWER_PACKAGES : []
    },
    server: {
      port: 5173,
      strictPort: true,
      watch: {
        ignored: ['**/src-tauri/**']
      }
    },
    build: {
      outDir: 'dist',
      // Viewer overlays and dialogs must not wait for lazy component CSS.
      // Keep every style in the render-blocking entry stylesheet; JS stays split.
      cssCodeSplit: false,
      modulePreload: false,
      minify: true,
      rollupOptions: {
        input: {
          main: 'index.html'
        },
        output: exampleRollupOutput
      }
    },
    plugins
  }
})
