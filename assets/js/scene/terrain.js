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

function buildTerrainMesh(width, depth, segW, segD, centerZ, lowColor, highColor) {
  const geometry = new THREE.PlaneGeometry(width, depth, segW, segD);
  geometry.rotateX(-Math.PI / 2);
  geometry.translate(0, 0, centerZ);
  const positions = geometry.attributes.position;
  const colors = [];
  const low = new THREE.Color(lowColor);
  const high = new THREE.Color(highColor);
  const color = new THREE.Color();

  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i);
    const z = positions.getZ(i);
    const y = elevation(x, z);
    positions.setY(i, y);
    color.copy(low).lerp(high, THREE.MathUtils.clamp(y / 46, 0, 1));
    colors.push(color.r, color.g, color.b);
  }

  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.computeVertexNormals();

  const material = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.94,
    metalness: 0.05
  });

  return new THREE.Mesh(geometry, material);
}

/**
 * Creates 3 distinct mountain depth layers:
 * 1. nearGroup (Z: +25 to -55) - closest, highest contrast, mouse parallax ~0.78
 * 2. midGroup  (Z: -50 to -145) - middle distance, moderate contrast, mouse parallax ~0.48
 * 3. farGroup  (Z: -140 to -260) - distant peaks, soft mist, mouse parallax ~0.20
 */
export function createMultiLayerTerrain(compact) {
  const root = new THREE.Group();

  // Far Mountains (Z ~ -195)
  const farMesh = buildTerrainMesh(
    360, 130,
    compact ? 70 : 120, compact ? 50 : 80,
    -195,
    '#254b56', '#527c85'
  );
  const farGroup = new THREE.Group();
  farGroup.add(farMesh);
  farGroup.userData = { parallaxFactor: 0.20, baseZ: 0 };
  root.add(farGroup);

  // Mid Mountains (Z ~ -95)
  const midMesh = buildTerrainMesh(
    320, 105,
    compact ? 80 : 130, compact ? 55 : 90,
    -95,
    '#18414d', '#5f8f96'
  );
  const midGroup = new THREE.Group();
  midGroup.add(midMesh);
  midGroup.userData = { parallaxFactor: 0.48, baseZ: 0 };
  root.add(midGroup);

  // Near Mountains (Z ~ -15)
  const nearMesh = buildTerrainMesh(
    280, 95,
    compact ? 90 : 140, compact ? 60 : 100,
    -15,
    '#123b45', '#73a5a7'
  );
  const nearGroup = new THREE.Group();
  nearGroup.add(nearMesh);
  nearGroup.userData = { parallaxFactor: 0.78, baseZ: 0 };
  root.add(nearGroup);

  return { root, farGroup, midGroup, nearGroup };
}

export function createTerrain(compact) {
  return createMultiLayerTerrain(compact).root;
}
