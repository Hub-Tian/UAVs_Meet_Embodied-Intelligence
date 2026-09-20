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

// Sinuous river centerline equation (delicate serpentine meanders)
export function getRiverX(z) {
  return 6.2 * Math.sin(z * 0.038) + 3.0 * Math.sin(z * 0.078 + 1.1);
}

// Sloping interlocking mountain spur (斜向交错山嘴)
function mountainSpur(x, z, rootX, rootZ, tipX, tipZ, rootH, tipH, spurWidth) {
  const vX = tipX - rootX;
  const vZ = tipZ - rootZ;
  const lenSq = vX * vX + vZ * vZ;
  if (lenSq < 0.001) return 0;

  const t = THREE.MathUtils.clamp(((x - rootX) * vX + (z - rootZ) * vZ) / lenSq, 0.0, 1.0);
  const projX = rootX + t * vX;
  const projZ = rootZ + t * vZ;

  const distSq = (x - projX) * (x - projX) + (z - projZ) * (z - projZ);
  const w = spurWidth * (1.0 + 0.32 * (1.0 - t));
  const heightAlong = THREE.MathUtils.lerp(rootH, tipH, t);

  return heightAlong * Math.exp(-distSq / (w * w));
}

/**
 * Grand Alpine Canyon Gorge Elevation Function (高山深切峡谷与真实交错山嘴).
 *
 * Geological Architecture:
 * 1. Deep V-Canyon Corridor with sinuous alluvial floor and carved river channel.
 * 2. Alternating Interlocking Spurs (交错山嘴): Sloping mountain spurs jutting into
 *    the valley from left and right alternately, creating authentic photographic canyon depth.
 * 3. Stepped Stratified Escarpments: Sheer rock cliff bands alternating with structural ledges.
 * 4. Sawtooth Horizon Horns: High jagged peaks towering into misty morning sky.
 */
export function elevation(x, z) {
  const riverX = getRiverX(z);
  const distRiver = x - riverX;

  // Gentle river channel groove
  const riverBed = -0.42 * Math.exp(-Math.pow(distRiver / 1.6, 2));

  // Natural valley alluvial bed
  const floorBase = 1.6 + 0.3 * Math.sin(z * 0.02) + 0.2 * noise(x * 0.04, z * 0.04) + riverBed;

  // Sinuous canyon floor width
  const valleyW = 15.2 + 2.5 * Math.sin(z * 0.025);

  // =========================================================================
  // 1. LEFT CANYON MASSIF & INTERLOCKING SPURS
  // =========================================================================
  const leftSpineX = -48.0 - 0.08 * (z + 80.0) + 3.0 * Math.sin(z * 0.025);

  // Left peaks
  const zRelL1 = Math.abs(z + 82.0) / 24.0;
  const l1Peak = 48.0 * Math.exp(-zRelL1 * 1.25);

  const zRelL2 = Math.abs(z + 138.0) / 20.0;
  const l2Peak = 39.0 * Math.exp(-zRelL2 * 1.25);

  const zRelL3 = Math.abs(z + 32.0) / 18.0;
  const l3Peak = 27.0 * Math.exp(-zRelL3 * 1.20);

  const zNormLeft = THREE.MathUtils.clamp((-z + 40.0) / 190.0, 0.0, 1.0);
  const leftBaseline = 16.0 + 15.0 * zNormLeft;
  const leftSpineH = Math.max(leftBaseline, Math.max(l1Peak, Math.max(l2Peak, l3Peak)));

  // Mountain wall profile
  const distFromLeftSpine = Math.abs(x - leftSpineX);
  const leftSlopeW = x > leftSpineX ? 32.0 : 48.0;
  const leftMassif = leftSpineH * Math.exp(-Math.pow(distFromLeftSpine / leftSlopeW, 1.25));

  // Left interlocking spurs (jutting into valley at z = -35, z = -115, z = +45)
  const spurL1 = mountainSpur(x, z, -42.0, -35.0, -11.0, -38.0, 30.0, 6.5, 11.0);
  const spurL2 = mountainSpur(x, z, -45.0, -115.0, -13.0, -118.0, 32.0, 7.5, 12.0);
  const spurL3 = mountainSpur(x, z, -40.0, 45.0, -10.0, 42.0, 24.0, 5.5, 10.0);

  // =========================================================================
  // 2. RIGHT CANYON MASSIF & INTERLOCKING SPURS
  // =========================================================================
  const rightSpineX = 46.0 - 0.07 * (z + 80.0) + 3.0 * Math.sin(z * 0.026);

  // Right peaks
  const zRelR1 = Math.abs(z + 92.0) / 24.0;
  const r1Peak = 50.0 * Math.exp(-zRelR1 * 1.25);

  const zRelR2 = Math.abs(z + 54.0) / 18.0;
  const r2Peak = 40.0 * Math.exp(-zRelR2 * 1.20);

  const zRelR3 = Math.abs(z + 12.0) / 16.0;
  const r3Peak = 25.0 * Math.exp(-zRelR3 * 1.15);

  const zNormRight = THREE.MathUtils.clamp((-z + 40.0) / 190.0, 0.0, 1.0);
  const rightBaseline = 16.0 + 14.0 * zNormRight;
  const rightSpineH = Math.max(rightBaseline, Math.max(r1Peak, Math.max(r2Peak, r3Peak)));

  // Mountain wall profile
  const distFromRightSpine = Math.abs(x - rightSpineX);
  const rightSlopeW = x < rightSpineX ? 31.0 : 46.0;
  const rightMassif = rightSpineH * Math.exp(-Math.pow(distFromRightSpine / rightSlopeW, 1.25));

  // Right interlocking spurs (jutting into valley at z = -75, z = -10, z = +80)
  const spurR1 = mountainSpur(x, z, 42.0, -75.0, 12.0, -78.0, 32.0, 7.0, 12.0);
  const spurR2 = mountainSpur(x, z, 38.0, -10.0, 11.0, -12.0, 26.0, 6.0, 10.5);
  const spurR3 = mountainSpur(x, z, 36.0, 80.0, 10.0, 78.0, 22.0, 5.0, 10.0);

  // Combine massifs and spurs
  const totalLeft = Math.max(leftMassif, Math.max(spurL1, Math.max(spurL2, spurL3)));
  const totalRight = Math.max(rightMassif, Math.max(spurR1, Math.max(spurR2, spurR3)));

  // Valley floor carving
  const valleyMask = 1.0 - Math.exp(-Math.pow(distRiver / valleyW, 2));
  let canyonH = valleyMask * (distRiver < 0 ? totalLeft : totalRight);

  // Stepped structural terraces on lower slopes (y < 22)
  const terraceStep = 0.8 * Math.sin(canyonH * 0.7) * smoothstep(2.5, 20.0, canyonH);
  canyonH += terraceStep;

  // =========================================================================
  // 3. FAR ALPINE SAWTOOTH HORIZON (Z in [-340, -180])
  // =========================================================================
  const farPeaks = (
    alpinePeak(x, z, -85.0, -255.0, 58.0, 36.0, 46.0) +
    alpinePeak(x, z, -24.0, -270.0, 54.0, 28.0, 38.0) +
    alpinePeak(x, z, 32.0, -265.0, 56.0, 30.0, 40.0) +
    alpinePeak(x, z, 88.0, -250.0, 60.0, 36.0, 46.0)
  );
  const farSawtooth = 14.0 * ridged(x * 0.024 + 7.0, z * 0.024 + 5.0);
  const farFactor = smoothstep(-140.0, -210.0, z);
  canyonH = Math.max(canyonH, (farPeaks + farSawtooth) * farFactor);

  // =========================================================================
  // 4. MESO-SCALE VERTICAL ROCK GULLIES & JOINT FISSURES
  // =========================================================================
  const wx = 3.0 * noise(x * 0.018, z * 0.018);
  const wz = 3.0 * noise(x * 0.018 + 11.0, z * 0.018 + 23.0);
  const rockGullies = (
    3.6 * ridged((x + wx) * 0.028 + 14.0, (z + wz) * 0.028 + 36.0) +
    1.8 * ridged((x + wx) * 0.06, (z + wz) * 0.06)
  );
  const mesoFactor = THREE.MathUtils.clamp(canyonH / 16.0, 0.0, 1.0);
  const fineRock = (ridged(x * 0.08 + wx * 0.5, z * 0.08 + wz * 0.5) - 0.5) * 1.1 * mesoFactor;

  return Math.max(0.4, floorBase + canyonH + rockGullies * mesoFactor + fineRock);
}

/**
 * Creates canyon terrain material with dynamic Sun Break shader injection
 */
function createTerrainMaterial(enableSunBreak = false) {
  const material = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.84,
    metalness: 0.05,
    depthTest: true,
    depthWrite: true
  });

  if (enableSunBreak) {
    material.userData.uSunBreak = { value: 0.0 };
    material.userData.uSunCenter = { value: new THREE.Vector3(38.0, 30.0, -50.0) };

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
          // Morning sunlight beam striking the right canyon cliff and golden terraces
          vec2 beamOffset = (vCustomWorldPos.xz - uSunCenter.xz) * vec2(0.85, 1.15);
          float beamDist = length(beamOffset);
          float beamMask = smoothstep(52.0, 6.0, beamDist);
          float heightMask = smoothstep(6.0, 44.0, vCustomWorldPos.y);
          vec3 sunDir = normalize(vec3(0.58, 0.67, -0.49));
          float facing = clamp(dot(normalize(vNormal), sunDir), 0.0, 1.0);
          float sunFactor = uSunBreak * beamMask * heightMask * pow(facing, 1.3);

          // Warm golden amber sunlight matching photographic reference
          vec3 warmSun = vec3(1.0, 0.82, 0.48);
          gl_FragColor.rgb = mix(gl_FragColor.rgb, gl_FragColor.rgb * warmSun * 1.55 + warmSun * 0.28, sunFactor);
        }
        `
      );
    };
  }

  return material;
}

/**
 * Builds terrain mesh with slope-aware, elevation-aware, and river-aware multi-strata coloring:
 * - Silvery glistening river stream with fine gravel banks
 * - Golden autumn terraces and meadows on flat/gentle lower grounds
 * - Clustered dark conifer pine forests dotting slopes and ravines
 * - Stratified slate rock cliffs on steep vertical escarpments with sedimentary strata
 * - High alpine crags fading into atmospheric sky haze
 */
function buildTerrainMesh(width, depth, segW, segD, centerZ, enableSunBreak = false, isFar = false) {
  const geometry = new THREE.PlaneGeometry(width, depth, segW, segD);
  geometry.rotateX(-Math.PI / 2);
  geometry.translate(0, 0, centerZ);
  const positions = geometry.attributes.position;

  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i);
    const z = positions.getZ(i);
    positions.setY(i, elevation(x, z));
  }

  geometry.computeVertexNormals();
  const normals = geometry.attributes.normal;
  const colors = [];

  // Colors closely matched to user reference photo:
  // 1. Water & Shore
  const cRiver = new THREE.Color('#eaf5fa');
  const cRiverGlint = new THREE.Color('#ffffff');
  const cGravelShore = new THREE.Color('#8c9fa8');
  // 2. Golden autumn terraces / meadows
  const cGoldLush = new THREE.Color('#dfa435'); // rich autumn gold
  const cGoldDeep = new THREE.Color('#c6922d'); // warm amber mustard
  const cGoldPale = new THREE.Color('#eed87c'); // sunlit straw terrace highlight
  const cAutumnMeadow = new THREE.Color('#7a8e42'); // olive yellow meadow
  // 3. Pine forest (clustered conifers)
  const cPineForest = new THREE.Color('#162d22'); // deep conifer green
  const cPineShadow = new THREE.Color('#0e1f16'); // dark ravine conifer
  // 4. Stratified rock cliffs
  const cSlateCliff = new THREE.Color('#252d34'); // dark charcoal slate rock
  const cRockStrata = new THREE.Color('#3c454e'); // sedimentary cool rock band
  const cWarmStrata = new THREE.Color('#46433b'); // warm limestone strata band
  const cHighCrag = new THREE.Color('#55606a'); // high alpine crags
  const cFarMist = new THREE.Color('#7897a2'); // distant atmospheric haze

  const vColor = new THREE.Color();

  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i);
    const y = positions.getY(i);
    const z = positions.getZ(i);
    const ny = normals.getY(i);

    if (isFar) {
      const hNorm = THREE.MathUtils.clamp((y - 4.0) / 48.0, 0, 1);
      vColor.copy(cSlateCliff).lerp(cFarMist, 0.45 + 0.55 * hNorm);
    } else {
      const riverX = getRiverX(z);
      const dRiver = Math.abs(x - riverX);

      if (dRiver < 2.4 && y < 3.2 && ny > 0.80) {
        // Serpentine alpine river with glistening center and sandy gravel shores
        const waterMask = smoothstep(1.4, 0.3, dRiver);
        const shoreMask = smoothstep(2.4, 1.2, dRiver);
        const glint = 0.5 + 0.5 * Math.sin(z * 0.16 + x * 0.1);
        const riverColor = new THREE.Color().copy(cRiver).lerp(cRiverGlint, glint * 0.4);
        vColor.copy(cGravelShore).lerp(riverColor, waterMask);
      } else {
        // Base rock with dual-band sedimentary strata
        const strataOsc1 = 0.5 + 0.5 * Math.sin(y * 1.35 + noise(x * 0.05, z * 0.05) * 2.2);
        const strataOsc2 = 0.5 + 0.5 * Math.sin(y * 2.1 + 1.2);
        let rockBase = new THREE.Color().copy(cSlateCliff).lerp(cRockStrata, strataOsc1 * 0.55);
        rockBase.lerp(cWarmStrata, strataOsc2 * 0.25);

        if (y > 27.0) {
          // High mountain crags
          const hRatio = THREE.MathUtils.clamp((y - 27.0) / 23.0, 0, 1);
          vColor.copy(rockBase).lerp(cHighCrag, hRatio * 0.7);
        } else if (ny < 0.60) {
          // Sheer vertical canyon cliff faces
          const steepRatio = THREE.MathUtils.clamp((0.60 - ny) / 0.35, 0, 1);
          vColor.copy(rockBase).multiplyScalar(1.0 - steepRatio * 0.26);
        } else {
          // Valley floor and stepped terraces:
          const vegNoise = noise(x * 0.07 + 5.0, z * 0.07 + 11.0);
          const treeCluster = noise(x * 0.11 + 3.0, z * 0.11 + 7.0);

          if (treeCluster > 0.60 && ny < 0.86 && y > 2.0) {
            // Clustered dark pine forest
            const forestCol = new THREE.Color().copy(cPineForest).lerp(cPineShadow, vegNoise);
            vColor.copy(rockBase).lerp(forestCol, 0.88);
          } else if (y < 20.0 && ny > 0.66) {
            // Golden autumn terraces and alpine meadows
            let goldMix = new THREE.Color().copy(cGoldDeep).lerp(cGoldLush, vegNoise);
            const terraceStripe = 0.5 + 0.5 * Math.sin(y * 2.2 + vegNoise * 2.4);
            if (terraceStripe > 0.62) {
              goldMix.lerp(cGoldPale, 0.45);
            } else if (terraceStripe < 0.32) {
              goldMix.lerp(cAutumnMeadow, 0.35);
            }
            const flatFactor = smoothstep(0.66, 0.82, ny);
            vColor.copy(rockBase).lerp(goldMix, flatFactor * 0.94);
          } else {
            // Transitional alpine shrub & moss
            const shrubCol = new THREE.Color().copy(cAutumnMeadow).lerp(cPineForest, vegNoise * 0.45);
            vColor.copy(rockBase).lerp(shrubCol, 0.65);
          }
        }
      }
    }

    colors.push(vColor.r, vColor.g, vColor.b);
  }

  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

  const material = createTerrainMaterial(enableSunBreak);
  return { mesh: new THREE.Mesh(geometry, material), material };
}

/**
 * Creates continuous canyon depth layers with ZERO valley floor seam cuts:
 * 1. farGroup    (Z in [-340, -180]) - distant sawtooth peaks, soft mist, parallax ~0.14
 * 2. midFarGroup (Z in [-190, -80])  - dominant peaks & canyon escarpments, parallax ~0.36
 * 3. midGroup    - anchor group for scene hierarchy compatibility
 * 4. nearGroup   (Z in [-82, +138])  - continuous unified foreground + mid-valley floor and sunlit terraces
 */
export function createMultiLayerTerrain(compact) {
  const root = new THREE.Group();
  const materials = [];

  // 1. Far Mountains (Z ~ -260, depth 160: Z in [-340, -180])
  const far = buildTerrainMesh(
    480, 160,
    compact ? 80 : 140, compact ? 55 : 90,
    -260,
    false,
    true
  );
  const farGroup = new THREE.Group();
  farGroup.add(far.mesh);
  farGroup.userData = { parallaxFactor: 0.14, baseZ: -260 };
  root.add(farGroup);
  materials.push(far.material);

  // 2. Mid-Far Mountains (Z ~ -135, depth 110: Z in [-190, -80]) - Dominant Horns & Canyon Escarpments
  const midFar = buildTerrainMesh(
    420, 110,
    compact ? 95 : 170, compact ? 65 : 120,
    -135,
    true,
    false
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
  // High mesh resolution ensures smooth terrain facets, crisp river, and terrace contours
  const near = buildTerrainMesh(
    360, 220,
    compact ? 130 : 220, compact ? 110 : 180,
    28,
    true,
    false
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
