import { execSync } from 'node:child_process'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * "Last updated" comes from the last git commit date — real repository metadata, not a
 * hard-coded date and not a fake live indicator. Falls back to build time when git isn't
 * available (e.g. a source tarball).
 */
function resolveLastUpdated() {
  try {
    // A dirty tree means the last commit understates when this build's content was made —
    // fall through to build time so a local preview never claims a stale date.
    const dirty = execSync('git status --porcelain', {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
    if (dirty) return new Date().toISOString()
    return execSync('git log -1 --format=%cI', {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
  } catch {
    return new Date().toISOString()
  }
}

/**
 * Fonts are referenced from inside the CSS bundle, so the browser can't discover them until the
 * stylesheet has downloaded and parsed — which delays first text paint. Preload just the three
 * latin faces that render above the fold. Filenames are content-hashed, so they have to be read
 * out of the emitted bundle rather than hard-coded in index.html.
 */
function preloadCriticalFonts() {
  const CRITICAL = [
    /instrument-serif-latin-400-normal-[^.]+\.woff2$/,
    /archivo-latin-wght-normal-[^.]+\.woff2$/,
    /jetbrains-mono-latin-400-normal-[^.]+\.woff2$/,
  ]

  return {
    name: 'preload-critical-fonts',
    enforce: 'post',
    apply: 'build',
    transformIndexHtml(html, ctx) {
      const files = Object.keys(ctx.bundle ?? {}).filter((file) =>
        CRITICAL.some((pattern) => pattern.test(file))
      )
      return {
        html,
        tags: files.map((file) => ({
          tag: 'link',
          injectTo: 'head-prepend',
          attrs: {
            rel: 'preload',
            as: 'font',
            type: 'font/woff2',
            href: `/${file}`,
            crossorigin: 'anonymous',
          },
        })),
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), preloadCriticalFonts()],
  define: {
    __LAST_UPDATED__: JSON.stringify(resolveLastUpdated()),
  },
  /*
   * Deliberately NO manualChunks for the markdown renderer.
   *
   * Splitting it into a named chunk promoted it to a top-level chunk, which made Vite emit
   * `<link rel="modulepreload">` for it in index.html — so every homepage visitor downloaded
   * 43 kB of markdown renderer they only need after clicking into a case study. The lazy route
   * in App.jsx already keeps it off the homepage; letting it sit inside the CaseStudyPage chunk
   * is what actually defers it.
   */
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
    css: false,
  },
})
