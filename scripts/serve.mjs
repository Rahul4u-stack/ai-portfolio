/**
 * Static server that mirrors how Vercel serves this site: Brotli/gzip on text assets,
 * immutable caching on hashed assets, and the SPA fallback for client routes.
 *
 * Use THIS for local Lighthouse runs — never `python3 -m http.server`, which sends no
 * compression and no cache headers, so the build gets scored for the test server's
 * shortcomings and the numbers stop meaning anything. (See HANDOVER.md §9.)
 *
 * Usage: node scripts/serve.mjs [dir=dist] [port=4400]
 */
import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join, normalize } from 'node:path'
import { createBrotliCompress, createGzip } from 'node:zlib'

const root = process.argv[2] ?? 'dist'
const port = Number(process.argv[3] ?? 4400)

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.mp4': 'video/mp4',
  '.pdf': 'application/pdf',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
}

const COMPRESSIBLE = new Set(['.html', '.js', '.css', '.json', '.svg', '.xml', '.txt', '.webmanifest'])

createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost')
  let path = join(root, normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, ''))

  if (existsSync(path) && statSync(path).isDirectory()) path = join(path, 'index.html')
  // SPA fallback for client-side routes such as /case-study/snake
  if (!existsSync(path)) path = join(root, 'index.html')

  const ext = extname(path)
  res.setHeader('Content-Type', TYPES[ext] ?? 'application/octet-stream')
  res.setHeader(
    'Cache-Control',
    path.includes('/assets/')
      ? 'public, max-age=31536000, immutable'
      : 'public, max-age=0, must-revalidate'
  )

  const accept = req.headers['accept-encoding'] ?? ''
  const stream = createReadStream(path)

  if (COMPRESSIBLE.has(ext) && /\bbr\b/.test(accept)) {
    res.setHeader('Content-Encoding', 'br')
    res.setHeader('Vary', 'Accept-Encoding')
    stream.pipe(createBrotliCompress()).pipe(res)
  } else if (COMPRESSIBLE.has(ext) && /\bgzip\b/.test(accept)) {
    res.setHeader('Content-Encoding', 'gzip')
    res.setHeader('Vary', 'Accept-Encoding')
    stream.pipe(createGzip()).pipe(res)
  } else {
    stream.pipe(res)
  }
}).listen(port, '127.0.0.1', () => console.log(`serving ${root} on http://127.0.0.1:${port}`))
