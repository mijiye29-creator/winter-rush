// Writes prototype/models/<name>.glb for every model in tools/models/export.html.
// Run from the repo root: node tools/models/build.js [previewDir]   (previewDir gets one <name>.png per model)
// Needs Playwright with Chromium. Without it, open tools/models/export.html in a browser and press the buttons.
const { chromium } = require('playwright');
const { writeFileSync } = require('fs');
const { resolve } = require('path');
(async () => {
const browser = await chromium.launch({ args: ['--allow-file-access-from-files', '--use-gl=swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1000, height: 420 } });
page.on('pageerror', e => { console.error(e); process.exitCode = 1; });
await page.goto('file://' + resolve('tools/models/export.html'));
for (const name of await page.evaluate(() => Object.keys(MODELS))) {
  const glb = Buffer.from(await page.evaluate(n => window.exportGLB(n), name), 'base64');
  writeFileSync(`prototype/models/${name}.glb`, glb);
  const tris = await page.evaluate(n => window.preview(n), name);
  console.log(`prototype/models/${name}.glb ${glb.length} bytes, ${tris} triangles`);
  if (process.argv[2]) await page.screenshot({ path: `${process.argv[2]}/${name}.png` });
}
await browser.close();
})();
