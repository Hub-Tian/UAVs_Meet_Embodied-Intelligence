import * as THREE from 'three';

const VERTEX_SHADER = `
precision highp float;

uniform vec2 uViewportSizes;
uniform float uVelocity;
uniform float uTime;

varying vec2 vUv;

void main() {
  vUv = uv;
  vec3 pos = position;

  // View-space position
  vec4 screenPos = modelViewMatrix * vec4(pos, 1.0);
  float dist = length(screenPos.xy);

  // Corentin Bernadou exact hyperbolic curve deformation formula:
  float hyperDist = cosh(dist * 0.45) * 0.45;
  float clampedVelocity = abs(uVelocity) / (1.0 + abs(uVelocity) * 0.03);
  float velocityFactor = clampedVelocity * 0.03;

  // 1. Z-axis 3D curved sheet bend (curving backward or forward in depth)
  pos.z -= hyperDist * velocityFactor * sign(uVelocity) * 2.2;

  // 2. Y-axis dynamic sliding wave (middle trails behind the edges like bent paper)
  pos.y -= sin(uv.x * 3.14159265) * uVelocity * 0.14;

  // 3. X-axis subtle inertial shear
  pos.x += (uv.y - 0.5) * uVelocity * 0.04;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;

uniform sampler2D tMap;
uniform float uAlpha;
uniform float uActive;
uniform float uVelocity;

varying vec2 vUv;

void main() {
  vec2 uv = vUv;

  // Chromatic aberration on sliding motion
  float shift = clamp(uVelocity * 0.0035, -0.015, 0.015);
  float r = texture2D(tMap, uv + vec2(shift, 0.0)).r;
  float g = texture2D(tMap, uv).g;
  float b = texture2D(tMap, uv - vec2(shift, 0.0)).b;
  vec4 color = vec4(r, g, b, 1.0);

  // Active card illumination & subtle edge vignette
  float vignette = smoothstep(1.35, 0.35, length(uv - 0.5));
  float boost = mix(0.92, 1.06, uActive);
  color.rgb *= boost;
  color.rgb *= mix(0.94, 1.0, vignette);
  color.a = uAlpha;

  gl_FragColor = color;
}
`;

export class ArchiveWebGLScene {
  constructor(options = {}) {
    this.container = options.container || document.getElementById('perception-webgl-container') || document.getElementById('archive-webgl-container');
    this.stageEl = options.stageEl || document.getElementById('archive-preview-stage');
    this.onSelect = options.onSelect || options.onSelectCategory || (() => {});
    this.onActiveChange = options.onActiveChange || (() => {});

    // Raycaster for precise 3D card clicks
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // Parse papers/items
    this.items = [];
    if (Array.isArray(options.papers) && options.papers.length > 0) {
      this.setItems(options.papers);
    }

    this.scene = new THREE.Scene();
    this.clock = new THREE.Clock();

    this.activeIndex = 0;
    this.targetScroll = 0;
    this.currentScroll = 0;
    this.velocity = 0;
    this.smoothedVelocity = 0;

    this.stride = 320;
    this.isRunning = true;
    this.isActive = true;

    this.initRenderer();
    if (this.items.length > 0) {
      this.initMedias();
    }
    this.bindEvents();
    this.onResize();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  setItems(papers) {
    this.items = (papers || []).map(p => ({
      id: p.id,
      title: p.title,
      methodName: p.methodName || p.title,
      cover: p.image || p.cover,
      paper: p
    }));

    if (this.group) {
      while (this.group.children.length > 0) {
        const obj = this.group.children[0];
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (obj.material.uniforms?.tMap?.value) obj.material.uniforms.tMap.value.dispose();
          obj.material.dispose();
        }
        this.group.remove(obj);
      }
      this.initMedias();
      this.onResize();
    }
  }

  initRenderer() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.z = 20;

    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setSize(width, height);
    this.renderer.domElement.className = 'archive-webgl-canvas';
    this.renderer.domElement.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:3;';

    if (this.container) {
      this.container.appendChild(this.renderer.domElement);
    } else {
      document.body.appendChild(this.renderer.domElement);
    }
  }

  initMedias() {
    if (!this.group) {
      this.group = new THREE.Group();
      this.scene.add(this.group);
    }

    this.geometry = new THREE.PlaneGeometry(1, 1, 48, 48);
    this.textureLoader = new THREE.TextureLoader();
    this.medias = [];

    this.items.forEach((item, index) => {
      const texture = this.textureLoader.load(item.cover, (tex) => {
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.generateMipmaps = false;
        tex.needsUpdate = true;
      });

      const material = new THREE.ShaderMaterial({
        vertexShader: VERTEX_SHADER,
        fragmentShader: FRAGMENT_SHADER,
        uniforms: {
          tMap: { value: texture },
          uAlpha: { value: index === 0 ? 1.0 : 0.0 },
          uActive: { value: index === 0 ? 1.0 : 0.0 },
          uVelocity: { value: 0.0 },
          uTime: { value: 0.0 },
          uViewportSizes: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
        },
        transparent: true,
        side: THREE.DoubleSide
      });

      const mesh = new THREE.Mesh(this.geometry, material);
      mesh.userData = { index, id: item.id };
      this.group.add(mesh);

      this.medias.push({
        mesh,
        material,
        id: item.id,
        index
      });
    });
  }

  bindEvents() {
    window.addEventListener('resize', () => this.onResize());

    // Wheel over the archive preview stage
    window.addEventListener('wheel', (e) => {
      if (!this.isActive || this.items.length <= 1) return;
      const archiveEl = document.getElementById('perception-paper-archive');
      if (!archiveEl || archiveEl.hidden || archiveEl.style.display === 'none') return;
      if (document.getElementById('research-detail')?.classList.contains('is-open')) return;

      const stageEl = this.stageEl || document.getElementById('archive-preview-stage');
      const isOverStage = stageEl && stageEl.contains(e.target);
      if (!isOverStage) return;

      const maxScroll = (this.items.length - 1) * this.stride;
      this.targetScroll = Math.max(0, Math.min(maxScroll, this.targetScroll + e.deltaY * 0.95));
      const newIndex = Math.round(this.targetScroll / this.stride);
      if (newIndex !== this.activeIndex && newIndex >= 0 && newIndex < this.items.length) {
        this.activeIndex = newIndex;
        this.onActiveChange(this.activeIndex, this.items[this.activeIndex].paper);
      }
    }, { passive: true });

    // Click on stage or 3D card mesh to flip & open detail
    const stageEl = this.stageEl || document.getElementById('archive-preview-stage');
    if (stageEl && !stageEl._hasSelectClick) {
      stageEl._hasSelectClick = true;

      stageEl.addEventListener('click', (e) => {
        if (!this.isActive) return;
        if (document.getElementById('research-detail')?.classList.contains('is-open')) return;

        const width = window.innerWidth;
        const height = window.innerHeight;
        this.mouse.x = (e.clientX / width) * 2 - 1;
        this.mouse.y = -(e.clientY / height) * 2 + 1;
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.medias.map(m => m.mesh));
        if (intersects.length > 0) {
          const hitIdx = intersects[0].object.userData.index;
          if (hitIdx !== undefined && this.items[hitIdx]) {
            this.scrollToIndex(hitIdx);
            this.onActiveChange(hitIdx, this.items[hitIdx].paper);
            this.onSelect(this.items[hitIdx].paper, hitIdx);
            return;
          }
        }
        // Fallback: click anywhere on the right stage flips the active card
        if (this.items[this.activeIndex]) {
          this.onSelect(this.items[this.activeIndex].paper, this.activeIndex);
        }
      });

      stageEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (this.items[this.activeIndex]) {
            this.onSelect(this.items[this.activeIndex].paper, this.activeIndex);
          }
        }
      });
    }
  }

  scrollToIndex(index, immediate = false) {
    if (index < 0 || index >= this.items.length) return;
    this.activeIndex = index;
    this.targetScroll = index * this.stride;
    if (immediate) {
      this.currentScroll = this.targetScroll;
      this.velocity = 0;
      this.smoothedVelocity = 0;
    }
  }

  onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    // Viewport in Three.js units at z=0 with camera.position.z=20
    const vFov = (this.camera.fov * Math.PI) / 180;
    const vHeight = 2 * Math.tan(vFov / 2) * this.camera.position.z;
    const vWidth = vHeight * this.camera.aspect;
    this.viewport = { width: vWidth, height: vHeight };

    const targetEl = this.stageEl || document.getElementById('archive-preview-stage');

    if (targetEl && targetEl.offsetParent !== null) {
      const rect = targetEl.getBoundingClientRect();
      this.stageRect = rect;
      const cardWidthPx = Math.min(rect.width * 0.95, 640);
      const cardHeightPx = cardWidthPx * 0.62;
      this.frameScaleX = (cardWidthPx / width) * this.viewport.width;
      this.frameScaleY = (cardHeightPx / height) * this.viewport.height;
      const frameCenterX = rect.left + rect.width / 2;
      const frameCenterY = rect.top + rect.height / 2 + 10;
      this.frameCenterYPx = frameCenterY;
      this.frameThreeX = ((frameCenterX / width) - 0.5) * this.viewport.width;
      this.frameThreeY = -((frameCenterY / height) - 0.5) * this.viewport.height;
      this.stride = cardHeightPx + 50;
    } else {
      this.frameScaleX = this.viewport.width * 0.36;
      this.frameScaleY = this.frameScaleX * 0.62;
      this.frameThreeX = this.viewport.width * 0.22;
      this.frameThreeY = -0.3;
      this.stride = 330;
    }

    this.targetScroll = this.activeIndex * this.stride;
    this.currentScroll = this.targetScroll;

    this.medias?.forEach((m) => {
      m.mesh.scale.set(this.frameScaleX, this.frameScaleY, 1);
      m.material.uniforms.uViewportSizes.value.set(width, height);
    });
  }

  setActive(active) {
    this.isActive = active;
    if (this.renderer && this.renderer.domElement) {
      this.renderer.domElement.style.display = active ? 'block' : 'none';
      if (active) {
        setTimeout(() => this.onResize(), 40);
      }
    }
  }

  animate() {
    if (!this.isRunning) return;
    requestAnimationFrame(this.animate);

    if (!this.isActive || !this.medias || this.medias.length === 0) return;

    const time = this.clock.getElapsedTime();

    // Physics damping (lerp)
    const prevScroll = this.currentScroll;
    this.currentScroll += (this.targetScroll - this.currentScroll) * 0.095;
    const instantVel = (this.currentScroll - prevScroll);

    const height = window.innerHeight || 900;
    const width = window.innerWidth || 1400;

    // Convert pixel velocity to Three.js view-scale velocity for shader
    const velInThree = (instantVel / height) * (this.viewport ? this.viewport.height : 16.5) * 8.5;

    this.velocity = THREE.MathUtils.lerp(this.velocity, velInThree, 0.25);
    this.smoothedVelocity = THREE.MathUtils.lerp(this.smoothedVelocity, this.velocity, 0.16);

    // Apply WebGL scissor test to strictly prevent any rendering outside the right stage
    const targetEl = this.stageEl || document.getElementById('archive-preview-stage');
    if (targetEl && targetEl.offsetParent !== null) {
      const rect = targetEl.getBoundingClientRect();
      this.stageRect = rect;
      const scissorX = Math.max(0, Math.floor(rect.left));
      const scissorY = Math.max(0, Math.floor(height - rect.bottom));
      const scissorW = Math.min(width - scissorX, Math.ceil(rect.width));
      const scissorH = Math.min(height - scissorY, Math.ceil(rect.height));

      this.renderer.setScissorTest(true);
      this.renderer.setScissor(scissorX, scissorY, scissorW, scissorH);
    } else {
      this.renderer.setScissorTest(false);
    }

    // Update each card mesh
    this.medias.forEach((m, i) => {
      const cardCenterY = (i * this.stride) - this.currentScroll;
      const deltaThreeY = (cardCenterY / height) * (this.viewport ? this.viewport.height : 16.5);

      m.mesh.position.y = this.frameThreeY - deltaThreeY;
      m.mesh.position.x = this.frameThreeX;

      // Distance from center of active card frame
      const distFromCenter = Math.abs(cardCenterY) / this.stride;
      const isActive = i === this.activeIndex;

      // Soft boundary fade as card moves near stage top or bottom
      let boundaryFade = 1.0;
      if (this.stageRect) {
        const centerY = (this.frameCenterYPx || (this.stageRect.top + this.stageRect.height / 2)) + cardCenterY;
        const topThreshold = this.stageRect.top + 70;
        const bottomThreshold = this.stageRect.bottom - 70;
        if (centerY < topThreshold) {
          boundaryFade = Math.max(0.0, (centerY - (this.stageRect.top - 30)) / 100);
        } else if (centerY > bottomThreshold) {
          boundaryFade = Math.max(0.0, ((this.stageRect.bottom + 30) - centerY) / 100);
        }
      }

      // Opacity falloff for non-active cards + edge fade
      const targetAlpha = Math.max(0.0, (1.0 - distFromCenter * 0.72) * boundaryFade);
      m.material.uniforms.uAlpha.value = THREE.MathUtils.lerp(m.material.uniforms.uAlpha.value, targetAlpha, 0.2);
      m.material.uniforms.uActive.value = THREE.MathUtils.lerp(m.material.uniforms.uActive.value, isActive ? 1.0 : 0.0, 0.2);
      m.material.uniforms.uVelocity.value = this.smoothedVelocity;
      m.material.uniforms.uTime.value = time;
    });

    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    this.isRunning = false;
    if (this.renderer && this.renderer.domElement && this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
      this.renderer.dispose();
    }
  }
}

if (typeof window !== 'undefined') {
  window.ArchiveWebGLScene = ArchiveWebGLScene;
}
