// Shared helpers for the model files: named materials, a part adder and low-poly spheres.
function modelKit(THREE, name) {
  const root = new THREE.Group(); root.name = name;
  const mats = {};
  const M = (n, color) => mats[n] || (mats[n] = Object.assign(new THREE.MeshStandardMaterial({ color, roughness: 1, metalness: 0 }), { name: n }));
  // parts added while k.limb is set ({ name, pivot: [x, y, z] }) bake into a separate piece that pivots there, so the game can swing it
  const add = (n, geo, m, x = 0, y = 0, z = 0, opt = {}) => {
    const o = new THREE.Mesh(geo, m); o.name = n; o.position.set(x, y, z);
    if (opt.s) o.scale.set(...opt.s);
    if (opt.r) o.rotation.set(...opt.r);
    if (k.limb) o.userData.limb = k.limb;
    root.add(o); return o;
  };
  const sph = (r, w = 8, h = 6) => new THREE.SphereGeometry(r, w, h);
  // a cute low-poly face on a head centred at (0, y, z) with radius r, looking +z
  const face = (y, z, r, M) => {
    for (const s of [-1, 1]) {
      add('eye', sph(.048, 5, 3), M('eye', 0x2a2230), s * .095, y + .02, z + r * .92, { s: [1, 1.15, .6] });
      add('eyeShine', sph(.017, 4, 2), M('shine', 0xffffff), s * .095 - .015, y + .04, z + r * .99);
      add('cheek', sph(.055, 5, 3), M('cheek', 0xf2938c), s * .16, y - .05, z + r * .8, { s: [1, .7, .4] });
    }
    add('nose', sph(.032, 5, 3), M('nose', 0xeaa585), 0, y - .03, z + r);
  };
  const k = { root, M, add, sph, face, limb: null };
  return k;
}
if (typeof module !== 'undefined') module.exports = modelKit;
