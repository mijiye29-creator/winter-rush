// Hunter (사냥꾼) Lv1: green hooded parka with fur trim, leather strap and pouch, feather on the hood.
// The left mitten sits at the bow grip (-.45, .9, .1) the game adds. Feet at y=0, facing +z.
function buildHunterLv1(THREE) {
  const { root, M, add, sph, face } = modelKit(THREE, 'hunter_lv1');
  const coat = M('coat', 0x6b8e3a), coatDark = M('coatDark', 0x55732c), fur = M('fur', 0xe8dcc4), skin = M('skin', 0xf4c9a4),
    hair = M('hair', 0x4a3020), leather = M('leather', 0x7a4a2a), boot = M('boot', 0x5a3a28), mitt = M('mitt', 0x8a5a3a);
  for (const s of [-1, 1]) {
    add('boot', sph(.13, 7, 5), boot, s * .16, .11, .05, { s: [1, .95, 1.35] });
    add('bootCuff', new THREE.TorusGeometry(.105, .045, 3, 6), fur, s * .16, .21, .02, { r: [Math.PI / 2, 0, 0] });
  }
  const prof = [[0, .26], [.42, .26], [.45, .32], [.44, .42], [.42, .62], [.38, .86], [.33, 1.04], [.22, 1.14], [0, 1.16]].map(([x, y]) => new THREE.Vector2(x, y));
  add('coat', new THREE.LatheGeometry(prof, 10), coat);
  add('hem', new THREE.TorusGeometry(.44, .06, 3, 10), fur, 0, .3, 0, { r: [Math.PI / 2, 0, 0] });
  // leather strap across the chest + pouch and knife on the belt
  add('strap', new THREE.BoxGeometry(.08, .95, .04), leather, 0, .8, .37, { r: [-.2, 0, -.75] });
  add('strapBack', new THREE.BoxGeometry(.08, .95, .04), leather, 0, .8, -.37, { r: [.2, 0, .75] });
  add('belt', new THREE.TorusGeometry(.43, .04, 3, 10), leather, 0, .55, 0, { r: [Math.PI / 2, 0, 0] });
  add('pouch', new THREE.BoxGeometry(.16, .15, .08), M('pouch', 0x5e3820), .2, .5, .4, { r: [0, .45, 0] });
  add('knife', new THREE.BoxGeometry(.05, .2, .05), M('knife', 0x3a2a22), -.25, .47, .36, { r: [0, -.5, .3] });
  // arms: the left holds the bow out to the side, the right hangs
  add('sleeveL', sph(.12, 7, 5), coat, -.42, .92, .06, { s: [1, 1.6, 1], r: [-.3, 0, -.35] });
  add('mittL', sph(.1, 6, 5), mitt, -.45, .9, .1);
  add('sleeveR', sph(.12, 7, 5), coat, .43, .84, .02, { s: [1, 1.9, 1], r: [0, 0, .28] });
  add('mittR', sph(.1, 6, 5), mitt, .5, .58, .05);
  // head: pointed green hood with fur trim and a red feather
  add('hood', sph(.35, 9, 6), coatDark, 0, 1.47, -.07);
  add('hoodTip', new THREE.ConeGeometry(.16, .32, 6), coatDark, 0, 1.75, -.28, { r: [-1.0, 0, 0] });
  add('face', sph(.27, 10, 7), skin, 0, 1.43, .12);
  add('bangs', sph(.2, 6, 4), hair, 0, 1.6, .17, { s: [1.15, .42, .7] });
  add('hoodFur', new THREE.TorusGeometry(.25, .07, 4, 10), fur, 0, 1.45, .2);
  add('feather', new THREE.ConeGeometry(.045, .3, 4), M('feather', 0xd9483b), .27, 1.66, -.16, { r: [-.7, 0, -.45], s: [1, 1, .35] });
  face(1.43, .12, .27, M);
  add('mouth', new THREE.TorusGeometry(.03, .009, 3, 4, Math.PI), M('mouth', 0x7a3a3a), 0, 1.35, .37, { r: [0, 0, Math.PI] });
  return root;
}
if (typeof module !== 'undefined') module.exports = buildHunterLv1;
