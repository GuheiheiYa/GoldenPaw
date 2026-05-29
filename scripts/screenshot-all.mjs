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

await new Promise(r => server.listen(8768, r))
const baseUrl = 'http://localhost:8768'

const browser = await chromium.launch({ headless: true })
const context = await browser.newContext({ viewport: { width: 390, height: 844 } })

async function screenshot(name, tabIndex = 0, action) {
  const page = await context.newPage()
  await page.goto(baseUrl)
  await page.waitForTimeout(1000)
  if (tabIndex !== null) {
    const tabs = await page.locator('.tab-bar-item').all()
    if (tabs[tabIndex]) await tabs[tabIndex].click()
    await page.waitForTimeout(600)
  }
  if (action) await action(page)
  await page.screenshot({ path: path.join(outDir, name), fullPage: true })
  await page.close()
  console.log('✅', name)
}

// 关键页面截图
await screenshot('verify-home.png', 0)
await screenshot('verify-ai.png', 1)
await screenshot('verify-assets.png', 3)
await screenshot('verify-profile.png', 4)

// 设置页：分类管理
await screenshot('verify-settings-category.png', null, async (page) => {
  await page.goto(baseUrl + '/#/pages/settings/index?type=category')
  await page.waitForTimeout(600)
})

// 设置页：账户管理
await screenshot('verify-settings-account.png', null, async (page) => {
  await page.goto(baseUrl + '/#/pages/settings/index?type=account')
  await page.waitForTimeout(600)
})

// 设置页：主题
await screenshot('verify-settings-theme.png', null, async (page) => {
  await page.goto(baseUrl + '/#/pages/settings/index?type=theme')
  await page.waitForTimeout(600)
})

// 设置页：密码锁
await screenshot('verify-settings-security.png', null, async (page) => {
  await page.goto(baseUrl + '/#/pages/settings/index?type=security')
  await page.waitForTimeout(600)
})

// 设置页：记账周期
await screenshot('verify-settings-cycle.png', null, async (page) => {
  await page.goto(baseUrl + '/#/pages/settings/index?type=cycle')
  await page.waitForTimeout(600)
})

await browser.close()
server.close()
console.log('All screenshots done')
