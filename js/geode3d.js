/* =========================================================
   Matrix Science Publication — 3D WebGL geode (Three.js)
   A photorealistic rocky geode that cracks open on click to
   reveal glossy, subject-coloured crystal clusters lit by an
   inner glow. Each cluster links to its subject page.
   ========================================================= */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const stage = document.getElementById('geodeStage');
const hint = document.getElementById('geodeHint');
const M = window.MSP;
const ORDER = M.SUBJECT_ORDER;

function fallback() {
  // No WebGL / load failure → graceful static menu so the hero still works.
  if (!stage) return;
  stage.innerHTML = '<div class="geode-fallback">' +
    ORDER.map(function (k) {
      var s = M.SUBJECTS[k];
      return '<a href="subject.html?s=' + k + '" style="background:' + s.color + '">' +
        '<span>' + s.glyph + '</span>' + s.name + '</a>';
    }).join('') + '</div>';
  if (hint) hint.textContent = 'Choose a subject to explore';
}

try {
  init();
} catch (err) {
  console.error('Geode 3D failed, using fallback:', err);
  fallback();
}

function init() {
  if (!stage) return;
  const R = 1.25;

  /* ---------- renderer / scene / camera ---------- */
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  stage.innerHTML = '';
  stage.appendChild(renderer.domElement);
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  renderer.domElement.style.display = 'block';
  renderer.domElement.style.cursor = 'pointer';
  renderer.domElement.setAttribute('aria-label', 'Interactive 3D geode. Click to crack it open and reveal subjects.');

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 0.15, 4.5);

  // image-based lighting for realistic crystal reflections
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  /* ---------- lights ---------- */
  scene.add(new THREE.AmbientLight(0x4a5066, 0.5));
  const key = new THREE.DirectionalLight(0xfff4e6, 2.1);
  key.position.set(3, 4, 4);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x88aaff, 0.8);
  rim.position.set(-4, -1, -3);
  scene.add(rim);

  // inner glow light (ramps up when cracked)
  const glowLight = new THREE.PointLight(0xfff0c8, 0, 6, 2);
  glowLight.position.set(0, 0, 0);
  scene.add(glowLight);

  /* ---------- geode group ---------- */
  const geode = new THREE.Group();
  scene.add(geode);

  // rock halves
  const rockMat = new THREE.MeshStandardMaterial({
    color: 0x4b4138, roughness: 0.97, metalness: 0.02,
    bumpMap: makeBumpTexture(256), bumpScale: 0.06, side: THREE.DoubleSide,
    envMapIntensity: 0.25
  });
  const innerMat = new THREE.MeshStandardMaterial({
    color: 0x6b6256, roughness: 0.85, metalness: 0.0, side: THREE.BackSide,
    bumpMap: rockMat.bumpMap, bumpScale: 0.03
  });

  const leftHalf = makeRockHalf(R, -Math.PI / 2, rockMat, innerMat);
  const rightHalf = makeRockHalf(R, Math.PI / 2, rockMat, innerMat);
  geode.add(leftHalf, rightHalf);

  leftHalf.userData.closed = { x: 0, ry: 0 };
  leftHalf.userData.open = { x: -1.85, ry: -0.7, rz: 0.18, y: 0.05 };
  rightHalf.userData.closed = { x: 0, ry: 0 };
  rightHalf.userData.open = { x: 1.85, ry: 0.7, rz: -0.18, y: 0.05 };

  /* ---------- crystals ---------- */
  const crystals = new THREE.Group();
  geode.add(crystals);
  const clusterDirs = [
    new THREE.Vector3(0.0, 0.10, 0.62),
    new THREE.Vector3(-0.5, 0.42, 0.30),
    new THREE.Vector3(0.52, 0.40, 0.28),
    new THREE.Vector3(-0.36, -0.46, 0.34),
    new THREE.Vector3(0.38, -0.44, 0.34)
  ];
  const clusterMeshes = [];
  ORDER.forEach(function (k, i) {
    const cl = makeCrystalCluster(M.SUBJECTS[k], clusterDirs[i] || new THREE.Vector3(0, 0, 0.5), R);
    cl.userData.subject = k;
    crystals.add(cl);
    clusterMeshes.push(cl);
  });
  // druzy sparkle floor lining the cavity
  crystals.add(makeDruzy(R));

  /* ---------- inner glow sprite (soft additive bloom) ---------- */
  const glowSprite = new THREE.Sprite(new THREE.SpriteMaterial({
    map: makeGlowTexture(), color: 0xfff2d0, transparent: true,
    blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0
  }));
  glowSprite.scale.set(0.1, 0.1, 0.1);
  geode.add(glowSprite);

  /* ---------- controls (subtle auto-orbit) ---------- */
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.autoRotate = !reduceMotion;
  controls.autoRotateSpeed = 0.9;
  controls.minPolarAngle = Math.PI * 0.30;
  controls.maxPolarAngle = Math.PI * 0.70;
  controls.target.set(0, 0, 0);

  /* ---------- interaction ---------- */
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let cracked = false, progress = 0;
  let downAt = null;

  function setPointer(e) {
    const r = renderer.domElement.getBoundingClientRect();
    const cx = (e.touches ? e.touches[0].clientX : e.clientX);
    const cy = (e.touches ? e.touches[0].clientY : e.clientY);
    pointer.x = ((cx - r.left) / r.width) * 2 - 1;
    pointer.y = -((cy - r.top) / r.height) * 2 + 1;
  }
  function clusterHit() {
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(clusterMeshes, true);
    if (!hits.length) return null;
    let o = hits[0].object;
    while (o && o.userData.subject === undefined) o = o.parent;
    return o || null;
  }

  renderer.domElement.addEventListener('pointerdown', function (e) {
    downAt = { x: e.clientX, y: e.clientY, t: performance.now() };
  });
  renderer.domElement.addEventListener('pointerup', function (e) {
    if (!downAt) return;
    const moved = Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y);
    const quick = performance.now() - downAt.t < 500;
    downAt = null;
    if (moved > 6 || !quick) return; // it was a drag/orbit, not a click
    setPointer(e);
    if (!cracked) { crackOpen(); return; }
    const c = clusterHit();
    if (c) window.location.href = 'subject.html?s=' + c.userData.subject;
  });
  renderer.domElement.addEventListener('pointermove', function (e) {
    if (!cracked) return;
    setPointer(e);
    const c = clusterHit();
    clusterMeshes.forEach(function (m) { m.userData.hover = (m === c); });
    renderer.domElement.style.cursor = c ? 'pointer' : 'grab';
  });

  function crackOpen() {
    if (cracked) return;
    cracked = true;
    controls.autoRotateSpeed = 0.5;
    if (hint) hint.textContent = 'Tap a crystal to explore that subject';
    spawnShards();
  }

  /* ---------- rock shard burst ---------- */
  const shards = [];
  function spawnShards() {
    const g = new THREE.DodecahedronGeometry(0.06, 0);
    for (let i = 0; i < 16; i++) {
      const m = new THREE.Mesh(g, rockMat);
      const dir = new THREE.Vector3((Math.random() - 0.5), (Math.random() - 0.5), Math.random() * 0.6 + 0.2).normalize();
      m.position.set(dir.x * 0.2, dir.y * 0.2, dir.z * 0.2);
      m.userData.vel = dir.multiplyScalar(0.012 + Math.random() * 0.02);
      m.userData.spin = new THREE.Vector3(Math.random(), Math.random(), Math.random()).multiplyScalar(0.2);
      m.userData.life = 1;
      geode.add(m); shards.push(m);
    }
  }

  /* ---------- resize ---------- */
  function resize() {
    const w = stage.clientWidth || 460;
    const h = stage.clientHeight || 420;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  /* ---------- animation ---------- */
  const tmp = new THREE.Vector3();
  function lerp(a, b, t) { return a + (b - a) * t; }
  function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

  function animate() {
    requestAnimationFrame(animate);
    const target = cracked ? 1 : 0;
    progress += (target - progress) * 0.08;
    const p = ease(Math.min(progress, 1));

    applyHalf(leftHalf, p);
    applyHalf(rightHalf, p);

    glowLight.intensity = p * 3.2;
    glowSprite.material.opacity = p * 0.9;
    const gs = 0.1 + p * 2.4;
    glowSprite.scale.set(gs, gs, gs);

    clusterMeshes.forEach(function (m) {
      const want = (m.userData.hover ? 1.14 : 1) * (0.2 + 0.8 * p);
      m.scale.setScalar(lerp(m.scale.x, want, 0.15));
      m.traverse(function (o) {
        if (o.material && o.material.emissive) {
          o.material.emissiveIntensity = lerp(o.material.emissiveIntensity, (m.userData.hover ? 0.55 : 0.28) * p, 0.15);
        }
      });
    });

    // shard burst physics
    for (let i = shards.length - 1; i >= 0; i--) {
      const s = shards[i];
      s.position.add(s.userData.vel);
      s.userData.vel.multiplyScalar(0.97);
      s.rotation.x += s.userData.spin.x;
      s.rotation.y += s.userData.spin.y;
      s.userData.life -= 0.02;
      s.scale.setScalar(Math.max(s.userData.life, 0.01));
      if (s.userData.life <= 0) { geode.remove(s); shards.splice(i, 1); }
    }

    controls.update();
    renderer.render(scene, camera);
  }

  function applyHalf(half, p) {
    const o = half.userData.open, c = half.userData.closed;
    half.position.x = lerp(c.x, o.x, p);
    half.position.y = lerp(0, o.y || 0, p);
    half.rotation.y = lerp(c.ry, o.ry, p);
    half.rotation.z = lerp(0, o.rz || 0, p);
  }

  animate();
}

/* =========================================================
   Builders
   ========================================================= */
function makeRockHalf(R, phiStart, outerMat, innerMat) {
  const geo = new THREE.SphereGeometry(R, 120, 80, phiStart, Math.PI);
  displaceRock(geo, R);
  const grp = new THREE.Group();
  grp.add(new THREE.Mesh(geo, outerMat));
  grp.add(new THREE.Mesh(geo, innerMat)); // backside lining for thickness illusion
  return grp;
}

function displaceRock(geo, R) {
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const n = v.clone().normalize();
    const big = fbm(n.x * 2.2 + 5, n.y * 2.2, n.z * 2.2 - 3);
    const small = fbm(n.x * 6.5, n.y * 6.5 + 9, n.z * 6.5);
    const disp = (big - 0.5) * 0.12 * R + (small - 0.5) * 0.04 * R;
    v.addScaledVector(n, disp);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();
}

function makeCrystalCluster(subject, dir, R) {
  const grp = new THREE.Group();
  const base = dir.clone().multiplyScalar(R * 0.42);
  grp.position.copy(base);
  const grad = subject.gradient || [subject.color];
  const up = dir.clone().normalize();
  const count = 16 + Math.floor(Math.random() * 8);
  const spikeGeo = new THREE.ConeGeometry(0.07, 0.32, 6);

  for (let i = 0; i < count; i++) {
    const col = new THREE.Color(grad[Math.floor(Math.random() * grad.length)]);
    const mat = new THREE.MeshPhysicalMaterial({
      color: col, metalness: 0.0, roughness: 0.05 + Math.random() * 0.12,
      transmission: 0.18, thickness: 0.5, ior: 2.2,
      clearcoat: 1.0, clearcoatRoughness: 0.04, reflectivity: 1.0,
      envMapIntensity: 1.6, emissive: col.clone(), emissiveIntensity: 0,
      flatShading: true
    });
    const sp = new THREE.Mesh(spikeGeo, mat);
    // jitter direction around the cluster's outward normal
    const j = new THREE.Vector3((Math.random() - 0.5), (Math.random() - 0.5), (Math.random() - 0.5)).multiplyScalar(0.9);
    const d = up.clone().add(j).normalize();
    const len = 0.5 + Math.random() * 0.9;
    sp.scale.set(0.5 + Math.random() * 0.5, len, 0.5 + Math.random() * 0.5);
    sp.position.copy(d.clone().multiplyScalar(0.05 + Math.random() * 0.12));
    sp.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d);
    grp.add(sp);
  }
  return grp;
}

function makeDruzy(R) {
  const grp = new THREE.Group();
  const geo = new THREE.IcosahedronGeometry(0.018, 0);
  const mat = new THREE.MeshPhysicalMaterial({ color: 0xece6f5, roughness: 0.1, metalness: 0, clearcoat: 1, envMapIntensity: 1.4, transmission: 0.1 });
  for (let i = 0; i < 120; i++) {
    const m = new THREE.Mesh(geo, mat);
    const dir = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() * 0.7 + 0.1).normalize();
    m.position.copy(dir.multiplyScalar(R * (0.55 + Math.random() * 0.18)));
    m.scale.setScalar(0.4 + Math.random());
    grp.add(m);
  }
  return grp;
}

/* ---------- procedural textures ---------- */
function makeBumpTexture(size) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  const img = ctx.createImageData(size, size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const n = fbm2(x / size * 8, y / size * 8) * 0.6 + fbm2(x / size * 26, y / size * 26) * 0.4;
      const val = Math.floor(n * 255);
      const idx = (y * size + x) * 4;
      img.data[idx] = img.data[idx + 1] = img.data[idx + 2] = val;
      img.data[idx + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  return tex;
}

function makeGlowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, 'rgba(255,248,224,1)');
  g.addColorStop(0.25, 'rgba(255,236,190,0.7)');
  g.addColorStop(0.6, 'rgba(180,200,255,0.18)');
  g.addColorStop(1, 'rgba(180,200,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

/* ---------- value noise / fbm ---------- */
function fade(t) { return t * t * (3 - 2 * t); }
function lerpN(a, b, t) { return a + (b - a) * t; }
function h3(a, b, c) { let n = Math.sin(a * 127.1 + b * 311.7 + c * 74.7) * 43758.5453; return n - Math.floor(n); }
function vnoise(x, y, z) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
  const xf = x - xi, yf = y - yi, zf = z - zi;
  const u = fade(xf), v = fade(yf), w = fade(zf);
  const c000 = h3(xi, yi, zi), c100 = h3(xi + 1, yi, zi), c010 = h3(xi, yi + 1, zi), c110 = h3(xi + 1, yi + 1, zi);
  const c001 = h3(xi, yi, zi + 1), c101 = h3(xi + 1, yi, zi + 1), c011 = h3(xi, yi + 1, zi + 1), c111 = h3(xi + 1, yi + 1, zi + 1);
  const x00 = lerpN(c000, c100, u), x10 = lerpN(c010, c110, u), x01 = lerpN(c001, c101, u), x11 = lerpN(c011, c111, u);
  return lerpN(lerpN(x00, x10, v), lerpN(x01, x11, v), w);
}
function fbm(x, y, z) { let f = 0, a = 0.5, fr = 1; for (let i = 0; i < 4; i++) { f += a * vnoise(x * fr, y * fr, z * fr); fr *= 2; a *= 0.5; } return f; }
function fbm2(x, y) { return fbm(x, y, 0.5); }
