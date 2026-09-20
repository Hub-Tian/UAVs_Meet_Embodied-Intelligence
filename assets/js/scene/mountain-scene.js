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

// Hero section scroll progress: 0 (Hover) -> 1 (Fly-away)
let targetHeroScroll = 0;
let currentHeroScroll = 0;

const lightFogColor = new THREE.Color('#d8e7ea');
const deepFogColor = new THREE.Color('#1a3e4c');
const hemiSkyLight = new THREE.Color('#e0f0f4');
const hemiSkyDeep = new THREE.Color('#78a9b6');
const hemiGroundLight = new THREE.Color('#a8c8cc');
const hemiGroundDeep = new THREE.Color('#123640');
const dirLightMorning = new THREE.Color('#fff2dd');
const dirLightValley = new THREE.Color('#d8eff4');

function resize() {
  if (!renderer) return;
  renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 768 ? 1.25 : 1.5));
  renderer.setSize(innerWidth, innerHeight);
  camera.aspect = innerWidth / innerHeight;
  camera.fov = innerWidth < 768 ? 54 : 42;
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
  const yaw = angle.x * 0.08, pitch = angle.y * 0.042;

  // Smooth journey progress interpolation
  currentJourney = THREE.MathUtils.lerp(currentJourney, targetJourney, 1 - Math.exp(-6.0 * dt));
  currentHeroScroll = THREE.MathUtils.lerp(currentHeroScroll, targetHeroScroll, 1 - Math.exp(-8.0 * dt));

  // 1. True Multi-Plane Mountain Parallax (Far: ~0.16, Mid: ~0.42, Near: ~0.72)
  if (terrainLayers && !reduced.matches) {
    const { farGroup, midGroup, nearGroup } = terrainLayers;
    farGroup.position.x = angle.x * 1.6;
    farGroup.position.y = angle.y * 0.65;

    midGroup.position.x = angle.x * 3.8;
    midGroup.position.y = angle.y * 1.45;

    nearGroup.position.x = angle.x * 6.5;
    nearGroup.position.y = angle.y * 2.4;
  }

  // 2. Distant Vista to Valley Forward Flight (Starts far with mountains occupying ~35%-55% screen height)
  const camZ = THREE.MathUtils.lerp(102, 48, currentJourney);
  const camY = THREE.MathUtils.lerp(34.5, 43, currentJourney);
  const lookZ = THREE.MathUtils.lerp(-70, -78, currentJourney);
  const lookY = THREE.MathUtils.lerp(21, 11, currentJourney);
  camera.position.set(Math.sin(yaw) * 45, camY + Math.sin(pitch) * 35, camZ);
  camera.lookAt(0, lookY, lookZ);

  // 3. Continuous Atmosphere & Fog transition
  if (scene && scene.fog) {
    scene.fog.color.lerpColors(lightFogColor, deepFogColor, currentJourney);
    scene.fog.density = THREE.MathUtils.lerp(0.0055, 0.0036, currentJourney);
  }

  // 4. Dynamic Lighting transition (Morning warm sunlight -> Cool valley daylight)
  if (hemiLight) {
    hemiLight.color.lerpColors(hemiSkyLight, hemiSkyDeep, currentJourney);
    hemiLight.groundColor.lerpColors(hemiGroundLight, hemiGroundDeep, currentJourney);
  }
  if (dirLight) {
    dirLight.color.lerpColors(dirLightMorning, dirLightValley, currentJourney);
    dirLight.intensity = THREE.MathUtils.lerp(2.5, 2.7, currentJourney) + pulse * 0.5;
  }
  pulse *= Math.exp(-3 * dt);

  // 5. Hero Drone Animation (Foreground idle hover, 3D spline orbit around mountain with occlusion, and valley fly-away)
  if (heroDrone) {
    animateHeroDrone(heroDrone, time, reduced.matches ? null : angle, currentHeroScroll, dt);
  }

  // 6. Ambient background drones
  if (ambientDrones.length > 0) {
    animateDrones(ambientDrones, time, Math.min(1, camera.aspect / 1.5));
  }

  renderer.render(scene, camera);
  if (!reduced.matches || angle.length() > 0.001 || Math.abs(currentJourney - targetJourney) > 0.001 || Math.abs(currentHeroScroll - targetHeroScroll) > 0.001) {
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
    scene.fog = new THREE.FogExp2(lightFogColor, 0.0055);
    camera = new THREE.PerspectiveCamera(42, 1, 1, 500);

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

    dirLight = new THREE.DirectionalLight(dirLightMorning, 2.5);
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
  setJourney(progress, heroScroll) {
    targetJourney = THREE.MathUtils.clamp(progress, 0, 1);
    if (heroScroll !== undefined) {
      targetHeroScroll = THREE.MathUtils.clamp(heroScroll, 0, 1);
    }
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
