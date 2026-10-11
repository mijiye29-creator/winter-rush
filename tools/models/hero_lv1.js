// Winter Rush hero, Lv1 "견습 사냥꾼" (apprentice hunter), built from simple shapes.
// Same size as the old in-game hero: feet at y=0, top of the hood about 1.95, facing +z.
// The right mitten sits at the axe grip (.45, .8, .15) so the game's axe swings from the hand.
// Later levels add gear on top; part and material names (coat, fur, scarf…) let the game recolor them.
function buildHeroLv1(THREE) {
  const root = new THREE.Group(); root.name = 'hero_lv1';
  const mats = {};
  const M = (name, color) => mats[name] || (mats[name] = Object.assign(new THREE.MeshStandardMaterial({ color, roughness: 1, metalness: 0 }), { name }));
  const add = (name, geo, m, x = 0, y = 0, z = 0, opt = {}) => {
    const o = new THREE.Mesh(geo, m); o.name = name; o.position.set(x, y, z);
    if (opt.s) o.scale.set(...opt.s);
    if (opt.r) o.rotation.set(...opt.r);
    root.add(o); return o;
  };
  const coat = M('coat', 0x3a9ad9), coatDark = M('coatDark', 0x2c7cb8), fur = M('fur', 0xfbf6ec), skin = M('skin', 0xf4c9a4),
    cheek = M('cheek', 0xf2938c), eye = M('eye', 0x2a2230), shine = M('shine', 0xffffff), hair = M('hair', 0x6a4128),
    scarf = M('scarf', 0xe0483c), stripe = M('stripe', 0xf6e6c4), boot = M('boot', 0x7a4a2a), sole = M('sole', 0x3a2a22),
    leather = M('leather', 0x8a5530), gold = M('gold', 0xf0c75a), wood = M('wood', 0xc8955a);
  const sph = (r, w = 14, h = 10) => new THREE.SphereGeometry(r, w, h);

  // boots: round toes, dark soles, fluffy cuffs
  for (const s of [-1, 1]) {
    add('boot', sph(.13), boot, s * .16, .11, .05, { s: [1, .95, 1.35] });
    add('sole', new THREE.CylinderGeometry(.13, .13, .05, 14), sole, s * .16, .025, .06, { s: [1, 1, 1.35] });
    add('bootCuff', new THREE.TorusGeometry(.105, .05, 6, 14), fur, s * .16, .21, .02, { r: [Math.PI / 2, 0, 0] });
  }

  // parka: a lathe gives the flared, rounded bell shape
  const prof = [[0, .26], [.42, .26], [.47, .32], [.46, .42], [.43, .62], [.39, .86], [.34, 1.04], [.24, 1.15], [0, 1.18]].map(([x, y]) => new THREE.Vector2(x, y));
  add('coat', new THREE.LatheGeometry(prof, 18), coat);
  add('hem', new THREE.TorusGeometry(.455, .07, 8, 22), fur, 0, .31, 0, { r: [Math.PI / 2, 0, 0] });
  add('placket', new THREE.BoxGeometry(.07, .5, .03), coatDark, 0, .78, .405, { r: [-.17, 0, 0] });
  for (const [y, z] of [[.7, .435], [.88, .395]]) add('toggle', new THREE.CylinderGeometry(.026, .026, .13, 8), wood, 0, y, z, { r: [0, 0, Math.PI / 2] });
  add('belt', new THREE.TorusGeometry(.445, .042, 6, 22), leather, 0, .54, 0, { r: [Math.PI / 2, 0, 0] });
  add('buckle', new THREE.BoxGeometry(.13, .1, .04), gold, 0, .54, .475);
  // satchel on the left hip
  add('satchel', new THREE.BoxGeometry(.08, .18, .2), leather, -.47, .5, .05, { r: [0, 0, -.12] });
  add('satchelFlap', new THREE.BoxGeometry(.09, .08, .21), M('leatherDark', 0x6a3d22), -.48, .57, .05, { r: [0, 0, -.12] });

  // arms: the left hangs, the right reaches forward to the axe grip
  add('sleeveL', sph(.13, 12, 8), coat, -.43, .84, .02, { s: [1, 1.9, 1], r: [0, 0, -.28] });
  add('cuffL', new THREE.TorusGeometry(.085, .045, 6, 12), fur, -.5, .63, .04, { r: [Math.PI / 2, 0, -.28] });
  add('mittenL', sph(.1, 12, 8), scarf, -.52, .56, .05);
  add('thumbL', sph(.045, 8, 6), scarf, -.47, .58, .12);
  add('sleeveR', sph(.13, 12, 8), coat, .42, .9, .06, { s: [1, 1.7, 1], r: [-.55, 0, .25] });
  add('cuffR', new THREE.TorusGeometry(.085, .045, 6, 12), fur, .45, .78, .14, { r: [Math.PI / 2 - .55, 0, .25] });
  add('mittenR', sph(.1, 12, 8), scarf, .45, .8, .17);
  add('thumbR', sph(.045, 8, 6), scarf, .39, .84, .22);

  // knitted scarf with a striped tail
  add('scarf', new THREE.TorusGeometry(.24, .095, 8, 18), scarf, 0, 1.13, .02, { r: [Math.PI / 2, 0, 0] });
  add('scarfTail', new THREE.BoxGeometry(.15, .32, .06), scarf, -.14, .95, .33, { r: [-.18, 0, .12] });
  for (const y of [.9, .99]) add('scarfStripe', new THREE.BoxGeometry(.16, .035, .065), stripe, -.14 + (y - .95) * -.12, y, .335 + (y - .95) * .18, { r: [-.18, 0, .12] });
  add('scarfFringe', new THREE.BoxGeometry(.15, .05, .04), stripe, -.12, .78, .36, { r: [-.18, 0, .12] });

  // head: big round face, fur-trimmed hood with a pompom
  add('hood', sph(.36, 16, 12), coat, 0, 1.47, -.08);
  add('face', sph(.27, 16, 12), skin, 0, 1.43, .12);
  add('bangs', sph(.2, 12, 8), hair, 0, 1.6, .17, { s: [1.15, .42, .7] });
  add('hoodFur', new THREE.TorusGeometry(.255, .085, 8, 20), fur, 0, 1.45, .2);
  add('pompom', sph(.1, 10, 8), fur, 0, 1.86, -.14);
  for (const s of [-1, 1]) {
    add('eye', sph(.048, 10, 8), eye, s * .095, 1.45, .355, { s: [1, 1.15, .6] });
    add('eyeShine', sph(.017, 6, 4), shine, s * .095 - .015, 1.47, .382);
    add('cheek', sph(.055, 10, 6), cheek, s * .16, 1.38, .33, { s: [1, .7, .4] });
  }
  add('nose', sph(.032, 8, 6), M('nose', 0xeaa585), 0, 1.4, .39);
  add('mouth', new THREE.TorusGeometry(.03, .009, 4, 10, Math.PI), M('mouth', 0x7a3a3a), 0, 1.35, .37, { r: [0, 0, Math.PI] });
  return root;
}
if (typeof module !== 'undefined') module.exports = buildHeroLv1;
