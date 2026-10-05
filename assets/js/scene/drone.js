import * as THREE from 'three';

/**
 * Creates the primary Hero UAV clearly visible in the foreground valley space.
 * Sized ~4.5%-5.5% viewport width, placed top-right above the main title.
 */
export function createHeroDrone() {
  const group = new THREE.Group();

  // Central Avionics Body
  const bodyGeo = new THREE.BoxGeometry(0.9, 0.28, 1.25);
  const shellMat = new THREE.MeshStandardMaterial({
    color: '#d6eaed',
    metalness: 0.5,
    roughness: 0.42,
    transparent: true,
    opacity: 1.0
  });
  const bodyMesh = new THREE.Mesh(bodyGeo, shellMat);
  group.add(bodyMesh);

  // Top canopy accent (stealth aerodynamic cowl)
  const cowlGeo = new THREE.BoxGeometry(0.55, 0.12, 0.85);
  const darkMat = new THREE.MeshStandardMaterial({
    color: '#26424e',
    metalness: 0.65,
    roughness: 0.35,
    transparent: true,
    opacity: 1.0
  });
  const cowlMesh = new THREE.Mesh(cowlGeo, darkMat);
  cowlMesh.position.set(0, 0.18, -0.05);
  group.add(cowlMesh);

  // Carbon Fiber Motor Arms (Diagonal X configuration)
  const armGeo = new THREE.BoxGeometry(3.2, 0.08, 0.14);
  for (const angle of [-Math.PI / 4, Math.PI / 4]) {
    const armMesh = new THREE.Mesh(armGeo, darkMat);
    armMesh.rotation.y = angle;
    armMesh.position.y = 0.02;
    group.add(armMesh);
  }

  // 4 Rotors with spinning disks & motor hubs
  const hubGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.14, 12);
  const rotorGeo = new THREE.CylinderGeometry(0.58, 0.58, 0.02, 16);
  const bladeMat = new THREE.MeshStandardMaterial({
    color: '#65909c',
    metalness: 0.25,
    roughness: 0.5,
    transparent: true,
    opacity: 0.72
  });

  const rotors = [];
  const armSpan = 1.12;
  const rotorPositions = [
    [-armSpan, armSpan],
    [armSpan, armSpan],
    [-armSpan, -armSpan],
    [armSpan, -armSpan]
  ];

  for (const [rx, rz] of rotorPositions) {
    const hub = new THREE.Mesh(hubGeo, darkMat);
    hub.position.set(rx, 0.12, rz);
    group.add(hub);

    const disk = new THREE.Mesh(rotorGeo, bladeMat);
    disk.position.set(rx, 0.19, rz);
    group.add(disk);
    rotors.push(disk);
  }

  // Under-fuselage Gimbal Sensor Pod
  const podGeo = new THREE.SphereGeometry(0.18, 12, 10);
  const lensGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.1, 12);
  const lensMat = new THREE.MeshBasicMaterial({ color: '#091c28' });
  const pod = new THREE.Mesh(podGeo, darkMat);
  pod.position.set(0, -0.16, 0.22);
  const lens = new THREE.Mesh(lensGeo, lensMat);
  lens.rotation.x = Math.PI / 2;
  lens.position.set(0, -0.2, 0.32);
  group.add(pod);
  group.add(lens);

  // Status Navigation Beacons
  const frontBeacon = new THREE.Mesh(
    new THREE.SphereGeometry(0.08, 8, 6),
    new THREE.MeshBasicMaterial({ color: '#4ee3b6', transparent: true, opacity: 0.95 })
  );
  frontBeacon.position.set(0, 0.04, -0.68);
  group.add(frontBeacon);

  const rearBeacon = new THREE.Mesh(
    new THREE.SphereGeometry(0.07, 8, 6),
    new THREE.MeshBasicMaterial({ color: '#ffaa5b', transparent: true, opacity: 0.85 })
  );
  rearBeacon.position.set(0, 0.04, 0.68);
  group.add(rearBeacon);

  // Base positioning in Hero scene:
  // Camera is at (0, 49, 78) looking down at (0, 12, -48).
  // x = 16.5, y = 44.0, z = 38.0 places it cleanly in the upper-right sky above text.
  const basePos = new THREE.Vector3(16.5, 44.0, 38.0);
  group.position.copy(basePos);
  group.rotation.y = -0.42; // angled slightly towards center
  group.rotation.x = 0.05;

  group.userData = {
    basePos: basePos.clone(),
    rotors,
    frontBeacon,
    rearBeacon,
    materials: [shellMat, darkMat, bladeMat]
  };

  return group;
}

export function animateHeroDrone(drone, time, mouseTarget, scrollProgress = 0) {
  if (!drone) return;
  const { basePos, rotors, frontBeacon, rearBeacon, materials } = drone.userData;

  // 1. Idle Motion: 9.5s smooth continuous cruising cycle
  const idleT = time * (Math.PI * 2 / 9.5);
  const floatY = Math.sin(idleT) * 0.45; // ~±4-5px floating
  const driftX = Math.sin(idleT * 0.5) * 0.68; // slow horizontal drift
  const bankZ = -Math.cos(idleT * 0.5) * 0.028; // gentle roll into drift
  const pitchX = Math.sin(idleT) * 0.015;

  // 2. Mouse Parallax (subtle viewer reaction, ±6px)
  const mouseOffsetX = (mouseTarget ? mouseTarget.x : 0) * 0.55;
  const mouseOffsetY = (mouseTarget ? mouseTarget.y : 0) * 0.35;

  // 3. Scroll Away Effect: cruises into valley distance
  const sp = THREE.MathUtils.clamp(scrollProgress * 2.2, 0, 1);
  const forwardZ = -sp * 88; // moves deeper into valley
  const ascendY = sp * 9.5; // rises gently
  const driftIntoValleyX = -sp * 6.5; // drifts toward center valley
  const scale = THREE.MathUtils.lerp(1.0, 0.38, sp);
  const opacity = THREE.MathUtils.lerp(1.0, 0.45, sp);

  drone.position.set(
    basePos.x + driftX + mouseOffsetX + driftIntoValleyX,
    basePos.y + floatY - mouseOffsetY + ascendY,
    basePos.z + forwardZ
  );

  drone.rotation.z = bankZ;
  drone.rotation.x = 0.06 + pitchX;
  drone.scale.setScalar(scale);

  // Spin rotors
  rotors.forEach((r, idx) => {
    r.rotation.y += (idx % 2 === 0 ? 0.38 : -0.38);
  });

  // Pulse beacons
  if (frontBeacon) frontBeacon.material.opacity = 0.65 + Math.sin(time * 2.8) * 0.35;
  if (rearBeacon) rearBeacon.material.opacity = 0.6 + Math.cos(time * 2.8) * 0.35;

  // Material fade
  materials.forEach(mat => {
    if (mat) mat.opacity = opacity;
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
