// Bakes every mesh of a model into ONE mesh with vertex colors, so the game draws it in a single call.
// Part colors come from each mesh's material; UVs are dropped (no textures).
// Animals: parts whose material name starts with "tint" go into a second mesh named "tint". The game gives that
// mesh the animal's own fur material, so fur color per kind (raider bear, pet coat…) and the red hit flash still work;
// tint parts should be white or grey so the fur color shows through.
function bakeParts(THREE, parts, name, off) {
  const pos = [], nor = [], col = [], idx = [], regions = [], nm = new THREE.Matrix3(), v = new THREE.Vector3();
  for (const o of parts) {
    const g = o.geometry, p = g.attributes.position, n = g.attributes.normal, c = o.material.color, base = pos.length / 3;
    if (name === 'hero_lv1' || name === 'hunter_lv1') regions.push({ name: o.name, material: o.material.name, start: base, count: p.count, color: c.getHex() });
    nm.getNormalMatrix(o.matrixWorld);
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i).applyMatrix4(o.matrixWorld); if (off) v.sub(off); pos.push(v.x, v.y, v.z);
      v.fromBufferAttribute(n, i).applyMatrix3(nm).normalize(); nor.push(v.x, v.y, v.z);
      col.push(c.r, c.g, c.b);
    }
    if (g.index) for (let i = 0; i < g.index.count; i++) idx.push(base + g.index.getX(i));
    else for (let i = 0; i < p.count; i++) idx.push(base + i);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  geo.setIndex(idx);
  const m = new THREE.Mesh(geo, Object.assign(new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, metalness: 0 }), { name }));
  m.name = name;
  if (regions.length) m.userData.colorRegions = regions;
  return m;
}
// tint parts and the rest; one plain mesh when nothing is tinted (props, people)
function bakeSplit(THREE, parts, name, off) {
  const tint = parts.filter(o => o.material.name.startsWith('tint')), rest = parts.filter(o => !tint.includes(o));
  if (!tint.length && !off) return bakeParts(THREE, parts, name);
  const g = new THREE.Group(); g.name = name;
  if (tint.length) g.add(bakeParts(THREE, tint, 'tint', off));
  if (rest.length) g.add(bakeParts(THREE, rest, 'detail', off));
  return g;
}
// Legs (parts tagged with a limb, see kit.js) become child groups named after the limb, placed at its pivot,
// with their own tint/detail meshes: the game swings them to walk. Still only a few draw calls per animal.
function bakeModel(THREE, group) {
  group.updateMatrixWorld(true);
  const all = []; group.traverse(o => o.isMesh && all.push(o));
  const limbs = new Map(), body = [];
  for (const o of all) { const l = o.userData.limb; if (!l) body.push(o); else (limbs.get(l) || limbs.set(l, []).get(l)).push(o); }
  const out = bakeSplit(THREE, body, group.name);
  if (!limbs.size) return out;
  let g = out; if (!g.isGroup) { g = new THREE.Group(); g.name = group.name; out.name = 'detail'; g.add(out); }
  for (const [l, parts] of limbs) {
    const piv = new THREE.Vector3(...l.pivot), leg = bakeSplit(THREE, parts, l.name, piv);
    leg.position.copy(piv); g.add(leg);
  }
  return g;
}
if (typeof module !== 'undefined') module.exports = bakeModel;
