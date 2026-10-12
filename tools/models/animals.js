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

// wolf (hostile: amber eyes, ruff) and wolf pup (pet: big friendly eyes, pink tongue)
function buildWolf(THREE, pup) {
  const { root, M, add, sph, T, T3, eyes, cyl } = animalKit(THREE, pup ? 'wolf_pup' : 'wolf');
  const cream = M('cream', 0xe8e4dc);
  add('body', sph(1, 9, 6), T, 0, .74, -.02, { s: [.3, .28, .6] });
  add('back', sph(1, 7, 4), T3, 0, .86, -.1, { s: [.2, .14, .45] });
  add('chest', sph(.26, 7, 5), cream, 0, .78, .42, { s: [1, 1.1, .8] });
  add('head', sph(.25, 8, 6), T, 0, 1.0, .7, pup ? { s: [1.12, 1.05, 1] } : {});
  add('snout', sph(.14, 6, 4), cream, 0, .92, .98, { s: [.95, .75, 1.3] });
  add('nose', sph(.05, 5, 3), M('nose', 0x1f1a24), 0, .96, 1.16);
  add('tail', new THREE.ConeGeometry(.1, .55, 6), T, 0, .9, -.72, { r: [-2.1, 0, 0] });
  add('tailTip', sph(.07, 5, 3), cream, 0, 1.08, -.93);
  for (const s of [-1, 1]) {
    add('ear', new THREE.ConeGeometry(.09, .24, 4), T, s * .14, 1.27, .66, { r: [0, 0, s * -.2] });
    add('earIn', new THREE.ConeGeometry(.05, .14, 4), M('pink', 0xf2a7a7), s * .14, 1.25, .69, { r: [0, 0, s * -.2] });
    for (const f of [-1, 1]) {
      add('leg', cyl(.07, .075, .5, 5), T, s * .18, .26, f * .38);
      add('paw', sph(.08, 5, 3), cream, s * .18, .04, f * .38 + .03, { s: [1, .6, 1.2] });
    }
  }
  if (pup) {
    eyes(.1, 1.05, .9, .06);
    add('tongue', sph(.05, 5, 3), M('tongue', 0xf07a8a), 0, .84, 1.05, { s: [1, .5, 1.2] });
  } else {
    eyes(.11, 1.04, .91, .045, 0xffc83d, false);
    add('ruff', new THREE.TorusGeometry(.22, .07, 3, 8), T, 0, .92, .52, { r: [Math.PI / 2 - .3, 0, 0] });
  }
  return root;
}

// sabre-tooth cat: stripes take the fur color (darker), long white fangs
function buildSaber(THREE) {
  const { root, M, add, sph, T, T2, T3, eyes, cyl } = animalKit(THREE, 'saber');
  add('body', sph(1, 9, 6), T, 0, .98, 0, { s: [.4, .36, .78] });
  for (const z of [-.42, 0, .42]) add('stripe', new THREE.TorusGeometry(.36, .045, 3, 8), T3, 0, .98, z, { s: [1.05, 1, 1] });
  add('belly', sph(.3, 7, 4), T2, 0, .76, .2, { s: [1, .6, 1.8] });
  add('head', sph(.3, 8, 6), T, 0, 1.17, .95, { s: [1.05, .9, 1] });
  add('muzzle', sph(.16, 6, 4), T2, 0, 1.04, 1.2, { s: [1.2, .8, .9] });
  add('nose', sph(.05, 5, 3), M('nose', 0x5a2a2a), 0, 1.12, 1.33);
  add('tail', cyl(.06, .04, .7, 5), T, 0, 1.15, -.98, { r: [-1.0, 0, 0] });
  add('tailTip', sph(.07, 5, 3), T3, 0, 1.38, -1.28);
  for (const s of [-1, 1]) {
    add('ear', new THREE.ConeGeometry(.1, .18, 4), T, s * .19, 1.44, .9);
    add('fang', new THREE.ConeGeometry(.04, .34, 5), M('fang', 0xfdfaf2), s * .09, .84, 1.3, { r: [Math.PI + .15, 0, 0] });
    for (const f of [-1, 1]) {
      add('leg', cyl(.11, .12, .66, 6), T, s * .25, .35, f * .5);
      add('paw', sph(.12, 6, 3), T2, s * .25, .05, f * .5 + .04, { s: [1, .55, 1.2] });
    }
  }
  eyes(.13, 1.24, 1.18, .05, 0xffd34a, false);
  return root;
}

// mammoth: big shaggy body with a hump, curving trunk, floppy ears, ivory tusks
function buildMammoth(THREE) {
  const { root, M, add, sph, T, T3, eyes, cyl } = animalKit(THREE, 'mammoth');
  const ivory = M('ivory', 0xf4efe2);
  add('body', sph(1, 10, 7), T, 0, 1.8, 0, { s: [1.0, .88, 1.38] });
  add('hump', sph(.62, 8, 5), T, 0, 2.6, .5, { s: [1, .7, 1] });
  add('head', sph(.68, 9, 6), T, 0, 2.15, 1.55);
  for (let i = 0; i < 7; i++) {   // shaggy fringe under the belly
    const a = (i / 6 - .5) * 2.2;
    add('fringe', new THREE.ConeGeometry(.22, .5, 4), T3, Math.sin(a) * .85, 1.02, Math.cos(a) * .2 - .1, { r: [Math.PI, 0, 0] });
  }
  // trunk: five segments curling down and forward
  [[0, 1.85, 2.1, .2, .1], [0, 1.45, 2.3, .17, .25], [0, 1.08, 2.38, .14, .05], [0, .76, 2.3, .12, -.35], [0, .58, 2.12, .1, -.9]]
    .forEach(([x, y, z, r, tilt]) => add('trunk', cyl(r * .85, r, .42, 6), T, x, y, z, { r: [tilt, 0, 0] }));
  for (const s of [-1, 1]) {
    add('ear', sph(.42, 6, 4), T3, s * .68, 2.18, 1.3, { s: [.25, 1, .9] });
    for (const [y, z, th] of [[1.41, 2.1, 2.5], [1.265, 2.385, 1.6], [1.39, 2.67, .7]])   // tusk: three segments curling forward and up
      add('tusk', cyl(.065, .08, .38, 6), ivory, s * .36, y, z, { r: [th, 0, 0] });
    for (const f of [-1, 1]) {
      add('leg', cyl(.32, .35, 1.15, 8), T, s * .6, .6, f * .85);
      add('foot', cyl(.37, .37, .12, 8), M('toe', 0x4a3424), s * .6, .06, f * .85);
    }
  }
  eyes(.34, 2.35, 2.05, .07);
  return root;
}

// angry penguin (the hostile one): tint black back, white belly, orange beak and feet, frowning brows
function buildPenguin(THREE) {
  const { root, M, add, sph, T, eyes, cyl } = animalKit(THREE, 'penguin');
  const white = M('white', 0xf6f8fb), orange = M('orange', 0xffa030);
  add('body', sph(.4, 9, 7), T, 0, .5, 0, { s: [.85, 1.15, .8] });
  add('belly', sph(.32, 8, 6), white, 0, .46, .1, { s: [.85, 1.15, .75] });
  add('head', sph(.27, 8, 6), T, 0, .98, .02);
  add('face', sph(.2, 7, 5), white, 0, .96, .12, { s: [1, .9, .7] });
  add('beak', new THREE.ConeGeometry(.08, .2, 5), orange, 0, .94, .32, { r: [Math.PI / 2, 0, 0] });
  for (const s of [-1, 1]) {
    add('flipper', sph(.2, 6, 4), T, s * .34, .58, 0, { s: [.22, 1, .5], r: [0, 0, s * .3] });
    add('foot', sph(.1, 5, 3), orange, s * .12, .04, .12, { s: [1, .4, 1.5] });
    add('brow', new THREE.BoxGeometry(.11, .03, .03), M('brow', 0x1f1a24), s * .09, 1.1, .27, { r: [0, 0, s * .45] });
  }
  eyes(.09, 1.03, .25, .045, 0xe5302b, false);
  return root;
}

// seal (hostile in the sea and the pet seal): round grey body, big eyes, whiskers, spots
function buildSeal(THREE) {
  const { root, M, add, sph, T, T2, T3, eyes } = animalKit(THREE, 'seal');
  add('body', sph(.5, 10, 7), T, 0, .35, 0, { s: [1, .7, 1.8] });
  add('belly', sph(.42, 8, 5), T2, 0, .25, .15, { s: [.95, .5, 1.6] });
  add('head', sph(.32, 9, 6), T, 0, .57, .8);
  add('muzzle', sph(.13, 6, 4), T2, 0, .5, 1.06, { s: [1.3, .8, .8] });
  add('nose', sph(.045, 5, 3), M('nose', 0x1f1a24), 0, .56, 1.15);
  for (let i = 0; i < 4; i++) add('spot', sph(.07, 4, 2), T3, [.3, -.25, .15, -.35][i], .6, [-.2, .1, .3, -.45][i], { s: [1, .3, 1] });
  for (const s of [-1, 1]) {
    add('flipper', sph(.22, 6, 3), T, s * .42, .12, .25, { s: [1, .2, .55], r: [0, s * .4, 0] });
    add('tailFin', sph(.18, 5, 3), T, s * .14, .2, -.9, { s: [.6, .2, 1], r: [0, s * .5, 0] });
    for (const d of [-.04, .03]) add('whisker', new THREE.BoxGeometry(.18, .01, .01), M('whisker', 0xf6f8fb), s * .17, .5 + d, 1.07, { r: [0, s * -.2, d * 3] });
  }
  eyes(.12, .63, 1.04, .06);
  return root;
}

// walrus boss: huge brown body, bushy moustache, long tusks, gold crown
function buildWalrus(THREE) {
  const { root, M, add, sph, T, T2, T3, eyes } = animalKit(THREE, 'walrus');
  add('body', sph(1, 10, 7), T, 0, .9, 0, { s: [1.2, .9, 1.6] });
  for (let i = 0; i < 3; i++) add('fold', new THREE.TorusGeometry(.95, .05, 3, 10), T3, 0, .9, .4 - i * .45, { s: [1.18, .88, 1] });
  add('head', sph(.6, 9, 6), T, 0, 1.22, 1.4);
  for (const s of [-1, 1]) add('stache', sph(.24, 6, 4), T2, s * .17, 1.02, 1.88, { s: [1, .8, .8] });
  add('nose', sph(.07, 5, 3), M('nose', 0x1f1a24), 0, 1.2, 1.97);
  for (const s of [-1, 1]) {
    add('tusk', new THREE.ConeGeometry(.085, .9, 6), M('ivory', 0xf4efe2), s * .2, .66, 1.85, { r: [Math.PI - .15, 0, 0] });
    add('flipper', sph(.4, 6, 3), T, s * 1.05, .2, .55, { s: [1, .2, .6], r: [0, s * .5, 0] });
    add('tailFin', sph(.35, 5, 3), T, s * .3, .2, -1.55, { s: [.6, .2, 1], r: [0, s * .5, 0] });
  }
  add('crown', new THREE.CylinderGeometry(.3, .26, .18, 5), M('gold', 0xffc83d), 0, 1.83, 1.3);
  for (let i = 0; i < 5; i++) { const a = i / 5 * Math.PI * 2; add('crownTip', new THREE.ConeGeometry(.06, .16, 4), M('gold', 0xffc83d), Math.cos(a) * .27, 2.0, 1.3 + Math.sin(a) * .27); }
  eyes(.24, 1.45, 1.9, .07);
  return root;
}

// orca: sleek black body with the white belly and eye patches, tall dorsal fin, flukes
function buildOrca(THREE) {
  const { root, M, add, sph, T, eyes } = animalKit(THREE, 'orca');
  const white = M('white', 0xf6f8fb);
  add('body', sph(.9, 12, 7), T, 0, .25, 0, { s: [1, .6, 2.6] });
  add('belly', sph(.6, 9, 5), white, 0, .05, .4, { s: [1, .4, 2.2] });
  add('fin', new THREE.ConeGeometry(.3, 1.4, 4), T, 0, 1.0, -.3, { s: [.35, 1, 1], r: [-.25, 0, 0] });
  for (const s of [-1, 1]) {
    add('patch', sph(.18, 6, 4), white, s * .5, .38, 1.3, { s: [.4, .7, 1.4] });
    add('flipper', sph(.35, 6, 3), T, s * .85, -.05, .7, { s: [1, .15, .5], r: [0, s * .6, 0] });
    add('fluke', sph(.5, 6, 3), T, s * .45, .2, -2.3, { s: [1, .12, .5], r: [0, s * -.4, 0] });
  }
  eyes(.42, .3, 1.55, .05, 0x1f1a24, false);
  return root;
}
if (typeof module !== 'undefined') module.exports = { buildBear, buildWolf, buildSaber, buildMammoth, buildPenguin, buildSeal, buildWalrus, buildOrca };
