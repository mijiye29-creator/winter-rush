// Bakes every mesh of a model into ONE mesh with vertex colors, so the game draws the hero in a single call.
// Part colors come from each mesh's material; UVs are dropped (no textures).
function bakeModel(THREE, group) {
  group.updateMatrixWorld(true);
  const pos = [], nor = [], col = [], idx = [], nm = new THREE.Matrix3();
  group.traverse(o => {
    if (!o.isMesh) return;
    const g = o.geometry, p = g.attributes.position, n = g.attributes.normal, c = o.material.color, base = pos.length / 3;
    nm.getNormalMatrix(o.matrixWorld);
    const v = new THREE.Vector3();
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i).applyMatrix4(o.matrixWorld); pos.push(v.x, v.y, v.z);
      v.fromBufferAttribute(n, i).applyMatrix3(nm).normalize(); nor.push(v.x, v.y, v.z);
      col.push(c.r, c.g, c.b);
    }
    if (g.index) for (let i = 0; i < g.index.count; i++) idx.push(base + g.index.getX(i));
    else for (let i = 0; i < p.count; i++) idx.push(base + i);
  });
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  geo.setIndex(idx);
  const m = new THREE.Mesh(geo, Object.assign(new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, metalness: 0 }), { name: group.name }));
  m.name = group.name; return m;
}
if (typeof module !== 'undefined') module.exports = bakeModel;
