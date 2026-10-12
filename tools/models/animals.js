// Animals and pets. Same footprint as the old box animals so hit ranges and the code-made extras
// (boss crowns, pet scarves, alpha collars) still sit in the right place. Facing +z, ground at y=0.
// "tint" parts are white/grey and take the animal's fur color in the game; everything else keeps its own color.
function animalKit(THREE, name) {
  const k = modelKit(THREE, name), { M, add, sph } = k;
  k.T = M('tint', 0xffffff); k.T2 = M('tintShade', 0xd2d2d2); k.T3 = M('tintDark', 0x8c8c8c);
  // round eyes with a shine; mean = small amber eyes, cute = big black eyes
  k.eyes = (x, y, z, r, color = 0x1f1a24, shine = true) => {
    for (const s of [-1, 1]) {
      add('eye', sph(r, 6, 4), M('eye' + color, color), s * x, y, z, { s: [1, 1, .6] });
      if (shine) add('eyeShine', sph(r * .35, 4, 2), M('shine', 0xffffff), s * x - r * .3, y + r * .35, z + r * .45);
    }
  };
  k.cyl = (r1, r2, h, n = 6) => new THREE.CylinderGeometry(r1, r2, h, n);
  return k;
}

// polar bear: chubby round body and belly, puffy cheeks, stubby legs, fluffy ruff and tufts, little claws
function buildBear(THREE) {
  const { root, M, add, sph, T, T2, eyes, cyl } = animalKit(THREE, 'bear');
  const cream = M('tintCream', 0xf3ecdc), claw = M('claw', 0x5a5560);
  add('body', sph(1, 11, 7), T, 0, 1.0, 0, { s: [.7, .6, .98] });
  add('belly', sph(.55, 8, 5), cream, 0, .8, .25, { s: [1, .82, 1.25] });
  for (const s of [-1, 1]) {
    add('haunch', sph(.38, 7, 5), T, s * .36, .86, -.5);
    add('shoulder', sph(.34, 7, 5), T, s * .38, .96, .52);
  }
  // fluffy back: soft bumps down the spine, a ruff of tufts around the neck
  for (let i = 0; i < 4; i++) add('backFluff', sph(.22, 5, 3), i % 2 ? T2 : T, 0, 1.5 - Math.abs(i - 1.5) * .03, .45 - i * .32, { s: [1.15, .7, 1.1] });
  for (let i = 0; i < 8; i++) {
    const a = i / 8 * Math.PI * 2, x = Math.cos(a) * .42, y = 1.3 + Math.sin(a) * .36;
    add('ruff', new THREE.ConeGeometry(.09, .22, 4), i % 2 ? cream : T, x, y, .72, { r: [0, 0, a - Math.PI / 2] });
  }
  add('head', sph(.44, 10, 7), T, 0, 1.43, 1.02, { s: [1.05, .95, .95] });
  for (let i = -1; i <= 1; i++) add('headTuft', new THREE.ConeGeometry(.06, .17, 4), T, i * .09, 1.86, .98 - Math.abs(i) * .04, { r: [-.3, 0, -i * .4] });
  add('muzzle', sph(.21, 8, 5), cream, 0, 1.28, 1.4, { s: [1.1, .8, 1.1] });
  add('tail', sph(.15, 6, 4), T, 0, 1.12, -.95);
  for (let i = 0; i < 3; i++) add('tailTuft', new THREE.ConeGeometry(.06, .14, 4), T, (i - 1) * .07, 1.2, -1.06, { r: [-1.2, 0, (i - 1) * .5] });
  for (const s of [-1, 1]) {
    add('cheek', sph(.18, 6, 4), T, s * .25, 1.3, 1.2, { s: [1, .85, .8] });
    add('blush', sph(.06, 5, 3), M('blush', 0xf4a9a9), s * .27, 1.32, 1.34, { s: [1, .7, .4] });
    add('ear', sph(.13, 6, 4), T, s * .29, 1.78, .98, { s: [1, 1, .6] });
    add('earIn', sph(.07, 5, 3), M('pink', 0xf2a7a7), s * .29, 1.78, 1.04, { s: [1, 1, .4] });
    for (const f of [-1, 1]) {
      add('leg', new THREE.CylinderGeometry(.22, .25, .5, 8, 1, true), T, s * .38, .32, f * .55);
      add('paw', sph(.24, 6, 4), cream, s * .38, .09, f * .55 + .05, { s: [1, .55, 1.2] });
      if (f > 0) for (let c = -1; c <= 1; c++) add('claw', sph(.035, 4, 2), claw, s * .38 + c * .08, .06, f * .55 + .31);
    }
  }
  add('nose', sph(.08, 6, 4), M('nose', 0x1f1a24), 0, 1.35, 1.64, { s: [1.3, .9, 1] });
  add('mouth', new THREE.TorusGeometry(.04, .012, 3, 5, Math.PI), M('mouth', 0x3a2a30), 0, 1.22, 1.6, { r: [0, 0, Math.PI] });
  eyes(.16, 1.51, 1.39, .06);   // ~1,500 triangles in all
  return root;
}

// a fan of fur tufts: n cones spread around a ring (centre x,y,z, radius r) facing outward in the x/y plane
function tuftRing(k, name, m, n, x, y, z, r, size, from = 0, to = Math.PI * 2, tilt = 0) {
  for (let i = 0; i < n; i++) {
    const a = from + (to - from) * (n === 1 ? .5 : i / (to - from >= 6.28 ? n : n - 1));
    k.add(name, new k.THREE.ConeGeometry(size * .45, size, 4), Array.isArray(m) ? m[i % m.length] : m, x + Math.cos(a) * r, y + Math.sin(a) * r, z, { r: [tilt, 0, a - Math.PI / 2] });
  }
}

// wolf (hostile: lean, mane, soft brows, little fangs) and wolf pup (pet: big round head, fluffy, friendly)
function buildWolf(THREE, pup) {
  const k = animalKit(THREE, pup ? 'wolf_pup' : 'wolf'), { root, M, add, sph, T, T2, T3, eyes, cyl } = k; k.THREE = THREE;
  const cream = M('tintCream', 0xf3efe6), H = pup ? 1.18 : 1;
  add('body', sph(1, 10, 6), T, 0, .74, -.02, { s: [pup ? .34 : .3, pup ? .31 : .28, pup ? .55 : .62] });
  add('saddle', sph(1, 7, 4), T3, 0, .88, -.12, { s: [.22, .12, .42] });
  add('haunch', sph(.2, 6, 4), T, .16, .7, -.36); add('haunch', sph(.2, 6, 4), T, -.16, .7, -.36);
  add('chest', sph(.25, 7, 5), cream, 0, .76, .42, { s: [1, 1.15, .8] });
  tuftRing(k, 'chestTuft', cream, 5, 0, .66, .52, .1, .16, Math.PI * 1.15, Math.PI * 1.85, .4);   // fluffy bib
  tuftRing(k, 'mane', [T, T2], pup ? 7 : 9, 0, .95, .5, pup ? .24 : .27, pup ? .16 : .22, Math.PI * .05, Math.PI * .95);
  add('head', sph(.25, 9, 7), T, 0, 1.0, .7, { s: [H, H * .95, H * .95] });
  add('snout', sph(.14, 7, 4), cream, 0, .92, pup ? .94 : 1.0, { s: [.9, .72, pup ? 1.0 : 1.5] });
  add('nose', sph(.05, 5, 3), M('nose', 0x1f1a24), 0, .97, pup ? 1.08 : 1.2);
  for (const s of [-1, 1]) {
    add('cheekFluff', new THREE.ConeGeometry(.07, .16, 4), cream, s * .24 * H, .92, .7, { r: [0, 0, s * 1.9] });
    add('ear', new THREE.ConeGeometry(.095, pup ? .2 : .26, 4), T, s * .14 * H, 1.25 * (pup ? 1.03 : 1), .64, { r: [0, 0, s * (pup ? -.45 : -.2)] });
    add('earIn', new THREE.ConeGeometry(.05, .14, 4), M('pink', 0xf2a7a7), s * .14 * H, 1.23 * (pup ? 1.03 : 1), .67, { r: [0, 0, s * (pup ? -.45 : -.2)] });
    for (const f of [-1, 1]) {
      add('leg', cyl(.065, .08, .5, 6), T, s * .18, .26, f * .38);
      add('paw', sph(.085, 6, 3), cream, s * .18, .04, f * .38 + .03, { s: [1, .6, 1.25] });
    }
  }
  // big bushy tail: three puffs rising behind, cream tip
  [[.88, -.62, .1], [.98, -.8, .095], [1.08, -.95, .08]].forEach(([y, z, r], i) => add('tail', sph(r * (pup ? 1.15 : 1.25), 6, 4), i % 2 ? T2 : T, 0, y, z, { s: [1, 1, 1.4] }));
  add('tailTip', sph(.075, 5, 3), cream, 0, 1.16, -1.06);
  if (pup) {
    eyes(.105, 1.06, .9, .065);
    for (const s of [-1, 1]) add('blush', sph(.04, 5, 3), M('blush', 0xf4a9a9), s * .17, .96, .9, { s: [1, .6, .4] });
    add('tongue', sph(.05, 5, 3), M('tongue', 0xf07a8a), 0, .83, 1.0, { s: [1, .5, 1.2] });
  } else {
    eyes(.11, 1.05, .91, .058, 0x2a2230);
    for (const s of [-1, 1]) {
      add('brow', new THREE.BoxGeometry(.08, .025, .03), T3, s * .11, 1.13, .9, { r: [0, 0, s * .2] });
      add('blush', sph(.035, 5, 3), M('blush', 0xf4a9a9), s * .17, .96, .9, { s: [1, .6, .4] });
      add('fang', new THREE.ConeGeometry(.018, .07, 4), M('fang', 0xfdfaf2), s * .05, .83, 1.1, { r: [Math.PI, 0, 0] });
    }
  }
  return root;
}

// sabre-tooth cat: muscular shoulders, chevron stripes, cheek ruff, short bobbed tail, long curved fangs
function buildSaber(THREE) {
  const k = animalKit(THREE, 'saber'), { root, M, add, sph, T, T2, T3, eyes, cyl } = k; k.THREE = THREE;
  const cream = M('tintCream', 0xf6efe0), fangM = M('fang', 0xfdfaf2);
  add('body', sph(1, 10, 6), T, 0, .98, -.05, { s: [.4, .36, .74] });
  add('belly', sph(.3, 7, 4), cream, 0, .74, .1, { s: [1.05, .6, 1.9] });
  for (const s of [-1, 1]) {
    add('shoulder', sph(.26, 7, 5), T, s * .2, 1.06, .42);
    add('haunch', sph(.26, 7, 5), T, s * .2, .96, -.5);
  }
  for (let i = 0; i < 4; i++) for (const s of [-1, 1])   // chevron stripes over the back
    add('stripe', new THREE.BoxGeometry(.32, .04, .07), T3, s * .14, 1.3 - Math.abs(i - 1.5) * .02, .4 - i * .3, { r: [0, s * .5, s * -.45] });
  add('head', sph(.3, 9, 6), T, 0, 1.19, .95, { s: [1.08, .92, 1] });
  tuftRing(k, 'ruff', [T, cream], 8, 0, 1.12, .82, .3, .2, Math.PI * -.15, Math.PI * 1.15);
  add('muzzle', sph(.16, 7, 4), cream, 0, 1.05, 1.2, { s: [1.25, .8, .9] });
  add('nose', sph(.05, 5, 3), M('nose', 0x5a2a2a), 0, 1.13, 1.33, { s: [1.3, .8, 1] });
  add('tail', cyl(.07, .05, .32, 5), T, 0, 1.12, -.86, { r: [-.9, 0, 0] });
  add('tailTip', sph(.07, 5, 3), T3, 0, 1.24, -1.0);
  for (const s of [-1, 1]) {
    add('ear', new THREE.ConeGeometry(.1, .17, 4), T, s * .2, 1.44, .9, { r: [0, 0, s * -.25] });
    add('earTip', new THREE.ConeGeometry(.05, .08, 4), T3, s * .23, 1.53, .9, { r: [0, 0, s * -.25] });
    add('whiskerPad', sph(.07, 5, 3), cream, s * .07, 1.02, 1.3);
    add('fang', new THREE.ConeGeometry(.045, .24, 5), fangM, s * .09, .9, 1.3, { r: [Math.PI + .1, 0, 0] });
    add('fangTip', new THREE.ConeGeometry(.03, .16, 5), fangM, s * .09, .73, 1.36, { r: [Math.PI + .45, 0, 0] });
    add('blush', sph(.045, 5, 3), M('blush', 0xf4a9a9), s * .2, 1.12, 1.17, { s: [1, .6, .4] });
    for (const f of [-1, 1]) {
      add('leg', cyl(.1, .13, .66, 6), T, s * .25, .35, f * .5);
      add('paw', sph(.14, 6, 3), cream, s * .25, .05, f * .5 + .05, { s: [1, .55, 1.2] });
    }
  }
  eyes(.13, 1.25, 1.18, .07, 0x2a2230);
  return root;
}

// mammoth: shaggy layered coat, domed head with a hair tuft, small ears, long curling tusks, leg fur skirts
function buildMammoth(THREE) {
  const k = animalKit(THREE, 'mammoth'), { root, M, add, sph, T, T2, T3, eyes, cyl } = k; k.THREE = THREE;
  const ivory = M('ivory', 0xf4efe2), nail = M('nail', 0xe9dcc4);
  add('body', sph(1, 10, 6), T, 0, 1.8, 0, { s: [1.0, .88, 1.38] });
  add('hump', sph(.62, 7, 4), T, 0, 2.6, .45, { s: [1, .7, 1] });
  add('head', sph(.68, 9, 6), T, 0, 2.18, 1.55, { s: [1, 1.05, 1] });
  add('dome', sph(.38, 6, 4), T2, 0, 2.78, 1.5);
  tuftRing(k, 'hairTuft', [T3, T2], 5, 0, 2.95, 1.45, .12, .3, Math.PI * .2, Math.PI * .8);
  tuftRing(k, 'shag', [T3, T2, T], 14, 0, 1.5, -.1, 1.0, .55, Math.PI * 1.08, Math.PI * 1.92, 0);   // long shag hanging off the sides
  for (let i = 0; i < 5; i++) add('shagBack', new THREE.ConeGeometry(.24, .6, 4), i % 2 ? T3 : T2, (i - 2) * .4, 1.2, -.9, { r: [Math.PI, 0, 0] });
  // trunk: five segments curling down and forward, a little finger at the tip
  [[0, 1.85, 2.1, .2, .1], [0, 1.45, 2.3, .17, .25], [0, 1.08, 2.38, .14, .05], [0, .76, 2.3, .12, -.35], [0, .58, 2.12, .1, -.9]]
    .forEach(([x, y, z, r, tilt]) => add('trunk', cyl(r * .85, r, .42, 5), T, x, y, z, { r: [tilt, 0, 0] }));
  add('trunkTip', sph(.09, 5, 3), T2, 0, .5, 1.98);
  for (const s of [-1, 1]) {
    add('ear', sph(.26, 6, 4), T3, s * .66, 2.25, 1.25, { s: [.3, 1, .85] });
    // long tusk: five segments sweeping down, forward and back up
    [[1.5, 2.05, 2.6], [1.3, 2.3, 2.0], [1.2, 2.6, 1.55], [1.25, 2.92, .95], [1.42, 3.12, .35]]
      .forEach(([y, z, th], i) => add('tusk', cyl(.06 - i * .006, .08 - i * .006, .38, 5), ivory, s * (.36 + i * .04), y, z, { r: [th, 0, 0] }));
    for (const f of [-1, 1]) {
      add('leg', cyl(.32, .35, 1.15, 7), T, s * .6, .6, f * .85);
      for (let i = 0; i < 4; i++) { const a = i / 4 * Math.PI * 2 + .4; add('legFur', new THREE.ConeGeometry(.16, .4, 4), i % 2 ? T3 : T2, s * .6 + Math.cos(a) * .3, .72, f * .85 + Math.sin(a) * .3, { r: [Math.PI + Math.sin(a) * .3, 0, -Math.cos(a) * .3] }); }
      add('foot', cyl(.37, .37, .12, 7), M('toe', 0x4a3424), s * .6, .06, f * .85);
      for (let t = -1; t <= 1; t++) add('toenail', sph(.07, 4, 2), nail, s * .6 + t * .16, .1, f * .85 + .33, { s: [1, .7, .6] });
    }
  }
  eyes(.34, 2.38, 2.05, .1);
  for (const s of [-1, 1]) add('blush', sph(.09, 5, 3), M('blush', 0xf4a9a9), s * .48, 2.18, 1.95, { s: [1, .6, .4] });
  return root;
}

// rockhopper-style penguin: chubby, spiky yellow crest, big shiny eyes, rosy cheeks, white belly
function buildPenguin(THREE) {
  const k = animalKit(THREE, 'penguin'), { root, M, add, sph, T, eyes } = k; k.THREE = THREE;
  const white = M('white', 0xf6f8fb), orange = M('orange', 0xffa030), crest = M('crest', 0xffd23a);
  add('body', sph(.42, 10, 7), T, 0, .5, 0, { s: [.9, 1.1, .85] });
  add('belly', sph(.34, 9, 6), white, 0, .46, .1, { s: [.9, 1.08, .8] });
  add('head', sph(.28, 9, 6), T, 0, .98, .02);
  add('face', sph(.2, 7, 5), white, 0, .95, .13, { s: [1.05, .9, .7] });
  add('beak', new THREE.ConeGeometry(.08, .18, 5), orange, 0, .96, .32, { r: [Math.PI / 2, 0, 0] });
  add('beakLow', new THREE.ConeGeometry(.06, .13, 5), M('orangeDark', 0xe07a20), 0, .9, .3, { r: [Math.PI / 2 + .2, 0, 0] });
  add('tail', new THREE.ConeGeometry(.12, .2, 4), T, 0, .14, -.32, { r: [-2.2, 0, 0] });
  for (const s of [-1, 1]) {
    add('flipper', sph(.22, 6, 4), T, s * .38, .56, 0, { s: [.22, 1, .5], r: [0, 0, s * .45] });
    add('foot', sph(.1, 5, 3), orange, s * .13, .04, .14, { s: [1.1, .4, 1.6] });
    for (let t = -1; t <= 1; t++) add('toe', new THREE.ConeGeometry(.025, .08, 3), orange, s * .13 + t * .05, .03, .28, { r: [Math.PI / 2, 0, 0] });
    add('blush', sph(.04, 5, 3), M('blush', 0xf4a9a9), s * .14, .94, .25, { s: [1, .6, .4] });
    tuftRing(k, 'crest', crest, 3, s * .14, 1.1, .1, .03, .2, s > 0 ? -.3 : Math.PI - .5, s > 0 ? .5 : Math.PI + .3, .2);
  }
  eyes(.085, 1.03, .25, .058);
  return root;
}

// seal (hostile in the sea and the pet seal): chubby harp-seal pup look, cheek puffs, lots of whiskers, spots
function buildSeal(THREE) {
  const k = animalKit(THREE, 'seal'), { root, M, add, sph, T, T2, T3, eyes } = k; k.THREE = THREE;
  add('body', sph(.5, 11, 7), T, 0, .36, 0, { s: [1.05, .75, 1.75] });
  add('belly', sph(.42, 8, 5), T2, 0, .25, .15, { s: [1, .5, 1.6] });
  add('neck', sph(.38, 8, 5), T, 0, .5, .55);
  add('head', sph(.33, 10, 7), T, 0, .6, .82, { s: [1.05, .95, 1] });
  for (const s of [-1, 1]) add('cheek', sph(.12, 6, 4), T2, s * .09, .5, 1.08, { s: [1, .8, .8] });
  add('nose', sph(.045, 5, 3), M('nose', 0x1f1a24), 0, .57, 1.17, { s: [1.3, .8, 1] });
  add('mouth', new THREE.TorusGeometry(.025, .008, 3, 4, Math.PI), M('mouth', 0x3a2a30), 0, .45, 1.15, { r: [0, 0, Math.PI] });
  [[.3, -.2], [-.25, .1], [.15, .3], [-.35, -.45], [.05, -.6], [-.1, .45]].forEach(([x, z], i) => add('spot', sph(.06 + (i % 2) * .02, 4, 2), T3, x, .62 - Math.abs(z) * .1, z, { s: [1, .3, 1] }));
  for (const s of [-1, 1]) {
    add('flipper', sph(.22, 6, 3), T, s * .44, .14, .35, { s: [1, .2, .55], r: [0, s * .4, -s * .3] });
    for (let c = 0; c < 3; c++) add('claw', sph(.02, 3, 2), M('claw', 0x3a3a44), s * (.52 + c * .04), .16, .52 - c * .03);
    add('tailFin', sph(.2, 6, 3), T, s * .15, .2, -.92, { s: [.6, .2, 1], r: [0, s * .5, 0] });
    for (const d of [-.04, 0, .04]) add('whisker', new THREE.BoxGeometry(.2, .008, .008), M('whisker', 0xf6f8fb), s * .2, .5 + d, 1.1, { r: [0, s * -.25, s * d * 4] });
    add('blush', sph(.05, 5, 3), M('blush', 0xf4a9a9), s * .2, .55, 1.04, { s: [1, .6, .4] });
  }
  eyes(.12, .64, 1.06, .065);
  return root;
}

// walrus boss: wrinkly chubby body, big whiskered muzzle pads, long tusks, jewelled crown
function buildWalrus(THREE) {
  const k = animalKit(THREE, 'walrus'), { root, M, add, sph, T, T2, T3, eyes } = k; k.THREE = THREE;
  const gold = M('gold', 0xffc83d), dot = M('bristle', 0x5a3a28);
  add('body', sph(1, 11, 7), T, 0, .9, 0, { s: [1.2, .9, 1.6] });
  add('belly', sph(.9, 8, 5), T2, 0, .55, .3, { s: [1.1, .6, 1.4] });
  for (let i = 0; i < 4; i++) add('fold', new THREE.TorusGeometry(.95 - Math.abs(i - 1.5) * .05, .05, 3, 12), T3, 0, .9, .6 - i * .42, { s: [1.18, .88, 1] });
  add('neck', sph(.75, 9, 6), T, 0, 1.05, 1.0);
  add('head', sph(.6, 10, 7), T, 0, 1.25, 1.4);
  for (const s of [-1, 1]) {
    add('pad', sph(.26, 7, 5), T2, s * .18, 1.02, 1.86, { s: [1, .85, .8] });
    for (let i = 0; i < 6; i++) add('bristle', sph(.022, 3, 2), dot, s * (.1 + (i % 3) * .1), 1.08 - Math.floor(i / 3) * .1, 2.04 - (i % 3) * .03);
    add('tusk', new THREE.ConeGeometry(.085, .95, 6), M('ivory', 0xf4efe2), s * .2, .64, 1.88, { r: [Math.PI - .15, 0, 0] });
    add('flipper', sph(.42, 7, 3), T, s * 1.05, .2, .6, { s: [1, .2, .6], r: [0, s * .5, 0] });
    add('tailFin', sph(.36, 6, 3), T, s * .3, .2, -1.55, { s: [.6, .2, 1], r: [0, s * .5, 0] });
    add('blush', sph(.08, 5, 3), M('blush', 0xf4a9a9), s * .38, 1.25, 1.82, { s: [1, .6, .4] });
  }
  add('nose', sph(.08, 5, 3), M('nose', 0x1f1a24), 0, 1.22, 1.98, { s: [1.4, .8, 1] });
  add('crown', new THREE.CylinderGeometry(.3, .26, .18, 6, 1, true), gold, 0, 1.85, 1.3);
  for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; add('crownTip', new THREE.ConeGeometry(.06, .16, 4), gold, Math.cos(a) * .28, 2.02, 1.3 + Math.sin(a) * .28); }
  [[0, 0xe5484d], [Math.PI / 2, 0x3a9ad9], [-Math.PI / 2, 0x5fd38a]].forEach(([a, c]) => add('jewel', sph(.04, 4, 2), M('jewel' + c, c), Math.sin(a) * .29, 1.85, 1.3 + Math.cos(a) * .29));
  eyes(.24, 1.47, 1.9, .09);
  return root;
}

// orca: sleek body, white chin-to-belly, white eye patches, grey saddle, curved dorsal fin, proper flukes
function buildOrca(THREE) {
  const k = animalKit(THREE, 'orca'), { root, M, add, sph, T, T2, eyes } = k; k.THREE = THREE;
  const white = M('white', 0xf6f8fb);
  add('body', sph(.9, 13, 8), T, 0, .25, 0, { s: [1, .62, 2.6] });
  add('tailStock', sph(.4, 8, 5), T, 0, .25, -1.95, { s: [.7, .7, 1.6] });
  add('belly', sph(.6, 9, 5), white, 0, .03, .5, { s: [1.05, .42, 2.3] });
  add('chin', sph(.35, 7, 4), white, 0, .06, 1.75, { s: [1.2, .5, 1] });
  add('saddle', sph(.4, 7, 4), T2, 0, .72, -.7, { s: [1.2, .3, 1] });
  add('fin', new THREE.ConeGeometry(.3, 1.3, 5), T, 0, .98, -.35, { s: [.3, 1, 1], r: [-.35, 0, 0] });
  add('mouth', new THREE.BoxGeometry(1.0, .02, .02), M('mouthLine', 0x2a2a30), 0, .12, 1.85, { r: [0, 0, 0] });
  for (const s of [-1, 1]) {
    add('patch', sph(.2, 7, 4), white, s * .5, .4, 1.25, { s: [.35, .6, 1.5], r: [0, s * .25, 0] });
    add('flipper', sph(.38, 7, 3), T, s * .85, -.08, .8, { s: [1, .15, .5], r: [0, s * .7, -s * .3] });
    add('fluke', sph(.55, 7, 3), T, s * .5, .25, -2.65, { s: [1, .12, .45], r: [0, s * -.5, 0] });
  }
  eyes(.42, .32, 1.55, .07);
  for (const s of [-1, 1]) add('blush', sph(.08, 5, 3), M('blush', 0xf4a9a9), s * .5, .18, 1.6, { s: [.4, .6, 1] });
  return root;
}
if (typeof module !== 'undefined') module.exports = { buildBear, buildWolf, buildSaber, buildMammoth, buildPenguin, buildSeal, buildWalrus, buildOrca };
