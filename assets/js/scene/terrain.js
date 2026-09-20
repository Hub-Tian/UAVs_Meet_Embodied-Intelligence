import * as THREE from 'three';

// 32-bit Murmur/Wang-style integer hash: zero trigonometric aliasing or Moiré patterns
function hash2d(ix, iz) {
  let n = ((ix * 374761393 + iz * 668265263) ^ 0x5bf03635) >>> 0;
  n = Math.imul(n ^ (n >>> 13), 1274126177) >>> 0;
  return ((n ^ (n >>> 16)) >>> 0) / 4294967296.0;
}

// C2-continuous Perlin value noise with quintic Hermite interpolation
function noise(x, z) {
  const ix = Math.floor(x), iz = Math.floor(z);
  const fx = x - ix, fz = z - iz;
  // Quintic curve: 6t^5 - 15t^4 + 10t^3 (eliminates 1st & 2nd derivative seams)
  const u = fx * fx * fx * (fx * (fx * 6.0 - 15.0) + 10.0);
  const v = fz * fz * fz * (fz * (fz * 6.0 - 15.0) + 10.0);

  const a = hash2d(ix, iz);
  const b = hash2d(ix + 1, iz);
  const c = hash2d(ix, iz + 1);
  const d = hash2d(ix + 1, iz + 1);

  return (a * (1.0 - u) + b * u) * (1.0 - v) + (c * (1.0 - u) + d * u) * v;
}

// Ridged multifractal octave for sharp arêtes and mountain ribs
function ridged(x, z) {
  const n = noise(x, z);
  return 1.0 - Math.abs(2.0 * n - 1.0);
}

// Hermite smoothstep interpolation
function smoothstep(edge0, edge1, x) {
  const t = THREE.MathUtils.clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
  return t * t * (3.0 - 2.0 * t);
}

// Sharp Alpine Peak Mass for distant horizon summits
function alpinePeak(x, z, px, pz, h, rx, rz) {
  const dx = Math.abs(x - px) / rx;
  const dz = Math.abs(z - pz) / rz;
  const d = Math.sqrt(dx * dx + dz * dz);
  return h * Math.exp(-d * 1.35);
}

/**
 * Continuous Icelandic Mountain Valley Elevation Function.
 *
 * 3-Tier Geological Hierarchy with Sharp Alpine Arêtes:
 * Tier 1 (Macro): Continuous mountain massifs with dominant peaks,
 *         secondary peaks, saddles, and knife-edge ridge spines on both left and right.
 * Tier 2 (Meso): Domain-warped ridged facets, rock arêtes, and couloirs.
 * Tier 3 (Micro): Natural rock grain texture (zero periodic Moiré striping).
 *
 * Guarantees:
 * - Left side: Dominant Horn (h~46) + 2 Secondary Peaks (h~37 & h~20) with clear saddle passes.
 * - Right side: Dominant Peak (h~48) + Sunlit Ridge Break (h~37) + Front Shoulder (h~22).
 * - Central Valley: Continuous natural alluvial floor (Y ~ 1.8 - 2.6) meandering into distance.
 * - Foreground: Extends continuously past and under camera frustum with zero bottom edge.
 */
export function elevation(x, z) {
  // Sinuous valley corridor centerline that gently meanders
  const valleyCenter = 10.0 * Math.sin(z * 0.014) + 3.0 * Math.cos(z * 0.032);
  const distValley = x - valleyCenter;

  // Valley floor carving (flattens central canyon corridor)
  const valleyW = 23.0 + Math.sin(z * 0.018) * 4.0;
  const valleyMask = 1.0 - Math.exp(-Math.pow(distValley / valleyW, 2));

  // Alluvial floor with gentle natural wash undulation (smooth natural bed)
  const floorUndulation = 1.6 + 0.5 * Math.sin(z * 0.02) + 0.3 * noise(x * 0.03, z * 0.03);

  // =========================================================================
  // 1. LEFT CONTINUOUS MOUNTAIN RANGE (Sharp Spine & Massif)
  // =========================================================================
  const leftSpineX = -45.0 - 0.10 * (z + 82.0) + 3.5 * Math.sin(z * 0.024);

  // 1 Dominant Peak (z = -82, h = 46) + 2 Secondary Peaks (z = -138, h = 37; z = -32, h = 24)
  const zRelL1 = Math.abs(z + 82.0) / 24.0;
  const l1Peak = 46.0 * Math.exp(-zRelL1 * 1.25);

  const zRelL2 = Math.abs(z + 138.0) / 20.0;
  const l2Peak = 37.0 * Math.exp(-zRelL2 * 1.25);

  const zRelL3 = Math.abs(z + 32.0) / 18.0;
  const l3Peak = 24.0 * Math.exp(-zRelL3 * 1.20);

  // Continuous connecting ridge baseline between peaks (arête spine)
  const zNormLeft = THREE.MathUtils.clamp((-z + 40.0) / 190.0, 0.0, 1.0);
  const leftRidgeBaseline = 14.0 + 14.0 * zNormLeft;

  const leftSpineH = Math.max(leftRidgeBaseline, Math.max(l1Peak, Math.max(l2Peak, l3Peak)));

  // Sharp knife-edge cross-section at spine
  const distFromLeftSpine = Math.abs(x - leftSpineX);
  const leftSlopeW = x > leftSpineX ? 26.0 : 48.0;
  const leftCrossSection = Math.exp(-Math.pow(distFromLeftSpine / leftSlopeW, 1.18));
  const leftMassif = leftSpineH * leftCrossSection;

  // =========================================================================
  // 2. RIGHT CONTINUOUS MOUNTAIN RANGE (Sharp Spine & Massif)
  // =========================================================================
  const rightSpineX = 44.0 - 0.08 * (z + 80.0) + 3.0 * Math.sin(z * 0.026);

  // 1 Dominant Peak (z = -92, h = 48) + Sun Break Ridge (z = -54, h = 37) + Front Shoulder (z = -12, h = 22)
  const zRelR1 = Math.abs(z + 92.0) / 24.0;
  const r1Peak = 48.0 * Math.exp(-zRelR1 * 1.25);

  const zRelR2 = Math.abs(z + 54.0) / 18.0;
  const r2Peak = 37.0 * Math.exp(-zRelR2 * 1.20);

  const zRelR3 = Math.abs(z + 12.0) / 16.0;
  const r3Peak = 22.0 * Math.exp(-zRelR3 * 1.15);

  const zNormRight = THREE.MathUtils.clamp((-z + 40.0) / 190.0, 0.0, 1.0);
  const rightRidgeBaseline = 13.0 + 13.0 * zNormRight;

  const rightSpineH = Math.max(rightRidgeBaseline, Math.max(r1Peak, Math.max(r2Peak, r3Peak)));

  // Sharp knife-edge cross-section at right spine
  const distFromRightSpine = Math.abs(x - rightSpineX);
  const rightSlopeW = x < rightSpineX ? 25.0 : 46.0;
  const rightCrossSection = Math.exp(-Math.pow(distFromRightSpine / rightSlopeW, 1.18));
  const rightMassif = rightSpineH * rightCrossSection;

  // Select left or right massif based on valley divide
  let macroMass = distValley < 0 ? leftMassif : rightMassif;

  // =========================================================================
  // 3. FAR ALPINE HORIZON SKYLINE (Layer A: Z in [-335, -170])
  // =========================================================================
  const farPeaks = (
    alpinePeak(x, z, -90.0, -255.0, 54.0, 38.0, 48.0) +
    alpinePeak(x, z, -28.0, -265.0, 50.0, 30.0, 40.0) +
    alpinePeak(x, z, 30.0, -270.0, 52.0, 32.0, 42.0) +
    alpinePeak(x, z, 90.0, -255.0, 56.0, 38.0, 48.0)
  );
  const farCrest = 12.0 * ridged(x * 0.022 + 9.0, z * 0.022 + 4.0);
  const farFactor = smoothstep(-140.0, -200.0, z);
  macroMass = Math.max(macroMass, (farPeaks + farCrest) * farFactor);

  // =========================================================================
  // 4. MESO-SCALE TECTONIC RIDGES & ROCK FACETS (Domain-Warped)
  // =========================================================================
  const wx = 3.5 * noise(x * 0.018, z * 0.018);
  const wz = 3.5 * noise(x * 0.018 + 13.0, z * 0.018 + 27.0);

  const mesoRidges = (
    3.6 * ridged((x + wx) * 0.026 + 12.0, (z + wz) * 0.026 + 34.0) +
    1.8 * ridged((x + wx) * 0.055, (z + wz) * 0.055)
  );
  const mesoFactor = THREE.MathUtils.clamp(macroMass / 18.0, 0.0, 1.0);

  // Natural fine rock grain
  const fineRock = (ridged(x * 0.08 + wx * 0.5, z * 0.08 + wz * 0.5) - 0.5) * 1.2 * mesoFactor;

  // Final composite elevation
  return Math.max(0.5, floorUndulation + valleyMask * (macroMass + mesoRidges * mesoFactor + fineRock));
}

/**
 * Creates terrain material with dynamic Sun Break shader injection
 */
function createTerrainMaterial(lowColor, highColor, enableSunBreak = false) {
  const material = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.88,
    metalness: 0.04,
    depthTest: true,
    depthWrite: true
  });

  if (enableSunBreak) {
    // Center of morning sunbreak on the prominent right ridge break (x=41, z=-54, y=37)
    material.userData.uSunBreak = { value: 0.0 };
    material.userData.uSunCenter = { value: new THREE.Vector3(41.0, 35.0, -54.0) };

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
          // Localized morning sunlight beam on the right mountain ridge (15% - 35% of ridge)
          vec2 beamOffset = (vCustomWorldPos.xz - uSunCenter.xz) * vec2(0.85, 1.15);
          float beamDist = length(beamOffset);
          float beamMask = smoothstep(44.0, 6.0, beamDist);
          float heightMask = smoothstep(16.0, 42.0, vCustomWorldPos.y);
          vec3 sunDir = normalize(vec3(-0.62, 0.70, 0.35));
          float facing = clamp(dot(normalize(vNormal), sunDir), 0.0, 1.0);
          float sunFactor = uSunBreak * beamMask * heightMask * pow(facing, 1.35);

          // Warm morning sun illumination: warm golden grazing light, no blown-out white
          vec3 warmSun = vec3(1.0, 0.86, 0.65);
          gl_FragColor.rgb = mix(gl_FragColor.rgb, gl_FragColor.rgb * warmSun * 1.45 + warmSun * 0.22, sunFactor);
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

    // Continuous geological strata color assignment using smooth Hermite curve
    const normH = THREE.MathUtils.clamp((y - 1.5) / 46.0, 0, 1);
    const tH = normH * normH * (3.0 - 2.0 * normH);
    if (tH < 0.38) {
      vertexColor.copy(cLow).lerp(cMid, tH / 0.38);
    } else {
      vertexColor.copy(cMid).lerp(cHigh, (tH - 0.38) / 0.62);
    }
    colors.push(vertexColor.r, vertexColor.g, vertexColor.b);
  }

  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.computeVertexNormals();

  const material = createTerrainMaterial(lowColor, highColor, enableSunBreak);
  return { mesh: new THREE.Mesh(geometry, material), material };
}

/**
 * Creates continuous mountain depth layers with ZERO valley floor seam cuts:
 * 1. farGroup    (Z in [-340, -180]) - distant alpine peaks, soft mist, parallax ~0.14
 * 2. midFarGroup (Z in [-190, -80])  - dominant peaks & high alpine crags, parallax ~0.36
 * 3. midGroup    - anchor group for scene hierarchy compatibility
 * 4. nearGroup   (Z in [-82, +138])  - continuous unified foreground + mid-valley floor and sunlit ridge break
 */
export function createMultiLayerTerrain(compact) {
  const root = new THREE.Group();
  const materials = [];

  // 1. Far Mountains (Z ~ -260, depth 160: Z in [-340, -180])
  const far = buildTerrainMesh(
    480, 160,
    compact ? 80 : 140, compact ? 55 : 90,
    -260,
    '#20444e', '#355f6b', '#628e99',
    false
  );
  const farGroup = new THREE.Group();
  farGroup.add(far.mesh);
  farGroup.userData = { parallaxFactor: 0.14, baseZ: -260 };
  root.add(farGroup);
  materials.push(far.material);

  // 2. Mid-Far Mountains (Z ~ -135, depth 110: Z in [-190, -80]) - Dominant Horns & High Crags
  const midFar = buildTerrainMesh(
    420, 110,
    compact ? 90 : 160, compact ? 60 : 110,
    -135,
    '#183d48', '#2b5764', '#6a97a1',
    true
  );
  const midFarGroup = new THREE.Group();
  midFarGroup.add(midFar.mesh);
  midFarGroup.userData = { parallaxFactor: 0.36, baseZ: -135 };
  root.add(midFarGroup);
  materials.push(midFar.material);

  // 3. MidGroup (empty anchor to maintain interface compatibility)
  const midGroup = new THREE.Group();
  midGroup.userData = { parallaxFactor: 0.55, baseZ: -45 };
  root.add(midGroup);

  // 4. Unified Continuous Foreground & Mid-Valley Floor (Z ~ +28, depth 220: Z in [-82, +138])
  // Extends unbroken from foreground (+138, behind camera) all the way to midground (-82)
  // Guarantees ZERO visible seam, teeth, or sliding in the valley corridor!
  const near = buildTerrainMesh(
    360, 220,
    compact ? 110 : 180, compact ? 90 : 150,
    28,
    '#112d36', '#1e4854', '#588891',
    true
  );
  const nearGroup = new THREE.Group();
  nearGroup.add(near.mesh);
  nearGroup.userData = { parallaxFactor: 0.80, baseZ: 28 };
  root.add(nearGroup);
  materials.push(near.material);

  return { root, farGroup, midFarGroup, midGroup, nearGroup, materials };
}

export function createTerrain(compact) {
  return createMultiLayerTerrain(compact).root;
}
