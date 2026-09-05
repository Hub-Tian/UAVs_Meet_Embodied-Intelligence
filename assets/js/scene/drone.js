import * as THREE from 'three';

export function createDrones() {
  const body = new THREE.BoxGeometry(0.7, 0.22, 1);
  const arm = new THREE.BoxGeometry(2.4, 0.09, 0.12);
  const rotor = new THREE.CylinderGeometry(0.42, 0.42, 0.035, 16);
  const shell = new THREE.MeshStandardMaterial({ color: '#c0d9d8', metalness: 0.45, roughness: 0.5 });
  const blade = new THREE.MeshStandardMaterial({ color: '#537780', metalness: 0.3, roughness: 0.6 });
  return [[-27, 41, 16], [49, 48, -25], [-50, 50, -75]].map((position, index) => {
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
    const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 6),
      new THREE.MeshBasicMaterial({ color: index === 0 ? '#efb883' : '#9de0dc' }));
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
    drone.position.set(origin.x * spread + Math.sin(time * 0.09 + i) * 1.8,
      origin.y + Math.sin(time * 0.28 + i) * 0.35,
      origin.z + Math.cos(time * 0.09 + i) * 1.1);
    drone.rotation.z = Math.sin(time * 0.2 + i) * 0.025;
  });
}
