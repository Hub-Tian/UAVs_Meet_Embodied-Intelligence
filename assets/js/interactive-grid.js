/**
 * UAVs Meet Embodied Intelligence - Interactive Terrain Background Engine
 * Features:
 * - Multi-layered wireframe mountain ridges & flowing topographical surface
 * - 3D-like camera tilt and spatial terrain elevation warping under mouse movement
 * - Linear UAV silhouettes cruising on flight trajectory arcs
 * - Background click spatial terrain pulse with telemetry particles
 * - Smooth spring-damping restoration on warm academic palette
 */

const InteractiveGrid = (function () {
  let canvas = null;
  let ctx = null;
  let width = 0;
  let height = 0;
  let dpr = 1;
  let animationFrameId = null;

  // Mountain & Terrain parameters
  const RIDGE_COUNT = 16;
  const SAMPLES_PER_RIDGE = 120;
  let ridges = [];

  // Physics & Pointer state
  let pointer = { x: -1000, y: -1000, active: false };
  let smoothPointer = { x: -1000, y: -1000 };
  let tilt = { x: 0, y: 0 };
  let targetTilt = { x: 0, y: 0 };
  let intensity = 1.0; // 1.0 on Home, 0.45 on Paper Gallery, 0.15 on Detail
  const motionReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Pulse & Particle state
  let pulses = [];
  let particles = [];
  let uavDrones = [];
  let trajectoryArcs = [];

  class UAVDrone {
    constructor(baseXRatio, baseYRatio, speed, scale = 1) {
      this.baseXRatio = baseXRatio;
      this.baseYRatio = baseYRatio;
      this.speed = speed;
      this.scale = scale;
      this.x = 0;
      this.y = 0;
      this.phase = Math.random() * Math.PI * 2;
    }

    update(time, ptr, intensityFactor) {
      const baseX = width * this.baseXRatio;
      const baseY = height * this.baseYRatio;
      const cruiseX = baseX + Math.sin(time * 0.0008 * this.speed + this.phase) * (width * 0.14);
      const cruiseY = baseY + Math.cos(time * 0.0012 * this.speed + this.phase) * 22;

      let targetX = cruiseX;
      let targetY = cruiseY;

      // Smooth lag-follow to pointer
      if (ptr.active && intensityFactor > 0.1) {
        const dx = ptr.x - baseX;
        const dy = ptr.y - baseY;
        const dist = Math.hypot(dx, dy);
        if (dist < 420) {
          targetX += (dx / dist) * Math.min(dist * 0.12, 42) * intensityFactor;
          targetY += (dy / dist) * Math.min(dist * 0.12, 42) * intensityFactor;
        }
      }

      this.x += (targetX - this.x) * 0.04;
      this.y += (targetY - this.y) * 0.04;
    }

    draw(context, intensityFactor) {
      if (intensityFactor < 0.1) return;
      context.save();
      context.translate(this.x, this.y);
      context.scale(this.scale, this.scale);
      context.globalAlpha = 0.4 * intensityFactor;
      context.strokeStyle = '#356c9a';
      context.lineWidth = 1.3;

      // Minimalist linear UAV quadrotor silhouette
      context.beginPath();
      // Fuselage
      context.arc(0, 0, 3.2, 0, Math.PI * 2);
      // Quadrotor cross arms
      context.moveTo(-10, -10);
      context.lineTo(10, 10);
      context.moveTo(10, -10);
      context.lineTo(-10, 10);
      context.stroke();

      // Rotors
      const rotors = [[-10, -10], [10, -10], [-10, 10], [10, 10]];
      rotors.forEach(([rx, ry]) => {
        context.beginPath();
        context.arc(rx, ry, 4, 0, Math.PI * 2);
        context.stroke();
      });

      context.restore();
    }
  }

  class TerrainPulse {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.radius = 0;
      this.maxRadius = 260;
      this.speed = 4.2;
      this.strength = 32;
      this.life = 1.0;
    }

    update() {
      this.radius += this.speed;
      this.life = Math.max(0, 1 - this.radius / this.maxRadius);
    }
  }

  class TelemetryParticle {
    constructor(x, y, color) {
      this.x = x;
      this.y = y;
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.6 + Math.random() * 3.4;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.radius = 1.4 + Math.random() * 1.5;
      this.color = color;
      this.life = 1.0;
      this.decay = 0.02 + Math.random() * 0.02;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vx *= 0.94;
      this.vy *= 0.94;
      this.life -= this.decay;
    }

    draw(context) {
      if (this.life <= 0) return;
      context.save();
      context.globalAlpha = this.life * 0.75;
      context.fillStyle = this.color;
      context.beginPath();
      context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      context.fill();
      context.restore();
    }
  }

  function init(canvasId) {
    canvas = document.getElementById(canvasId || 'interactive-grid');
    if (!canvas) return;
    ctx = canvas.getContext('2d');

    resize();
    bindEvents();
    startLoop();
  }

  function resize() {
    if (!canvas) return;
    dpr = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    ctx.scale(dpr, dpr);

    // Initialize Terrain Ridges
    ridges = [];
    const baseYStart = height * 0.44;
    const baseYSpacing = (height * 0.54) / RIDGE_COUNT;

    for (let i = 0; i < RIDGE_COUNT; i++) {
      const depthFactor = i / RIDGE_COUNT;
      ridges.push({
        baseY: baseYStart + i * baseYSpacing,
        amplitude: 28 + depthFactor * 45,
        freq1: 0.0018 + (i % 3) * 0.0006,
        freq2: 0.0042 + (i % 2) * 0.001,
        phase: i * 0.75,
        speed: 0.0006 + (1 - depthFactor) * 0.0006,
        depth: depthFactor,
        isHighlight: i % 4 === 0
      });
    }

    // Initialize UAV Drones
    uavDrones = [
      new UAVDrone(0.18, 0.38, 1.0, 1.05),
      new UAVDrone(0.82, 0.42, 0.85, 0.95),
      new UAVDrone(0.48, 0.65, 1.15, 0.9)
    ];

    // Trajectory Arcs
    trajectoryArcs = [
      { cx: width * 0.22, cy: height * 0.42, rx: 160, ry: 70, rot: -0.15 },
      { cx: width * 0.78, cy: height * 0.48, rx: 180, ry: 80, rot: 0.18 }
    ];
  }

  function triggerShockwave(x, y) {
    if (motionReduced) return;

    pulses.push(new TerrainPulse(x, y));

    // Spawn 12-16 telemetry particles
    const colors = ['#df6f3f', '#356c9a', '#4c8874', '#c89a36'];
    for (let i = 0; i < 14; i++) {
      particles.push(new TelemetryParticle(x, y, colors[i % colors.length]));
    }
  }

  function bindEvents() {
    window.addEventListener('resize', resize, { passive: true });

    window.addEventListener('pointermove', function (e) {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;

      // 3D camera tilt target (2° to 5° spatial tilt)
      const nx = (e.clientX - width / 2) / (width / 2);
      const ny = (e.clientY - height / 2) / (height / 2);
      targetTilt.x = nx * 18;
      targetTilt.y = ny * 12;
    }, { passive: true });

    window.addEventListener('pointerleave', function () {
      pointer.active = false;
      targetTilt.x = 0;
      targetTilt.y = 0;
    }, { passive: true });

    // Background Click Spatial Terrain Pulse Filter
    window.addEventListener('pointerdown', function (e) {
      const isInteractive = e.target.closest(
        'a, button, input, .category-panel, .category-strip, .research-record, .research-detail, .research-stage-nav, .btn-action, .first-badge-container'
      );
      if (isInteractive) return;

      triggerShockwave(e.clientX, e.clientY);
    });

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
      } else {
        startLoop();
      }
    });
  }

  function setIntensity(val) {
    intensity = Math.max(0, Math.min(1, val));
  }

  function render(time) {
    ctx.clearRect(0, 0, width, height);

    // Smooth tilt interpolation
    tilt.x += (targetTilt.x - tilt.x) * 0.05;
    tilt.y += (targetTilt.y - tilt.y) * 0.05;

    // Smooth pointer follow
    if (pointer.active) {
      smoothPointer.x += (pointer.x - smoothPointer.x) * 0.08;
      smoothPointer.y += (pointer.y - smoothPointer.y) * 0.08;
    }

    // Update Pulses
    for (let pIdx = pulses.length - 1; pIdx >= 0; pIdx--) {
      const pulse = pulses[pIdx];
      pulse.update();
      if (pulse.life <= 0) pulses.splice(pIdx, 1);
    }

    // 1. Draw Trajectory Flight Arcs
    ctx.save();
    ctx.strokeStyle = `rgba(223, 111, 63, ${0.16 * intensity})`;
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 8]);
    trajectoryArcs.forEach(arc => {
      ctx.beginPath();
      ctx.ellipse(arc.cx + tilt.x * 0.5, arc.cy + tilt.y * 0.5, arc.rx, arc.ry, arc.rot, 0, Math.PI * 2);
      ctx.stroke();
    });
    ctx.setLineDash([]);
    ctx.restore();

    // 2. Render Wireframe Terrain Mountain Ridges
    ridges.forEach((ridge, rIdx) => {
      const depth = ridge.depth;
      const alpha = (0.08 + depth * 0.22) * intensity;
      const strokeColor = ridge.isHighlight
        ? `rgba(223, 111, 63, ${alpha * 1.2})`
        : `rgba(40, 78, 108, ${alpha})`;

      ctx.save();
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = ridge.isHighlight ? 1.4 : 1.0;
      ctx.beginPath();

      const dxStep = width / (SAMPLES_PER_RIDGE - 1);

      for (let s = 0; s < SAMPLES_PER_RIDGE; s++) {
        const x = s * dxStep;

        // Base mountain harmonic wave
        const wave1 = Math.sin(x * ridge.freq1 + time * ridge.speed + ridge.phase) * (ridge.amplitude * 0.65);
        const wave2 = Math.cos(x * ridge.freq2 + time * ridge.speed * 0.8) * (ridge.amplitude * 0.35);

        // Tilt offset
        const tiltOffset = ((x - width / 2) / (width / 2)) * tilt.x * depth + tilt.y * (1 - depth);

        let y = ridge.baseY + wave1 + wave2 + tiltOffset;

        // Pointer Spatial Gravitational Deflection
        if (pointer.active && intensity > 0.05) {
          const pDist = Math.hypot(x - smoothPointer.x, y - smoothPointer.y);
          if (pDist < 180 && pDist > 1) {
            const factor = Math.pow(1 - pDist / 180, 2);
            y += factor * 16 * intensity;
          }
        }

        // Pulse wave displacement
        pulses.forEach(pulse => {
          const dist = Math.hypot(x - pulse.x, y - pulse.y);
          const diff = Math.abs(dist - pulse.radius);
          if (diff < 45) {
            const pFactor = Math.sin((1 - diff / 45) * Math.PI) * pulse.life;
            y -= pFactor * pulse.strength * intensity;
          }
        });

        if (s === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.stroke();
      ctx.restore();
    });

    // 3. Update & Draw UAV Drones
    uavDrones.forEach(uav => {
      uav.update(time, pointer, intensity);
      uav.draw(ctx, intensity);
    });

    // 4. Update & Draw Particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      p.draw(ctx);
      if (p.life <= 0) particles.splice(i, 1);
    }

    animationFrameId = requestAnimationFrame(render);
  }

  function startLoop() {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    animationFrameId = requestAnimationFrame(render);
  }

  return {
    init: init,
    triggerShockwave: triggerShockwave,
    setIntensity: setIntensity
  };
})();
