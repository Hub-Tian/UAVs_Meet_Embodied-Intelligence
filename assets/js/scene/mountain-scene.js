import * as THREE from 'three';
import { createMultiLayerTerrain } from './terrain.js';
import { createHeroDrone, animateHeroDrone, createDrones, animateDrones } from './drone.js';

// Continuous Mountain Valley Journey Background
const canvas = document.getElementById('mountain-scene');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let renderer, scene, camera, hemiLight, dirLight;
let terrainLayers = null;
let heroDrone = null, ambientDrones = [];
let active = true, frame = 0, previous = 0, time = 0, pulse = 0;
const target = new THREE.Vector2();
const angle = new THREE.Vector2();

// Continuous journey progress: 0 (Hero start) -> 1 (Categories)
let targetJourney = 0;
let currentJourney = 0;

const lightFogColor = new THREE.Color('#d8e7ea');
const deepFogColor = new THREE.Color('#1a3e4c');
const hemiSkyLight = new THREE.Color('#e0f0f4');
const hemiSkyDeep = new THREE.Color('#78a9b6');
const hemiGroundLight = new THREE.Color('#a8c8cc');
const hemiGroundDeep = new THREE.Color('#123640');
const dirLightColor = new THREE.Color('#fcf4e8');

function resize() {
  if (!renderer) return;
  renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 768 ? 1.25 : 1.5));
  renderer.setSize(innerWidth, innerHeight);
  camera.aspect = innerWidth / innerHeight;
  camera.fov = innerWidth < 768 ? 58 : 44;
  camera.updateProjectionMatrix();
  requestFrame();
}

function requestFrame() {
  if (!frame && active && !document.hidden && renderer) frame = requestAnimationFrame(render);
}

function render(now) {
  frame = 0;
  const dt = Math.min((now - (previous || now)) / 1000, 0.05);
  previous = now;
  if (!reduced.matches) time += dt;

  // Smooth mouse angle interpolation (restricted subtle yaw/pitch)
  const damping = 1 - Math.exp(-3.2 * dt);
  angle.lerp(reduced.matches ? new THREE.Vector2() : target, damping);
  const yaw = angle.x * 0.10, pitch = angle.y * 0.048;

  // Smooth journey progress interpolation
  currentJourney = THREE.MathUtils.lerp(currentJourney, targetJourney, 1 - Math.exp(-6.0 * dt));

  // 1. True Multi-Plane Mountain Parallax (Far: ~0.20, Mid: ~0.48, Near: ~0.78)
  if (terrainLayers && !reduced.matches) {
    const { farGroup, midGroup, nearGroup } = terrainLayers;
    farGroup.position.x = angle.x * 2.2;
    farGroup.position.y = angle.y * 0.85;

    midGroup.position.x = angle.x * 5.2;
    midGroup.position.y = angle.y * 1.9;

    nearGroup.position.x = angle.x * 8.5;
    nearGroup.position.y = angle.y * 3.2;
  }

  // 2. Camera forward flight into the valley (Section XII & XXII)
  const camZ = THREE.MathUtils.lerp(78, 48, currentJourney);
  const camY = THREE.MathUtils.lerp(49, 43, currentJourney);
  const lookZ = THREE.MathUtils.lerp(-48, -78, currentJourney);
  camera.position.set(Math.sin(yaw) * 45, camY + Math.sin(pitch) * 35, camZ);
  camera.lookAt(0, 11, lookZ);

  // 3. Continuous Atmosphere & Fog transition (Section XXI - XXIV)
  if (scene && scene.fog) {
    scene.fog.color.lerpColors(lightFogColor, deepFogColor, currentJourney);
    scene.fog.density = THREE.MathUtils.lerp(0.0075, 0.0036, currentJourney);
  }

  // 4. Dynamic Lighting transition
  if (hemiLight) {
    hemiLight.color.lerpColors(hemiSkyLight, hemiSkyDeep, currentJourney);
    hemiLight.groundColor.lerpColors(hemiGroundLight, hemiGroundDeep, currentJourney);
  }
  if (dirLight) {
    dirLight.intensity = THREE.MathUtils.lerp(2.2, 2.6, currentJourney) + pulse * 0.5;
  }
  pulse *= Math.exp(-3 * dt);

  // 5. Hero Drone Animation (Idle floating, mouse reaction, scroll forward cruising)
  if (heroDrone) {
    animateHeroDrone(heroDrone, time, reduced.matches ? null : angle, currentJourney);
  }

  // 6. Ambient background drones
  if (ambientDrones.length > 0) {
    animateDrones(ambientDrones, time, Math.min(1, camera.aspect / 1.5));
  }

  renderer.render(scene, camera);
  if (!reduced.matches || angle.length() > 0.001 || Math.abs(currentJourney - targetJourney) > 0.001) {
    requestFrame();
  }
}

function init() {
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: devicePixelRatio < 2,
      alpha: true,
      powerPreference: 'low-power'
    });
    renderer.setClearColor('#142d42', 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(lightFogColor, 0.0075);
    camera = new THREE.PerspectiveCamera(44, 1, 1, 500);

    // Multi-layer terrain
    terrainLayers = createMultiLayerTerrain(innerWidth < 768);
    scene.add(terrainLayers.root);

    // Primary Hero UAV
    heroDrone = createHeroDrone();
    scene.add(heroDrone);

    // Distant ambient drones
    ambientDrones = createDrones();
    ambientDrones.forEach(d => scene.add(d));

    // Lights
    hemiLight = new THREE.HemisphereLight(hemiSkyLight, hemiGroundLight, 2.1);
    scene.add(hemiLight);

    dirLight = new THREE.DirectionalLight(dirLightColor, 2.2);
    dirLight.position.set(-65, 80, -90);
    scene.add(dirLight);

    canvas.dataset.state = 'ready';
    resize();
  } catch (error) {
    canvas.dataset.state = 'unavailable';
    console.warn('Mountain scene unavailable; using the atmospheric CSS background.', error.message);
  }
  document.body.classList.add('mountain-home');
}

window.MountainScene = {
  init,
  setActive(value) {
    active = value;
    document.body.classList.toggle('mountain-home', value);
    if (value) { previous = 0; resize(); }
    else { cancelAnimationFrame(frame); frame = 0; target.set(0, 0); }
  },
  setJourney(progress) {
    targetJourney = THREE.MathUtils.clamp(progress, 0, 1);
    requestFrame();
  }
};

window.addEventListener('pointermove', event => {
  if (!active || event.pointerType !== 'mouse' || reduced.matches) return;
  target.set(
    THREE.MathUtils.clamp(event.clientX / innerWidth * 2 - 1, -1, 1),
    THREE.MathUtils.clamp(event.clientY / innerHeight * 2 - 1, -1, 1)
  );
  requestFrame();
}, { passive: true });

document.documentElement.addEventListener('pointerleave', () => {
  target.set(0, 0);
  requestFrame();
});

window.addEventListener('blur', () => {
  target.set(0, 0);
  requestFrame();
});

window.addEventListener('resize', resize, { passive: true });

window.addEventListener('click', event => {
  if (active && !reduced.matches && !event.target.closest('a, button, [role="button"]')) pulse = 1;
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    cancelAnimationFrame(frame);
    frame = 0;
  } else {
    previous = 0;
    requestFrame();
  }
});

reduced.addEventListener('change', () => {
  target.set(0, 0);
  requestFrame();
});

canvas.addEventListener('webglcontextlost', event => {
  event.preventDefault();
  cancelAnimationFrame(frame);
  frame = 0;
  canvas.dataset.state = 'unavailable';
});

canvas.addEventListener('webglcontextrestored', () => {
  canvas.dataset.state = 'ready';
  requestFrame();
});
