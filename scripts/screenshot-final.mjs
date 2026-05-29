import { chromium } from 'playwright'
import http from 'http'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '../dist/build/h5')
const outDir = path.resolve(__dirname, '../screenshots')

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })

const mime = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
}

const server = http.createServer((req, res) => {
  let filePath = path.join(root, req.url === '/' ? 'index.html' : req.url)
  const ext = path.extname(filePath).toLowerCase()
  const contentType = mime[ext] || 'application/octet-stream'
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return }
    res.writeHead(200, { 'Content-Type': contentType })
    res.end(data)
  })
})

await new Promise(r => server.listen(8773, r))
const baseUrl = 'http://localhost:8773'

const browser = await chromium.launch({ headless: true })
const context = await browser.newContext({ viewport: { width: 390, height: 844 } })

const pages = [
  ['final-home.png', '/'],
  ['final-ai.png', '/#/pages/ai/ai'],
  ['final-assets.png', '/#/pages/assets/assets'],
  ['final-detail.png', '/#/pages/detail/detail'],
  ['final-report.png', '/#/pages/report/report'],
  ['final-goals.png', '/#/pages/goals/goals'],
  ['final-profile.png', '/#/pages/profile/profile'],
  ['final-settings-category.png', '/#/pages/settings/index?type=category'],
  ['final-settings-account.png', '/#/pages/settings/index?type=account'],
  ['final-settings-theme.png', '/#/pages/settings/index?type=theme'],
  ['final-settings-reminder.png', '/#/pages/settings/index?type=reminder'],
  ['final-settings-security.png', '/#/pages/settings/index?type=security'],
  ['final-settings-cycle.png', '/#/pages/settings/index?type=cycle'],
  ['final-settings-export.png', '/#/pages/settings/index?type=export'],
  ['final-settings-clear.png', '/#/pages/settings/index?type=clear'],
]

for (const [name, url] of pages) {
  const page = await context.newPage()
  page.on('pageerror', err => console.log('PAGEERROR', name, err.message))
  await page.goto(baseUrl + url)
  await page.waitForTimeout(1200)
  await page.screenshot({ path: path.join(outDir, name), fullPage: true })
  await page.close()
  console.log('✅', name)
}

await browser.close()
server.close()
console.log('All final screenshots done')
