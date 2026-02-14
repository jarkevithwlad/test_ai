import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js';

export function initThreeBackground() {
  const canvas = document.getElementById('bg3d');
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.z = 12;

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight, false);

  // Particles
  const count = 2200;
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    // random in a "thick" sphere-ish volume
    const r = 18 * Math.cbrt(Math.random());
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i3 + 0] = r * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = r * Math.cos(phi);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0x7dd3fc,
    size: 0.035,
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
    sizeAttenuation: true,
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  // Subtle second layer (bigger, fewer)
  const count2 = 260;
  const positions2 = new Float32Array(count2 * 3);

  for (let i = 0; i < count2; i++) {
    const i3 = i * 3;
    const x = (Math.random() - 0.5) * 30;
    const y = (Math.random() - 0.5) * 22;
    const z = (Math.random() - 0.5) * 26;

    positions2[i3 + 0] = x;
    positions2[i3 + 1] = y;
    positions2[i3 + 2] = z;
  }

  const geometry2 = new THREE.BufferGeometry();
  geometry2.setAttribute('position', new THREE.BufferAttribute(positions2, 3));

  const material2 = new THREE.PointsMaterial({
    color: 0xa78bfa,
    size: 0.06,
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
    sizeAttenuation: true,
  });

  const points2 = new THREE.Points(geometry2, material2);
  scene.add(points2);

  // Parallax
  let targetX = 0;
  let targetY = 0;

  const onMouseMove = (e) => {
    const x = e.clientX / window.innerWidth - 0.5;
    const y = e.clientY / window.innerHeight - 0.5;
    targetX = x;
    targetY = y;
  };

  window.addEventListener('mousemove', onMouseMove, { passive: true });

  const onResize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  };

  window.addEventListener('resize', onResize);

  let rafId = 0;

  const tick = () => {
    rafId = requestAnimationFrame(tick);

    points.rotation.y += 0.0007;
    points.rotation.x += 0.00035;

    points2.rotation.y -= 0.00045;
    points2.rotation.x += 0.0002;

    // smooth camera parallax
    const px = targetX * 1.2;
    const py = -targetY * 0.9;

    camera.position.x += (px - camera.position.x) * 0.03;
    camera.position.y += (py - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  };

  tick();

  // Optional: stop rendering when tab hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(rafId);
    } else {
      tick();
    }
  });
}
