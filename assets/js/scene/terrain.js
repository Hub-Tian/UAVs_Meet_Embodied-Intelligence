import * as THREE from 'three';

// Deterministic value noise: the landscape stays still while the camera moves.
function noise(x, z) {
  const ix = Math.floor(x), iz = Math.floor(z);
  const hash = (a, b) => {
    const v = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
    return v - Math.floor(v);
  };
  const smooth = t => t * t * (3 - 2 * t);
  const u = smooth(x - ix), v = smooth(z - iz);
  return THREE.MathUtils.lerp(
    THREE.MathUtils.lerp(hash(ix, iz), hash(ix + 1, iz), u),
    THREE.MathUtils.lerp(hash(ix, iz + 1), hash(ix + 1, iz + 1), u), v);
}

export function elevation(x, z) {
  const bend = 12 * Math.sin(z * 0.025);
  const valley = 1 - Math.exp(-Math.pow((x - bend) / 24, 2));
  let detail = 0, amplitude = 1, frequency = 0.027;
  for (let i = 0; i < 5; i++) {
    detail += amplitude * (1 - Math.abs(2 * noise(x * frequency + 9, z * frequency + 17) - 1));
    amplitude *= 0.48;
    frequency *= 2.05;
  }
  return 1 + valley * (8 + detail * 22) + noise(x * 0.045, z * 0.045) * 2;
}

export function createTerrain(compact) {
  const geometry = new THREE.PlaneGeometry(300, 320, compact ? 130 : 220, compact ? 140 : 240);
  geometry.rotateX(-Math.PI / 2);
  geometry.translate(0, 0, -85);
  const positions = geometry.attributes.position;
  const colors = [];
  const low = new THREE.Color('#123b45');
  const high = new THREE.Color('#6b9899');
  const color = new THREE.Color();
  for (let i = 0; i < positions.count; i++) {
    const y = elevation(positions.getX(i), positions.getZ(i));
    positions.setY(i, y);
    color.copy(low).lerp(high, THREE.MathUtils.clamp(y / 48, 0, 1));
    colors.push(color.r, color.g, color.b);
  }
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  return new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({
    vertexColors: true, roughness: 0.96, metalness: 0.04
  }));
}
