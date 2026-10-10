(() => {
'use strict';
const V = (x, y, z) => new THREE.Vector3(x, y, z);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const rand = (a, b) => a + Math.random() * (b - a);

const { T, UP } = window.WinterRushData;

const S = {
  coins: 0, coinPile: 0, coinFish: 0, coinLeather: 0, tanWood: 0, wood: 0, meat: 0, hide: 0, fishCrate: 0, fishRaw: 0, ovenWood: 0, fishSmoked: 0, fishStock: 0, smokeFuel: 0, smokeT: 0, tanFuel: 0, leather: 0, stage: 1, tanT: 0, petCount: 0, petHits: 0, grillItems: [], counter: { steak: 0 },
  fuel: 0, cookT: 0, warmth: 55, hp: 5, maxHp: 5, stun: 0, hurtCd: 0, hitstop: 0,
  lv: Object.fromEntries(Object.keys(UP).map(k => [k, 0])),
  phase: 'calm', phaseT: T.firstCalm, stormK: 0, storms: 0, stormFireOut: false,
  served: 0, bought: 0, tut: 0, woodIn: 0, meatIn: 0, steakIn: 0, goal: 0,
  stat: { sold: 0, soldFish: 0, soldLeather: 0, kills: 0, held: 0, boss: 0, wolves: 0, hides: 0 },
  timers: {}, started: false,
};
const val = k => UP[k].vals[S.lv[k]];
const bagCap = () => val('bag') + 4 * pets.length;
const hidesOn = () => S.lv.hunter >= 3;
const heroLv = () => S.lv.axe + S.lv.boots + S.lv.coat + S.lv.cape;   // drives how tough the wild animals get
const ovenCap = () => T.ovenCap[S.lv.oven];
const ST = T.staff;
const raidSize = gate => Math.max(0, 1 + Math.floor((S.storms + 1) / 2) - gate);
const blockChance = (db = 0, dc = 0) => T.armor.boots[S.lv.boots + db] + T.armor.coat[S.lv.coat + dc];
const pct = v => `${Math.round(v * 100)}%`;
const DESC = {
  bag: (a, b) => `용량 ${a} → ${b}`,
  axe: (a, b) => `공격력 ${a} → ${b}, 벌목 속도 ↑`,
  boots: (a, b) => `이동 속도 ${a} → ${b}, 막기 ${pct(blockChance())} → ${pct(blockChance(1, 0))}`,
  cape: (a, b) => `최대 체력 ${a} → ${b}`,
  coat: () => `막기 확률 ${pct(blockChance())} → ${pct(blockChance(0, 1))}`,
  gate: (a, b) => `다음 눈보라 습격 곰 ${raidSize(a)} → ${raidSize(b)}마리`,
  helper: (a, b) => a ? `나무꾼 숙련 Lv${b}: 장작 ${ST.helperCarry[a]} → ${ST.helperCarry[b]}개씩, 더 빠르게` : `나무꾼 고용 (장작 ${ST.helperCarry[1]}개씩 자동 운반)`,
  server: (a, b) => a ? `서빙 숙련 Lv${b}: 한 번에 ${ST.serverCarry[a]} → ${ST.serverCarry[b]}개, 더 빠르게` : `서빙 직원 고용 (그릴 → 카운터)`,
  hunter: (a, b) => a ? `사냥꾼 숙련 Lv${b}: 공격력 ${ST.hunterDmg[a]} → ${ST.hunterDmg[b]}` + (b === 3 ? ', 가죽도 수집 → 가죽 공방 개방' : '') : `사냥꾼 고용 (곰 자동 사냥)`,
  cabin: (a, b) => `오두막 ${a} → ${b}채 (손님 수·주문량 ↑)`,
  fishing: () => `2단계! 마을 확장, 얼음 낚시터 + 훈제 생선 가게 개방`,
  clerk: (a, b) => `점원 숙련 Lv${b}: 동시 손님 ${ST.clerkSlots[a]} → ${ST.clerkSlots[b]}명, 판매 속도 ↑`,
  artisan: (a, b) => b === 1 ? `가죽 장인 고용: 가죽 → 가죽 제품 (${T.tanTime[1]}초)` : `제작 속도 ${T.tanTime[a]}초 → ${T.tanTime[b]}초`,
  helper2: () => `두 번째 나무꾼 고용 (같은 숙련도로 장작 운반)`,
  hunter2: () => `두 번째 사냥꾼 고용 (같은 숙련도로 사냥)`,
  oven: (a, b) => `화덕 Lv${b + 1}: 생선 ${T.ovenTime[a]}초 → ${T.ovenTime[b]}초, 위에 ${T.ovenCap[a]} → ${T.ovenCap[b]}마리`,
  fishClerk: (a, b) => a ? `생선 점원 숙련 Lv${b}: 동시 손님 ${ST.clerkSlots[a]} → ${ST.clerkSlots[b]}명` : `생선 가게 점원 고용 (판매 속도 ↑)`,
  fisher: (a, b) => a ? `낚시꾼 숙련 Lv${b}: 더 빨리, ${ST.fisherCarry[b]}마리씩` : `낚시꾼 고용 (생선 상자에 자동 공급)`,
};
const descOf = k => { const u = UP[k], l = S.lv[k]; return l >= u.costs.length ? `${u.icon} ${u.name} 최대 레벨` : `${u.icon} ${u.name}: ${DESC[k](u.vals[l], u.vals[l + 1])}`; };
function tick(key, every, dt) {
  const t = (S.timers[key] = (S.timers[key] ?? every) + dt);
  if (t >= every) { S.timers[key] = t - every; return true; }
  return false;
}
const resetTick = key => { delete S.timers[key]; };

// ───────────────────────── renderer / scene ─────────────────────────
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.getElementById('game').appendChild(renderer.domElement);
const scene = new THREE.Scene();
const calmSky = new THREE.Color(0xdfeaf5), stormSky = new THREE.Color(0xb9c8d8);
scene.background = calmSky.clone();
scene.fog = new THREE.Fog(scene.background, 40, 90);
const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 200);
function resize() {
  renderer.setSize(innerWidth, innerHeight);
  camera.aspect = innerWidth / innerHeight;
  camera.fov = camera.aspect < 1 ? 50 : 40;
  camera.updateProjectionMatrix();
}
addEventListener('resize', resize); resize();

const hemi = new THREE.HemisphereLight(0xffffff, 0xb0c4de, .8);
scene.add(hemi);
const sun = new THREE.DirectionalLight(0xffffff, .75);
sun.castShadow = true;
sun.shadow.mapSize.set(1024, 1024);
Object.assign(sun.shadow.camera, { left: -18, right: 18, top: 18, bottom: -18, near: 1, far: 60 });
scene.add(sun, sun.target);

const matCache = {};
const mat = (c, o) => {
  const k = c + JSON.stringify(o || {});
  return matCache[k] || (matCache[k] = new THREE.MeshLambertMaterial(Object.assign({ color: c }, o)));
};
function mesh(geo, material, x = 0, y = 0, z = 0, shadow = true) {
  const m = new THREE.Mesh(geo, material);
  m.position.set(x, y, z);
  m.castShadow = shadow; m.receiveShadow = true;
  return m;
}
function disposeActor(group, sharedGeometry = null) {
  const geometries = new Set();
  group.traverse(o => { if (o.isMesh && o.geometry !== sharedGeometry) geometries.add(o.geometry); });
  geometries.forEach(g => g.dispose());
}

// ───────────────────────── canvas labels ─────────────────────────
function canvasTex(w, h) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const tex = new THREE.CanvasTexture(c);
  return { c, ctx: c.getContext('2d'), tex, draw(fn) { this.ctx.clearRect(0, 0, w, h); fn(this.ctx, w, h); tex.needsUpdate = true; } };
}
function sprite(w, h, sx, sy) {
  const ct = canvasTex(w, h);
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: ct.tex, depthTest: false, transparent: true }));
  sp.scale.set(sx, sy, 1); sp.renderOrder = 10;
  ct.sp = sp; return ct;
}
const FONT = '"Jua", "Apple SD Gothic Neo", "Noto Sans KR", sans-serif';
function bubble(ctx, w, h, text, bg = '#fff', fg = '#13253d') {
  ctx.fillStyle = bg;
  const r = 22, bh = h - 18;
  ctx.beginPath();
  ctx.moveTo(r, 0); ctx.arcTo(w, 0, w, bh, r); ctx.arcTo(w, bh, 0, bh, r);
  ctx.lineTo(w / 2 + 12, bh); ctx.lineTo(w / 2, h); ctx.lineTo(w / 2 - 12, bh);
  ctx.arcTo(0, bh, 0, 0, r); ctx.arcTo(0, 0, w, 0, r); ctx.fill();
  ctx.fillStyle = fg; ctx.font = `${Math.round(bh * .52)}px ${FONT}`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(text, w / 2, bh / 2 + 2);
}

// ───────────────────────── items ─────────────────────────
const GEO = {
  log: new THREE.CylinderGeometry(.2, .2, .85, 8).rotateZ(Math.PI / 2),
  meat: new THREE.SphereGeometry(.27, 8, 6).scale(1, .5, .8),
  steak: new THREE.CylinderGeometry(.3, .28, .12, 9),
  coin: new THREE.CylinderGeometry(.17, .17, .06, 10),
  fish: new THREE.SphereGeometry(.28, 8, 6).scale(1.4, .45, .6),
  hide: new THREE.BoxGeometry(.62, .1, .48),
  leather: new THREE.BoxGeometry(.5, .22, .4),
};
GEO.sfish = GEO.fish;
const IMAT = { log: mat(0xc8773a), meat: mat(0xef7b7b), steak: mat(0x8b3a1f), coin: mat(0xf5c542, { emissive: 0x4a3000 }), fish: mat(0x9fb6c8), hide: mat(0x8a5a3a), leather: mat(0x6b3a1e), sfish: mat(0xb5793a) };
const ITEM_H = { log: .4, meat: .27, steak: .15, coin: .07, fish: .2, hide: .1, leather: .22, sfish: .2 };
const itemMesh = type => mesh(GEO[type], IMAT[type]);

// fixed-size visual pile for a counter value
function pile(type, maxN, origin, cols, rows, sx, sz) {
  const g = new THREE.Group(); g.position.copy(origin); scene.add(g);
  const per = cols * rows, list = [];
  for (let i = 0; i < maxN; i++) {
    const m = itemMesh(type), j = i % per, layer = Math.floor(i / per);
    m.position.set((j % cols - (cols - 1) / 2) * sx, ITEM_H[type] / 2 + layer * ITEM_H[type], (Math.floor(j / cols) - (rows - 1) / 2) * sz);
    m.rotation.y = rand(-.08, .08);
    m.visible = false; g.add(m); list.push(m);
  }
  return { g, set(n) { list.forEach((m, i) => (m.visible = i < n)); } };
}

const flyers = [];
function fly(type, from, to, dur = .32) {
  const m = itemMesh(type); m.position.copy(from); scene.add(m);
  flyers.push({ m, from: from.clone(), to: to.clone(), t: 0, dur });
}
function updateFlyers(dt) {
  for (let i = flyers.length - 1; i >= 0; i--) {
    const f = flyers[i]; f.t += dt;
    const k = Math.min(1, f.t / f.dur);
    f.m.position.lerpVectors(f.from, f.to, k); f.m.position.y += Math.sin(k * Math.PI) * 1.3;
    f.m.rotation.y += dt * 10;
    if (k >= 1) { scene.remove(f.m); flyers.splice(i, 1); }
  }
}

// ───────────────────────── juice: particles, damage numbers, sound, haptics ─────────────────────────
const parts = [], partGeo = new THREE.BoxGeometry(.13, .13, .13);
function burst(x, y, z, color, n, o = {}) {
  const { spd = 4, up = 4, life = .5, size = 1, grav = 14 } = o;
  for (let i = 0; i < n && parts.length < 160; i++) {
    const m = new THREE.Mesh(partGeo, mat(color)), a = rand(0, Math.PI * 2), sp = rand(.4, 1) * spd;
    m.position.set(x, y, z); m.scale.setScalar(size * rand(.6, 1.2)); scene.add(m);
    parts.push({ m, vx: Math.cos(a) * sp, vy: rand(.5, 1) * up, vz: Math.sin(a) * sp, life, max: life, grav, size: m.scale.x });
  }
}
function updateParts(dt) {
  for (let i = parts.length - 1; i >= 0; i--) {
    const p = parts[i]; p.life -= dt; p.vy -= p.grav * dt;
    p.m.position.set(p.m.position.x + p.vx * dt, Math.max(.05, p.m.position.y + p.vy * dt), p.m.position.z + p.vz * dt);
    p.m.rotation.x += dt * 8; p.m.scale.setScalar(p.size * Math.max(0, p.life / p.max));
    if (p.life <= 0) { scene.remove(p.m); parts.splice(i, 1); }
  }
}
const pops = [];
function popText(x, y, z, text, color = '#fff', big = false) {
  const ct = sprite(200, 90, big ? 2.4 : 1.6, big ? 1.08 : .72);
  ct.draw((c, w, h) => { c.font = `${big ? 66 : 54}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineWidth = 9; c.strokeStyle = '#13253d'; c.strokeText(text, w / 2, h / 2); c.fillStyle = color; c.fillText(text, w / 2, h / 2); });
  ct.sp.position.set(x + rand(-.3, .3), y, z); scene.add(ct.sp);
  pops.push({ ct, t: 0, bx: ct.sp.scale.x, by: ct.sp.scale.y });
}
function updatePops(dt) {
  for (let i = pops.length - 1; i >= 0; i--) {
    const p = pops[i], sp = p.ct.sp; p.t += dt;
    const k = p.t < .1 ? 1 + (1 - p.t / .1) * .7 : 1;
    sp.scale.set(p.bx * k, p.by * k, 1); sp.position.y += dt * 1.8; sp.material.opacity = Math.min(1, 3 * (1 - p.t / .8));
    if (p.t >= .8) { scene.remove(sp); p.ct.tex.dispose(); sp.material.dispose(); pops.splice(i, 1); }
  }
}
const SND = { on: true, vib: true, ctx: null, wind: null, last: {} };
function audioInit() {
  if (SND.ctx) return;
  try {
    const ctx = SND.ctx = new (window.AudioContext || window.webkitAudioContext)();
    const buf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    SND.noise = buf;
    const src = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    src.buffer = buf; src.loop = true; f.type = 'bandpass'; f.frequency.value = 500; f.Q.value = .6; g.gain.value = 0;
    src.connect(f).connect(g).connect(ctx.destination); src.start(); SND.wind = g;
  } catch (e) { SND.ctx = null; }
}
function tone(freq, dur, type = 'sine', vol = .2, to = 0, delay = 0) {
  const ctx = SND.ctx; if (!ctx || !SND.on) return;
  const t0 = ctx.currentTime + delay, o = ctx.createOscillator(), g = ctx.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, t0); if (to) o.frequency.exponentialRampToValueAtTime(to, t0 + dur);
  g.gain.setValueAtTime(vol, t0); g.gain.exponentialRampToValueAtTime(.001, t0 + dur);
  o.connect(g).connect(ctx.destination); o.start(t0); o.stop(t0 + dur + .02);
}
function noise(dur, freq, q = 1, vol = .2) {
  const ctx = SND.ctx; if (!ctx || !SND.on) return;
  const t0 = ctx.currentTime, s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
  s.buffer = SND.noise; f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = q;
  g.gain.setValueAtTime(vol, t0); g.gain.exponentialRampToValueAtTime(.001, t0 + dur);
  s.connect(f).connect(g).connect(ctx.destination); s.start(t0, Math.random() * .5); s.stop(t0 + dur + .02);
}
const sfx = {
  chop: () => { noise(.09, 2200, 1.5, .3); tone(260, .07, 'triangle', .12, 150); },
  swing: () => noise(.12, 3500, .7, .06),
  hit: () => { tone(140, .14, 'sine', .55, 45); noise(.08, 900, 1, .4); },
  pain: () => tone(190, .2, 'sawtooth', .12, 85),
  crit: () => { tone(180, .22, 'square', .22, 50); noise(.15, 600, .8, .5); },
  kill: () => { tone(110, .45, 'sawtooth', .2, 35); noise(.3, 400, .7, .35); },
  coin: () => tone(1400 + Math.random() * 300, .06, 'square', .05, 2000),
  pop: () => tone(520, .07, 'sine', .14, 900),
  hurt: () => { tone(200, .25, 'sawtooth', .25, 70); noise(.12, 700, 1, .3); },
  growl: () => tone(70, .5, 'sawtooth', .12, 55),
  up: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, .14, 'triangle', .16, 0, i * .07)),
  splash: () => noise(.3, 1400, .6, .25),
  burnt: () => noise(.5, 3000, .5, .08),
  warn: () => [440, 330].forEach((f, i) => tone(f, .3, 'triangle', .15, 0, i * .25)),
};
function play(name, gap = 0) {
  const now = performance.now();
  if (gap && now - (SND.last[name] || 0) < gap) return;
  SND.last[name] = now; sfx[name]();
}
function buzz(p) { try { if (SND.vib && navigator.vibrate) navigator.vibrate(p); } catch (e) {} }

// ───────────────────────── world layout ─────────────────────────
const ground = mesh(new THREE.PlaneGeometry(160, 160).rotateX(-Math.PI / 2), mat(0xe4edf6), 0, 0, 0, false);
scene.add(ground);
const camp = mesh(new THREE.PlaneGeometry(16, 16).rotateX(-Math.PI / 2), mat(0xd99c86), 0, .01, -2, false);
scene.add(camp);

const P = {
  woodTile: V(-.4, 0, -3), fire: V(2, 0, -3), meatTile: V(4.4, 0, -3),
  grill: V(2, 0, -5.4), counter: V(4.6, 0, -8.9), counterStand: V(4.6, 0, -7.6),
  coinPile: V(6.9, 0, -7.2), gate: V(0, 0, 6), queueFront: V(3.6, 0, -11.2),
  fishShop: V(11.6, 0, -8.9), oven: V(14, 0, -8.9), ovenOut: V(14, 0, -7.2),
  ovenWood: V(12, 0, -4.8), fishCrate: V(14.2, 0, -4.8), serverGrill: V(.3, 0, -5.4), serverWay: V(.3, 0, -7.1),
  fishCoin: V(11.4, 0, -7.2), tanWood: V(8.8, 0, 4.2), tanCoin: V(10.6, 0, 4.4),
  holes: [V(11.7, 0, 0), V(13.4, 0, 1.4)],
};
const BOUNDS = { x1: -21, x2: 18, z1: -15, z2: 24 };
const CAMP = { x1: -8, x2: 8, z1: -10, z2: 6 };
const grillBox = { x1: .9, x2: 3.1, z1: -6.2, z2: -4.6 };
const counterBox = { x1: 3.1, x2: 6.1, z1: -9.5, z2: -8.3 };
const WALLS1 = [
  { x1: -8.3, x2: 8.3, z1: -10.3, z2: -9.7 },
  { x1: -8.3, x2: -1.8, z1: 5.7, z2: 6.3 }, { x1: 1.8, x2: 8.3, z1: 5.7, z2: 6.3 },
  { x1: -8.3, x2: -7.7, z1: -10.3, z2: -6 }, { x1: -8.3, x2: -7.7, z1: -2, z2: 6.3 },
  { x1: 7.7, x2: 8.3, z1: -10.3, z2: 6.3 }, grillBox, counterBox,
];
const WALLS2 = [   // stage 2: the village extends east to x = 16
  { x1: -8.3, x2: 16.3, z1: -10.3, z2: -9.7 },
  { x1: -8.3, x2: -1.8, z1: 5.7, z2: 6.3 }, { x1: 1.8, x2: 16.3, z1: 5.7, z2: 6.3 },
  { x1: -8.3, x2: -7.7, z1: -10.3, z2: -6 }, { x1: -8.3, x2: -7.7, z1: -2, z2: 6.3 },
  { x1: 15.7, x2: 16.3, z1: -10.3, z2: 6.3 }, grillBox, counterBox,
  { x1: 10.3, x2: 12.9, z1: -9.45, z2: -8.35 },   // fish shop bench
  { x1: 13.3, x2: 14.7, z1: -9.6, z2: -7.75 },    // fish oven, attached to the shop
];
let walls = WALLS1;
const circles = [{ x: P.fire.x, z: P.fire.z, r: .95 }];

// fence posts as instanced meshes, one set per village stage
function buildFence(segs, capColor) {
  const posts = [], g = new THREE.Group();
  for (const [x1, z1, x2, z2] of segs) {
    const n = Math.max(1, Math.round(Math.hypot(x2 - x1, z2 - z1) / .55));
    for (let i = 0; i <= n; i++) posts.push([x1 + (x2 - x1) * i / n, z1 + (z2 - z1) * i / n]);
  }
  const im = new THREE.InstancedMesh(new THREE.CylinderGeometry(.27, .27, 1.3, 9), mat(0xd08b45), posts.length);
  const caps = new THREE.InstancedMesh(new THREE.CylinderGeometry(.26, .26, .04, 9), mat(capColor), posts.length);
  const m4 = new THREE.Matrix4();
  posts.forEach(([x, z], i) => {
    m4.makeTranslation(x, .65 + (i % 3) * .05, z); im.setMatrixAt(i, m4);
    m4.makeTranslation(x, 1.31 + (i % 3) * .05, z); caps.setMatrixAt(i, m4);
  });
  im.castShadow = true; im.receiveShadow = true; g.add(im, caps); scene.add(g);
  return g;
}
const fence1 = buildFence([[-8, -10, 8, -10], [-8, 6, -1.9, 6], [1.9, 6, 8, 6], [-8, -10, -8, -6], [-8, -2, -8, 6], [8, -10, 8, 6]], 0xf2dcc0);
const fence2 = buildFence([[-8, -10, 16, -10], [-8, 6, -1.9, 6], [1.9, 6, 16, 6], [-8, -10, -8, -6], [-8, -2, -8, 6], [16, -10, 16, 6]], 0xffd36b);
fence2.visible = false;
// gate doors (open), plus spikes added per gate level
const gateGroup = new THREE.Group(); scene.add(gateGroup);
for (const s of [-1, 1]) {
  const d = mesh(new THREE.BoxGeometry(.25, 1.3, 1.7), mat(0xf0a040), s * 2.0, .65, 6.9);
  d.rotation.y = s * .25; gateGroup.add(d);
  gateGroup.add(mesh(new THREE.BoxGeometry(.27, .9, .25), mat(0x4aa3e0), s * 2.0, .65, 6.9));
}
function drawGateSpikes() {
  for (let i = 0; i < S.lv.gate; i++) for (const s of [-1, 1]) {
    const sp = mesh(new THREE.ConeGeometry(.14, .9, 6), mat(0x8a8f99), s * (2.6 + i * .5), .9, 6.45);
    sp.rotation.x = .7; gateGroup.add(sp);
  }
}

// trees
function makeTree(x, z, snowy) {
  const g = new THREE.Group(); g.position.set(x, 0, z);
  g.add(mesh(new THREE.CylinderGeometry(.22, .3, .9, 7), mat(0x8a4b2a), 0, .45, 0));
  const top = new THREE.Group(); g.add(top);
  const c = snowy ? 0xe8f1fa : 0x7fb3e0;
  [[1.05, 1.3, 1.3], [.85, 1.1, 2.0], [.6, .9, 2.6]].forEach(([r, h, y]) => top.add(mesh(new THREE.ConeGeometry(r, h, 7), mat(c), 0, y, 0)));
  const s = rand(.9, 1.15); g.scale.setScalar(s); g.rotation.y = rand(0, 6);
  scene.add(g); return { g, top };
}
const trees = [];
for (let ix = 0; ix < 5; ix++) for (let iz = 0; iz < 7; iz++) {
  const x = -19 + ix * 2.2 + rand(-.4, .4), z = -13 + iz * 2.2 + rand(-.4, .4);
  if (x > -10.5 && z > -7 && z < -1) continue; // clearing in front of the side gap
  const t = makeTree(x, z, false);
  trees.push(Object.assign(t, { x, z, logs: 3, regrow: 0, shake: 0 }));
  circles.push({ x, z, r: .5 });
}
// decorative border trees (no collision)
for (let x = -24; x <= 21; x += 2.6) { makeTree(x + rand(-.5, .5), 26 + rand(-1, 1), true); makeTree(x + rand(-.5, .5), -17 + rand(-1, 1), true); }
for (let z = -14; z <= 24; z += 2.6) { makeTree(20 + rand(-.6, .6), z, true); makeTree(-23.5 + rand(-.6, .6), z, true); }

function chopTree(t) {
  if (t.logs <= 0) return false;
  t.logs--; t.shake = .25;
  if (t.logs === 0) { t.top.visible = false; t.regrow = 14; }
  return true;
}
function updateTrees(dt) {
  for (const t of trees) {
    if (t.shake > 0) { t.shake -= dt; t.g.rotation.z = Math.sin(t.shake * 60) * .06; } else t.g.rotation.z = 0;
    if (t.logs === 0) {
      t.regrow -= dt;
      if (t.regrow <= 0) { t.logs = 3; t.top.visible = true; t.top.scale.setScalar(.01); }
    }
    if (t.top.visible && t.top.scale.x < 1) t.top.scale.setScalar(Math.min(1, t.top.scale.x + dt * 2));
  }
}

// stations
function tile(pos, icon) {
  const g = new THREE.Group(); g.position.copy(pos); scene.add(g);
  const border = mesh(new THREE.BoxGeometry(1.9, .06, 1.9), new THREE.MeshLambertMaterial({ color: 0xe03a3a }), 0, .03, 0, false);
  g.add(border, mesh(new THREE.BoxGeometry(1.6, .08, 1.6), mat(0x4a2f2a), 0, .05, 0, false));
  const ct = canvasTex(128, 128);
  ct.draw((c, w) => { c.globalAlpha = .55; c.font = `76px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(icon, w / 2, w / 2 + 4); });
  const p = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 1.3).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ map: ct.tex, transparent: true }));
  p.position.y = .1; g.add(p);
  return { g, setFull(on) { border.material.color.setHex(on ? 0x4cc75a : 0xe03a3a); } };
}
const woodTile = tile(P.woodTile, '🪵'), meatTile = tile(P.meatTile, '🥩');
const woodPile = pile('log', T.max.wood, V(P.woodTile.x, .09, P.woodTile.z), 2, 3, .9, .42);
const meatPile = pile('meat', T.max.meat, V(P.meatTile.x, .09, P.meatTile.z), 3, 3, .5, .45);

// campfire
const fireG = new THREE.Group(); fireG.position.copy(P.fire); scene.add(fireG);
for (let i = 0; i < 9; i++) {
  const a = i / 9 * Math.PI * 2;
  fireG.add(mesh(new THREE.DodecahedronGeometry(.28), mat(0xa9adb8), Math.cos(a) * .85, .15, Math.sin(a) * .85));
}
for (let i = 0; i < 3; i++) {
  const l = mesh(new THREE.CylinderGeometry(.1, .12, 1.1, 6), mat(0x5a3a28), 0, .35, 0);
  l.rotation.set(.9, i * 2.1, 0); fireG.add(l);
}
const flameO = new THREE.Mesh(new THREE.ConeGeometry(.5, 1.3, 7), new THREE.MeshBasicMaterial({ color: 0xff8a2a }));
const flameI = new THREE.Mesh(new THREE.ConeGeometry(.28, .8, 7), new THREE.MeshBasicMaterial({ color: 0xffd34a }));
flameO.position.y = .75; flameI.position.y = .55; fireG.add(flameO, flameI);
const fireLight = new THREE.PointLight(0xff8a3a, 1.2, 9); fireLight.position.y = 1.6; fireG.add(fireLight);
const fireLabel = sprite(220, 96, 2.0, .87); fireLabel.sp.position.y = 2.8; fireG.add(fireLabel.sp);
let fireLabelKey = '';

const grillG = new THREE.Group(); grillG.position.copy(P.grill); scene.add(grillG);
grillG.add(mesh(new THREE.BoxGeometry(2.2, .1, 1.6), mat(0xe8e8e8), 0, .05, 0, false), mesh(new THREE.BoxGeometry(2.0, .14, 1.4), mat(0x34353b), 0, .08, 0, false));
const grillSlots = [];
for (let i = 0; i < T.max.grill; i++) {
  const m = mesh(GEO.steak, new THREE.MeshLambertMaterial()), j = i % 9;
  m.position.set(P.grill.x + (j % 3 - 1) * .62, .22, P.grill.z + (Math.floor(j / 3) - 1) * .44);
  m.visible = false; scene.add(m); grillSlots.push(m);
}
const RAW = { steak: new THREE.Color(0xef7b7b), fishc: new THREE.Color(0x9fb6c8) };
const DONE = { steak: new THREE.Color(0x8b3a1f), fishc: new THREE.Color(0xd9a441) }, BURNT = new THREE.Color(0x2a1d18);
const isReady = it => it.t >= T.cook[it.type] && it.t < T.cook[it.type] + T.burn;
function renderGrill() {
  const now = performance.now();
  grillSlots.forEach((m, i) => {
    const it = S.grillItems[i]; m.visible = !!it; if (!it) return;
    const c = T.cook[it.type];
    m.geometry = it.type === 'fishc' ? GEO.fish : GEO.steak;
    if (it.t < c) m.material.color.copy(RAW[it.type]).lerp(DONE[it.type], it.t / c);
    else m.material.color.copy(DONE[it.type]).lerp(BURNT, clamp((it.t - c - T.burn + 6) / 6, 0, 1));
    m.position.y = .22 + Math.floor(i / 9) * .15 + (it.t < c && S.fuel > 0 ? Math.abs(Math.sin(now / 60 + i)) * .04 : 0);
  });
}
function takeReady(type) {
  let best = -1;
  S.grillItems.forEach((it, i) => { if (isReady(it) && (!type || it.type === type) && (best < 0 || it.t > S.grillItems[best].t)) best = i; });
  return best < 0 ? null : S.grillItems.splice(best, 1)[0];
}

const benchG = new THREE.Group(); benchG.position.copy(P.counter); scene.add(benchG);
benchG.add(mesh(new THREE.BoxGeometry(3, .2, 1.2), mat(0xe2a35a), 0, .8, 0));
for (const sx of [-1.3, 1.3]) benchG.add(mesh(new THREE.BoxGeometry(.2, .8, 1.0), mat(0xc4823e), sx, .4, 0));
const counterPile = pile('steak', T.max.counter, V(P.counter.x, .9, P.counter.z), 4, 2, .62, .5);

// stage 2 east district: ice fishing, smokehouse and the smoked-fish shop (north fence)
const eastG = new THREE.Group(); scene.add(eastG);
eastG.add(mesh(new THREE.PlaneGeometry(8, 16).rotateX(-Math.PI / 2), mat(0xd99c86), 12, .011, -2, false));
eastG.add(mesh(new THREE.CylinderGeometry(2.4, 2.4, .06, 28), mat(0x8fc4e6), 12.5, .03, .6, false));
P.holes.forEach(h => eastG.add(mesh(new THREE.CylinderGeometry(.55, .55, .07, 16), mat(0x1d4f73), h.x, .05, h.z, false)));
function stall(x, z, color) {
  const g = new THREE.Group(); g.position.set(x, 0, z);
  g.add(mesh(new THREE.BoxGeometry(2.6, .2, 1.1), mat(0xe2a35a), 0, .8, 0));
  for (const sx of [-1.1, 1.1]) g.add(mesh(new THREE.BoxGeometry(.2, .8, .9), mat(0xc4823e), sx, .4, 0));
  g.add(mesh(new THREE.BoxGeometry(2.6, .45, .08), mat(color), 0, .45, .56));
  return g;
}
const fishStall = stall(P.fishShop.x, P.fishShop.z, 0x3a9ad9); fishStall.rotation.y = Math.PI; eastG.add(fishStall);
// fish oven (화덕) right next to the fish shop: raw fish + its own logs → smoked fish on the oven ledge
const ovenG = new THREE.Group(); ovenG.position.copy(P.oven); eastG.add(ovenG);
ovenG.add(mesh(new THREE.SphereGeometry(.85, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), mat(0x9a9590), 0, 0, -.2));
ovenG.add(mesh(new THREE.BoxGeometry(1.3, .35, .55), mat(0x7a756f), 0, .5, .55));
ovenG.add(mesh(new THREE.BoxGeometry(.25, .9, .25), mat(0x6e6a72), .35, 1.1, -.35));
const ovenFire = new THREE.Mesh(new THREE.ConeGeometry(.22, .45, 6), new THREE.MeshBasicMaterial({ color: 0xff8a2a })); ovenFire.position.set(0, .3, .45); ovenG.add(ovenFire);
const ovenWoodTile = tile(P.ovenWood, '🪵'); eastG.add(ovenWoodTile.g);
const ovenWoodPile = pile('log', T.max.ovenWood, V(P.ovenWood.x, .09, P.ovenWood.z), 2, 3, .9, .42); eastG.add(ovenWoodPile.g);
const fishRawPile = pile('fish', T.max.fishRaw, V(P.oven.x, .72, P.oven.z - .15), 3, 3, .38, .28); eastG.add(fishRawPile.g);   // raw fish stacked on the oven top
const crateTile = tile(P.fishCrate, '📦'); eastG.add(crateTile.g);
const fishCratePile = pile('fish', T.max.fishCrate, V(P.fishCrate.x, .09, P.fishCrate.z), 3, 3, .5, .45); eastG.add(fishCratePile.g);
const fishShopPile = pile('sfish', T.max.fishStock, V(P.fishShop.x, .9, P.fishShop.z), 4, 2, .55, .45); eastG.add(fishShopPile.g);
const smokerSign = sprite(240, 100, 2.2, .92); smokerSign.sp.position.set(P.oven.x, 2.6, P.oven.z); eastG.add(smokerSign.sp);
smokerSign.draw((c, w, h) => bubble(c, w, h, '🪵 장작 필요', '#ffd36b'));
// lanterns that make the stage 2 village look finished
const decoG = new THREE.Group(); scene.add(decoG);
for (const [x, z] of [[-7.4, -9.4], [3, -9.4], [8.5, -9.4], [15.4, -9.4], [-7.4, 5.4], [-2.6, 5.4], [2.6, 5.4], [9, 5.4], [15.4, 5.4], [15.4, -2]]) {
  decoG.add(mesh(new THREE.CylinderGeometry(.08, .1, 2, 6), mat(0x3b2a20), x, 1, z));
  decoG.add(mesh(new THREE.BoxGeometry(.32, .38, .32), mat(0xffd36b, { emissive: 0xff9a3c }), x, 2.1, z));
}

// tannery + leather shop (stage 2, east): unlocked when the hunter reaches mastery Lv3 and starts bringing hides
const TAN = { in: V(12.6, 0, 4), out: V(15, 0, 3.5), fire: V(14, 0, 5.2), home: V(14, 0, 4) };
const tanTile = tile(TAN.in, '🟫');
const tanWoodTile = tile(P.tanWood, '🪵');
const tanWoodPile = pile('log', T.max.tanWood, V(P.tanWood.x, .09, P.tanWood.z), 2, 3, .9, .42);
const hidePile = pile('hide', T.max.hide, V(TAN.in.x, .09, TAN.in.z), 2, 2, .7, .55);
const tanG = stall(TAN.out.x, TAN.out.z, 0x8a5a3a); tanG.rotation.y = Math.PI / 2; scene.add(tanG);
const tanHide = mesh(new THREE.BoxGeometry(.8, .6, .05), mat(0x9b6a45), 0, 1.25, -.35); tanG.add(tanHide);
const leatherPile = pile('leather', T.max.leather, V(TAN.out.x, .9, TAN.out.z), 2, 4, .5, .5);
const tanSign = sprite(260, 100, 2.4, .92); tanSign.sp.position.set(TAN.out.x, 3.2, TAN.out.z); scene.add(tanSign.sp);
tanSign.draw((c, w, h) => bubble(c, w, h, '🧵 가죽 장인 필요', '#ffd36b'));
const tanFireG = new THREE.Group(); tanFireG.position.copy(TAN.fire); scene.add(tanFireG);
for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; tanFireG.add(mesh(new THREE.DodecahedronGeometry(.13), mat(0xa9adb8), Math.cos(a) * .35, .08, Math.sin(a) * .35)); }
const tanFlame = new THREE.Mesh(new THREE.ConeGeometry(.2, .45, 6), new THREE.MeshBasicMaterial({ color: 0xff8a2a })); tanFlame.position.y = .3; tanFireG.add(tanFlame);
let artisan = null;
function addArtisan() {
  if (artisan) return;
  const p = makePerson(0x8a5a3a, 0x3a2a22);
  p.body.add(mesh(new THREE.BoxGeometry(.5, .6, .05), mat(0xd9c3a0), 0, .7, .4));
  const carry = new THREE.Group(); carry.position.z = -.5; p.g.add(carry);
  for (let i = 0; i < 3; i++) { const m = itemMesh('log'); m.position.y = 1.1 + i * .4; m.visible = false; carry.add(m); }
  artisan = { ...p, carry, n: 0, x: TAN.home.x, z: TAN.home.z, path: [], state: 'work' };
  p.g.position.set(artisan.x, 0, artisan.z);
}
function updateTannery(dt) {
  const on = hidesOn() && S.stage >= 2;
  tanWoodTile.g.visible = tanWoodPile.g.visible = tanTile.g.visible = tanG.visible = leatherPile.g.visible = hidePile.g.visible = tanFireG.visible = on;
  tanSign.sp.visible = on && !S.lv.artisan;
  if (on && !tanG.shown && S.started) { tanG.shown = true; toast('🟫 가죽 공방이 생겼어요 (동쪽): 장인을 고용하면 가죽 제품을 팔아요'); }
  tanG.shown = tanG.shown || on;
  tanFlame.visible = S.tanFuel > 0;
  if (S.tanFuel > 0) tanFlame.scale.setScalar(.8 + Math.sin(performance.now() / 70) * .2);
  hidePile.set(S.hide); leatherPile.set(S.leather); tanTile.setFull(S.hide > 0); tanWoodPile.set(S.tanWood); tanWoodTile.setFull(S.tanWood > 0);
  if (!artisan) return;
  const a = artisan;
  a.carry.children.forEach((m, i) => (m.visible = i < a.n));
  if (a.state === 'getWood') {          // walk to the tannery log tile (or the main pile when it is empty) and bring logs back
    if (!walkPath(a, dt, 3.6)) return;
    const key = a.src === 'tan' ? 'tanWood' : 'wood', from = a.src === 'tan' ? P.tanWood : P.woodTile;
    const k = Math.min(3, S[key], Math.ceil((T.max.tanFuel - S.tanFuel) / T.tanPerLog));
    if (k > 0) { S[key] -= k; a.n = k; fly('log', V(from.x, .5, from.z), V(a.x, 1.3, a.z)); }
    a.state = 'back'; a.path = [TAN.home.clone()]; return;
  }
  if (a.state === 'back') {
    if (!walkPath(a, dt, 3.6)) return;
    if (a.n) { S.tanFuel = Math.min(T.max.tanFuel, S.tanFuel + a.n * T.tanPerLog); fly('log', V(a.x, 1.3, a.z), V(TAN.fire.x, .3, TAN.fire.z)); a.n = 0; }
    a.state = 'work'; return;
  }
  a.body.position.y = 0; a.g.rotation.y = Math.PI / 2;
  if (S.tanFuel <= 0 && S.hide > 0 && S.tanWood > 0) { a.state = 'getWood'; a.src = 'tan'; a.path = [V(P.tanWood.x + 1.2, 0, P.tanWood.z)]; return; }
  if (S.tanFuel <= 0 && S.hide > 0 && S.wood > 0) { a.state = 'getWood'; a.src = 'main'; a.path = [V(P.woodTile.x + .8, 0, P.woodTile.z + 1.3)]; return; }
  const busy = S.hide > 0 && S.leather < T.max.leather && S.tanFuel > 0;
  tanHide.rotation.y = busy ? Math.sin(performance.now() / 120) * .15 : 0;
  a.body.rotation.x = busy ? Math.sin(performance.now() / 90) * .15 : 0;
  if (busy && (S.tanT += dt) >= T.tanTime[S.lv.artisan]) {
    S.tanT = 0; S.hide--; S.leather++; S.tanFuel -= S.phase === 'storm' ? T.smoke.stormUse : 1;
    burst(TAN.out.x, 1.2, TAN.out.z, 0xb07a4a, 5, { spd: 2, up: 3, life: .5 });
  }
}
// fish oven: uses only the logs stacked on its own wood tile
function updateOven(dt) {
  fishRawPile.set(S.fishRaw); fishCratePile.set(S.fishCrate); fishShopPile.set(S.fishStock); ovenWoodPile.set(S.ovenWood);
  ovenWoodTile.setFull(S.ovenWood > 0); crateTile.setFull(S.fishCrate > 0);
  if (S.stage < 2) return;
  const need = S.fishRaw > 0 && S.fishStock < T.max.fishStock;
  if (need && S.smokeFuel <= 0 && S.ovenWood > 0) { S.ovenWood--; S.smokeFuel += T.smoke.fishPerLog; }
  smokerSign.sp.visible = need && S.smokeFuel <= 0;
  ovenFire.visible = S.smokeFuel > 0;
  if (ovenFire.visible) ovenFire.scale.setScalar(.8 + Math.sin(performance.now() / 60) * .2);
  if (!need || S.smokeFuel <= 0) return;
  if ((S.smokeT += dt) >= T.ovenTime[S.lv.oven]) {   // a finished fish slides straight onto the shop counter next door
    S.smokeT = 0; S.fishRaw--; S.fishStock++; S.smokeFuel -= S.phase === 'storm' ? T.smoke.stormUse : 1;
    fly('sfish', V(P.oven.x, 1, P.oven.z), V(P.fishShop.x, 1, P.fishShop.z), .35);
  }
  if (tick('smokePuff', .45, dt)) burst(P.oven.x + .35, 1.8, P.oven.z - .35, 0x9aa0aa, 2, { spd: .4, up: 1.2, grav: -1.5, life: 1.4, size: 1.4 });
}

// one sales clerk behind the main counter; mastery adds parallel service and speed
let clerkNpc = null, fishClerkNpc = null;
function syncClerks() {
  if (!clerkNpc && S.lv.clerk) { clerkNpc = makePerson(0x2b6e4f, 0x2b2f3a); clerkNpc.g.position.set(6.6, 0, -8.7); clerkNpc.g.rotation.y = Math.PI; }
  if (!fishClerkNpc && S.lv.fishClerk) { fishClerkNpc = makePerson(0x2f6e8a, 0x2b2f3a); fishClerkNpc.g.position.set(9.6, 0, -8.8); fishClerkNpc.g.rotation.y = Math.PI; }
}

// villager cabins (north, outside the fence)
const CABIN_POS = [V(-6.2, 0, -13.7), V(-2.6, 0, -13.7), V(1, 0, -13.7)];
const cabins = [];
function buildCabin(i) {
  const g = new THREE.Group(); g.position.copy(CABIN_POS[i]); scene.add(g);
  g.add(mesh(new THREE.BoxGeometry(2.4, 1.5, 1.8), mat(0xb8743e), 0, .75, 0));
  const roof = mesh(new THREE.ConeGeometry(1.95, 1.1, 4), new THREE.MeshLambertMaterial({ color: 0x7a4a2a }), 0, 2.05, 0);
  roof.rotation.y = Math.PI / 4; roof.scale.set(1, 1, .8); g.add(roof);
  g.add(mesh(new THREE.BoxGeometry(.6, .9, .05), mat(0x5a3420), 0, .45, .92));
  g.add(mesh(new THREE.BoxGeometry(.45, .4, .05), mat(0xffd36b, { emissive: 0x664400 }), .75, .95, .92));
  g.add(mesh(new THREE.BoxGeometry(.35, .7, .35), mat(0x8a8f99), -.7, 2.3, -.2));
  g.scale.setScalar(.01); cabins.push({ g, roof });
}
function updateCabins(dt) {
  const cold = S.warmth < 35;
  cabins.forEach(c => { if (c.g.scale.x < 1) c.g.scale.setScalar(Math.min(1, c.g.scale.x + dt * 3)); c.roof.material.color.setHex(cold ? 0xd8f0ff : 0x7a4a2a); });
}
// each shop drops its takings on its own coin pile
const COIN_PILES = [
  { key: 'coinPile', at: P.coinPile, show: () => true },
  { key: 'coinFish', at: P.fishCoin, show: () => S.stage >= 2 },
  { key: 'coinLeather', at: P.tanCoin, show: () => hidesOn() && S.stage >= 2 },
];
COIN_PILES.forEach(c => (c.v = pile('coin', 72, V(c.at.x, .01, c.at.z), 3, 3, .36, .36)));

// upgrade pads
const pads = [];
function makePad(key, x, z) {
  const ct = canvasTex(256, 256);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(1.9, 1.9).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ map: ct.tex, transparent: true }));
  m.position.set(x, .03, z); scene.add(m);
  const pad = { key, x, z, ct, paid: 0, m, on: false };
  m.visible = false;
  pads.push(pad); drawPad(pad); return pad;
}
function drawPad(p) {
  const u = UP[p.key], lv = S.lv[p.key], maxed = lv >= u.costs.length;
  const cost = maxed ? 0 : u.costs[lv];
  p.ct.draw((c, w) => {
    c.fillStyle = maxed ? 'rgba(80,90,110,.55)' : 'rgba(19,37,61,.82)';
    c.beginPath(); c.roundRect ? c.roundRect(8, 8, w - 16, w - 16, 34) : c.rect(8, 8, w - 16, w - 16); c.fill();
    if (!maxed && p.paid > 0) { c.fillStyle = 'rgba(255,154,60,.55)'; const hgt = (w - 16) * p.paid / cost; c.fillRect(8, w - 8 - hgt, w - 16, hgt); }
    c.strokeStyle = maxed ? '#9aa4b5' : '#ffffff'; c.lineWidth = 8; c.setLineDash([22, 14]);
    c.beginPath(); c.roundRect ? c.roundRect(12, 12, w - 24, w - 24, 30) : c.rect(12, 12, w - 24, w - 24); c.stroke(); c.setLineDash([]);
    c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#fff';
    c.font = `70px ${FONT}`; c.fillText(u.icon, w / 2, 80);
    c.font = `${u.name.length > 4 ? 30 : 36}px ${FONT}`; c.fillText(`${u.name} ${maxed ? 'MAX' : 'Lv' + (lv + 1)}`, w / 2, 150);
    c.font = `40px ${FONT}`; c.fillStyle = '#ffd36b';
    c.fillText(maxed ? '완료' : `🪙 ${cost - p.paid}`, w / 2, 202);
  });
}
// pads sit next to what they upgrade and appear one by one
// two 3x3 blocks either side of the gate path, rows z = -.2 / 2 / 4.2 (call order = save order, append new pads at the end)
makePad('bag', -2.4, -.2); makePad('boots', -6.6, -.2);
makePad('axe', -4.5, -.2); makePad('helper', -4.5, 2); makePad('helper2', -6.6, 2);
makePad('gate', 2.4, 4.2); makePad('hunter', -2.4, 4.2); makePad('hunter2', -4.5, 4.2);
makePad('server', 2.4, -.2); makePad('cabin', 6.6, -.2); makePad('fishing', 2.4, 2);
makePad('clerk', 4.5, -.2); makePad('artisan', 6.6, 4.2); makePad('fisher', 4.5, 4.2); makePad('fishClerk', 6.6, 2); makePad('oven', 4.5, 2);
makePad('coat', -2.4, 2); makePad('cape', -6.6, 4.2);
const PAD_POS2 = {};   // pads that move when the village grows
const REVEAL = {
  bag: () => true, axe: () => true,
  boots: () => S.bought >= 1,
  coat: () => S.bought >= 2,
  cape: () => S.bought >= 3,
  helper: () => S.stat.sold >= 5,
  gate: () => S.storms >= 1 || S.phase !== 'calm',
  server: () => S.stat.sold >= 10,
  hunter: () => S.stat.kills >= 5,
  cabin: () => S.lv.server >= 1,
  fishing: () => S.stat.sold >= 25,
  clerk: () => S.stat.sold >= 15 || S.lv.server >= 1,
  artisan: () => hidesOn() && S.stage >= 2,
  fisher: () => S.stage >= 2,
  fishClerk: () => S.stage >= 2,
  oven: () => S.stage >= 2,
  helper2: () => S.stage >= 2 && S.lv.helper >= 1,
  hunter2: () => S.stage >= 2 && S.lv.hunter >= 1,
};
// a pad disappears at max level, and waits while its next level needs a later village stage
const padHidden = p => { const u = UP[p.key], lv = S.lv[p.key]; return lv >= u.costs.length || (u.stage && S.stage < u.stage[lv]); };
function updatePads(dt) {
  for (const p of pads) {
    p.m.visible = p.on && !padHidden(p);
    if (!p.on && REVEAL[p.key]()) {
      p.on = true; p.m.visible = true; p.m.scale.setScalar(S.started ? .01 : 1);
      if (S.started) { toast(`✨ 새 업그레이드: ${UP[p.key].icon} ${UP[p.key].name}`); burst(p.x, .4, p.z, 0xffc83d, 12, { spd: 3, up: 6, life: .7 }); play('up'); }
    }
    if (!p.on) continue;
    if (p.m.scale.x < 1) p.m.scale.setScalar(Math.min(1, p.m.scale.x + dt * 2.5));
    const u = UP[p.key], lv = S.lv[p.key], maxed = lv >= u.costs.length;
    if (!maxed) p.m.material.opacity = S.coins >= u.costs[lv] - p.paid ? 1 : .5;
  }
}

// ───────────────────────── village stages ─────────────────────────
// stage 1: small camp (wood + bear meat). stage 2 (fishing upgrade): fence grows east, hearth moves to the middle and gets grander.
const fireDeco = new THREE.Group(); fireDeco.visible = false; fireG.add(fireDeco);
fireDeco.add(mesh(new THREE.CylinderGeometry(1.1, 1.15, .1, 20), mat(0x6e6a72), 0, .05, 0, false));
const decoFlames = [];
for (let i = 0; i < 4; i++) {
  const a = (i + .5) / 4 * Math.PI * 2, x = Math.cos(a) * 1.55, z = Math.sin(a) * 1.55;
  fireDeco.add(mesh(new THREE.CylinderGeometry(.16, .2, .9, 6), mat(0x8a8f99), x, .45, z));
  const f = new THREE.Mesh(new THREE.ConeGeometry(.14, .4, 6), new THREE.MeshBasicMaterial({ color: 0xffb347 }));
  f.position.set(x, 1.1, z); fireDeco.add(f); decoFlames.push(f);
}
const HEARTH_SHIFT = 3;
function applyStage(fanfare) {
  const two = S.stage >= 2;
  fence1.visible = !two; fence2.visible = two; walls = two ? WALLS2 : WALLS1;
  CAMP.x2 = two ? 16 : 8; eastG.visible = decoG.visible = two;
  fireDeco.visible = two; fireG.scale.setScalar(two ? 1.15 : 1); circles[0].r = two ? 1.1 : .95;
  if (two && !applyStage.moved) {
    applyStage.moved = true;
    const from = V(P.fire.x, 0, P.fire.z);
    for (const v of [P.woodTile, P.fire, P.meatTile, P.grill, P.serverGrill, P.serverWay]) v.x += HEARTH_SHIFT;
    for (const g of [woodTile.g, meatTile.g, woodPile.g, meatPile.g, fireG, grillG]) g.position.x += HEARTH_SHIFT;
    grillSlots.forEach(m => (m.position.x += HEARTH_SHIFT));
    grillBox.x1 += HEARTH_SHIFT; grillBox.x2 += HEARTH_SHIFT; circles[0].x += HEARTH_SHIFT;
    for (const p of pads) if (PAD_POS2[p.key]) { [p.x, p.z] = PAD_POS2[p.key]; p.m.position.set(p.x, .03, p.z); }
    if (fanfare) {
      burst(from.x, 1, from.z, 0x9aa0aa, 20, { spd: 3, up: 4, life: .8, size: 1.3 });
      burst(P.fire.x, 1, P.fire.z, 0xffb347, 30, { spd: 5, up: 8, life: 1, size: 1.2 });
    }
  }
  if (!fanfare) return;
  for (let x = -6; x <= 16; x += 2.2) { burst(x, 1.4, -10, 0xffd36b, 5, { spd: 2, up: 6, life: .9 }); burst(x, 1.4, 6, 0xffd36b, 5, { spd: 2, up: 6, life: .9 }); }
  for (let z = -9; z <= 6; z += 2.2) burst(16, 1.4, z, 0xffd36b, 5, { spd: 2, up: 6, life: .9 });
  const flash = document.createElement('div');
  flash.style.cssText = 'position:fixed;inset:0;background:#fff;opacity:.9;pointer-events:none;transition:opacity .9s';
  document.body.appendChild(flash); requestAnimationFrame(() => (flash.style.opacity = 0)); setTimeout(() => flash.remove(), 1000);
  popText(pl.x, 3.4, pl.z, '뿅!', '#ffd36b', true);
  toast('🎉 2단계! 마을이 넓어지고 모닥불이 가운데로 옮겨졌어요. 북쪽에 훈제 생선 가게 개방');
  play('up'); play('kill'); buzz([40, 30, 40, 30, 120]); shakeK(.5);
}
applyStage(false);

// ───────────────────────── characters ─────────────────────────
function makePerson(coat, hair) {
  const g = new THREE.Group(), body = new THREE.Group(); g.add(body);
  body.add(mesh(new THREE.CylinderGeometry(.34, .44, .95, 10), mat(coat), 0, .62, 0));
  body.add(mesh(new THREE.TorusGeometry(.33, .1, 6, 12).rotateX(Math.PI / 2), mat(0xffffff), 0, 1.12, 0));
  body.add(mesh(new THREE.TorusGeometry(.42, .05, 5, 12).rotateX(Math.PI / 2), mat(0x6b3d1f), 0, .55, 0));
  body.add(mesh(new THREE.SphereGeometry(.34, 10, 8), mat(hair), 0, 1.45, -.04));
  body.add(mesh(new THREE.SphereGeometry(.26, 10, 8), mat(0xf1c6a0), 0, 1.42, .12));
  for (const s of [-1, 1]) body.add(mesh(new THREE.BoxGeometry(.16, .3, .18), mat(0x3a2a22), s * .16, .15, 0));
  scene.add(g); return { g, body };
}

const player = makePerson(0x3a9ad9, 0x3a9ad9);
player.body.add(mesh(new THREE.SphereGeometry(.38, 10, 8, 0, Math.PI * 2, 0, 1.2), mat(0xffffff), 0, 1.5, -.06));
const axeHead = mesh(new THREE.BoxGeometry(.06, .25, .3), new THREE.MeshLambertMaterial({ color: 0xc7ccd6 }), 0, .52, .12);
const axe = new THREE.Group(); axe.position.set(.45, .8, .15); player.body.add(axe);
axe.add(mesh(new THREE.CylinderGeometry(.04, .04, .8, 5), mat(0x5a3a28), 0, .2, 0), axeHead);
// gear: boots and coat levels change the hero's look
const GEAR = {
  boots: [null, [0x6b4426, null], [0x8a2b2b, 0xffffff], [0x2b4f8a, 0xffd36b]],   // [boot, cuff]
  coat: [null, [0x7a5a3a, null], [0xb03a3a, 0xffffff], [0x2c3e7a, 0xffd36b]],     // [coat, trim]
};
const gmat = (c = 0xffffff) => new THREE.MeshLambertMaterial({ color: c });   // own material: gear colors change per level
const gearM = { boot: [], cuff: [], trim: [], pads: [] };
for (const s of [-1, 1]) {
  gearM.boot.push(mesh(new THREE.BoxGeometry(.22, .24, .28), gmat(), s * .16, .12, .03));
  gearM.cuff.push(mesh(new THREE.BoxGeometry(.26, .07, .3), gmat(), s * .16, .26, .03));
  gearM.pads.push(mesh(new THREE.SphereGeometry(.16, 8, 6), gmat(0xffd36b), s * .38, 1.02, 0));
}
gearM.coat = mesh(new THREE.CylinderGeometry(.37, .48, .8, 10), gmat(), 0, .68, 0);
gearM.trim.push(mesh(new THREE.TorusGeometry(.47, .06, 5, 14).rotateX(Math.PI / 2), gmat(), 0, .3, 0));
gearM.trim.push(mesh(new THREE.TorusGeometry(.36, .08, 5, 14).rotateX(Math.PI / 2), gmat(), 0, 1.08, 0));
[...gearM.boot, ...gearM.cuff, ...gearM.pads, ...gearM.trim, gearM.coat].forEach(m => player.body.add(m));
const capeG = new THREE.Group(); capeG.position.set(0, 1.18, -.36); player.body.add(capeG);
const cape = mesh(new THREE.BoxGeometry(.66, .9, .04), gmat(), 0, -.45, 0); capeG.add(cape);
const capeTrim = mesh(new THREE.BoxGeometry(.68, .08, .05), gmat(0xffd36b), 0, -.88, 0); capeG.add(capeTrim);
const CAPE_COLORS = [null, 0x8a2b2b, 0x3a4fa0, 0x6b2fa0, 0x1b1b22];
// axe tiers: stone → iron → steel → gold → ice → fire → storm
const AXE_LOOKS = [
  { head: 0x8a8f99, glow: 0, size: 1, trail: 0xffffff },
  { head: 0xc7ccd6, glow: 0, size: 1.1, trail: 0xffffff },
  { head: 0xe8f0ff, glow: 0x223344, size: 1.2, trail: 0xdff3ff },
  { head: 0xffc83d, glow: 0x664400, size: 1.3, trail: 0xffd36b },
  { head: 0x8fe3ff, glow: 0x2a8fbf, size: 1.45, trail: 0x8fe3ff },
  { head: 0xff6a2a, glow: 0xaa2a00, size: 1.6, trail: 0xff8a3c },
  { head: 0xc07bff, glow: 0x5a1fa0, size: 1.8, trail: 0xd9a6ff },
];
const axeLook = () => AXE_LOOKS[Math.min(S.lv.axe, AXE_LOOKS.length - 1)];
function applyGear() {
  const ax = axeLook();
  axeHead.material.color.setHex(ax.head); axeHead.scale.set(1, ax.size, ax.size); axe.scale.setScalar(1 + (ax.size - 1) * .4);
  swoosh.material.color.setHex(ax.trail);
  const cc = CAPE_COLORS[S.lv.cape];
  capeG.visible = !!cc; if (cc) cape.material.color.setHex(cc);
  capeG.scale.y = 1 + .1 * S.lv.cape; capeTrim.visible = S.lv.cape >= 3;
  const b = GEAR.boots[S.lv.boots], c = GEAR.coat[S.lv.coat];
  gearM.boot.forEach(m => { m.visible = !!b; if (b) m.material.color.setHex(b[0]); });
  gearM.cuff.forEach(m => { m.visible = !!(b && b[1]); if (b && b[1]) m.material.color.setHex(b[1]); });
  gearM.coat.visible = !!c; if (c) gearM.coat.material.color.setHex(c[0]);
  gearM.trim.forEach(m => { m.visible = !!(c && c[1]); if (c && c[1]) m.material.color.setHex(c[1]); });
  gearM.pads.forEach(m => (m.visible = S.lv.coat >= 3));
}
const shock = new THREE.Mesh(new THREE.RingGeometry(.85, 1, 48).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0xffe08a, transparent: true, depthWrite: false }));
shock.visible = false; scene.add(shock);
const swoosh = new THREE.Mesh(new THREE.RingGeometry(.7, 1.35, 18, 1, -Math.PI * .8, Math.PI * .6).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false }));
swoosh.position.y = .95; swoosh.visible = false; player.g.add(swoosh);
applyGear();
const stackG = new THREE.Group(); stackG.position.set(0, 0, -.5); player.g.add(stackG);
const pl = { combo: 0, comboT: 0, manual: 0, focus: null, x: 0, z: 0, rot: Math.PI, swing: 0, moving: false };
player.g.position.set(0, 0, 0);
const stack = [];
function layoutStack() {
  const cols = Math.ceil(stack.length / 12) || 1;
  const ys = new Array(cols).fill(1.0);
  stack.forEach((s, i) => {
    const col = Math.floor(i / 12), h = ITEM_H[s.type];
    s.mesh.position.set((col - (cols - 1) / 2) * .62, ys[col] + h / 2, -Math.floor(i / 12) * .05);
    ys[col] += h;
  });
}
function stackAdd(type) {
  if (stack.length >= bagCap()) return false;
  const m = itemMesh(type); stackG.add(m); stack.push({ type, mesh: m }); layoutStack(); return true;
}
function stackTake(type) {
  for (let i = stack.length - 1; i >= 0; i--) if (stack[i].type === type) {
    stackG.remove(stack[i].mesh); stack.splice(i, 1); layoutStack(); return true;
  }
  return false;
}
const stackHas = type => stack.some(s => s.type === type);
const backPos = () => V(pl.x - Math.sin(pl.rot) * .5, 1.2 + stack.length * .25, pl.z - Math.cos(pl.rot) * .5);

// helper lumberjacks
const helpers = [];
function addHelper() {
  if (helpers.length >= (S.lv.helper > 0) + S.lv.helper2) return;
  const p = makePerson(0xe0803a, 0x6b3d1f);
  const carry = new THREE.Group(); carry.position.z = -.5; p.g.add(carry);
  for (let i = 0; i < 12; i++) { const m = itemMesh('log'); m.position.set(i < 6 ? 0 : .5, 1.1 + (i % 6) * .4, 0); m.visible = false; carry.add(m); }
  const h = { ...p, carry, n: 0, x: -6.5, z: -4 + helpers.length, path: [], state: 'idle', tree: null, t: 0 };
  p.g.position.set(h.x, 0, h.z); helpers.push(h);
}
function helperToTree(h) {
  const live = trees.filter(t => t.logs > 0);
  if (!live.length) { h.state = 'idle'; return; }
  live.sort((a, b) => Math.hypot(a.x - h.x, a.z - h.z) - Math.hypot(b.x - h.x, b.z - h.z));
  h.tree = live[Math.floor(Math.random() * Math.min(3, live.length))];
  h.path = (h.x > -8 ? [V(-6.5, 0, -4), V(-9.8, 0, -4)] : []).concat([V(h.tree.x + .9, 0, h.tree.z)]);
  h.state = 'toTree';
}
// every log tile a woodcutter may unload at
const WOOD_SPOTS = [
  { key: 'wood', at: () => P.woodTile, max: () => T.max.wood, on: () => true },
  { key: 'ovenWood', at: () => P.ovenWood, max: () => T.max.ovenWood, on: () => S.stage >= 2 },
  { key: 'tanWood', at: () => P.tanWood, max: () => T.max.tanWood, on: () => hidesOn() && S.stage >= 2 },
];
function woodSpot(skip) {
  const open = WOOD_SPOTS.filter(w => w !== skip && w.on() && S[w.key] < w.max());
  const ovenLow = open.find(w => w.key === 'ovenWood' && S.ovenWood < T.max.ovenWood / 2 && S.ovenWood * 3 < S.wood);
  return ovenLow || open.find(w => w.key === 'wood') || open.sort((a, b) => S[a.key] / a.max() - S[b.key] / b.max())[0] || skip || WOOD_SPOTS[0];
}
function updateHelpers(dt) {
  for (const h of helpers) {
    if (h.path.length) {
      const tgt = h.path[0], dx = tgt.x - h.x, dz = tgt.z - h.z, d = Math.hypot(dx, dz);
      const sp = ST.helperSpeed[S.lv.helper] * (1 - .3 * S.stormK);
      if (d < .15) h.path.shift();
      else { h.x += dx / d * Math.min(d, sp * dt); h.z += dz / d * Math.min(d, sp * dt); h.g.rotation.y = Math.atan2(dx, dz); h.body.position.y = Math.abs(Math.sin(performance.now() / 90)) * .08; }
    } else if (h.state === 'toTree') { h.state = 'chop'; h.t = 0; }
    else if (h.state === 'chop') {
      h.t += dt;
      h.body.rotation.x = Math.sin(h.t * 12) * .15;
      if (h.t > ST.helperChop[S.lv.helper]) {
        h.t = 0;
        if (chopTree(h.tree)) h.n++;
        if (h.n >= ST.helperCarry[S.lv.helper]) {
          h.body.rotation.x = 0;
          h.spot = woodSpot(); const dest = h.spot.at();
          h.path = [V(-9.8, 0, -4), V(-6.5, 0, -4), V(dest.x - .4, 0, dest.z - 1.3)]; h.state = 'deliver';
        }
        else if (h.tree.logs === 0) helperToTree(h);
      }
    } else if (h.state === 'deliver') {   // unload; when this tile is full, walk on to another wood tile that still has room
      const w = h.spot, k = Math.min(w.max() - S[w.key], h.n);
      if (k > 0) { S[w.key] += k; h.n -= k; fly('log', V(h.x, 1.3, h.z), V(w.at().x, .4, w.at().z)); }
      if (!h.n) helperToTree(h);
      else { const nx = woodSpot(w); if (nx !== w) { h.spot = nx; h.path = [V(nx.at().x - .4, 0, nx.at().z - 1.3)]; } }
    } else helperToTree(h);
    h.carry.children.forEach((m, i) => (m.visible = i < h.n));
    h.g.position.set(h.x, 0, h.z);
  }
}

function walkPath(w, dt, sp) {
  if (!w.path.length) return true;
  const tgt = w.path[0], dx = tgt.x - w.x, dz = tgt.z - w.z, d = Math.hypot(dx, dz);
  if (d < .15) { w.path.shift(); return !w.path.length; }
  const st = sp * (1 - .3 * S.stormK) * dt;
  w.x += dx / d * Math.min(d, st); w.z += dz / d * Math.min(d, st);
  w.g.rotation.y = Math.atan2(dx, dz); w.body.position.y = Math.abs(Math.sin(performance.now() / 90 + w.x)) * .08;
  w.g.position.set(w.x, 0, w.z); return false;
}

// serving staff: grill → counter
const servers = [];
function addServer() {
  if (servers.length) return;
  const p = makePerson(0xf4f4f4, 0x2b2f3a);
  p.body.add(mesh(new THREE.CylinderGeometry(.22, .26, .4, 8), mat(0xffffff), 0, 1.85, -.02));
  const carry = new THREE.Group(); carry.position.z = .42; p.g.add(carry);
  const w = { ...p, carry, items: [], x: P.serverGrill.x - 1, z: P.serverGrill.z - 1, path: [P.serverGrill.clone()], state: 'toGrill', id: servers.length };
  p.g.position.set(w.x, 0, w.z); servers.push(w);
}
function renderCarry(w) {
  w.carry.clear();
  w.items.forEach((t, i) => { const m = itemMesh(t); m.position.set(0, .95 + i * .16, 0); w.carry.add(m); });
}
// the chef picks whichever job is most backed up: steaks to the counter, raw fish into the oven, smoked fish to the fish shop
const CHEF_JOBS = {
  steak:   { pick: () => P.serverGrill, drop: () => P.counterStand, has: () => S.grillItems.filter(isReady).length, room: () => T.max.counter - S.counter.steak,
             take: () => !!takeReady('steak'), give: () => S.counter.steak++, item: 'steak' },
  fishIn:  { pick: () => P.fishCrate, drop: () => P.ovenOut, has: () => S.fishCrate, room: () => ovenCap() - S.fishRaw,
             take: () => S.fishCrate > 0 && !!S.fishCrate--, give: () => S.fishRaw++, item: 'fish' },
};
const queuedNeed = shop => customers.reduce((n, c) => n + (c.shop === shop && c.state === 'queue' ? c.need : 0), 0);
function chooseChefJob(w) {
  let best = null, score = 0;
  for (const [k, j] of Object.entries(CHEF_JOBS)) {
    if (k !== 'steak' && S.stage < 2) continue;
    const amount = Math.min(j.has(), j.room());
    if (amount <= 0) continue;
    const shortage = k === 'steak' ? queuedNeed('main') - S.counter.steak : queuedNeed('fish') - S.fishStock - S.fishRaw;
    const urgency = 1 + Math.max(0, shortage) / 3 + (k === 'fishIn' && S.fishRaw < 3 ? 1 : 0);
    const v = Math.min(amount, ST.serverCarry[S.lv.server]) * urgency + (w.since[k] || 0) * .4;
    if (v > score) { score = v; best = k; }
  }
  return best;
}
function updateServers(dt) {
  for (const w of servers) {
    const lv = S.lv.server;
    w.since = w.since || {};
    for (const k in CHEF_JOBS) w.since[k] = (w.since[k] || 0) + dt;
    if (!walkPath(w, dt, ST.serverSpeed[lv])) continue;
    w.body.position.y = 0;
    if (w.state === 'idle' || w.state === 'toGrill') {
      w.job = chooseChefJob(w);
      if (!w.job) { if (Math.hypot(w.x - P.serverGrill.x, w.z - P.serverGrill.z) > .3) w.path = [P.serverGrill.clone()]; continue; }
      const jj = CHEF_JOBS[w.job];
      w.since[w.job] = 0; w.want = Math.max(1, Math.min(ST.serverCarry[lv], jj.room()));
      w.state = 'pick'; w.path = [jj.pick().clone()]; continue;
    }
    const j = CHEF_JOBS[w.job];
    if (w.state === 'pick') {
      if (w.items.length < w.want && tick('srvPick' + w.id, ST.serverIv[lv], dt) && j.take()) { w.items.push(j.item); renderCarry(w); }
      if (w.items.length >= w.want || (w.items.length && !j.has())) {
        w.state = 'drop'; w.path = w.job === 'steak' ? [P.serverWay.clone(), P.counterStand.clone()] : [j.drop().clone()];
      } else if (!w.items.length && !j.has()) w.state = 'idle';
    } else {
      if (w.items.length && j.room() > 0 && tick('srvDrop' + w.id, ST.serverIv[lv], dt)) { w.items.pop(); j.give(); renderCarry(w); }
      if (!w.items.length) w.state = 'idle';
    }
  }
}

// hunters: leave through the gate, shoot field bears, bring meat home
const hunters = [], shots = [];
const GATE_IN = V(0, 0, 4.5), GATE_OUT = V(0, 0, 8);
const arrowGeo = new THREE.CylinderGeometry(.03, .03, .8, 4).rotateX(Math.PI / 2);
function addHunter() {
  if (hunters.length >= (S.lv.hunter > 0) + S.lv.hunter2) return;
  const p = makePerson(0x6b8e3a, 0x4a3020);
  const bow = mesh(new THREE.TorusGeometry(.35, .04, 5, 12, Math.PI), mat(0x6b3d1f), -.45, .9, .1); bow.rotation.y = Math.PI / 2; p.body.add(bow);
  const carry = new THREE.Group(); carry.position.z = -.5; p.g.add(carry);
  for (let i = 0; i < 6; i++) { const m = itemMesh('meat'); m.visible = false; carry.add(m); }
  for (let i = 0; i < 4; i++) { const m = itemMesh('hide'); m.visible = false; m.userData.hide = true; carry.add(m); }
  const h = { ...p, carry, n: 0, hides: 0, hp: 8, down: 0, cd: 0, x: P.meatTile.x - hunters.length, z: P.meatTile.z + 1.4, path: [], state: 'out', prey: null };
  p.g.position.set(h.x, 0, h.z); hunters.push(h); huntOut(h);
}
function huntOut(h) { h.state = 'out'; h.prey = null; h.path = h.z < 6 ? [GATE_IN.clone(), GATE_OUT.clone()] : []; }
function huntHome(h) {
  h.state = 'home';
  h.path = (h.z > 6 ? [GATE_OUT.clone(), GATE_IN.clone()] : []).concat([V(P.meatTile.x, 0, P.meatTile.z + 1.3)]);
}
function hurtHunter(h, b) {
  h.hp -= b.boss ? 2 : 1;
  burst(h.x, 1.2, h.z, 0xe5484d, 4, { spd: 3, up: 3, life: .4, size: .7 });
  if (h.hp <= 0) { h.down = 3; h.n = 0; h.hides = 0; h.state = 'down'; toast('🏹 사냥꾼이 곰에게 쓰러졌어요'); }
}
function shoot(h, b) {
  const m = new THREE.Mesh(arrowGeo, mat(0x5a3a28)); scene.add(m);
  shots.push({ m, h, b, from: V(h.x, 1.1, h.z), t: 0 });
}
function updateShots(dt) {
  for (let i = shots.length - 1; i >= 0; i--) {
    const s = shots[i], to = V(s.b.x, 1.2, s.b.z); s.t += dt * 5;
    s.m.position.lerpVectors(s.from, to, Math.min(1, s.t)); s.m.lookAt(to);
    if (s.t < 1) continue;
    scene.remove(s.m); shots.splice(i, 1);
    if (!bears.includes(s.b)) continue;
    burst(s.b.x, 1.3, s.b.z, 0xffffff, 4, { spd: 3, up: 3, life: .35, size: .7 });
    const dmg = ST.hunterDmg[S.lv.hunter];
    popText(s.b.x, 2.5, s.b.z, `${dmg}`, '#c9f29b');
    if (bearHurt(s.b, dmg, s.h)) burst(s.b.x, 1, s.b.z, 0xffffff, 10, { spd: 5, up: 6, life: .6 });
  }
}
function updateHunters(dt) {
  for (const h of hunters) {
    let cy = 1.1, mi = 0, hi = 0;
    h.carry.children.forEach(m => {
      const show = m.userData.hide ? hi++ < h.hides : mi++ < h.n;
      m.visible = show; if (show) { m.position.y = cy; cy += m.userData.hide ? .12 : .27; }
    });
    if (h.down > 0) {
      h.down -= dt; h.body.rotation.z = Math.PI / 2.3;
      if (h.down <= 0) { h.body.rotation.z = 0; h.hp = 8; huntHome(h); }
      continue;
    }
    h.cd -= dt;
    if (h.state === 'out') { if (walkPath(h, dt, 3.4)) h.state = 'hunt'; continue; }
    if (h.state === 'home') {
      if (!walkPath(h, dt, 3.4)) continue;
      const k = Math.min(h.n, T.max.meat - S.meat);
      if (k > 0) { S.meat += k; h.n -= k; fly('meat', V(h.x, 1.3, h.z), V(P.meatTile.x, .5, P.meatTile.z)); }
      if (h.n === 0) { if (h.hides) { h.state = 'hides'; h.path = [V(TAN.in.x - 1.3, 0, TAN.in.z)]; } else huntOut(h); }
      continue;
    }
    if (h.state === 'hides') {
      if (!walkPath(h, dt, 3.4)) continue;
      S.stat.hides += h.hides;
      for (; h.hides > 0; h.hides--) { if (S.hide < T.max.hide) S.hide++; else S.coinLeather += T.price.hide; }
      fly('hide', V(h.x, 1.3, h.z), V(TAN.in.x, .5, TAN.in.z)); huntOut(h);
      continue;
    }
    if (h.state === 'collect') {             // picking up meat/hides lying inside the village
      if (!walkPath(h, dt, 3.4)) continue;
      for (let i = pickups.length - 1; i >= 0; i--) {
        const pk = pickups[i];
        if (Math.hypot(pk.x - h.x, pk.z - h.z) > 1.4) continue;
        if (pk.type === 'meat' && h.n < 6) h.n++; else if (pk.type === 'hide' && h.hides < 4) h.hides++; else continue;
        scene.remove(pk.m); pickups.splice(i, 1);
      }
      const next = campPickup(h);
      if (next) h.path = [V(next.x, 0, next.z)];
      else if (h.n || h.hides) huntHome(h); else huntOut(h);
      continue;
    }
    const loot = campPickup(h);
    if (loot) { h.state = 'collect'; h.path = (h.z > 6 ? [GATE_OUT.clone(), GATE_IN.clone()] : []).concat([V(loot.x, 0, loot.z)]); continue; }
    if (h.n >= 6 || h.hides >= 4) { huntHome(h); continue; }
    if (h.hp < 8 && tick('hReg' + hunters.indexOf(h), 2, dt)) h.hp++;
    if (!h.prey || !bears.includes(h.prey) || h.prey.raider) {
      h.prey = null; let bd = 1e9;
      for (const b of bears) if (!b.raider && !b.boss) { const d = Math.hypot(b.x - h.x, b.z - h.z); if (d < bd) { bd = d; h.prey = b; } }
      if (!h.prey) { h.body.position.y = 0; continue; }
    }
    const b = h.prey, d = Math.hypot(b.x - h.x, b.z - h.z);
    if (d > 4.5) move(h, b.x, b.z, 3.4 * (1 - .3 * S.stormK), dt);
    else { h.g.rotation.y = Math.atan2(b.x - h.x, b.z - h.z); h.body.position.y = 0; if (h.cd <= 0) { h.cd = ST.hunterCd[S.lv.hunter]; shoot(h, b); } }
    h.z = Math.max(h.z, 7.5); h.g.position.set(h.x, 0, h.z);
  }
}

// fishers: catch fish at the ice holes and stock the fish shop
const fishers = [];
function addFisher() {
  if (fishers.length) return;
  const p = makePerson(0x2f6e8a, 0xd9c3a0);
  const rod = mesh(new THREE.CylinderGeometry(.03, .03, 1.6, 5), mat(0x5a3a28), .4, 1.3, .4); rod.rotation.x = .9; p.body.add(rod);
  const carry = new THREE.Group(); carry.position.z = -.5; p.g.add(carry);
  for (let i = 0; i < 10; i++) { const m = itemMesh('fish'); m.position.y = 1.1 + i * .2; m.visible = false; carry.add(m); }
  const hole = P.holes[fishers.length % P.holes.length];
  const f = { ...p, carry, n: 0, t: 0, hole, x: P.fishCrate.x, z: P.fishCrate.z + 1, path: [V(hole.x + 1, 0, hole.z)], state: 'toHole' };
  p.g.position.set(f.x, 0, f.z); fishers.push(f);
}
function updateFishers(dt) {
  fishers.forEach((f, i) => {
    f.carry.children.forEach((m, j) => (m.visible = j < f.n));
    if (!walkPath(f, dt, 3.2)) return;
    f.body.position.y = 0;
    if (f.state === 'toHole') {
      f.g.rotation.y = -Math.PI / 2; f.body.rotation.x = Math.sin(performance.now() / 300) * .05;
      if ((f.t += dt) >= ST.fisherCatch[S.lv.fisher]) { f.t = 0; f.n++; burst(f.hole.x, .3, f.hole.z, 0xbfe3f5, 5, { spd: 2, up: 4, life: .4 }); }
      if (f.n >= ST.fisherCarry[S.lv.fisher]) { f.state = 'toShop'; f.path = [V(P.fishCrate.x + 1.2, 0, P.fishCrate.z)]; }
    } else {
      const k = Math.min(f.n, T.max.fishCrate - S.fishCrate);
      if (k > 0) { S.fishCrate += k; f.n -= k; fly('fish', V(f.x, 1.2, f.z), V(P.fishCrate.x, .5, P.fishCrate.z)); }
      if (f.n === 0) { f.state = 'toHole'; f.path = [V(f.hole.x + 1, 0, f.hole.z)]; }
    }
  });
}

// customers
const customers = [];
const SHOPS = {
  main: { item: 'steak', icon: '🍖', front: V(5.8, 0, -11.2), dir: V(-1, 0, 0), side: V(0, 0, -.4), face: 0, from: V(-22, 0, -12.6), exit: V(-22, 0, -12.8), at: P.counter, coat: 0x5fc3c9, coin: 'coinPile',
    open: () => true, stock: () => S.counter.steak, take: () => S.counter.steak--, stat: 'sold' },
  fish: { item: 'sfish', icon: '🐟', front: V(10.6, 0, -11.2), dir: V(1, 0, 0), side: V(0, 0, -.4), face: 0, from: V(22, 0, -12.6), exit: V(22, 0, -12.8), at: P.fishShop, coat: 0x7fb3e0, clerk: 'fishClerk', coin: 'coinFish',
    open: () => S.stage >= 2, stock: () => S.fishStock, take: () => S.fishStock--, stat: 'soldFish' },
  leather: { item: 'leather', icon: '👜', front: V(17.3, 0, TAN.out.z - 1.1), dir: V(0, 0, 1), side: V(.4, 0, 0), face: -Math.PI / 2, from: V(22, 0, 9), exit: V(22, 0, 9), at: TAN.out, coat: 0xc9a06b, coin: 'coinLeather',
    open: () => S.lv.artisan > 0 && hidesOn() && S.stage >= 2, stock: () => S.leather, take: () => S.leather--, stat: 'soldLeather' },
};
function spawnCustomer(key) {
  const sh = SHOPS[key], p = makePerson(sh.coat, 0x2b2f3a);
  const b = sprite(160, 120, 1.3, .98); b.sp.position.y = 2.6; p.g.add(b.sp);
  const need = key === 'main'
    ? 1 + Math.floor(Math.random() * Math.min(4 + S.lv.cabin, 1 + S.served / 6)) + (Math.random() < S.lv.cabin * .2 ? 1 : 0)
    : 1 + Math.floor(Math.random() * 3);
  const c = { ...p, b, shop: key, need, wait: 0, x: sh.from.x, z: sh.from.z, state: 'queue', mood: '' };
  p.g.position.set(c.x, 0, c.z); customers.push(c); drawBubble(c);
}
function drawBubble(c) {
  const cold = S.warmth < 35;
  const key = (cold ? 'c' : '') + c.need + c.state;
  if (c.mood === key) return; c.mood = key;
  c.b.draw((ctx, w, h) => bubble(ctx, w, h, c.state === 'leave' ? (c.need ? '😠' : '😋') : cold ? '🥶' : `${SHOPS[c.shop].icon}×${c.need}`));
}
function updateCustomers(dt) {
  for (const [key, sh] of Object.entries(SHOPS)) {
    if (!sh.open()) continue;
    const ck = S.lv[sh.clerk || 'clerk'], serveN = key === 'leather' ? Math.max(T.leatherShop.slots, ST.clerkSlots[ck]) : ST.clerkSlots[ck];
    const queue = customers.filter(c => c.shop === key && c.state === 'queue');
    const big = key !== 'leather', maxQ = big ? 6 + 2 * S.lv.cabin : T.leatherShop.maxQ, iv = big ? 3.2 - .6 * S.lv.cabin : T.leatherShop.iv;
    if (queue.length < maxQ && S.warmth >= 35 && S.started && tick('spawn' + key, iv, dt)) spawnCustomer(key);
    queue.forEach((c, i) => {
      const t = sh.front.clone().addScaledVector(sh.dir, i * 1.1);
      if (i >= serveN) t.add(sh.side);
      move(c, t.x, t.z, 3, dt);
      const there = Math.hypot(t.x - c.x, t.z - c.z) < .2;
      drawBubble(c);
      if (!there || i >= serveN) return;
      c.g.rotation.y = sh.face; c.wait += dt;
      if (c.wait > 30 && !sh.stock()) { c.state = 'leave'; drawBubble(c); toast('😠 기다리다 지친 손님이 떠났어요'); return; }
      if (sh.stock() > 0 && tick('serve' + key + i, ST.clerkIv[ck], dt)) {
        sh.take(); c.need--; c.wait = 0; S[sh.coin] += T.price[sh.item]; S.stat[sh.stat]++;
        fly(sh.item, V(sh.at.x, 1, sh.at.z), V(c.x, 1.2, c.z), .25);
        if (c.need <= 0) { c.state = 'leave'; S.served++; }
        drawBubble(c);
      }
    });
    if (key === 'main' && queue[0] && S.warmth <= 0 && tick('coldLeave', 3, dt)) { queue[0].state = 'leave'; drawBubble(queue[0]); toast('🥶 추워서 손님이 떠났어요'); }
  }
  for (let i = customers.length - 1; i >= 0; i--) {
    const c = customers[i];
    if (c.state !== 'leave') continue;
    const ex = SHOPS[c.shop].exit;
    move(c, ex.x, ex.z, 3.2, dt);
    if (Math.hypot(c.x - ex.x, c.z - ex.z) < .5) {
      scene.remove(c.g); disposeActor(c.g);
      c.b.tex.dispose(); c.b.sp.material.dispose();
      customers.splice(i, 1);
    }
  }
}
function move(e, tx, tz, sp, dt) {
  const dx = tx - e.x, dz = tz - e.z, d = Math.hypot(dx, dz);
  if (d > .05) {
    e.x += dx / d * Math.min(d, sp * dt); e.z += dz / d * Math.min(d, sp * dt);
    e.g.rotation.y = Math.atan2(dx, dz);
    e.body.position.y = Math.abs(Math.sin(performance.now() / 100 + e.x)) * .08;
  } else e.body.position.y = 0;
  e.g.position.set(e.x, 0, e.z);
}

// bears
const bears = [];
const hpBarGeo = new THREE.PlaneGeometry(1.2, .14);
const outlineMat = new THREE.MeshBasicMaterial({ color: 0x2b3440, side: THREE.BackSide });
function makeBear(raider, boss = false) {
  const g = new THREE.Group(); scene.add(g);
  const body = new THREE.Group(); g.add(body);
  const fur = new THREE.MeshLambertMaterial({ color: boss ? 0xdcd3f0 : raider ? 0xc3cad8 : 0xfffaf0 });
  const m = (geo, x, y, z, material = fur) => {
    const o = mesh(geo, material, x, y, z); body.add(o);
    if (material === fur) { const ol = new THREE.Mesh(geo, outlineMat); ol.position.copy(o.position); ol.scale.setScalar(1.09); body.add(ol); }
    return o;
  };
  m(new THREE.BoxGeometry(1.15, .95, 1.8), 0, 1.0, 0);
  m(new THREE.BoxGeometry(.75, .65, .7), 0, 1.35, 1.1);
  m(new THREE.BoxGeometry(.38, .28, .32), 0, 1.22, 1.55);
  m(new THREE.BoxGeometry(.14, .1, .06), 0, 1.33, 1.72, mat(0x1b1b22));
  for (const s of [-1, 1]) {
    m(new THREE.BoxGeometry(.18, .18, .1), s * .28, 1.72, 1.0);
    m(new THREE.BoxGeometry(.09, .09, .04), s * .18, 1.48, 1.46, raider ? mat(0xff3030, { emissive: 0xaa0000 }) : mat(0x1b1b22));
    for (const f of [-1, 1]) m(new THREE.CylinderGeometry(.18, .2, .65, 7), s * .38, .33, f * .6);
  }
  const bar = new THREE.Group(); bar.position.y = 2.4; g.add(bar);
  bar.add(new THREE.Mesh(hpBarGeo, new THREE.MeshBasicMaterial({ color: 0x13253d, depthTest: false })));
  const fill = new THREE.Mesh(hpBarGeo, new THREE.MeshBasicMaterial({ color: 0xe5484d, depthTest: false })); fill.position.z = .01; bar.add(fill);
  bar.visible = false; bar.renderOrder = 11; fill.renderOrder = 12;
  if (boss) { m(new THREE.ConeGeometry(.32, .45, 5), 0, 1.9, 1.05, mat(0xffc83d, { emissive: 0x664400 })); g.scale.setScalar(1.7); }
  const crown = boss;
  const hp = boss ? 30 + 10 * S.stat.boss + Math.round(T.powerHp.boss * heroLv()) : T.bearHp + Math.floor(S.storms / 2) + Math.floor(T.powerHp.bear * heroLv());
  return { g, body, fur, bar, fill, raider, boss, big: crown, hp, maxHp: hp, x: 0, z: 0, tx: 0, tz: 0, cd: 0, flash: 0, squash: 0, recoil: 0, stagger: 0, wander: 0, eatT: 0 };
}
function spawnFieldBear() {
  const b = makeBear(false);
  b.x = rand(-10, 10); b.z = rand(13, 22); b.tx = b.x; b.tz = b.z;
  bears.push(b);
}
for (let i = 0; i < T.fieldBears; i++) spawnFieldBear();
function makeWolf(alpha = false) {
  const g = new THREE.Group(); scene.add(g);
  const body = new THREE.Group(); g.add(body);
  const fur = new THREE.MeshLambertMaterial({ color: alpha ? 0x2b2f3a : 0x8e98a8 });
  const m = (geo, x, y, z, material = fur) => {
    const o = mesh(geo, material, x, y, z); body.add(o);
    if (material === fur) { const ol = new THREE.Mesh(geo, outlineMat); ol.position.copy(o.position); ol.rotation.copy(o.rotation); ol.scale.setScalar(1.12); body.add(ol); }
    return o;
  };
  m(new THREE.BoxGeometry(.55, .5, 1.1), 0, .72, 0);
  m(new THREE.BoxGeometry(.44, .4, .46), 0, .98, .7);
  m(new THREE.BoxGeometry(.22, .18, .32), 0, .9, 1.02);
  m(new THREE.BoxGeometry(.12, .12, .5), 0, .85, -.75);
  for (const s of [-1, 1]) {
    m(new THREE.ConeGeometry(.09, .22, 4), s * .14, 1.27, .64);
    m(new THREE.BoxGeometry(.07, .06, .04), s * .11, 1.04, .94, mat(0xffd34a, { emissive: 0x806000 }));
    for (const f of [-1, 1]) m(new THREE.CylinderGeometry(.08, .08, .5, 6), s * .2, .25, f * .38);
  }
  const bar = new THREE.Group(); bar.position.y = 1.8; g.add(bar);
  bar.add(new THREE.Mesh(hpBarGeo, new THREE.MeshBasicMaterial({ color: 0x13253d, depthTest: false })));
  const fill = new THREE.Mesh(hpBarGeo, new THREE.MeshBasicMaterial({ color: 0xe5484d, depthTest: false })); fill.position.z = .01; bar.add(fill);
  bar.visible = false; bar.renderOrder = 11; fill.renderOrder = 12;
  if (alpha) {
    m(new THREE.TorusGeometry(.3, .1, 6, 14).rotateX(Math.PI / 2), 0, 1.0, .5, mat(0xd9e3ee));
    for (const s of [-1, 1]) m(new THREE.BoxGeometry(.08, .07, .05), s * .11, 1.04, .95, mat(0xff3030, { emissive: 0xaa0000 }));
    g.scale.setScalar(1.5);
  }
  const hp = alpha ? T.alpha.hp + 2 * Math.floor(S.storms / 2) + Math.round(T.powerHp.alpha * heroLv()) : 2 + Math.floor(S.storms / 3) + Math.floor(T.powerHp.wolf * heroLv());
  return { g, body, fur, bar, fill, wolf: true, alpha, raider: false, boss: false, hp, maxHp: hp, x: 0, z: 0, tx: 0, cd: 0, flash: 0, squash: 0, recoil: 0, stagger: 0, wander: 0 };
}
// stronger wild animals unlocked by hero power (T.beasts)
function beastShell(color, barY) {
  const g = new THREE.Group(); scene.add(g);
  const body = new THREE.Group(); g.add(body);
  const fur = new THREE.MeshLambertMaterial({ color });
  const m = (geo, x, y, z, material = fur) => {
    const o = mesh(geo, material, x, y, z); body.add(o);
    if (material === fur) { const ol = new THREE.Mesh(geo, outlineMat); ol.position.copy(o.position); ol.scale.setScalar(1.08); body.add(ol); }
    return o;
  };
  const bar = new THREE.Group(); bar.position.y = barY; g.add(bar);
  bar.add(new THREE.Mesh(hpBarGeo, new THREE.MeshBasicMaterial({ color: 0x13253d, depthTest: false })));
  const fill = new THREE.Mesh(hpBarGeo, new THREE.MeshBasicMaterial({ color: 0xe5484d, depthTest: false })); fill.position.z = .01; bar.add(fill);
  bar.visible = false; bar.renderOrder = 11; fill.renderOrder = 12;
  return { g, body, fur, m, bar, fill };
}
function makeBeast(kind) {
  const B = T.beasts[kind];
  let a;
  if (kind === 'chief') {
    a = makeBear(false); a.fur.color.setHex(0xd8b27a);
    a.body.add(mesh(new THREE.ConeGeometry(.3, .4, 5), mat(0xffc83d, { emissive: 0x664400 }), 0, 1.85, 1.05));
    a.body.add(mesh(new THREE.BoxGeometry(.05, .3, .05), mat(0x8a2b2b), .2, 1.45, 1.47));
  } else if (kind === 'saber') {
    a = beastShell(0xe0a050, 2.1); const { m } = a;
    m(new THREE.BoxGeometry(.75, .65, 1.5), 0, .95, 0); m(new THREE.BoxGeometry(.6, .5, .55), 0, 1.15, .95); m(new THREE.BoxGeometry(.34, .24, .3), 0, 1.02, 1.3);
    m(new THREE.BoxGeometry(.1, .1, .7), 0, 1.1, -.95);
    for (const z of [-.45, 0, .45]) m(new THREE.BoxGeometry(.78, .08, .12), 0, 1.15, z, mat(0x6b3a1a));
    for (const sx of [-1, 1]) {
      m(new THREE.ConeGeometry(.1, .2, 4), sx * .2, 1.48, .9);
      m(new THREE.BoxGeometry(.07, .07, .04), sx * .14, 1.22, 1.23, mat(0xffd34a, { emissive: 0x806000 }));
      m(new THREE.BoxGeometry(.06, .34, .06), sx * .1, .8, 1.38, mat(0xffffff));
      for (const f of [-1, 1]) m(new THREE.CylinderGeometry(.12, .12, .7, 6), sx * .28, .35, f * .5);
    }
  } else {
    a = beastShell(0x7a5236, 4); const { m } = a;
    m(new THREE.BoxGeometry(1.9, 1.6, 2.6), 0, 1.75, 0); m(new THREE.BoxGeometry(1.2, .5, 1.2), 0, 2.75, .4); m(new THREE.BoxGeometry(1.2, 1.1, 1), 0, 2.1, 1.6);
    m(new THREE.CylinderGeometry(.17, .12, 1.3, 7), 0, 1.25, 2.2);
    for (const sx of [-1, 1]) {
      m(new THREE.BoxGeometry(.15, .7, .6), sx * .66, 2.2, 1.35);
      m(new THREE.CylinderGeometry(.07, .05, 1.1, 6).rotateX(-1.1), sx * .38, 1.45, 2.4, mat(0xf4efe2));
      m(new THREE.BoxGeometry(.1, .1, .05), sx * .3, 2.3, 2.11, mat(0x1b1b22));
      for (const f of [-1, 1]) m(new THREE.CylinderGeometry(.32, .34, 1.1, 8), sx * .6, .55, f * .85);
    }
  }
  const hp = B.hp + B.hpPer * heroLv();
  return Object.assign(a, { kind, sc: B.scale, dmg: B.dmg, reach: kind === 'mammoth' ? 2.8 : kind === 'chief' ? 2.1 : 1.8, big: kind !== 'saber',
    wolf: false, alpha: false, raider: false, boss: false, hp, maxHp: hp, x: 0, z: 0, tx: 0, tz: 0, cd: 0, flash: 0, squash: 0, recoil: 0, stagger: 0, wander: 0 });
}
function spawnBeast() {
  const p = heroLv();
  const kinds = Object.keys(T.beasts).filter(k => T.beasts[k].power && p >= T.beasts[k].power && bears.filter(b => b.kind === k).length < T.beasts[k].max);
  if (!kinds.length) return;
  const k = kinds[Math.floor(Math.random() * kinds.length)], b = makeBeast(k);
  b.x = rand(-9, 9); b.z = rand(16, 22); b.tx = b.x; b.tz = b.z; bears.push(b);
  toast(`⚠ ${T.beasts[k].name} 출현! (영웅 Lv${p})`); play('growl'); buzz([40, 30, 60]);
}
function spawnPack() {
  const x = rand(-10, 10), z = rand(15, 22);
  S.packs = (S.packs || 0) + 1;
  const alpha = S.storms >= 2 && S.packs % T.alpha.every === 0 && !bears.some(b => b.alpha);
  for (let i = 0; i < T.wolfPackSize + (alpha ? 1 : 0); i++) {
    const w = makeWolf(alpha && i === 0); w.x = x + rand(-1.2, 1.2); w.z = z + rand(-1.2, 1.2); w.tx = w.x; w.tz = w.z; bears.push(w);
  }
  if (alpha) { toast('🐺 대장 늑대가 나타났다!'); play('growl'); buzz([40, 30, 60]); }
}

// wolf pups → tamed pets (fight beside the player, +4 bag each)
const pets = [], pups = [];
function petModel(color, scale) {
  const w = makeWolf(); w.bar.visible = false; w.fur.color.setHex(color); w.g.scale.setScalar(scale); return w;
}
// each pet level gets its own coat and gear so growth is visible at a glance
const PET_LOOKS = [
  { fur: 0xc9ced8, scarf: 0xe5484d },
  { fur: 0xd9c3a0, scarf: 0xe5484d },
  { fur: 0xa8875f, scarf: 0x3a9ad9, stripe: 0x4a3020 },
  { fur: 0x6f7a8a, collar: 0x3b2a20, spikes: 0xd9e3ee, plates: 0x8a8f99 },
  { fur: 0xf4f6fa, mane: 0xffc83d, crown: 0xffc83d, glow: true },
];
function applyPetLook(w) {
  const L = PET_LOOKS[w.lv] || PET_LOOKS[0];
  w.fur.color.setHex(L.fur);
  if (w.look) { w.body.remove(w.look); disposeActor(w.look); }
  const g = w.look = new THREE.Group(); w.body.add(g);
  if (L.scarf) g.add(mesh(new THREE.TorusGeometry(.26, .07, 6, 12).rotateX(Math.PI / 2), mat(L.scarf), 0, .98, .5));
  if (L.stripe) g.add(mesh(new THREE.BoxGeometry(.2, .06, 1.0), mat(L.stripe), 0, .99, 0));
  if (L.collar) {
    g.add(mesh(new THREE.TorusGeometry(.27, .08, 6, 12).rotateX(Math.PI / 2), mat(L.collar), 0, .98, .5));
    for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2, sp = mesh(new THREE.ConeGeometry(.05, .16, 4), mat(L.spikes), Math.cos(a) * .3, .98, .5 + Math.sin(a) * .3); sp.rotation.z = -Math.cos(a) * 1.4; sp.rotation.x = Math.sin(a) * 1.4; g.add(sp); }
    for (const s of [-1, 1]) g.add(mesh(new THREE.BoxGeometry(.12, .3, .5), mat(L.plates), s * .32, .85, .1));
  }
  if (L.mane) g.add(mesh(new THREE.TorusGeometry(.32, .13, 6, 14).rotateX(Math.PI / 2), mat(L.mane, { emissive: 0x664400 }), 0, 1.0, .5));
  if (L.crown) g.add(mesh(new THREE.ConeGeometry(.14, .22, 5), mat(L.crown, { emissive: 0x664400 }), 0, 1.3, .7));
  if (L.glow) g.add(mesh(new THREE.SphereGeometry(.5, 10, 8), new THREE.MeshBasicMaterial({ color: 0x9fd6ff, transparent: true, opacity: .15, depthWrite: false }), 0, .8, 0, false));
}
function spawnPup(x, z) {
  const u = petModel(0xc9ced8, .6); u.x = x; u.z = z; u.t = 60; u.fed = 0; u.g.position.set(x, 0, z);
  const b = sprite(180, 120, 1.8, 1.2); b.sp.position.y = 2.6; u.g.add(b.sp); b.draw((c, w, h) => bubble(c, w, h, `🥩 0/${T.pet.tameMeat}`));
  u.bub = b; pups.push(u);
  toast(`🐺 새끼 늑대! 고기 ${T.pet.tameMeat}개를 먹이면 길들일 수 있어요`);
}
const petLv = () => T.pet.hits.filter(h => S.petHits >= h).length - 1;
function addPet() {
  const w = petModel(0xd9c3a0, T.pet.scale[petLv()]); w.lv = petLv(); applyPetLook(w);
  w.x = pl.x - 1; w.z = pl.z; w.cd = 0; pets.push(w); S.petCount = pets.length;
}
function removeWolfModel(u) { scene.remove(u.g); disposeActor(u.g, hpBarGeo); u.fur.dispose(); if (u.bub) { u.bub.tex.dispose(); u.bub.sp.material.dispose(); } }
function updatePets(dt) {
  for (let i = pups.length - 1; i >= 0; i--) {
    const u = pups[i]; u.t -= dt; u.g.position.y = Math.abs(Math.sin(performance.now() / 200 + i)) * .06;
    if (Math.hypot(u.x - pl.x, u.z - pl.z) < 1.6 && stackHas('meat') && pets.length < 1 && tick('feedPup', .35, dt)) {
      stackTake('meat'); u.fed++; u.t = 60; play('pop', 60);
      fly('meat', backPos(), V(u.x, .6, u.z), .2);
      u.bub.draw((c, w, h) => bubble(c, w, h, `🥩 ${u.fed}/${T.pet.tameMeat}`));
      if (u.fed < T.pet.tameMeat) continue;
      removeWolfModel(u); pups.splice(i, 1); addPet();
      toast('🐺 늑대를 길들였어요! 함께 싸우며 점점 자랍니다 (가방 +4)'); play('up'); buzz([20, 30, 20]);
      burst(pl.x, 1, pl.z, 0xffc83d, 12, { spd: 3, up: 5, life: .6 });
    } else if (u.t <= 0) { removeWolfModel(u); pups.splice(i, 1); }
  }
  pets.forEach((w, i) => {
    w.cd -= dt;
    let tgt = null, bd = 6;
    const home = inCamp();
    for (const b of bears) { const d = Math.hypot(b.x - pl.x, b.z - pl.z); if (d < bd && (!home || b.raider)) { bd = d; tgt = b; } }
    let tx, tz;
    if (tgt) { tx = tgt.x; tz = tgt.z; }
    else { const a = pl.rot + Math.PI + (i ? .8 : -.8); tx = pl.x + Math.sin(a) * 1.5; tz = pl.z + Math.cos(a) * 1.5; }
    const dx = tx - w.x, dz = tz - w.z, d = Math.hypot(dx, dz), stop = tgt ? 1.2 : .3;
    if (d > stop) {
      const st = Math.min(d - stop, (d > 6 ? 10 : 6) * dt);
      w.x += dx / d * st; w.z += dz / d * st; w.g.rotation.y = Math.atan2(dx, dz);
      w.g.position.y = Math.abs(Math.sin(performance.now() / 70 + i)) * .08;
    } else if (tgt && w.cd <= 0) {
      w.cd = T.pet.cd[w.lv]; w.g.rotation.y = Math.atan2(dx, dz);
      const dmg = T.pet.dmg[w.lv];
      S.petHits++;
      if (petLv() > w.lv) {
        w.lv = petLv(); applyPetLook(w); popText(w.x, 2.4, w.z, `🐺 Lv${w.lv + 1}!`, '#ffd36b', true);
        burst(w.x, 1, w.z, 0xffc83d, 14, { spd: 3, up: 6, life: .7 }); play('up'); toast(`🐺 늑대가 자랐어요! Lv${w.lv + 1} (공격력 ${T.pet.dmg[w.lv]})`);
      }
      popText(tgt.x, 2.3, tgt.z, `${dmg}`, '#ffd9a0'); burst(tgt.x, 1, tgt.z, 0xffffff, 4, { spd: 3, up: 3, life: .3, size: .6 });
      bearHurt(tgt, dmg, w);
    }
    if (Math.hypot(pl.x - w.x, pl.z - w.z) > 14) { w.x = pl.x; w.z = pl.z; }
    const sc = w.g.scale.x + (T.pet.scale[w.lv] - w.g.scale.x) * Math.min(1, dt * 3); w.g.scale.setScalar(sc);
    w.g.position.x = w.x; w.g.position.z = w.z;
  });
}
function spawnRaid() {
  const want = 1 + Math.floor(S.storms / 2), n = Math.max(0, want - S.lv.gate);
  if (want > n) setTimeout(() => toast(`🛡️ 정문이 곰 ${want - n}마리를 막았어요`), 1800);
  for (let i = 0; i < n; i++) {
    const b = makeBear(true);
    b.x = rand(-3, 3); b.z = 17 + i * 2; bears.push(b);
  }
  if (S.storms % T.bossEvery === 0) {
    const b = makeBear(true, true); b.x = 0; b.z = 21; bears.push(b);
    setTimeout(() => { toast('👑 보스 곰이 나타났다!'); play('growl'); buzz([60, 40, 60]); }, 2400);
  }
}
function bearHurt(b, dmg, src = pl) {
  b.hp -= dmg; b.flash = .2; b.squash = .22; b.recoil = .28; b.stagger = .2; b.bar.visible = true;
  const dx = b.x - src.x, dz = b.z - src.z, d = Math.hypot(dx, dz) || 1, kb = b.boss || b.kind === 'mammoth' ? .15 : .45;
  b.x += dx / d * kb; b.z += dz / d * kb;
  if (b.hp > 0) { play('pain', 130); return false; }
  scene.remove(b.g); bears.splice(bears.indexOf(b), 1);
  disposeActor(b.g, hpBarGeo);
  b.fur.dispose(); b.bar.children.forEach(o => o.material.dispose());
  if (!b.wolf) S.stat.kills++;
  const B = b.kind && T.beasts[b.kind];
  const meat = B ? B.meat : b.alpha ? T.alpha.meat : b.wolf ? 1 : b.boss ? 8 : 3;
  const hides = !(hidesOn() && S.stage >= 2) ? 0 : B ? B.hides : b.boss ? 2 : b.alpha ? 1 : Math.random() < T.hideChance[b.wolf ? 'wolf' : 'bear'] ? 1 : 0;
  b.lootText = b.boss ? '👑 처치!' : `🥩+${meat}`;
  if (b.wolf) { S.stat.wolves++; if (Math.random() < (b.alpha ? T.alpha.pupChance : .15) && pets.length + pups.length < 1) spawnPup(b.x, b.z); }
  if (b.alpha) { S.coinPile += T.alpha.coins; toast(`🐺 대장 늑대 처치! 보너스 🪙${T.alpha.coins}`); }
  if (src !== pl && src.carry) { src.n = Math.min(6, src.n + meat); src.hides = Math.min(4, src.hides + hides); }
  else {
    for (let i = 0; i < meat; i++) dropPickup('meat', b.x + rand(-1.2, 1.2), b.z + rand(-1.2, 1.2));
    for (let i = 0; i < hides; i++) dropPickup('hide', b.x + rand(-1, 1), b.z + rand(-1, 1));
  }
  if (B) { const c = B.coins + T.beasts.coinsPer * heroLv(); S.coinPile += c; S.stat.beasts = (S.stat.beasts || 0) + 1; toast(`⚔ ${B.name} 처치! 보너스 🪙${c}`); return true; }
  if (b.boss) { S.stat.boss++; S.coinPile += 300; toast('👑 보스 곰 처치! 보너스 🪙300'); return true; }
  if (b.wolf) return true;
  const fieldCount = bears.filter(x => !x.raider && !x.boss && !x.wolf && !x.kind).length + pendingBears.length;
  if (fieldCount < Math.min(T.maxFieldBears, T.fieldBears + S.storms)) pendingBears.push(T.bearRespawn);
  return true;
}
const pendingBears = [];
function updateBears(dt) {
  for (let i = pendingBears.length - 1; i >= 0; i--) if ((pendingBears[i] -= dt) <= 0) { pendingBears.splice(i, 1); spawnFieldBear(); }
  if ((S.storms >= 1 || S.stat.sold >= T.wolfStartSold) && tick('wolfPack', T.wolfSpawn, dt) && bears.filter(b => b.wolf).length + T.wolfPackSize <= Math.min(T.maxWolves, 3 + 3 * Math.floor(S.storms / 2))) spawnPack();
  if (S.started && heroLv() >= T.beasts.chief.power && tick('beast', T.beasts.every, dt)) spawnBeast();
  const pd = b => Math.hypot(pl.x - b.x, pl.z - b.z);
  for (const b of bears) {
    let sp = 1.1, chase = false, chaseH = false;
    const dist = pd(b);
    if (b.raider) {
      if (S.phase !== 'storm') {
        b.tx = 0; b.tz = 15; sp = 3;
        if (b.z > 9) { b.raider = false; b.fur.color.setHex(b.boss ? 0xdcd3f0 : 0xfffaf0); }
      } else if (dist < 5 && pl.stunFree) { chase = true; }
      else if (b.z > 5.2) { b.tx = 0; b.tz = 4.5; sp = 2.6; }
      else {
        const goal = S.meat > 0 ? P.meatTile : S.grillItems.length ? P.grill : P.fire;
        b.tx = goal.x + .2; b.tz = goal.z + 1.3; sp = 2.4;
        if (Math.hypot(b.tx - b.x, b.tz - b.z) < .4 && tick('eat' + bears.indexOf(b), 1.2, dt)) {
          if (S.meat > 0) S.meat--; else if (S.grillItems.length) S.grillItems.shift();
          else if (S.wood > 0) S.wood--;
          if (!S.timers.eatToast || S.timers.eatToast < 0) { toast('🐻 곰이 식량을 훔쳐 먹고 있어요!'); S.timers.eatToast = 6; }
        }
      }
    } else {
      const aggro = (b.wolf ? 6 : 5) + 3 * S.stormK;
      const hh = hunters.find(h => h.down <= 0 && h.z > 6.6 && Math.hypot(h.x - b.x, h.z - b.z) < aggro);
      if (pl.z > 6.6 && dist < aggro && pl.stunFree) chase = true;
      else if (hh) { b.tx = hh.x; b.tz = hh.z; sp = 2.3; chaseH = true; }
      else {
        b.wander -= dt;
        if (b.wander <= 0) { b.wander = rand(2, 5); b.tx = clamp(b.x + rand(-5, 5), -11, 11); b.tz = clamp(b.z + rand(-5, 5), 9, 23); }
      }
    }
    if (b.wolf && !chase && !chaseH) sp = 1.6;
    if (chase) { b.tx = pl.x; b.tz = pl.z; sp = (b.kind ? T.beasts[b.kind].spd : b.alpha ? 3.8 : b.wolf ? 3.4 : 2.5) + .8 * S.stormK; }
    const dx = b.tx - b.x, dz = b.tz - b.z, d = Math.hypot(dx, dz);
    b.stagger = Math.max(0, b.stagger - dt);
    if (b.stagger <= 0 && d > (chase || chaseH ? 1.3 : .1)) {
      b.x += dx / d * Math.min(d, sp * dt); b.z += dz / d * Math.min(d, sp * dt);
      b.g.rotation.y = lerpAngle(b.g.rotation.y, Math.atan2(dx, dz), dt * 8);
    }
    if (!b.raider) { b.z = clamp(b.z, 8.2, 23); b.x = clamp(b.x, -12, 12); }
    // separation
    for (const o of bears) if (o !== b) {
      const sx = b.x - o.x, sz = b.z - o.z, sd = Math.hypot(sx, sz);
      if (sd < 1.6 && sd > 0) { b.x += sx / sd * (1.6 - sd) * .5; b.z += sz / sd * (1.6 - sd) * .5; }
    }
    b.cd -= dt;
    if (b.stagger <= 0 && dist < (b.reach || 1.7) && b.cd <= 0 && pl.stunFree && S.hurtCd <= 0) { b.cd = 1.3; hurtPlayer(b); }
    for (const h of hunters) if (b.stagger <= 0 && h.down <= 0 && b.cd <= 0 && Math.hypot(h.x - b.x, h.z - b.z) < (b.reach || 1.7)) { b.cd = 1.3; hurtHunter(h, b); }
    b.squash -= dt;
    const sq = Math.max(0, b.squash) / .22, bs = b.sc || (b.boss ? 1.7 : b.alpha ? 1.5 : 1);
    b.g.scale.set(bs * (1 + .25 * sq), bs * (1 - .22 * sq), bs * (1 + .25 * sq));
    b.recoil = Math.max(0, b.recoil - dt);
    const pain = Math.sin(Math.PI * b.recoil / .28);
    b.body.rotation.x = -.35 * pain;
    b.body.rotation.z = .16 * pain;
    b.body.position.y = .2 * pain;
    b.flash -= dt;
    b.fur.emissive.setHex(b.flash > 0 ? 0xff4040 : 0x000000);
    b.g.position.set(b.x, Math.abs(Math.sin(performance.now() / 160 + b.x)) * (d > .2 ? .06 : 0), b.z);
    b.fill.scale.x = Math.max(0, b.hp / b.maxHp); b.fill.position.x = -(1 - b.fill.scale.x) * .6;
    b.bar.quaternion.copy(camera.quaternion);
    b.bar.parent.updateMatrixWorld();
    b.bar.quaternion.premultiply(b.g.quaternion.clone().invert());
  }
}
const lerpAngle = (a, b, k) => { let d = ((b - a + Math.PI) % (Math.PI * 2)) - Math.PI; if (d < -Math.PI) d += Math.PI * 2; return a + d * Math.min(1, k); };

const pickups = [];
// nearest meat/hide on the ground inside the fence that this hunter still has room for
function campPickup(h) {
  let best = null, bd = 1e9;
  for (const pk of pickups) {
    if (pk.x < CAMP.x1 || pk.x > CAMP.x2 || pk.z < CAMP.z1 || pk.z > CAMP.z2) continue;
    if (pk.type === 'meat' ? h.n >= 6 : pk.type === 'hide' ? h.hides >= 4 : true) continue;
    const d = Math.hypot(pk.x - h.x, pk.z - h.z);
    if (d < bd) { bd = d; best = pk; }
  }
  return best;
}
function dropPickup(type, x, z) {
  const m = itemMesh(type); m.position.set(x, .3, z); scene.add(m);
  pickups.push({ type, m, x, z, t: rand(0, 6) });
}

// ───────────────────────── player ─────────────────────────
function hurtPlayer(b) {
  if (Math.random() < blockChance()) {
    S.hurtCd = T.hurtGrace; popText(pl.x, 2.6, pl.z, '🛡 막음!', '#9fd8ff'); play('hit'); buzz(25);
    burst(pl.x, 1, pl.z, 0x9fd8ff, 8, { spd: 3, up: 3, life: .4 }); return;
  }
  S.hp -= b.dmg || (b.boss || b.alpha ? 2 : 1); S.hurtCd = T.hurtGrace; play('hurt'); buzz(150);
  const dx = pl.x - b.x, dz = pl.z - b.z, d = Math.hypot(dx, dz) || 1;
  pl.x += dx / d * 1.1; pl.z += dz / d * 1.1;
  hurtEl.style.opacity = 1; setTimeout(() => (hurtEl.style.opacity = 0), 220);
  shakeK(.35);
  if (S.hp <= 0) {
    S.stun = 2.2; S.hp = S.maxHp;
    while (stack.length) { stackG.remove(stack.pop().mesh); }
    pl.x = 0; pl.z = -1;
    toast('😵 곰에게 당했어요! 짐을 모두 잃었습니다');
  }
}
const input = { x: 0, z: 0 }, keys = {};
addEventListener('keydown', e => { keys[e.key.toLowerCase()] = true; });
addEventListener('keyup', e => { keys[e.key.toLowerCase()] = false; });
const joyEl = document.getElementById('joy'), knob = document.getElementById('knob');
let joyId = null, jx0 = 0, jy0 = 0, jdx = 0, jdy = 0;
const cv = renderer.domElement;
const tapStarts = new Map();
const ray = new THREE.Raycaster(), groundPlane = new THREE.Plane(V(0, 1, 0), 0), tapNdc = new THREE.Vector2();
const tapMark = new THREE.Mesh(new THREE.RingGeometry(.35, .5, 20).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0xffc83d, transparent: true, opacity: .9 }));
tapMark.position.y = .05; tapMark.visible = false; scene.add(tapMark);
cv.addEventListener('pointerdown', e => {
  tapStarts.set(e.pointerId, { x: e.clientX, y: e.clientY, t: performance.now() });
  if (joyId !== null) return;
  joyId = e.pointerId; jx0 = e.clientX; jy0 = e.clientY; jdx = jdy = 0;
  joyEl.style.display = 'block'; joyEl.style.left = jx0 + 'px'; joyEl.style.top = jy0 + 'px'; knob.style.transform = '';
});
addEventListener('pointermove', e => {
  if (e.pointerId !== joyId) return;
  let dx = e.clientX - jx0, dy = e.clientY - jy0; const d = Math.hypot(dx, dy), R = 50;
  if (d > R) { dx *= R / d; dy *= R / d; }
  jdx = dx / R; jdy = dy / R; knob.style.transform = `translate(${dx}px, ${dy}px)`;
});
function setTapTarget(e) {
  tapNdc.set(e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
  ray.setFromCamera(tapNdc, camera);
  let hitBear = null, nearest = Infinity;
  for (const b of bears) {
    const hit = ray.intersectObject(b.body, true)[0];
    if (hit && hit.distance < nearest) { hitBear = b; nearest = hit.distance; }
  }
  if (hitBear && S.started) {
    pl.focus = hitBear; pl.manual = Math.min(4, pl.manual + 1);
    pl.target = { enemy: hitBear, t: 6 };
    tapMark.position.set(hitBear.x, .05, hitBear.z); tapMark.visible = true;
    return;
  }
  pl.focus = null; pl.manual = 0;
  const hit = ray.ray.intersectPlane(groundPlane, V(0, 0, 0));
  if (hit) { pl.target = { x: hit.x, z: hit.z, t: 6 }; tapMark.position.set(hit.x, .05, hit.z); tapMark.visible = true; }
}
function joyEnd(e) {
  const tap = tapStarts.get(e.pointerId);
  if (e.type === 'pointerup' && tap && Math.hypot(e.clientX - tap.x, e.clientY - tap.y) < 18 && performance.now() - tap.t < 350) setTapTarget(e);
  tapStarts.delete(e.pointerId);
  if (e.pointerId === joyId) { joyId = null; jdx = jdy = 0; joyEl.style.display = 'none'; }
}
addEventListener('pointerup', joyEnd); addEventListener('pointercancel', joyEnd);

function collide() {
  const r = .45;
  for (const w of walls) {
    const cx = clamp(pl.x, w.x1, w.x2), cz = clamp(pl.z, w.z1, w.z2);
    const dx = pl.x - cx, dz = pl.z - cz, d = Math.hypot(dx, dz);
    if (d < r) {
      if (d > 1e-4) { pl.x = cx + dx / d * r; pl.z = cz + dz / d * r; }
      else { // inside box: push out along shallowest axis
        const opts = [[w.x1 - r - pl.x, 0], [w.x2 + r - pl.x, 0], [0, w.z1 - r - pl.z], [0, w.z2 + r - pl.z]];
        opts.sort((a, b) => Math.abs(a[0] + a[1]) - Math.abs(b[0] + b[1]));
        pl.x += opts[0][0]; pl.z += opts[0][1];
      }
    }
  }
  for (const c of circles) {
    const dx = pl.x - c.x, dz = pl.z - c.z, d = Math.hypot(dx, dz), m = c.r + r;
    if (d < m && d > 1e-4) { pl.x = c.x + dx / d * m; pl.z = c.z + dz / d * m; }
  }
  pl.x = clamp(pl.x, BOUNDS.x1, BOUNDS.x2); pl.z = clamp(pl.z, BOUNDS.z1, BOUNDS.z2);
}
const near = (p, r) => Math.hypot(pl.x - p.x, pl.z - p.z) < r;
const inCamp = () => pl.x > CAMP.x1 && pl.x < CAMP.x2 && pl.z > CAMP.z1 && pl.z < CAMP.z2;

function updatePlayer(dt) {
  S.stun = Math.max(0, S.stun - dt);
  S.hurtCd = Math.max(0, S.hurtCd - dt);
  if ((pl.comboT -= dt) <= 0) pl.combo = 0;
  pl.stunFree = S.stun <= 0;
  if (!pl.stunFree) { pl.manual = 0; pl.focus = null; }
  if (pl.focus && !bears.includes(pl.focus)) { pl.manual = 0; pl.focus = null; }
  let ix = Math.hypot(jdx, jdy) < .2 ? 0 : jdx, iz = Math.hypot(jdx, jdy) < .2 ? 0 : jdy;
  if (keys.a || keys.arrowleft) ix -= 1; if (keys.d || keys.arrowright) ix += 1;
  if (keys.w || keys.arrowup) iz -= 1; if (keys.s || keys.arrowdown) iz += 1;
  let il = Math.hypot(ix, iz);
  if (il > 1) { ix /= il; iz /= il; }
  if (il > .1) { pl.target = null; tapMark.visible = false; }
  else if (pl.target) {
    const enemy = pl.target.enemy;
    if (enemy && !bears.includes(enemy)) { pl.target = null; pl.focus = null; pl.manual = 0; tapMark.visible = false; }
    else {
      const tx = enemy ? enemy.x : pl.target.x, tz = enemy ? enemy.z : pl.target.z;
      const dx = tx - pl.x, dz = tz - pl.z, d = Math.hypot(dx, dz);
      if (enemy) tapMark.position.set(tx, .05, tz);
      if (d < (enemy ? 1.8 : .25) || (pl.target.t -= dt) <= 0 || !pl.stunFree) { pl.target = null; tapMark.visible = false; }
      else { ix = dx / d; iz = dz / d; il = 1; }
    }
  }
  pl.moving = il > .1 && pl.stunFree;
  if (pl.moving) {
    const sp = val('boots') * (1 - T.stormSlow * S.stormK);
    pl.x += ix * sp * dt; pl.z += iz * sp * dt;
    pl.rot = lerpAngle(pl.rot, Math.atan2(ix, iz), dt * 12);
  }
  collide();
  player.g.position.set(pl.x, 0, pl.z);
  capeG.rotation.x = (pl.moving ? .45 : .08) + Math.sin(performance.now() / (pl.moving ? 90 : 400)) * (pl.moving ? .12 : .03);
  player.g.rotation.y = pl.rot;
  player.body.position.y = pl.moving ? Math.abs(Math.sin(performance.now() / 85)) * .1 : 0;
  player.body.rotation.z = S.stun > 0 ? Math.PI / 2.4 : 0;
  stackG.rotation.x = pl.moving ? -.06 : 0;

  // combat beats chopping
  const manual = pl.manual > 0 && pl.focus && bears.includes(pl.focus);
  let target = manual ? pl.focus : null, best = manual ? T.combat.tapRange : 2.1;
  if (!manual) for (const b of bears) { const d = Math.hypot(b.x - pl.x, b.z - pl.z) - (b.boss ? .8 : 0); if (d < best) { best = d; target = b; } }
  if (manual && Math.hypot(target.x - pl.x, target.z - pl.z) - (target.boss ? .8 : 0) > best) target = null;
  if (target && pl.stunFree) {
    if (manual || !pl.moving) pl.rot = lerpAngle(pl.rot, Math.atan2(target.x - pl.x, target.z - pl.z), dt * 20);
    if (manual) {
      resetTick('atk');
      if (!pl.sw) {
        pl.manual--;
        const power = pl.combo % T.combat.slamEvery === T.combat.slamEvery - 1;
        startSwing(power ? .36 : T.combat.manualSwing, () => { if (power) powerSlam(); else if (bears.includes(target)) playerHit(target, true); }, power);
      }
    } else if (!pl.sw && tick('atk', T.combat.autoInterval, dt)) {
      startSwing(.38, () => { if (bears.includes(target)) playerHit(target, false); });
    }
  } else {
    resetTick('atk');
    let tree = null, tb = 1.75;
    for (const t of trees) { const d = Math.hypot(t.x - pl.x, t.z - pl.z); if (t.logs > 0 && d < tb) { tb = d; tree = t; } }
    if (tree && stack.length < bagCap() && pl.stunFree) {
      const iv = T.axeChop[S.lv.axe];
      if (tick('chop', iv, dt)) startSwing(Math.min(.3, iv * .85), () => {
        if (stack.length >= bagCap() || !chopTree(tree)) return;
        stackAdd('log'); fly('log', V(tree.x, 1, tree.z), backPos(), .22);
        burst(tree.x, 1, tree.z, 0xc8773a, 5, { spd: 3, up: 4, life: .4, size: .8 });
        burst(tree.x, 2.2, tree.z, 0x9fc8ea, 3, { spd: 2, up: 2, life: .5, size: .7 });
        play('chop'); buzz(8); shakeK(.06);
      });
    } else resetTick('chop');
  }
  updateSwing(dt);

  // drop-offs and pick-ups
  if (near(P.woodTile, 1.35) && S.wood < T.max.wood && stackHas('log')) {
    if (tick('dropWood', .07, dt)) { stackTake('log'); S.wood++; S.woodIn++; fly('log', backPos(), V(P.woodTile.x, .5, P.woodTile.z), .2); }
  }
  if (near(P.meatTile, 1.35) && S.meat < T.max.meat && stackHas('meat')) {
    if (tick('dropMeat', .07, dt)) { stackTake('meat'); S.meat++; S.meatIn++; fly('meat', backPos(), V(P.meatTile.x, .5, P.meatTile.z), .2); play('pop', 60); }
  }
  if (S.stage >= 2) {
    if (near(P.ovenOut, 1.3) && S.fishRaw < ovenCap() && stackHas('fish') && tick('dropFish', .07, dt)) { stackTake('fish'); S.fishRaw++; fly('fish', backPos(), V(P.oven.x, 1, P.oven.z), .2); play('pop', 60); }
    if (near(P.fishCrate, 1.35) && S.fishCrate < T.max.fishCrate && stackHas('fish') && tick('dropCrate', .07, dt)) { stackTake('fish'); S.fishCrate++; fly('fish', backPos(), V(P.fishCrate.x, .5, P.fishCrate.z), .2); play('pop', 60); }
    if (near(P.ovenWood, 1.35) && S.ovenWood < T.max.ovenWood && stackHas('log') && tick('dropOvenWood', .07, dt)) { stackTake('log'); S.ovenWood++; fly('log', backPos(), V(P.ovenWood.x, .5, P.ovenWood.z), .2); }
  }
  if (S.lv.fishing && stack.length < bagCap() && pl.stunFree) for (const h of P.holes) if (near(h, 1.4)) {
    if (tick('fishing', T.playerFishTime, dt)) { stackAdd('fish'); fly('fish', V(h.x, .2, h.z), backPos(), .35); burst(h.x, .3, h.z, 0xbfe3f5, 8, { spd: 2.5, up: 5, life: .5 }); play('splash'); buzz(15); }
    break;
  }
  if (near(P.grill, 1.9) && stack.length < bagCap() && S.grillItems.some(isReady)) {
    if (tick('pickSteak', .07, dt)) { const it = takeReady(); if (it) { stackAdd(it.type); play('pop', 40); } }
  }
  if (hidesOn() && S.stage >= 2 && near(P.tanWood, 1.35) && S.tanWood < T.max.tanWood && stackHas('log') && tick('dropTanWood', .07, dt)) {
    stackTake('log'); S.tanWood++; fly('log', backPos(), V(P.tanWood.x, .5, P.tanWood.z), .2);
  }
  if (hidesOn() && S.stage >= 2 && near(TAN.in, 1.35) && stackHas('hide') && tick('dropHide', .08, dt)) {
    stackTake('hide');
    if (S.hide < T.max.hide) { S.hide++; fly('hide', backPos(), V(TAN.in.x, .5, TAN.in.z), .2); }
    else S.coinLeather += T.price.hide;
    play('pop', 60);
  }
  if (near(P.counterStand, 1.5) && S.counter.steak < T.max.counter && stackHas('steak') && tick('dropSteak', .07, dt)) {
    stackTake('steak'); S.counter.steak++; S.steakIn++; fly('steak', backPos(), V(P.counter.x, 1, P.counter.z), .2);
  }
  for (const c of COIN_PILES) if (near(c.at, 1.5) && S[c.key] > 0 && tick('coin', .03, dt)) {
    const k = Math.min(S[c.key], Math.max(5, Math.ceil(S[c.key] / 20)));
    S[c.key] -= k; S.coins += k; play('coin', 45); fly('coin', V(c.at.x, .3, c.at.z), V(pl.x, 1.5, pl.z), .18);
  }
  for (let i = pickups.length - 1; i >= 0; i--) {
    const p = pickups[i];
    p.t += dt; p.m.position.y = .3 + Math.sin(p.t * 4) * .08; p.m.rotation.y += dt * 2;
    if (Math.hypot(p.x - pl.x, p.z - pl.z) < 1.4 && pl.stunFree && stackAdd(p.type)) { scene.remove(p.m); pickups.splice(i, 1); play('pop', 40); if (p.type === 'hide') S.stat.hides++; }
  }
  for (const p of pads) {
    if (!p.on) continue;
    const u = UP[p.key], lv = S.lv[p.key];
    if (p.lock) { if (!near(p, 1.3)) p.lock = false; continue; }
    if (padHidden(p) || !near(p, 1.0) || S.coins <= 0 || pl.moving) { p.dwell = 0; continue; }
    if ((p.dwell = (p.dwell || 0) + dt) < T.padDwell) continue;
    if (!tick('pad', .03, dt)) continue;
    const cost = u.costs[lv], k = Math.min(S.coins, cost - p.paid, Math.max(1, Math.ceil(cost / 25)));
    S.coins -= k; p.paid += k; play('coin', 45);
    fly('coin', V(pl.x, 1.4, pl.z), V(p.x, .1, p.z), .15);
    if (p.paid >= cost) { p.paid = 0; p.lock = true; levelUp(p.key); }
    drawPad(p);
  }
  if (inCamp() && S.hp < S.maxHp && tick('regen', 2.5, dt)) S.hp++;
}
function startSwing(dur, onHit, power = false) { pl.sw = { t: 0, dur, onHit, hit: false, power }; play('swing', 80); }
function updateSwing(dt) {
  const s = pl.sw, b = player.body;
  axeHead.material.emissive.setHex(pl.combo % 4 === 3 ? 0xff7a00 : axeLook().glow);
  if (!s) { axe.rotation.x *= .75; b.rotation.y *= .75; b.position.z *= .75; swoosh.visible = false; return; }
  s.t += dt; const k = s.t / s.dur;
  if (s.power) {
    if (k < .45) { const e = k / .45; axe.rotation.x = -2.9 * e * e; b.rotation.y = -.6 * e; b.position.y = -.12 * e; }
    else if (k < .7) {
      const e = (k - .45) / .25; axe.rotation.x = 1.3; b.rotation.y = -.6 + e * (Math.PI * 2 + .6); b.position.y = .35 * Math.sin(e * Math.PI);
      swoosh.visible = true; swoosh.material.opacity = .9; swoosh.rotation.y = b.rotation.y;
    } else { const e = (k - .7) / .3; axe.rotation.x = 1.3 * (1 - e); b.rotation.y = 0; swoosh.visible = false; }
    if (!s.hit && k >= .62) { s.hit = true; s.onHit(); }
  } else {
    if (k < .4) { const e = k / .4; axe.rotation.x = -2.4 * e * e; b.rotation.y = -.4 * e; b.position.z = -.1 * e; }
    else if (k < .55) {
      const e = (k - .4) / .15; axe.rotation.x = -2.4 + 4.2 * e; b.rotation.y = -.4 + .75 * e; b.position.z = -.1 + .35 * e;
      swoosh.visible = true; swoosh.material.opacity = .85; swoosh.rotation.y = .7 - 1.4 * e;
    } else {
      const e = (k - .55) / .45; axe.rotation.x = 1.8 * (1 - e); b.rotation.y = .35 * (1 - e); b.position.z = .25 * (1 - e);
      swoosh.material.opacity = .85 * Math.max(0, 1 - e * 2.5); swoosh.visible = e < .4;
    }
    if (!s.hit && k >= .5) { s.hit = true; s.onHit(); }
  }
  if (k >= 1) pl.sw = null;
}
function updateShock(dt) {
  if (!shock.visible) return;
  shock.t += dt; const e = shock.t / .35;
  shock.scale.setScalar(.5 + e * 3.2); shock.material.opacity = Math.max(0, 1 - e);
  if (e >= 1) shock.visible = false;
}
function powerSlam() {
  pl.combo = 0; pl.comboT = 0;
  const dmg = val('axe') * 3, R = 3.4;
  shock.position.set(pl.x, .12, pl.z); shock.t = 0; shock.visible = true;
  burst(pl.x, .4, pl.z, 0xffffff, 24, { spd: 8, up: 4, life: .6, size: 1.1 });
  let hits = 0;
  for (const b of [...bears]) {
    const d = Math.hypot(b.x - pl.x, b.z - pl.z) || .1;
    if (d > R + (b.boss ? .8 : 0)) continue;
    hits++;
    const killed = bearHurt(b, dmg, pl);
    if (!killed && !b.boss) { b.x += (b.x - pl.x) / d * 1.2; b.z += (b.z - pl.z) / d * 1.2; }
    popText(b.x, b.big ? 4 : 2.6, b.z, `${dmg}!`, '#ff9a3c', true);
    burst(b.x, 1.3, b.z, 0xffffff, 10, { spd: 6, up: 6, life: .5 });
    if (killed) popText(b.x, 3.4, b.z, b.lootText, '#ffd36b', true);
  }
  popText(pl.x, 3.4, pl.z, hits > 1 ? `💥 강타 ×${hits}` : '💥 강타!', '#ffd36b', true);
  S.hitstop = .16; shakeK(.6); play('crit'); play('kill'); buzz([30, 20, 110]);
}
function playerHit(b, manual) {
  if (manual) {
    pl.combo++; pl.comboT = T.combat.comboWindow;
    if (pl.combo >= 2) popText(pl.x - .6, 2.4, pl.z, pl.combo % T.combat.slamEvery === T.combat.slamEvery - 1 ? '⚡ 강타 준비' : `${pl.combo} 콤보`, '#ffb347');
  }
  const crit = manual && Math.random() < T.combat.critChance;
  const dmg = val('axe') * (crit ? 2 : 1), by = b.big ? 4 : 2.6;
  const killed = bearHurt(b, dmg, pl);
  popText(b.x, by, b.z, crit ? `${dmg}!` : `${dmg}`, crit ? '#ffd36b' : '#ffffff', crit);
  const ax = axeLook();
  burst(b.x, 1.3, b.z, ax.trail, crit ? 14 : manual ? 9 : 4, { spd: 5, up: 5, life: .45, size: .9 });
  if (S.lv.axe >= 3) burst(b.x, 1.6, b.z, ax.head, S.lv.axe * 2, { spd: 3 + S.lv.axe, up: 6, life: .5, size: .7 });
  if (S.lv.axe >= 5 && manual && !killed) {   // fire/storm axe: blast splashes half damage onto nearby animals
    for (const o of [...bears]) if (o !== b && Math.hypot(o.x - b.x, o.z - b.z) < 2) { const sd = Math.ceil(dmg / 2); popText(o.x, 2.4, o.z, `${sd}`, '#ff9a3c'); bearHurt(o, sd, pl); }
  }
  if (manual) burst(b.x, 1.3, b.z, 0xe5484d, crit ? 7 : 4, { spd: 4, up: 4, life: .35, size: .7 });
  S.hitstop = manual ? crit ? .12 : .075 : .025;
  shakeK(manual ? crit ? .4 : .26 : .08);
  play(crit ? 'crit' : 'hit'); buzz(manual ? crit ? [25, 20, 55] : 35 : 10);
  if (killed) {
    S.hitstop = .14; shakeK(.5); play('kill'); buzz([40, 30, 90]);
    burst(b.x, 1, b.z, 0xffffff, 18, { spd: 6, up: 7, life: .7, size: 1.2 });
    popText(b.x, by + .6, b.z, b.lootText, '#ffd36b', true);
  }
}
function levelUp(key) {
  S.lv[key]++; S.bought++;
  const u = UP[key];
  if (key === 'helper' || key === 'helper2') addHelper();
  if (key === 'gate') { drawGateSpikes(); }
  if (key === 'server') addServer();
  if (key === 'hunter' || key === 'hunter2') addHunter();
  if (key === 'cabin') buildCabin(S.lv.cabin - 1);
  if (key === 'fishing') { S.stage = 2; applyStage(true); }
  if (key === 'hunter' && S.lv.hunter === 3) setTimeout(() => toast('🏹 숙련 사냥꾼! 이제 가죽도 모아 와요 → 동쪽에 가죽 공방'), 2600);
  if (key === 'clerk' || key === 'fishClerk') syncClerks();
  if (key === 'artisan') addArtisan();
  if (key === 'fisher') addFisher();
  if (key === 'cape') { S.maxHp = val('cape'); S.hp = S.maxHp; }
  if (key === 'boots' || key === 'coat' || key === 'cape' || key === 'axe') {
    const p = heroLv(), nb = Object.entries(T.beasts).find(([, B]) => B.power === p);
    if (nb) setTimeout(() => toast(`⚔ 영웅 Lv${p}! 이제 ${nb[1].name}이(가) 나타나요`), 2400);
 applyGear(); burst(pl.x, 1, pl.z, 0xffd36b, 16, { spd: 3, up: 5, life: .7 });
  }
  const pad = pads.find(p => p.key === key);
  burst(pad.x, .5, pad.z, 0xffc83d, 14, { spd: 4, up: 7, life: .8 }); play('up'); buzz([20, 40, 20]);
  const msg = { bag: `가방 용량 ${bagCap()}`, axe: `도끼 Lv${S.lv.axe + 1}: 공격력 ${val('axe')}`, cape: `최대 체력 ${val('cape')}`, boots: `이동 속도 ↑ · 막기 ${pct(blockChance())}`, coat: `외투 Lv${S.lv.coat}: 막기 ${pct(blockChance())}`, gate: `습격 곰 −${val('gate')}마리`, helper: `나무꾼 Lv${S.lv.helper}: 장작 ${ST.helperCarry[S.lv.helper]}개씩`, server: `서빙 직원 Lv${S.lv.server}: 한 번에 ${ST.serverCarry[S.lv.server]}개`, hunter: `사냥꾼 Lv${S.lv.hunter}: 공격력 ${ST.hunterDmg[S.lv.hunter]}`, cabin: `손님이 더 많이, 더 자주 옵니다`, fishing: `2단계 확장!`, clerk: `판매 점원 Lv${S.lv.clerk}: 손님 ${ST.clerkSlots[S.lv.clerk]}명 동시 응대`, artisan: S.lv.artisan === 1 ? `가죽 공방 가동! 가죽 제품을 팔아요` : `가죽 제품을 더 빨리 만들어요`, fisher: `낚시꾼 Lv${S.lv.fisher}: 생선 상자를 채웁니다`, fishClerk: `생선 점원 Lv${S.lv.fishClerk}: 손님 ${ST.clerkSlots[S.lv.fishClerk]}명 동시 응대`, helper2: `두 번째 나무꾼이 일을 시작합니다`, oven: `생선을 ${T.ovenTime[S.lv.oven]}초마다 굽고, 위에 ${ovenCap()}마리까지 올려요`, hunter2: `두 번째 사냥꾼이 사냥을 나갑니다` }[key];
  if (key !== 'fishing') toast(`${u.icon} ${u.name} 업그레이드! ${msg}`);
}

// ───────────────────────── fire, warmth, blizzard ─────────────────────────
function updateFire(dt) {
  const burn = (S.phase === 'storm' ? T.stormBurn : 1) * Math.min(T.burnMax, 1 + T.burnGrow * S.storms);
  decoFlames.forEach((f, i) => f.scale.setScalar(S.fuel > 0 ? .8 + Math.sin(performance.now() / 80 + i) * .25 : .01));
  if (S.fuel < 2 && S.wood > 0) { S.wood--; S.fuel += T.logFuel; }
  S.fuel = Math.max(0, S.fuel - dt * burn);
  const lit = S.fuel > 0;
  if (lit && S.meat > 0 && S.grillItems.length < T.max.grill && (S.cookT += dt) >= .6) {
    S.cookT = 0; S.meat--;
    S.grillItems.push({ type: 'steak', t: 0 });
    fly('meat', V(P.meatTile.x, .5, P.meatTile.z), V(P.grill.x, .3, P.grill.z), .3);
  }
  if (lit) for (let i = S.grillItems.length - 1; i >= 0; i--) {
    const it = S.grillItems[i]; it.t += dt;
    if (it.t < T.cook[it.type] + T.burn + 2.5) continue;
    S.grillItems.splice(i, 1);
    burst(P.grill.x, .5, P.grill.z, 0x555555, 6, { spd: 1, up: 2, grav: -2, life: 1, size: 1.4 }); play('burnt', 300);
    if (!(S.timers.burnToast > 0)) { toast('🔥 고기가 탔어요! 빨리 옮기세요'); S.timers.burnToast = 10; }
  }
  if (lit) S.warmth = Math.min(100, S.warmth + 8 * dt);
  else S.warmth = Math.max(0, S.warmth - (S.phase === 'storm' ? 7 : 1.2) * dt);
  if (S.phase === 'storm' && !lit) S.stormFireOut = true;
  const total = S.fuel + S.wood * T.logFuel;
  const f = lit ? .55 + .45 * Math.min(1, S.fuel / 4) : 0, now = performance.now();
  flameO.visible = flameI.visible = lit;
  flameO.scale.set(f * (1 + Math.sin(now / 70) * .08), f * (1 + Math.sin(now / 53) * .12), f);
  flameI.scale.set(f, f * (1 + Math.sin(now / 41) * .15), f);
  fireLight.intensity = lit ? 1 + Math.sin(now / 60) * .15 : 0;
  const secs = Math.ceil(total / burn);
  const key = lit ? 'L' + secs : 'off';
  if (key !== fireLabelKey) {
    fireLabelKey = key;
    fireLabel.draw((c, w, h) => bubble(c, w, h, lit ? `🔥 ${secs}초` : '🔥 꺼짐!', lit ? '#fff' : '#e5484d', lit ? '#13253d' : '#fff'));
  }
}
function updatePhase(dt) {
  S.phaseT -= dt;
  if (S.phaseT <= 0) {
    if (S.phase === 'calm') { S.phase = 'warn'; S.phaseT = T.warnTime; toast('⚠ 눈보라가 몰려옵니다! 장작을 채우세요'); play('warn'); }
    else if (S.phase === 'warn') { S.phase = 'storm'; S.phaseT = T.stormTime; S.storms++; S.stormFireOut = false; spawnRaid(); toast('🌨 눈보라! 곰들이 마을을 노립니다'); }
    else {
      S.phase = 'calm'; S.phaseT = T.calmTime;
      if (!S.stormFireOut) S.stat.held++;
      if (!S.stormFireOut) { const bonus = 30 + 20 * S.storms; S.coinPile += bonus; toast(`🔥 눈보라를 버텼다! 보너스 🪙${bonus}`); }
      else toast('불이 꺼져 보너스를 놓쳤어요');
    }
  }
  const target = S.phase === 'storm' ? 1 : S.phase === 'warn' ? .25 : 0;
  S.stormK += (target - S.stormK) * Math.min(1, dt * .9);
  const k = S.stormK;
  scene.background.copy(calmSky).lerp(stormSky, k);
  scene.fog.near = 40 - 26 * k; scene.fog.far = 90 - 54 * k;
  sun.intensity = .75 - .4 * k; hemi.intensity = .8 - .25 * k;
  frostEl.style.opacity = (k * .75).toFixed(2);
}

// snow particles
const SNOW = 2200;
const snowGeo = new THREE.BufferGeometry();
const snowPos = new Float32Array(SNOW * 3);
for (let i = 0; i < SNOW; i++) { snowPos[i * 3] = rand(-22, 22); snowPos[i * 3 + 1] = rand(0, 16); snowPos[i * 3 + 2] = rand(-22, 22); }
snowGeo.setAttribute('position', new THREE.BufferAttribute(snowPos, 3));
const snow = new THREE.Points(snowGeo, new THREE.PointsMaterial({ color: 0xffffff, size: .14, transparent: true, opacity: .9, depthWrite: false }));
scene.add(snow);
function updateSnow(dt) {
  const k = S.stormK, wind = .4 + 9 * k, fall = 1.2 + 5 * k;
  snowGeo.setDrawRange(0, Math.floor(500 + (SNOW - 500) * k));
  snow.material.size = .14 + .08 * k;
  for (let i = 0; i < SNOW; i++) {
    let x = snowPos[i * 3] + wind * dt, y = snowPos[i * 3 + 1] - fall * dt, z = snowPos[i * 3 + 2] + wind * .3 * dt;
    if (y < 0) y += 16; if (x > 22) x -= 44; if (z > 22) z -= 44;
    snowPos[i * 3] = x; snowPos[i * 3 + 1] = y; snowPos[i * 3 + 2] = z;
  }
  snowGeo.attributes.position.needsUpdate = true;
  if (SND.wind) SND.wind.gain.value = SND.on ? S.stormK * .22 : 0;
  snow.position.set(pl.x, 0, pl.z);
}

// ───────────────────────── tutorial + HUD ─────────────────────────
const arrow = new THREE.Mesh(new THREE.ConeGeometry(.35, .8, 4).rotateX(Math.PI), new THREE.MeshBasicMaterial({ color: 0xffc83d, depthTest: false }));
arrow.renderOrder = 12; scene.add(arrow);
const TUT = [
  { text: '🌲 왼쪽 숲으로 가서 나무에 붙어 서면 나무를 벱니다', at: () => V(-11.5, 0, -4), done: () => stack.filter(s => s.type === 'log').length >= 3 || S.woodIn > 0 },
  { text: '🔥 장작을 모닥불 왼쪽 칸에 내려놓으세요', at: () => P.woodTile, done: () => S.woodIn > 0 },
  { text: '🐻 정문 밖 곰 옆에 서면 자동으로 공격합니다. 고기를 얻으세요', at: () => V(0, 0, 8.5), done: () => stackHas('meat') || S.meatIn > 0 },
  { text: '🥩 고기를 모닥불 오른쪽 칸에 내려놓으세요', at: () => P.meatTile, done: () => S.meatIn > 0 },
  { text: '🍖 구운 고기를 집어서 카운터로 옮기세요', at: () => (stackHas('steak') ? P.counterStand : P.grill), done: () => S.steakIn > 0 },
  { text: '🪙 동전을 모아 바닥의 업그레이드 칸에 서세요', at: () => (S.coins > 0 ? pads[0] : P.coinPile), done: () => S.bought > 0 },
];
const $ = id => document.getElementById(id);
const coinsEl = $('coins'), stormEl = $('storm'), hpEl = $('hp'), warmEl = $('warm'), warmFill = $('warmFill'), objEl = $('obj'), bagEl = $('bag'), toastEl = $('toast'), frostEl = $('frost'), hurtEl = $('hurt'), goalEl = $('goal');
let toastT = 0;
function toast(msg) { toastEl.textContent = msg; toastEl.classList.add('show'); toastT = 2.6; }
const setText = (el, t) => { if (el.textContent !== t) el.textContent = t; };
function updateHud(dt) {
  if (toastT > 0 && (toastT -= dt) <= 0) toastEl.classList.remove('show');
  if (S.timers.eatToast) S.timers.eatToast -= dt;
  if (S.timers.burnToast) S.timers.burnToast -= dt;
  updateGoals();
  setText(coinsEl, `🪙 ${S.coins}`);
  setText(hpEl, `⚔${heroLv()} ` + (S.maxHp > 5 ? `♥ ${Math.max(0, S.hp)}/${S.maxHp}` : '♥'.repeat(clamp(S.hp, 0, 20)) + '♡'.repeat(clamp(S.maxHp - S.hp, 0, 20))));
  const t = Math.ceil(S.phaseT);
  stormEl.className = 'pill' + (S.phase === 'warn' ? ' warn' : S.phase === 'storm' ? ' on' : '');
  setText(stormEl, S.phase === 'calm' ? `❄ 다음 눈보라 ${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}` : S.phase === 'warn' ? `⚠ 눈보라 접근 ${t}` : `🌨 눈보라 ${t}초`);
  warmFill.style.width = S.warmth.toFixed(0) + '%';
  warmEl.classList.toggle('cold', S.warmth < 35);
  setText(bagEl, `🎒 ${stack.length} / ${bagCap()}`);
  while (TUT[S.tut] && TUT[S.tut].done()) S.tut++;
  const cur = TUT[S.tut];
  let obj = cur ? cur.text : '';
  if (!cur && S.phase === 'warn') obj = '⚠ 눈보라 중엔 불·화덕이 훨씬 빨리 탑니다(모닥불 3.5배). 장작을 채우세요!';
  if (!cur && S.phase === 'storm' && bears.some(b => b.raider)) obj = '🐻 마을에 들어온 곰을 쫓아내세요!';
  if (!cur && S.warmth < 35 && S.phase !== 'storm') obj = '🥶 마을이 얼고 있어요. 모닥불에 장작을!';
  const onPad = pads.find(p => p.on && !padHidden(p) && near(p, 1.0));
  if (onPad) obj = descOf(onPad.key) + (onPad.lock && S.lv[onPad.key] < UP[onPad.key].costs.length ? ' · 칸 밖으로 나갔다 오면 다음 레벨' : pl.moving ? ' · 멈춰 서면 구매' : '');
  setText(objEl, obj);
  arrow.visible = !!cur;
  if (cur) { const p = cur.at(); arrow.position.set(p.x, 3 + Math.sin(performance.now() / 200) * .3, p.z); }
}

const GOALS = [
  { text: '스테이크 3개 판매', cur: () => S.stat.sold, n: 3, reward: 30 },
  { text: '스테이크 10개 판매', cur: () => S.stat.sold, n: 10, reward: 50 },
  { text: '곰 5마리 사냥', cur: () => S.stat.kills, n: 5, reward: 60 },
  { text: '불을 지키며 눈보라 버티기', cur: () => S.stat.held, n: 1, reward: 80 },
  { text: '나무꾼 고용', cur: () => S.lv.helper, n: 1, reward: 60 },
  { text: '서빙 직원 고용', cur: () => S.lv.server, n: 1, reward: 100 },
  { text: '사냥꾼 고용', cur: () => S.lv.hunter, n: 1, reward: 120 },
  { text: '판매 점원 고용', cur: () => S.lv.clerk, n: 1, reward: 120 },
  { text: '늑대 5마리 사냥', cur: () => S.stat.wolves, n: 5, reward: 80 },
  { text: '2단계: 낚시터 해금', cur: () => S.stage >= 2 ? 1 : 0, n: 1, reward: 200 },
  { text: '낚시꾼 고용', cur: () => S.lv.fisher, n: 1, reward: 150 },
  { text: '생선 점원 고용', cur: () => S.lv.fishClerk, n: 1, reward: 150 },
  { text: '훈제 생선 15마리 판매', cur: () => S.stat.soldFish, n: 15, reward: 200 },
  { text: '숙련 사냥꾼 (Lv3)', cur: () => S.lv.hunter, n: 3, reward: 200 },
  { text: '가죽 장인 고용', cur: () => S.lv.artisan, n: 1, reward: 150 },
  { text: '가죽 제품 10개 판매', cur: () => S.stat.soldLeather, n: 10, reward: 300 },
  { text: '보스 곰 처치', cur: () => S.stat.boss, n: 1, reward: 400 },
  { text: '늑대 펫 Lv3 키우기', cur: () => (pets[0] ? pets[0].lv + 1 : 0), n: 3, reward: 300 },
  { text: '오두막 3채 짓기', cur: () => S.lv.cabin, n: 3, reward: 500 },
];
function updateGoals() {
  const g = GOALS[S.goal];
  if (g && S.started && g.cur() >= g.n) { S.coinPile += g.reward; toast(`🎯 목표 달성: ${g.text}! 🪙${g.reward}`); play('up'); buzz([30, 40, 30]); S.goal++; }
  const ng = GOALS[S.goal];
  setText(goalEl, `Day ${S.storms + 1} · ` + (ng ? `🎯 ${ng.text} ${Math.min(ng.cur(), ng.n)}/${ng.n}` : '🎉 모든 목표 달성!'));
}

// ───────────────────────── save ─────────────────────────
const SAVE_KEY = 'winter-rush-v1';
function save() {
  try {
    const counter = { ...S.counter };
    const keys = ['coins', 'coinPile', 'coinFish', 'coinLeather', 'tanWood', 'wood', 'meat', 'fuel', 'warmth', 'grillItems', 'lv', 'storms', 'stat', 'goal', 'tut', 'woodIn', 'meatIn', 'steakIn', 'served', 'bought', 'hide', 'fishCrate', 'fishRaw', 'ovenWood', 'fishSmoked', 'fishStock', 'smokeFuel', 'tanFuel', 'leather', 'stage', 'petCount', 'petHits', 'packs', 'tanT', 'hp', 'phase', 'phaseT', 'stormFireOut'];
    const data = Object.fromEntries(keys.map(k => [k, S[k]]));
    data.counter = counter; data.paid = pads.map(p => p.paid);
    data.player = { x: pl.x, z: pl.z };
    data.stackTypes = stack.map(i => i.type);
    data.raiders = bears.filter(b => b.raider || b.boss).map(b => ({ raider: b.raider, boss: b.boss, x: b.x, z: b.z, hp: b.hp }));
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  } catch (e) {}
}
function load() {
  let d = null;
  try { d = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null'); } catch (e) {}
  if (!d) return false;
  const { paid, lv, stat, counter, player: savedPlayer, stackTypes, raiders, ...rest } = d;
  Object.assign(S, rest); Object.assign(S.lv, lv || {}); Object.assign(S.stat, stat || {}); Object.assign(S.counter, counter || {});
  (paid || []).forEach((v, i) => { if (pads[i]) pads[i].paid = v; });
  for (let i = 0; i < val('helper'); i++) addHelper();
  for (let i = 0; i < val('server'); i++) addServer();
  for (let i = 0; i < val('hunter'); i++) addHunter();
  for (let i = 0; i < S.lv.cabin; i++) buildCabin(i);
  for (let i = 0; i < Math.min(1, S.petCount); i++) addPet();
  for (let i = 0; i < val('fisher'); i++) addFisher();
  if (S.lv.artisan) addArtisan();
  syncClerks(); applyGear();
  S.grillItems = S.grillItems.filter(it => it.type === 'steak');
  if (savedPlayer) { pl.x = clamp(savedPlayer.x, BOUNDS.x1, BOUNDS.x2); pl.z = clamp(savedPlayer.z, BOUNDS.z1, BOUNDS.z2); player.g.position.set(pl.x, 0, pl.z); }
  for (const type of stackTypes || []) if (GEO[type]) stackAdd(type);
  for (const saved of raiders || []) {
    const b = makeBear(saved.raider, saved.boss);
    b.x = saved.x; b.z = saved.z; b.hp = saved.hp;
    bears.push(b);
  }
  S.maxHp = val('cape'); S.hp = Math.min(S.hp, S.maxHp);
  if (S.lv.fishing) S.stage = 2;
  drawGateSpikes(); applyStage(false); pads.forEach(drawPad);
  return true;
}

// ───────────────────────── loop ─────────────────────────
let shake = 0, shakeAmp = 0, last = performance.now();
function shakeK(a) { shake = .25; shakeAmp = Math.max(shakeAmp, a); }
const camOff = V(0, 20, 14);
function frame(now) {
  const dt = Math.min(.05, (now - last) / 1000); last = now;
  let g = dt;
  if (S.hitstop > 0) { S.hitstop -= dt; g = dt * .08; }
  if (S.started) {
    updatePhase(g); updatePlayer(g); updateFire(g); updateBears(g);
    updateCustomers(g); updateHelpers(g); updateServers(g); updateHunters(g); updateShots(g); updatePets(g); updateTannery(g); updateFishers(g); updateOven(g);
  }
  updateTrees(g); updateFlyers(g); updateParts(g); updatePops(dt); updateShock(dt); updateCabins(dt); updateSnow(dt); updateHud(dt);
  woodPile.set(S.wood); meatPile.set(S.meat); renderGrill();
  counterPile.set(S.counter.steak);
  COIN_PILES.forEach(c => { c.v.g.visible = c.show(); c.v.set(Math.min(72, Math.ceil(S[c.key] / 5))); });
  updatePads(dt);
  woodTile.setFull(S.wood > 0); meatTile.setFull(S.meat > 0);
  const off = camOff.clone().multiplyScalar(camera.aspect < 1 ? 1 : .85);
  const want = V(pl.x, 0, pl.z).add(off);
  camera.position.lerp(want, Math.min(1, dt * 6));
  if (shake > 0) { shake -= dt; const a = shakeAmp * Math.max(0, shake / .25); camera.position.x += rand(-a, a); camera.position.y += rand(-a, a); } else shakeAmp = 0;
  camera.lookAt(camera.position.x, 0, camera.position.z - off.z);
  sun.position.set(pl.x + 8, 20, pl.z + 10); sun.target.position.set(pl.x, 0, pl.z);
  renderer.render(scene, camera);
  requestAnimationFrame(frame);
}
camera.position.set(0, 20, 14);
requestAnimationFrame(frame);

if (load()) { $('go').textContent = '이어하기'; $('reset').hidden = false; }
$('reset').addEventListener('click', () => { try { localStorage.removeItem(SAVE_KEY); } catch (e) {} location.reload(); });
$('go').addEventListener('click', () => {
  $('start').hidden = true; S.started = true; pl.stunFree = true;
  audioInit(); setInterval(save, 4000);
});
addEventListener('pagehide', () => { if (S.started) save(); });
document.addEventListener('visibilitychange', () => { if (document.hidden && S.started) save(); });
$('snd').addEventListener('click', e => { SND.on = !SND.on; e.currentTarget.classList.toggle('off', !SND.on); });
$('vib').addEventListener('click', e => { SND.vib = !SND.vib; e.currentTarget.classList.toggle('off', !SND.vib); buzz(30); });
// every fixed object on the ground as an axis-aligned box [name, x1, x2, z1, z2] for overlap checks
function footprints() {
  const box = (n, x, z, w, d) => [n, x - w / 2, x + w / 2, z - d / 2, z + d / 2];
  const two = S.stage >= 2, f = [];
  const stage2Only = ['fisher', 'artisan', 'fishClerk', 'helper2', 'hunter2', 'oven'];
  pads.forEach(p => { if (S.lv[p.key] < UP[p.key].costs.length && (two || !stage2Only.includes(p.key))) f.push(box('pad:' + p.key, p.x, p.z, 1.9, 1.9)); });
  f.push(box('woodTile', P.woodTile.x, P.woodTile.z, 1.9, 1.9), box('meatTile', P.meatTile.x, P.meatTile.z, 1.9, 1.9));
  f.push(box('fire', P.fire.x, P.fire.z, two ? 2.6 : 2.2, two ? 2.6 : 2.2), ['grill', grillBox.x1, grillBox.x2, grillBox.z1, grillBox.z2], ['counter', counterBox.x1, counterBox.x2, counterBox.z1, counterBox.z2]);
  f.push(box('counterStand', P.counterStand.x, P.counterStand.z, 1.2, 1.2), box('coinPile', P.coinPile.x, P.coinPile.z, 1.3, 1.3));
  if (S.lv.clerk) f.push(box('clerk', 6.6, -8.7, .8, .8));
  if (two) f.push(box('fishClerk', 9.6, -8.8, .8, .8), box('artisanSpot', TAN.home.x, TAN.home.z, .8, .8));
  if (two) {
    f.push(box('fishShop', P.fishShop.x, P.fishShop.z, 2.6, 1.1), box('oven', P.oven.x, P.oven.z - .3, 1.4, 1.85), box('ovenWood', P.ovenWood.x, P.ovenWood.z, 1.9, 1.9), box('fishCrate', P.fishCrate.x, P.fishCrate.z, 1.9, 1.9));
    f.push(box('tanWood', P.tanWood.x, P.tanWood.z, 1.9, 1.9), box('tanCoin', P.tanCoin.x, P.tanCoin.z, 1.3, 1.3), box('fishCoin', P.fishCoin.x, P.fishCoin.z, 1.3, 1.3));
    f.push(box('tanFire', TAN.fire.x, TAN.fire.z, .9, .9), box('pond', 12.5, .6, 4.8, 4.8), box('tanIn', TAN.in.x, TAN.in.z, 1.9, 1.9), box('leatherShop', TAN.out.x, TAN.out.z, 1.1, 2.6));
  }
  return f;
}
window.__winter = { bearHurt, spawnBeast, dropPickup, pickups, footprints, spawnPup, addPet, spawnPack, applyPetLook, pups, stackAdd, pets, fishers, SHOPS, P, S, pl, stack, bears, trees, customers, pads, helpers, servers, hunters, camera, T, save, levelUp };
})();
