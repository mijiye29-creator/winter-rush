// Run: node tests/model_growth.test.cjs (requires Playwright and Chromium).
// Instrument only the served test response, without adding production debug hooks.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '../prototype');
const errors = [];
const server = http.createServer((req, res) => {
  const pathname = new URL(req.url, 'http://localhost').pathname;
  const file = path.join(root, pathname === '/' ? 'index.html' : pathname);
  try {
    let body = fs.readFileSync(file);
    if (file.endsWith('/game.js')) body = body.toString().replace('window.__winter = {',
      'window.__test = {updateHunters,applyGear,dressStaff,tintOutfit,models,gearM};window.__winter = {');
    res.setHeader('Content-Type', file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : file.endsWith('.glb') ? 'model/gltf-binary' : 'text/html');
    res.end(body);
  } catch { res.writeHead(404); res.end(); }
});
(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch({
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || (fs.existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined),
    args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader'],
  });
  try {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    await page.route('https://**', route => route.abort());
    await page.goto(url);
    await page.waitForFunction(() => window.__winter && __winter.player.body.getObjectByName('hero_lv1'));
    const checks = await page.evaluate(async () => {
      const w = __winter, t = __test;
      const inspect = (parent, model, name) => {
        let found;
        parent.getObjectByName(model).traverse(mesh => {
          const region = mesh.userData.colorRegions?.find(r => r.name === name);
          if (region) {
            const c = mesh.geometry.attributes.color;
            found = new THREE.Color(c.getX(region.start), c.getY(region.start), c.getZ(region.start)).getHex();
          }
        });
        return found;
      };
      const skin = inspect(w.player.body, 'hero_lv1', 'face');
      const heroColors = [];
      for (let level = 0; level <= 8; level++) {
        w.S.lv.hero = level; t.applyGear();
        const coat = inspect(w.player.body, 'hero_lv1', 'coat');
        if (inspect(w.player.body, 'hero_lv1', 'sleeveL') !== coat || inspect(w.player.body, 'hero_lv1', 'hood') !== coat) throw Error('Hero outfit mismatch at ' + level);
        if (inspect(w.player.body, 'hero_lv1', 'face') !== skin) throw Error('Face tinted at ' + level);
        if (t.gearM.coat.visible || t.gearM.boot.some(m => m.visible)) throw Error('Duplicate coat/boots');
        heroColors.push(coat);
      }
      w.S.lv.saberCoat = 1; t.applyGear();
      const legendary = inspect(w.player.body, 'hero_lv1', 'sleeveL');
      w.S.lv.saberCoat = 0; t.applyGear();
      w.levelUp('hunter'); w.levelUp('hunter');
      await new Promise(resolve => setTimeout(resolve, 500));
      const [a, b] = w.hunters;
      const hunterColors = [];
      for (let stage = 1; stage <= 4; stage++) {
        w.S.stage = stage; t.dressStaff(a, true); t.dressStaff(b, true);
        hunterColors.push(inspect(a.body, 'hunter_lv1', 'coat'));
      }
      const other = inspect(b.body, 'hunter_lv1', 'coat');
      t.tintOutfit(a.body, 'hunter_lv1', {'material:coat': 0xff00ff});
      if (inspect(b.body, 'hunter_lv1', 'coat') !== other) throw Error('Shared color buffer mutated');
      w.S.stage = 2; t.dressStaff(a, true);
      const deliveries = [];
      for (const state of ['home', 'hides']) {
        Object.assign(a, {state, path: [], x: state === 'home' ? w.P.meatTile.x : 9.4,
          z: state === 'home' ? w.P.meatTile.z + 1.3 : 3.8, hp: 4, n: 0, hides: state === 'hides' ? 1 : 0, down: 0});
        t.updateHunters(.01);
        if (a.state !== 'rest') throw Error('Premature departure after ' + state);
        deliveries.push(a.state);
        for (let i = 0; i < 20 && a.state === 'rest'; i++) t.updateHunters(.5);
        if (a.state !== 'out' || a.hp < 12.8) throw Error('Rest did not heal before departure');
      }
      w.S.stage = 4; w.S.lv.fire = 15; w.save();
      return {heroColors, hunterColors, legendary, deliveries};
    });
    assert.equal(checks.heroColors[8], 0x2a2f4a);
    assert.deepEqual(checks.hunterColors, [0x6b8e3a, 0x4f7a36, 0x8a5a3a, 0x2c3e7a]);
    assert.equal(checks.legendary, 0xe0a050);
    // Saved growth must apply when the GLB resolves after load().
    await page.reload();
    await page.waitForFunction(() => window.__winter && __winter.player.body.getObjectByName('hero_lv1'));
    assert.equal(await page.evaluate(() => __winter.S.lv.hero), 8);
    assert.equal(await page.locator('#go').textContent(), '이어하기');
    await page.click('#go');
    const x = await page.evaluate(() => __winter.pl.x);
    await page.keyboard.down('d'); await page.waitForTimeout(500); await page.keyboard.up('d');
    assert.notEqual(await page.evaluate(() => __winter.pl.x), x);
    // Test an intentionally late GLB response, with growth performed before it arrives.
    const late = await context.newPage();
    late.on('pageerror', error => errors.push(error.message));
    let release;
    const gate = new Promise(resolve => { release = resolve; });
    await late.route('https://**', route => route.abort());
    await late.route('**/models/hero_lv1.glb*', async route => { await gate; await route.continue(); });
    await late.goto(url);
    await late.waitForFunction(() => window.__winter);
    await late.evaluate(() => { __winter.S.lv.hero = 6; __test.applyGear(); });
    release();
    await late.waitForFunction(() => __winter.player.body.getObjectByName('hero_lv1'));
    assert.equal(await late.evaluate(() => __test.gearM.coat.visible), false);
    // Missing GLB must retain the original shape outfit, including upgraded coat.
    const fallback = await browser.newPage({ viewport: { width: 390, height: 844 } });
    fallback.on('pageerror', error => errors.push(error.message));
    await fallback.route('https://**', route => route.abort());
    await fallback.route('**/models/*.glb*', route => route.abort());
    await fallback.goto(url); await fallback.waitForFunction(() => window.__winter);
    assert.equal(await fallback.evaluate(() => { __winter.S.lv.hero = 8; __test.applyGear(); return __test.gearM.coat.visible; }), true);
    assert.deepEqual(errors, []);
    console.log('PASS: 9 hero levels, legendary coat, 4 hunter stages, instance isolation, both delivery rest paths, late GLB, fallback, mobile movement and save/resume.');
  } finally { await browser.close(); server.close(); }
})().catch(error => { console.error(error); server.close(); process.exitCode = 1; });
