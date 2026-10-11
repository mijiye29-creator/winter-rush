// Writes prototype/models/hero_lv1.glb from tools/models/hero_lv1.js.
// Run from the repo root: node tools/models/build.js [preview.png]
// Needs Playwright with Chromium. Without it, open tools/models/export.html in a browser and press the button.
const { chromium } = require('playwright');
const { writeFileSync } = require('fs');
const { resolve } = require('path');
(async () => {
const browser = await chromium.launch({ args: ['--allow-file-access-from-files', '--use-gl=swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1000, height: 420 } });
page.on('pageerror', e => { console.error(e); process.exitCode = 1; });
await page.goto('file://' + resolve('tools/models/export.html'));
const glb = Buffer.from(await page.evaluate(() => window.exportGLB()), 'base64');
writeFileSync('prototype/models/hero_lv1.glb', glb);
console.log(`prototype/models/hero_lv1.glb ${glb.length} bytes`);
if (process.argv[2]) await page.screenshot({ path: process.argv[2] });
await browser.close();
})();
