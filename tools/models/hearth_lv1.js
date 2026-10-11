// Hearth (모닥불) Lv1: a ring of snow-capped stones, crossed logs and glowing embers.
// The game keeps its own animated flames and light on top. Centre at the origin, ground at y=0, ring radius ~.85.
function buildHearthLv1(THREE) {
  const { root, M, add } = modelKit(THREE, 'hearth_lv1');
  const stones = [M('stone', 0xa9adb8), M('stoneDark', 0x8e93a0), M('stoneLight', 0xc2c6cf)], snow = M('snow', 0xf7fbff),
    bark = M('bark', 0x5a3a28), ash = M('ash', 0x4a4650), ember = M('ember', 0xff7a2a), ember2 = M('ember2', 0xffc04a);
  add('snowRing', new THREE.CylinderGeometry(1.2, 1.25, .04, 12, 1, true), snow, 0, .02, 0);
  add('snowFloor', new THREE.CircleGeometry(1.22, 12), snow, 0, .015, 0, { r: [-Math.PI / 2, 0, 0] });
  add('ash', new THREE.CircleGeometry(.62, 10), ash, 0, .03, 0, { r: [-Math.PI / 2, 0, 0] });
  for (let i = 0; i < 9; i++) {
    const a = i / 9 * Math.PI * 2, x = Math.cos(a) * .85, z = Math.sin(a) * .85, sc = .85 + (i * 37 % 5) * .06;
    add('stone', new THREE.IcosahedronGeometry(.26, 0), stones[i % 3], x, .14 * sc, z, { s: [sc, sc * .8, sc], r: [i, i * 2, 0] });
    if (i % 2 === 0) add('stoneSnow', new THREE.SphereGeometry(.16, 5, 2, 0, Math.PI * 2, 0, 1.3), snow, x, .3 * sc, z, { s: [sc, .5, sc] });
  }
  // four logs leaning into a little teepee
  for (let i = 0; i < 4; i++) {
    const a = i * Math.PI / 2 + .4, tilt = .95;
    const lg = add('log', new THREE.CylinderGeometry(.09, .11, 1.0, 6), bark, Math.cos(a) * .26, .34, Math.sin(a) * .26);
    lg.rotation.set(0, -a, 0); lg.rotateZ(tilt);
  }
  for (let i = 0; i < 7; i++) {
    const a = i * 2.3, r = .12 + (i % 3) * .1;
    add('ember', new THREE.BoxGeometry(.09, .05, .07), i % 2 ? ember : ember2, Math.cos(a) * r, .06, Math.sin(a) * r, { r: [0, a, 0] });
  }
  return root;
}
if (typeof module !== 'undefined') module.exports = buildHearthLv1;
