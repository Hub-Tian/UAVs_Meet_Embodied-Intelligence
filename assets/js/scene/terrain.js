import * as THREE from 'three';

// Procedural multi-frequency value noise
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

// Ridged noise for sharp mountain arêtes and ridges
function ridgedNoise(x, z) {
  const n = noise(x, z);
  return 1.0 - Math.abs(2.0 * n - 1.0);
}

/**
 * Procedural Icelandic Mountain Valley Elevation Function.
 * Designed for continuous landscape continuity across 4 depth layers:
 * 1. Far Alpine Horizon (Z ~ -255)
 * 2. Mid-Far Peaks (Z ~ -145)
 * 3. Mid Valley Walls (Z ~ -45)
 * 4. Foreground & Valley Floor (Z ~ +45, extending under & behind camera frustum)
 *
 * Elevation is calibrated so distant peaks occupy ~35%-50% screen height,
 * leaving open sky and morning clouds above, while foreground rolls continuously
 * below without any visible bottom edge or floating ribbon effect.
 */
export function elevation(x, z) {
  // Sinuous valley corridor centerline that gently meanders
  const valleyCenter = 12.0 * Math.sin(z * 0.015) + 3.0 * Math.cos(z * 0.038);
  const distFromCenter = Math.abs(x - valleyCenter);

  // Valley corridor carving (flattens canyon floor for alluvial bed)
  const valleyWidth = 28.0 + Math.sin(z * 0.018) * 6.0;
  const valleyFactor = 1.0 - Math.exp(-Math.pow(distFromCenter / valleyWidth, 2));

  // Multi-octave ridged mountain noise for sharp crests & rugged gullies
  let ridgeDetail = 0;
  let amp = 1.0;
  let freq = 0.022;
  for (let i = 0; i < 5; i++) {
    ridgeDetail += amp * ridgedNoise(x * freq + 12.3, z * freq + 28.7);
    amp *= 0.50;
    freq *= 2.06;
  }

  // Vertical erosion fluting (basalt couloirs characteristic of Icelandic mountains)
  const fluting = Math.sin(x * 0.35 + noise(x * 0.07, z * 0.035) * 2.6) * 1.6;

  // Depth-based height scaling:
  // Foreground (z > 0): rolling foothills (Y up to ~22) and flat valley floor (Y ~ 1.5)
  // Midground (z in [-120, 0]): valley walls (Y up to ~38)
  // Far distance (z < -120): majestic alpine peaks (Y up to ~54), framing ~35-50% screen height
  const depthFactor = THREE.MathUtils.clamp((-z + 50.0) / 220.0, 0.45, 1.30);
  const mountainScale = (14.0 + ridgeDetail * 22.0 + fluting * 0.8) * depthFactor;

  const baseFloor = 1.0 + Math.sin(z * 0.025) * 0.6;
  return Math.max(0.5, baseFloor + valleyFactor * mountainScale);
}

/**
 * Creates terrain material with dynamic Sun Break shader injection
 */
function createTerrainMaterial(lowColor, highColor, enableSunBreak = false) {
  const material = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.92,
    metalness: 0.04,
    depthTest: true,
    depthWrite: true
  });

  if (enableSunBreak) {
    // Prepare custom uniforms for morning sunbreak effect (scroll 60% - 85%)
    material.userData.uSunBreak = { value: 0.0 };
    material.userData.uSunCenter = { value: new THREE.Vector3(26.0, 30.0, -65.0) };

    material.onBeforeCompile = (shader) => {
      shader.uniforms.uSunBreak = material.userData.uSunBreak;
      shader.uniforms.uSunCenter = material.userData.uSunCenter;

      shader.vertexShader = `
        varying vec3 vCustomWorldPos;
        ${shader.vertexShader}
      `.replace(
        '#include <begin_vertex>',
        `
        #include <begin_vertex>
        vCustomWorldPos = (modelMatrix * vec4(transformed, 1.0)).xyz;
        `
      );

      shader.fragmentShader = `
        uniform float uSunBreak;
        uniform vec3 uSunCenter;
        varying vec3 vCustomWorldPos;
        ${shader.fragmentShader}
      `.replace(
        '#include <dithering_fragment>',
        `
        #include <dithering_fragment>
        if (uSunBreak > 0.001) {
          // Localized sunlight beam on the right mountain ridge (15% - 35% of ridge)
          vec2 beamOffset = (vCustomWorldPos.xz - uSunCenter.xz) * vec2(0.85, 1.15);
          float beamDist = length(beamOffset);
          float beamMask = smoothstep(46.0, 8.0, beamDist);
          float heightMask = smoothstep(16.0, 42.0, vCustomWorldPos.y);
          vec3 sunDir = normalize(vec3(-0.62, 0.70, 0.35));
          float facing = clamp(dot(normalize(vNormal), sunDir), 0.0, 1.0);
          float sunIntensity = uSunBreak * beamMask * heightMask * pow(facing, 1.35);

          // Warm morning sun illumination: warm golden grazing light, no blown-out white
          vec3 warmSun = vec3(1.0, 0.86, 0.65);
          gl_FragColor.rgb = mix(gl_FragColor.rgb, gl_FragColor.rgb * warmSun * 1.45 + warmSun * 0.22, sunIntensity);
        }
        `
      );
    };
  }

  return material;
}

function buildTerrainMesh(width, depth, segW, segD, centerZ, lowColor, midColor, highColor, enableSunBreak = false) {
  const geometry = new THREE.PlaneGeometry(width, depth, segW, segD);
  geometry.rotateX(-Math.PI / 2);
  geometry.translate(0, 0, centerZ);
  const positions = geometry.attributes.position;
  const colors = [];
  const cLow = new THREE.Color(lowColor);
  const cMid = new THREE.Color(midColor);
  const cHigh = new THREE.Color(highColor);
  const vertexColor = new THREE.Color();

  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i);
    const z = positions.getZ(i);
    const y = elevation(x, z);
    positions.setY(i, y);

    // Geological strata color assignment based on elevation
    const normH = THREE.MathUtils.clamp((y - 1.0) / 48.0, 0, 1);
    if (normH < 0.35) {
      vertexColor.copy(cLow).lerp(cMid, normH / 0.35);
    } else {
      vertexColor.copy(cMid).lerp(cHigh, (normH - 0.35) / 0.65);
    }
    colors.push(vertexColor.r, vertexColor.g, vertexColor.b);
  }

  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.computeVertexNormals();

  // Darken steep rock cliff faces slightly to simulate basalt shadow
  const normals = geometry.attributes.normal;
  const colorAttr = geometry.attributes.color;
  for (let i = 0; i < normals.count; i++) {
    const ny = normals.getY(i);
    if (ny < 0.65) {
      const cliffFactor = THREE.MathUtils.lerp(0.74, 1.0, Math.max(0, (ny - 0.2) / 0.45));
      colorAttr.setX(i, colorAttr.getX(i) * cliffFactor);
      colorAttr.setY(i, colorAttr.getY(i) * cliffFactor);
      colorAttr.setZ(i, colorAttr.getZ(i) * cliffFactor);
    }
  }

  const material = createTerrainMaterial(lowColor, highColor, enableSunBreak);
  return { mesh: new THREE.Mesh(geometry, material), material };
}

/**
 * Creates 4 continuous mountain depth layers:
 * 1. farGroup    (Z ~ -255) - distant alpine peaks, soft mist, parallax ~0.14
 * 2. midFarGroup (Z ~ -145) - prominent ridges & high crags, parallax ~0.36
 * 3. midGroup    (Z ~ -45)  - valley corridor walls & flanking spurs, parallax ~0.62
 * 4. nearGroup   (Z ~ +45)  - continuous valley floor & foreground terrain extending past camera, parallax ~0.85
 */
export function createMultiLayerTerrain(compact) {
  const root = new THREE.Group();
  const materials = [];

  // 1. Far Mountains (Z ~ -255, depth 160: Z in [-335, -175])
  const far = buildTerrainMesh(
    480, 160,
    compact ? 70 : 120, compact ? 50 : 80,
    -255,
    '#20444e', '#355f6b', '#628e99',
    false
  );
  const farGroup = new THREE.Group();
  farGroup.add(far.mesh);
  farGroup.userData = { parallaxFactor: 0.14, baseZ: -255 };
  root.add(farGroup);
  materials.push(far.material);

  // 2. Mid-Far Mountains (Z ~ -145, depth 130: Z in [-210, -80]) - Catch sunbreak on high ridge
  const midFar = buildTerrainMesh(
    420, 130,
    compact ? 80 : 130, compact ? 55 : 90,
    -145,
    '#183d48', '#2b5764', '#6a97a1',
    true
  );
  const midFarGroup = new THREE.Group();
  midFarGroup.add(midFar.mesh);
  midFarGroup.userData = { parallaxFactor: 0.36, baseZ: -145 };
  root.add(midFarGroup);
  materials.push(midFar.material);

  // 3. Mid Valley Walls (Z ~ -45, depth 120: Z in [-105, +15]) - Catch sunbreak on valley flank
  const mid = buildTerrainMesh(
    360, 120,
    compact ? 90 : 140, compact ? 60 : 100,
    -45,
    '#14353f', '#25505c', '#75a3ac',
    true
  );
  const midGroup = new THREE.Group();
  midGroup.add(mid.mesh);
  midGroup.userData = { parallaxFactor: 0.62, baseZ: -45 };
  root.add(midGroup);
  materials.push(mid.material);

  // 4. Foreground & Valley Floor (Z ~ +45, depth 180: Z in [-45, +135])
  // Extends under and behind camera frustum (camera is at Z: 106 -> 50)
  const near = buildTerrainMesh(
    320, 180,
    compact ? 90 : 140, compact ? 70 : 110,
    45,
    '#112d36', '#1e4854', '#588891',
    false
  );
  const nearGroup = new THREE.Group();
  nearGroup.add(near.mesh);
  nearGroup.userData = { parallaxFactor: 0.85, baseZ: 45 };
  root.add(nearGroup);
  materials.push(near.material);

  return { root, farGroup, midFarGroup, midGroup, nearGroup, materials };
}

export function createTerrain(compact) {
  return createMultiLayerTerrain(compact).root;
}
