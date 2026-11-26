# MLightCAD Studio

Desktop edition of [MLightCAD](https://github.com/mlightcad/cad-viewer) — a fully offline DWG/DXF viewer and editor powered by a browser rendering engine. The app wraps the published `@mlightcad/cad-viewer` Vue component in a [Tauri 2](https://v2.tauri.app/) shell, so drawings are parsed, rendered and edited locally without any backend service.

## Features

- Open `.dwg` and `.dxf` drawings through a native file dialog or by dropping files onto the window
- Native application menu (File / View / Help, plus the macOS app menu) with familiar shortcuts
- `.dwg` / `.dxf` file associations: double-click a drawing to open it in MLightCAD Studio
- Single instance: opening another drawing focuses the running window instead of starting a second app
- Recent drawings list, persisted across restarts and mirrored in the File → Open Recent submenu
- Read / Review / Edit open modes, matching the web demo
- Window size and position are restored on the next launch
- Full CAD UI from `@mlightcad/cad-viewer`: ribbon, command line, layers, measurements, markup and export plugins
- DWG support via the optional GPL-licensed [LibreDWG](https://www.gnu.org/software/libredwg/) converter (`@mlightcad/libredwg-converter`)

## Tech stack

| Layer | Technology |
| --- | --- |
| UI | Vue 3, Vite, Element Plus |
| CAD engine | `@mlightcad/cad-viewer`, `@mlightcad/cad-simple-viewer`, `@mlightcad/three-renderer` |
| Desktop shell | Tauri 2 (Rust), `tao`/`wry` |
| Desktop integration | `tauri-plugin-dialog`, `tauri-plugin-fs`, `tauri-plugin-store`, `tauri-plugin-window-state`, `tauri-plugin-single-instance`, `tauri-plugin-opener` |
| CI/CD | GitHub Actions (`pnpm`, `rust-cache`, `tauri-action`) |

## Prerequisites

- Node.js **24+**
- pnpm **10+** (the repo pins `pnpm@10.33.4` via `packageManager`)
- Rust **stable** with `cargo` ([rustup](https://rustup.rs/) recommended)
- Platform requirements for Tauri 2:
  - **Windows**: WebView2 (preinstalled on Windows 10/11) and the Microsoft C++ Build Tools
  - **macOS**: Xcode Command Line Tools
  - **Linux**: `libwebkit2gtk-4.1-dev build-essential curl wget file libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev patchelf`

## Getting started

```bash
pnpm install

# Run the UI in a plain browser (desktop integrations become no-ops)
pnpm dev

# Run the desktop app with hot reload
pnpm tauri:dev
```

Open a drawing from the welcome screen, drop a file into the window, or pass a path when launching the app:

```bash
pnpm tauri:dev -- "C:/path/to/drawing.dwg"
```

### Production build

```bash
pnpm tauri:build
```

Installers are written to `src-tauri/target/release/bundle/` (`msi`/`nsis` on Windows, `dmg` on macOS, `AppImage`/`deb` on Linux).

Useful scripts:

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the Vite dev server for browser debugging |
| `pnpm build` | Type-check and build the frontend into `dist/` |
| `pnpm typecheck` | Run `vue-tsc --noEmit` |
| `pnpm tauri:dev` | Run the desktop app in development mode |
| `pnpm tauri:build` | Build and bundle the desktop app |
| `pnpm version:sync` | Align the app version with `@mlightcad/cad-viewer` |
| `pnpm release` | Create and push a release tag (see below) |

## Versioning

The desktop app tracks the version of its CAD engine. `package.json → dependencies["@mlightcad/cad-viewer"]` is the single source of truth, and the app version must match it (currently **1.7.8**). Tauri reads the version from `package.json` through `tauri.conf.json → version`, so installers automatically use the same number.

When MLightCAD publishes a new version:

```bash
# 1. Upgrade the CAD packages (example)
pnpm up "@mlightcad/*@latest"

# 2. Copy the engine version into package.json and src-tauri/Cargo.toml
pnpm version:sync

# 3. Verify the app, then commit
pnpm install
pnpm build
git add -A
git commit -m "chore: bump mlightcad to vX.Y.Z"
```

## Releasing

`tools/release.mjs` is adapted from the upstream [`cad-viewer/tools/release.mjs`](https://github.com/mlightcad/cad-viewer/blob/main/tools/release.mjs). It reuses the same safety checks (clean tree, `main` branch, unique tag, semver/preview validation) but derives the version from `@mlightcad/cad-viewer` instead of a lockstep monorepo, and never touches npm.

```bash
# Release the version currently declared by @mlightcad/cad-viewer
pnpm release

# Preview releases use the X.Y.Z-preview.N suffix
pnpm release --preview

# Explicit version (must still be valid semver)
pnpm release 1.7.9
```

The script creates an annotated `vX.Y.Z` tag and pushes it to `origin`. Pushing the tag triggers the **Desktop Release** workflow, which builds Windows, Linux and macOS bundles in parallel and attaches them to a draft GitHub Release. Preview tags (`-preview.N`) are published as pre-releases.

## CI/CD

- **`.github/workflows/ci.yml`** — runs on every push to `main` and on pull requests: frontend type-check + production build, `cargo fmt --check`, `cargo check`.
- **`.github/workflows/release.yml`** — runs for `v*` tags or manual dispatch. Matrix builds:
  - `windows-latest` → NSIS + MSI installers
  - `ubuntu-22.04` → AppImage + Debian package
  - `macos-14` → universal DMG (Apple Silicon + Intel)

macOS signing/notarization is optional. Set the `APPLE_CERTIFICATE`, `APPLE_CERTIFICATE_PASSWORD`, `APPLE_SIGNING_IDENTITY`, `APPLE_ID`, `APPLE_PASSWORD` and `APPLE_TEAM_ID` secrets to enable it; otherwise unsigned artifacts are produced. Windows artifacts are currently unsigned as well.

## Project structure

```
├─ src/                    Vue frontend
│  ├─ components/          Welcome screen
│  ├─ desktop/             Tauri bridge (dialog, drag & drop, menu, recent files, startup)
│  ├─ commands/            Custom CAD commands (quit/exit)
│  └─ locale/              Host locale messages merged into the viewer
├─ src-tauri/              Rust/Tauri shell
│  ├─ src/                 main.rs / lib.rs
│  ├─ capabilities/        Permission grants
│  └─ tauri.conf.json      Window, CSP, bundle and file associations
├─ vite/                   Shared Rollup chunking helpers
├─ tools/release.mjs       Release automation
└─ .github/workflows/      CI and release pipelines
```

## Known limitations

- Only one drawing is open at a time; dropping multiple files opens the first one.
- Export actions rely on the web download flow. If your platform blocks downloads inside the webview, use the web version or save via the CAD command line.
- Default fonts/templates are fetched from jsDelivr (`https://cdn.jsdelivr.net`). A network connection is recommended for best text rendering.
- Linux uses WebKitGTK. On some NVIDIA/WebKitGTK combinations you may need `WEBKIT_DISABLE_DMABUF_RENDERER=1`.
- Unsigned macOS builds require right-click → Open (or removing the quarantine attribute) on first launch.

## License

[MIT](./LICENSE) © mlightcad. DWG parsing is provided by the optional GPL-licensed LibreDWG converter; see the upstream [proprietary parser note](https://github.com/mlightcad/cad-viewer/blob/main/PROPRIETARY-PARSER.md) for details.
