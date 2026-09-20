import * as THREE from 'three';

// 3D Cinematic Flight Path:
// P0: Foreground right sky (Hover & Opening, ~18vw-22vw, close to camera)
// P1: Mountain front approach
// P2: Front of ridge / banking into turn
// P3: Behind ridge crest (NATURAL 3D DEPTH OCCLUSION behind mountain!)
// P4: Far side re-emergence / valley flank
// P5: Center valley corridor
// P6: Distant horizon silhouette (~12% scale)
const FLIGHT_WAYPOINTS = [
  new THREE.Vector3(16.0, 35.8, 76.0),   // P0: Foreground right sky (clear of title, grazing right edge)
  new THREE.Vector3(20.5, 32.2, 48.0),   // P1: Ridge approach
  new THREE.Vector3(24.2, 26.5, 12.0),   // P2: Front of ridge / bank
  new THREE.Vector3(21.5, 19.8, -32.0),  // P3: Behind ridge crest (OCCLUDED!)
  new THREE.Vector3(10.5, 19.5, -65.0),  // P4: Far side re-emergence
  new THREE.Vector3(2.5,  21.0, -110.0), // P5: Center valley corridor
  new THREE.Vector3(0.0,  23.5, -170.0)  // P6: Distant horizon
];
const flightCurve = new THREE.CatmullRomCurve3(FLIGHT_WAYPOINTS, false, 'catmullrom', 0.45);

/**
 * Creates the primary Hero UAV prominently situated in the foreground sky.
 * Scaled ~18vw - 22vw visual width on desktop, placed in the upper-right sky.
 */
export function createHeroDrone() {
  const group = new THREE.Group();

  // Materials with depthTest & depthWrite enabled for authentic 3D occlusion
  const shellMat = new THREE.MeshStandardMaterial({
    color: '#dceef2',
    metalness: 0.48,
    roughness: 0.38,
    transparent: true,
    opacity: 1.0,
    depthTest: true,
    depthWrite: true
  });

  const carbonMat = new THREE.MeshStandardMaterial({
    color: '#1a2c35',
    metalness: 0.72,
    roughness: 0.32,
    transparent: true,
    opacity: 1.0,
    depthTest: true,
    depthWrite: true
  });

  const skidMat = new THREE.MeshStandardMaterial({
    color: '#253e4c',
    metalness: 0.6,
    roughness: 0.4,
    transparent: true,
    opacity: 1.0,
    depthTest: true,
    depthWrite: true
  });

  const bladeMat = new THREE.MeshStandardMaterial({
    color: '#537d8a',
    metalness: 0.25,
    roughness: 0.45,
    transparent: true,
    opacity: 0.76,
    depthTest: true,
    depthWrite: false
  });

  // 1. Central Avionics Fuselage (High-Tech Hexagonal Aerodynamic Body)
  const bodyGeo = new THREE.BoxGeometry(1.85, 0.58, 2.55);
  const bodyMesh = new THREE.Mesh(bodyGeo, shellMat);
  group.add(bodyMesh);

  // Top Aerodynamic Telemetry Cowl & Sensor Mast
  const cowlGeo = new THREE.BoxGeometry(1.15, 0.24, 1.75);
  const cowlMesh = new THREE.Mesh(cowlGeo, carbonMat);
  cowlMesh.position.set(0, 0.36, -0.1);
  group.add(cowlMesh);

  const mastGeo = new THREE.CylinderGeometry(0.06, 0.08, 0.38, 8);
  const mastMesh = new THREE.Mesh(mastGeo, carbonMat);
  mastMesh.position.set(0, 0.58, -0.45);
  group.add(mastMesh);

  // 2. High-Rigidity Carbon Motor Arms (Diagonal X Configuration)
  const armSpan = 2.35;
  const armGeo = new THREE.BoxGeometry(armSpan * 2.7, 0.16, 0.26);
  for (const angle of [-Math.PI / 4, Math.PI / 4]) {
    const armMesh = new THREE.Mesh(armGeo, carbonMat);
    armMesh.rotation.y = angle;
    armMesh.position.y = 0.04;
    group.add(armMesh);
  }

  // 3. 4 Heavy-Duty Brushless Motor Nacelles & Propeller Blades
  const hubGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.28, 16);
  const rotorGeo = new THREE.CylinderGeometry(1.22, 1.22, 0.035, 20);
  const propGeo = new THREE.BoxGeometry(2.35, 0.02, 0.22);

  const rotors = [];
  const rotorPositions = [
    [-armSpan, armSpan],
    [armSpan, armSpan],
    [-armSpan, -armSpan],
    [armSpan, -armSpan]
  ];

  for (const [rx, rz] of rotorPositions) {
    // Motor Nacelle Hub
    const hub = new THREE.Mesh(hubGeo, carbonMat);
    hub.position.set(rx, 0.24, rz);
    group.add(hub);

    // Rotor Disk & Spinning Propellers
    const rotorGroup = new THREE.Group();
    rotorGroup.position.set(rx, 0.39, rz);

    const disk = new THREE.Mesh(rotorGeo, bladeMat);
    rotorGroup.add(disk);

    const prop = new THREE.Mesh(propGeo, carbonMat);
    rotorGroup.add(prop);

    group.add(rotorGroup);
    rotors.push(rotorGroup);
  }

  // 4. Under-Fuselage 3-Axis Stabilized Gimbal Camera & Optical Pod
  const podGeo = new THREE.SphereGeometry(0.38, 16, 12);
  const lensGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.22, 16);
  const lensMat = new THREE.MeshBasicMaterial({ color: '#16edd4' });
  const pod = new THREE.Mesh(podGeo, carbonMat);
  pod.position.set(0, -0.34, 0.45);
  const lens = new THREE.Mesh(lensGeo, lensMat);
  lens.rotation.x = Math.PI / 2;
  lens.position.set(0, -0.42, 0.68);
  group.add(pod);
  group.add(lens);

  // 5. Dual Aerodynamic Carbon Landing Skids
  const skidRailGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.7, 10);
  const strutGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.65, 8);

  for (const side of [-0.95, 0.95]) {
    const rail = new THREE.Mesh(skidRailGeo, skidMat);
    rail.rotation.x = Math.PI / 2;
    rail.position.set(side, -0.72, 0);
    group.add(rail);

    for (const zOffset of [-0.75, 0.75]) {
      const strut = new THREE.Mesh(strutGeo, skidMat);
      strut.position.set(side * 0.75, -0.44, zOffset);
      strut.rotation.z = side > 0 ? -0.35 : 0.35;
      group.add(strut);
    }
  }

  // 6. Navigation Strobe Beacons
  const frontBeacon = new THREE.Mesh(
    new THREE.SphereGeometry(0.14, 10, 8),
    new THREE.MeshBasicMaterial({ color: '#38f8d0', transparent: true, opacity: 0.95 })
  );
  frontBeacon.position.set(0, 0.08, -1.35);
  group.add(frontBeacon);

  const rearBeacon = new THREE.Mesh(
    new THREE.SphereGeometry(0.12, 10, 8),
    new THREE.MeshBasicMaterial({ color: '#ffa857', transparent: true, opacity: 0.88 })
  );
  rearBeacon.position.set(0, 0.08, 1.35);
  group.add(rearBeacon);

  // Initial Placement at P0 in the upper-right sky
  const p0 = FLIGHT_WAYPOINTS[0];
  group.position.copy(p0);
  group.rotation.set(0.05, -0.32, 0);

  group.userData = {
    basePos: p0.clone(),
    rotors,
    frontBeacon,
    rearBeacon,
    bladeMat,
    materials: [shellMat, carbonMat, skidMat, bladeMat],
    revealProgress: 0
  };

  return group;
}

/**
 * Animates the Hero UAV along the cinematic curve:
 * - Idle hover when scrollProgress <= 0.18
 * - Spline orbit, bank roll, and ridge occlusion when scrollProgress in 0.18 -> 0.70
 * - Re-emergence and deep valley fly-away when scrollProgress in 0.70 -> 1.00
 * - Mouse parallax reaction
 */
export function animateHeroDrone(drone, time, mouseTarget, scrollProgress = 0, dt = 0.016) {
  if (!drone) return;
  const { rotors, frontBeacon, rearBeacon, bladeMat, materials } = drone.userData;

  // Initial restrained reveal at page entrance
  if (drone.userData.revealProgress < 1) {
    drone.userData.revealProgress = Math.min(1, drone.userData.revealProgress + dt * 1.25);
  }
  const revealEase = Math.sin(drone.userData.revealProgress * Math.PI / 2);

  // Scroll Progress mapped to flight path progress:
  // Scroll 0% - 18%: Idle Hover / Opening (flightT = 0)
  // Scroll 18% - 100%: 3D spline flight into valley distance (flightT = 0 -> 1)
  const flightT = THREE.MathUtils.clamp((scrollProgress - 0.18) / 0.82, 0, 1);

  // Spline Position and Tangent Vector
  const curvePos = flightCurve.getPointAt(flightT);
  const tangent = flightCurve.getTangentAt(flightT);

  // Scale: Dramatic perspective change from large foreground (~20vw) down to tiny silhouette (~13%)
  const currentScale = THREE.MathUtils.lerp(1.0, 0.13, Math.pow(flightT, 0.70)) * (0.88 + revealEase * 0.12);

  // Idle Hover Cycle (8.5s smooth harmonic, attenuates as flight accelerates)
  const idleWeight = 1 - flightT;
  const idleT = time * (Math.PI * 2 / 8.5);
  const floatY = Math.sin(idleT) * 0.65 * idleWeight;
  const driftX = Math.sin(idleT * 0.5) * 0.38 * idleWeight;
  const idleRoll = Math.cos(idleT * 0.5) * 0.014 * idleWeight;

  // Mouse Parallax Reaction (highest in foreground, subtle viewer immersion)
  const mouseFactor = 1 - flightT * 0.82;
  const mouseOffsetX = (mouseTarget ? mouseTarget.x : 0) * 1.15 * mouseFactor;
  const mouseOffsetY = (mouseTarget ? mouseTarget.y : 0) * 0.75 * mouseFactor;

  // Responsive adaptation for compact / mobile screens
  const isCompact = typeof window !== 'undefined' && window.innerWidth < 768;
  const responsiveX = isCompact ? -11.0 * (1 - flightT) : 0;
  const responsiveY = isCompact ? 5.2 * (1 - flightT) : 0;
  const responsiveScale = isCompact ? 0.62 : 1.0;

  // Set final 3D position
  drone.position.set(
    curvePos.x + driftX + mouseOffsetX + responsiveX,
    curvePos.y + floatY - mouseOffsetY + responsiveY,
    curvePos.z
  );

  // Orientation: Banking and turning along curve
  if (flightT < 0.01) {
    drone.rotation.set(0.05, -0.32, idleRoll);
  } else {
    const curveYaw = Math.atan2(-tangent.x, -tangent.z);
    const curveBank = THREE.MathUtils.clamp(-tangent.x * 2.8, -0.065, 0.065); // ~2° - 4° bank
    const curvePitch = 0.04 + tangent.y * 0.45;
    const blend = Math.min(flightT * 4, 1);

    drone.rotation.y = THREE.MathUtils.lerp(-0.32, curveYaw, blend);
    drone.rotation.z = THREE.MathUtils.lerp(idleRoll, curveBank, blend);
    drone.rotation.x = THREE.MathUtils.lerp(0.05, curvePitch, blend);
  }

  drone.scale.setScalar(currentScale * responsiveScale);

  // Spin 4 rotors
  rotors.forEach((r, idx) => {
    r.rotation.y += (idx % 2 === 0 ? 0.45 : -0.45);
  });

  // Pulse Navigation Beacons
  if (frontBeacon) frontBeacon.material.opacity = (0.7 + Math.sin(time * 3.4) * 0.3) * revealEase;
  if (rearBeacon) rearBeacon.material.opacity = (0.65 + Math.cos(time * 3.4) * 0.35) * revealEase;

  // Subtle material opacity blend into distant mist at final horizon
  const horizonOpacity = flightT > 0.85 ? THREE.MathUtils.lerp(1.0, 0.45, (flightT - 0.85) / 0.15) : 1.0;
  const totalOpacity = horizonOpacity * revealEase;
  materials.forEach(mat => {
    if (mat) mat.opacity = mat === bladeMat ? 0.76 * totalOpacity : totalOpacity;
  });
}

/**
 * Distant ambient UAVs in the deeper valley
 */
export function createDrones() {
  const body = new THREE.BoxGeometry(0.7, 0.22, 1);
  const arm = new THREE.BoxGeometry(2.4, 0.09, 0.12);
  const rotor = new THREE.CylinderGeometry(0.42, 0.42, 0.035, 16);
  const shell = new THREE.MeshStandardMaterial({ color: '#c0d9d8', metalness: 0.45, roughness: 0.5 });
  const blade = new THREE.MeshStandardMaterial({ color: '#537780', metalness: 0.3, roughness: 0.6 });

  return [[-42, 43, -15], [52, 49, -60], [-55, 52, -110]].map((position, index) => {
    const drone = new THREE.Group();
    drone.add(new THREE.Mesh(body, shell));
    for (const angle of [-Math.PI / 4, Math.PI / 4]) {
      const beam = new THREE.Mesh(arm, shell);
      beam.rotation.y = angle;
      drone.add(beam);
    }
    for (const x of [-0.85, 0.85]) {
      for (const z of [-0.85, 0.85]) {
        const disk = new THREE.Mesh(rotor, blade);
        disk.position.set(x, 0.12, z);
        drone.add(disk);
      }
    }
    const beacon = new THREE.Mesh(
      new THREE.SphereGeometry(0.09, 8, 6),
      new THREE.MeshBasicMaterial({ color: index === 0 ? '#efb883' : '#9de0dc' })
    );
    beacon.position.set(0, 0, -0.54);
    drone.add(beacon);
    drone.position.set(...position);
    drone.rotation.y = 0.35 + index * 0.65;
    drone.userData.origin = drone.position.clone();
    return drone;
  });
}

export function animateDrones(drones, time, spread = 1) {
  drones.forEach((drone, i) => {
    const origin = drone.userData.origin;
    drone.position.set(
      origin.x * spread + Math.sin(time * 0.09 + i) * 1.8,
      origin.y + Math.sin(time * 0.28 + i) * 0.35,
      origin.z + Math.cos(time * 0.09 + i) * 1.1
    );
    drone.rotation.z = Math.sin(time * 0.2 + i) * 0.025;
  });
}
