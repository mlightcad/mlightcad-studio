#!/usr/bin/env node
/**
 * Release automation for MLightCAD Studio.
 *
 * Adapted from cad-viewer/tools/release.mjs. Differences from upstream:
 * - Single app package, no monorepo lockstep / changesets / npm publishing.
 * - The release version is derived from the `@mlightcad/cad-viewer` dependency
 *   (the CAD engine this app wraps) instead of packages/* versions.
 * - `--sync` writes the engine version into package.json + src-tauri/Cargo.toml
 *   so Tauri bundles always match the engine version.
 *
 * Usage:
 *   node tools/release.mjs [--preview] [version]   create & push a release tag
 *   node tools/release.mjs --sync                  only sync versions, no git ops
 */
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const toolsDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(toolsDir, '..');
const packageJsonPath = path.join(rootDir, 'package.json');
const cargoTomlPath = path.join(rootDir, 'src-tauri', 'Cargo.toml');

/** Package whose version the desktop app tracks. */
const ENGINE_PACKAGE = '@mlightcad/cad-viewer';

const PREVIEW_VERSION_RE = /^\d+\.\d+\.\d+-preview\.\d+$/;
const ANY_VERSION_RE = /^\d+\.\d+\.\d+(-preview\.\d+)?$/;

function run(cmd) {
  return execSync(cmd, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

function fail(msg) {
  console.error(`❌ ${msg}`);
  process.exit(1);
}

function info(msg) {
  console.log(`ℹ️  ${msg}`);
}

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, data) {
  writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

/** Engine version declared in dependencies, with any range prefix stripped. */
function readEngineVersion(pkg) {
  const raw = pkg.dependencies?.[ENGINE_PACKAGE];
  if (!raw) {
    fail(`Missing dependencies["${ENGINE_PACKAGE}"] in package.json.`);
  }
  const version = raw.replace(/^[^0-9]*/, '');
  if (!ANY_VERSION_RE.test(version)) {
    fail(
      `Cannot parse engine version from "${raw}". Pin ${ENGINE_PACKAGE} to an ` +
        `exact version (e.g. "1.7.8" or "1.8.0-preview.6").`
    );
  }
  return version;
}

/**
 * Write `version` into package.json and the [package] section of Cargo.toml.
 * Returns the list of files that changed.
 */
function syncVersionFiles(version) {
  const changed = [];

  const pkg = readJson(packageJsonPath);
  if (pkg.version !== version) {
    pkg.version = version;
    writeJson(packageJsonPath, pkg);
    changed.push('package.json');
  }

  const cargo = readFileSync(cargoTomlPath, 'utf8');
  // Only the [package] version sits on its own line; dependency versions are inline.
  const nextCargo = cargo.replace(
    /^version = ".*"$/m,
    `version = "${version}"`
  );
  if (nextCargo !== cargo) {
    writeFileSync(cargoTomlPath, nextCargo, 'utf8');
    changed.push('src-tauri/Cargo.toml');
  }

  return changed;
}

function parseArgs(argv) {
  let previewFlag = false;
  let syncFlag = false;
  let versionArg = null;

  for (const arg of argv) {
    if (arg === '--preview' || arg === '-p') {
      previewFlag = true;
      continue;
    }
    if (arg === '--sync') {
      syncFlag = true;
      continue;
    }
    if (arg.startsWith('-')) {
      fail(
        `Unknown option "${arg}". Usage: pnpm release [version] [--preview] | pnpm version:sync`
      );
    }
    if (versionArg) {
      fail(`Unexpected extra argument "${arg}".`);
    }
    versionArg = arg.startsWith('v') ? arg.slice(1) : arg;
  }

  return { previewFlag, syncFlag, versionArg };
}

const { previewFlag, syncFlag, versionArg } = parseArgs(process.argv.slice(2));
const engineVersion = readEngineVersion(readJson(packageJsonPath));
const version = versionArg ?? engineVersion;

if (!ANY_VERSION_RE.test(version)) {
  fail(`Invalid version "${version}". Expected X.Y.Z or X.Y.Z-preview.N`);
}

const isPreview = PREVIEW_VERSION_RE.test(version);
if (previewFlag && !isPreview) {
  fail(
    `Version "${version}" is stable, but --preview was set. ` +
      `Use X.Y.Z-preview.N for preview releases.`
  );
}

if (versionArg && versionArg !== engineVersion) {
  console.warn(
    `⚠️  Releasing v${version}, but ${ENGINE_PACKAGE} is ${engineVersion}. ` +
      `The app version normally tracks the engine version.`
  );
}

/* ------------------------------------------------------------------ */
/* --sync: write versions and stop (no git operations)                 */
/* ------------------------------------------------------------------ */
if (syncFlag) {
  const changed = syncVersionFiles(version);
  if (changed.length === 0) {
    console.log(`✅ Versions already in sync at ${version}.`);
  } else {
    console.log(`✅ Synced version to ${version} in:`);
    for (const file of changed) console.log(`   - ${file}`);
    console.log('   Commit the changes before running "pnpm release".');
  }
  process.exit(0);
}

/* ------------------------------------------------------------------ */
/* Release: safety checks, then create & push the tag                  */
/* ------------------------------------------------------------------ */
const tag = `v${version}`;

try {
  run(`git rev-parse --verify refs/tags/${tag}`);
  fail(`Tag ${tag} already exists.`);
} catch {
  // tag does not exist → OK
}

const branch = run('git branch --show-current');
if (branch !== 'main') {
  fail(`Current branch is "${branch}". Please release from "main".`);
}

const status = run('git status --porcelain');
if (status) {
  fail('Working tree is not clean. Please commit or stash changes.');
}

const pkg = readJson(packageJsonPath);
const cargoToml = readFileSync(cargoTomlPath, 'utf8');
const cargoVersion = cargoToml.match(/^version = "(.*)"$/m)?.[1];
if (pkg.version !== version || cargoVersion !== version) {
  fail(
    `Version mismatch: package.json=${pkg.version}, Cargo.toml=${cargoVersion}, target=${version}.\n` +
      `Run "pnpm version:sync", commit the changes, then retry.`
  );
}

console.log(
  `🚀 Creating ${isPreview ? 'preview' : 'release'} tag ${tag} ` +
    `(${ENGINE_PACKAGE} ${engineVersion})`
);
run(`git tag -a ${tag} -m "release: release ${tag}"`);
run(`git push origin ${tag}`);

console.log(`✅ Tag ${tag} pushed. The Desktop Release workflow will build`);
console.log('   Windows (NSIS/MSI), Linux (AppImage/deb) and macOS (universal dmg)');
console.log(
  `   bundles and attach them to a ${isPreview ? 'pre-release' : 'draft release'}.`
);
