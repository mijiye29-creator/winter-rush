// Woodcutter (나무꾼) Lv1: plaid orange work jacket, knit beanie, little beard, work boots, axe in the right hand.
// Same frame as the people in the game: feet at y=0, facing +z, about 1.9 tall.
function buildWoodcutterLv1(THREE) {
  const { root, M, add, sph, face } = modelKit(THREE, 'woodcutter_lv1');
  const coat = M('coat', 0xe0803a), plaid = M('plaid', 0x9a3f22), skin = M('skin', 0xf4c9a4), beard = M('beard', 0x6b3d1f),
    hat = M('hat', 0x7a4a2a), hatCuff = M('hatCuff', 0x5e3820), boot = M('boot', 0x5a3a28), pants = M('pants', 0x3d5a80),
    glove = M('glove', 0xc8955a), wood = M('wood', 0x8a5a3a), steel = M('steel', 0xc7ccd6), fur = M('fur', 0xfbf6ec);
  for (const s of [-1, 1]) {
    add('boot', sph(.13, 7, 5), boot, s * .16, .1, .05, { s: [1, .9, 1.35] });
    add('leg', new THREE.CylinderGeometry(.11, .12, .2, 6, 1, true), pants, s * .16, .25, 0);
  }
  // jacket: straighter than the hero's parka, with plaid bands
  const prof = [[0, .32], [.4, .32], [.42, .38], [.41, .62], [.38, .86], [.33, 1.04], [.22, 1.14], [0, 1.16]].map(([x, y]) => new THREE.Vector2(x, y));
  add('coat', new THREE.LatheGeometry(prof, 10), coat);
  for (const y of [.44, .7, .94]) add('plaid', new THREE.TorusGeometry(.415 - (y - .44) * .12, .025, 3, 10), plaid, 0, y, 0, { r: [Math.PI / 2, 0, 0] });
  add('plaidV', new THREE.BoxGeometry(.05, .7, .03), plaid, 0, .7, .4, { r: [-.12, 0, 0] });
  add('belt', new THREE.TorusGeometry(.42, .04, 3, 10), M('belt', 0x3a2a22), 0, .56, 0, { r: [Math.PI / 2, 0, 0] });
  add('buckle', new THREE.BoxGeometry(.11, .09, .04), M('gold', 0xd9b24a), 0, .56, .44);
  add('collar', new THREE.TorusGeometry(.22, .07, 4, 10), fur, 0, 1.12, 0, { r: [Math.PI / 2, 0, 0] });
  // arms: left hangs, right holds the axe in front
  add('sleeveL', sph(.12, 7, 5), coat, -.42, .84, .02, { s: [1, 1.9, 1], r: [0, 0, -.25] });
  add('gloveL', sph(.1, 6, 5), glove, -.49, .58, .05);
  add('sleeveR', sph(.12, 7, 5), coat, .41, .88, .06, { s: [1, 1.7, 1], r: [-.5, 0, .25] });
  add('gloveR', sph(.1, 6, 5), glove, .44, .76, .17);
  add('axeHandle', new THREE.CylinderGeometry(.035, .035, .8, 5), wood, .44, .9, .2, { r: [.35, 0, 0] });
  add('axeHead', new THREE.BoxGeometry(.05, .22, .26), steel, .44, 1.24, .38, { r: [.35, 0, 0] });
  // head: round face, beard, knit beanie with a folded cuff and pompom
  add('face', sph(.27, 10, 7), skin, 0, 1.43, .1);
  add('beard', sph(.2, 7, 4), beard, 0, 1.3, .2, { s: [1.15, .75, .7] });
  add('hair', sph(.29, 8, 5), beard, 0, 1.47, .02, { s: [1, .9, 1] });
  add('hat', sph(.3, 9, 5), hat, 0, 1.58, .04, { s: [1, .85, 1] });
  add('hatCuff', new THREE.CylinderGeometry(.3, .3, .12, 10), hatCuff, 0, 1.56, .04);
  add('pompom', sph(.09, 6, 4), M('pom', 0xe0803a), 0, 1.88, .02);
  face(1.43, .1, .27, M);
  add('mouth', new THREE.TorusGeometry(.03, .009, 3, 4, Math.PI), M('mouth', 0x7a3a3a), 0, 1.36, .36, { r: [0, 0, Math.PI] });
  return root;
}
if (typeof module !== 'undefined') module.exports = buildWoodcutterLv1;
