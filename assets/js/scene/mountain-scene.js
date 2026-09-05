import * as THREE from 'three';
import { createTerrain } from './terrain.js';
import { createDrones, animateDrones } from './drone.js';

// Independent background; the existing app keeps ownership of navigation.
const canvas = document.getElementById('mountain-scene');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let renderer, scene, camera, drones, light;
let active = true, frame = 0, previous = 0, time = 0, pulse = 0;
const target = new THREE.Vector2();
const angle = new THREE.Vector2();

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
  // Limited yaw (+/- 7 degrees) and pitch (+/- 3 degrees), never free orbit.
  const damping = 1 - Math.exp(-3.2 * dt);
  angle.lerp(reduced.matches ? new THREE.Vector2() : target, damping);
  const yaw = angle.x * 0.12, pitch = angle.y * 0.052;
  camera.position.set(Math.sin(yaw) * 100, 49 + Math.sin(pitch) * 100, 78);
  camera.lookAt(0, 12, -48);
  animateDrones(drones, time, Math.min(1, camera.aspect / 1.5));
  pulse *= Math.exp(-3 * dt);
  light.intensity = 2.4 + pulse * 0.5;
  renderer.render(scene, camera);
  if (!reduced.matches || angle.length() > 0.001) requestFrame();
}

function init() {
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: devicePixelRatio < 2, alpha: true, powerPreference: 'low-power' });
    renderer.setClearColor('#142d42', 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2('#42697a', 0.0075);
    camera = new THREE.PerspectiveCamera(44, 1, 1, 500);
    scene.add(createTerrain(innerWidth < 768));
    drones = createDrones();
    drones.forEach(drone => scene.add(drone));
    scene.add(new THREE.HemisphereLight('#8bbad0', '#123944', 2));
    light = new THREE.DirectionalLight('#f5c99a', 2.4);
    light.position.set(-65, 80, -90);
    scene.add(light);
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
  }
};
window.addEventListener('pointermove', event => {
  if (!active || event.pointerType !== 'mouse' || reduced.matches) return;
  target.set(THREE.MathUtils.clamp(event.clientX / innerWidth * 2 - 1, -1, 1),
    THREE.MathUtils.clamp(event.clientY / innerHeight * 2 - 1, -1, 1));
}, { passive: true });
document.documentElement.addEventListener('pointerleave', () => target.set(0, 0));
window.addEventListener('blur', () => target.set(0, 0));
window.addEventListener('resize', resize, { passive: true });
window.addEventListener('click', event => {
  if (active && !reduced.matches && !event.target.closest('a, button, [role="button"]')) pulse = 1;
});
document.addEventListener('visibilitychange', () => {
  if (document.hidden) { cancelAnimationFrame(frame); frame = 0; }
  else { previous = 0; requestFrame(); }
});
reduced.addEventListener('change', () => { target.set(0, 0); requestFrame(); });
canvas.addEventListener('webglcontextlost', event => {
  event.preventDefault();
  cancelAnimationFrame(frame);
  frame = 0;
  canvas.dataset.state = 'unavailable';
});
canvas.addEventListener('webglcontextrestored', () => { canvas.dataset.state = 'ready'; requestFrame(); });
