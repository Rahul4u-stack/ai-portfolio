/**
 * Responsive probe over the Chrome DevTools Protocol.
 *
 * Chrome's `--window-size` clamps the CSS viewport to a 500px minimum on macOS, so it CANNOT
 * test 320/375/390 — a "320px" screenshot that way is a crop of a 500px layout and looks like
 * catastrophic overflow that isn't there. Emulation.setDeviceMetricsOverride sets a true CSS
 * viewport at any width. (See HANDOVER.md §9.)
 *
 * Reports per width: scrollWidth vs viewport, elements overflowing either edge, interactive
 * targets under 44px, elements stuck below opacity 0.95, and section heights. Saves full-page
 * screenshots per width.
 *
 * Usage: node scripts/probe.mjs [url=http://127.0.0.1:4400/] [outDir=./probe-out] [--reduced]
 */
import { spawn } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import { setTimeout as sleep } from 'node:timers/promises'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const url = process.argv[2] ?? 'http://127.0.0.1:4400/'
const outDir = process.argv[3] ?? './probe-out'
const reduced = process.argv.includes('--reduced')
const WIDTHS = [320, 375, 390, 768, 1024, 1440]
const PORT = 9333 + (reduced ? 1 : 0)

mkdirSync(outDir, { recursive: true })

const chrome = spawn(
  CHROME,
  [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    `--remote-debugging-port=${PORT}`,
    '--user-data-dir=' + outDir + '/profile',
    'about:blank',
  ],
  { stdio: 'ignore' }
)

async function targetWs() {
  for (let i = 0; i < 60; i += 1) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/list`)
      const targets = await res.json()
      const page = targets.find((t) => t.type === 'page')
      if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl
    } catch {
      /* not up yet */
    }
    await sleep(250)
  }
  throw new Error('Chrome never exposed a page target')
}

const ws = new WebSocket(await targetWs())
await new Promise((resolve, reject) => {
  ws.addEventListener('open', resolve, { once: true })
  ws.addEventListener('error', reject, { once: true })
})

let nextId = 1
const waiting = new Map()
ws.addEventListener('message', (event) => {
  const msg = JSON.parse(event.data)
  if (msg.id && waiting.has(msg.id)) {
    const { resolve, reject } = waiting.get(msg.id)
    waiting.delete(msg.id)
    if (msg.error) reject(new Error(JSON.stringify(msg.error)))
    else resolve(msg.result)
  }
})

function send(method, params = {}) {
  const id = nextId++
  return new Promise((resolve, reject) => {
    waiting.set(id, { resolve, reject })
    ws.send(JSON.stringify({ id, method, params }))
  })
}

await send('Page.enable')
await send('Runtime.enable')
if (reduced) {
  await send('Emulation.setEmulatedMedia', {
    features: [{ name: 'prefers-reduced-motion', value: 'reduce' }],
  })
}

const MEASURE = `(() => {
  const ids = ['impact','work','decisions','experience','lab','about','contact'];
  const vw = window.innerWidth;
  const offenders = [];
  for (const el of document.querySelectorAll('body *')) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    if (r.right > vw + 1 || r.left < -1) {
      const cs = getComputedStyle(el);
      if (cs.position === 'fixed' && cs.visibility === 'hidden') continue;
      offenders.push({ tag: el.tagName, cls: String(el.className).slice(0, 72), left: Math.round(r.left), right: Math.round(r.right) });
    }
  }
  const small = [];
  for (const el of document.querySelectorAll('a[href], button')) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;
    if (r.width < 44 || r.height < 44) small.push({ name: (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 40), w: Math.round(r.width), h: Math.round(r.height) });
  }
  const sections = {};
  for (const id of ids) { const el = document.getElementById(id); if (el) sections[id] = Math.round(el.getBoundingClientRect().height); }
  const invisible = [];
  for (const el of document.querySelectorAll('section, article, aside, dl, h2, h3, p')) {
    const cs = getComputedStyle(el);
    if (parseFloat(cs.opacity) < 0.95) invisible.push({ cls: String(el.className).slice(0, 50), op: cs.opacity });
  }
  return JSON.stringify({
    vw,
    scrollW: document.documentElement.scrollWidth,
    totalH: document.documentElement.scrollHeight,
    overflowCount: offenders.length,
    overflow: offenders.slice(0, 8),
    smallTargets: small.slice(0, 10),
    smallTargetCount: small.length,
    sections,
    stillFading: invisible.slice(0, 6),
    stillFadingCount: invisible.length,
  });
})()`

const report = {}

for (const width of WIDTHS) {
  await send('Emulation.setDeviceMetricsOverride', {
    width,
    height: 900,
    deviceScaleFactor: 1,
    mobile: width < 768,
  })
  await send('Page.navigate', { url })
  await sleep(2600)

  const { result } = await send('Runtime.evaluate', {
    expression: MEASURE,
    returnByValue: true,
  })
  report[width] = JSON.parse(result.value)

  const { data } = await send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: true,
  })
  writeFileSync(`${outDir}/${reduced ? 'rm-' : ''}${width}-full.png`, Buffer.from(data, 'base64'))
}

writeFileSync(`${outDir}/${reduced ? 'rm-' : ''}report.json`, JSON.stringify(report, null, 2))

for (const [width, r] of Object.entries(report)) {
  const overflows = r.scrollW > r.vw + 1
  console.log(
    `w=${String(width).padStart(4)}  viewport=${r.vw}  scrollW=${r.scrollW}${overflows ? '  ← HORIZONTAL OVERFLOW' : ''}  pageH=${r.totalH}  offenders=${r.overflowCount}  smallTargets=${r.smallTargetCount}  fading=${r.stillFadingCount}`
  )
  if (r.overflowCount) console.log('   overflow:', JSON.stringify(r.overflow))
}
console.log('\nsections @1440:', JSON.stringify(report[1440]?.sections))

ws.close()
chrome.kill()
