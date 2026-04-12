import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

export default function BlackHoleCanvas({ className = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    let animId;
    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const isMobile = window.innerWidth < 768;

    // ═══════════════════════════════════
    // SCENE SETUP
    // ═══════════════════════════════════
    const scene = new THREE.Scene();
    const clock = new THREE.Clock();

    const camera = new THREE.PerspectiveCamera(
      52,
      window.innerWidth / window.innerHeight,
      0.1,
      200
    );
    camera.position.set(0, 3.5, isMobile ? 18 : 14);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: !isMobile,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    // ═══════════════════════════════════
    // CAPA 1 — FONDO ESTELAR PROCEDIMENTAL
    // ═══════════════════════════════════
    const starCount = isMobile ? 0 : 800;
    let stars, starMat;

    if (starCount > 0) {
      const starPositions = new Float32Array(starCount * 3);
      const starSizes = new Float32Array(starCount);

      for (let i = 0; i < starCount; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = 60 + Math.random() * 40;
        starPositions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
        starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        starPositions[i * 3 + 2] = r * Math.cos(phi);
        starSizes[i] = Math.random() * 1.8 + 0.3;
      }

      const starGeo = new THREE.BufferGeometry();
      starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
      starGeo.setAttribute('size', new THREE.Float32BufferAttribute(starSizes, 1));

      starMat = new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 } },
        vertexShader: `
          attribute float size;
          uniform float uTime;
          varying float vBrightness;
          void main() {
            vBrightness = 0.5 + 0.5 * sin(uTime * 1.2 + position.x * 0.3);
            vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * (280.0 / -mvPos.z);
            gl_Position = projectionMatrix * mvPos;
          }
        `,
        fragmentShader: `
          varying float vBrightness;
          void main() {
            vec2 uv = gl_PointCoord - 0.5;
            float d = length(uv);
            float alpha = smoothstep(0.5, 0.1, d) * vBrightness;
            gl_FragColor = vec4(0.9, 0.95, 1.0, alpha);
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      stars = new THREE.Points(starGeo, starMat);
      scene.add(stars);
    }

    // ═══════════════════════════════════
    // CAPA 2 — DISCO DE ACRECIÓN (Keplerian)
    // ═══════════════════════════════════
    const INNER_R = 2.2;
    const OUTER_R = 7.0;
    const SEGMENTS = isMobile ? 64 : 160;
    const RINGS = isMobile ? 6 : 12;

    const diskGeo = new THREE.BufferGeometry();
    const positions = [];
    const uvs = [];
    const radiiArr = [];
    const indices = [];

    for (let r = 0; r <= RINGS; r++) {
      const t = r / RINGS;
      const radius = INNER_R + (OUTER_R - INNER_R) * t;
      for (let s = 0; s <= SEGMENTS; s++) {
        const angle = (s / SEGMENTS) * Math.PI * 2;
        positions.push(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
        uvs.push(s / SEGMENTS, t);
        radiiArr.push(radius);
      }
    }

    for (let r = 0; r < RINGS; r++) {
      for (let s = 0; s < SEGMENTS; s++) {
        const a = r * (SEGMENTS + 1) + s;
        const b = a + SEGMENTS + 1;
        indices.push(a, b, a + 1);
        indices.push(b, b + 1, a + 1);
      }
    }

    diskGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    diskGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    diskGeo.setAttribute('aRadius', new THREE.Float32BufferAttribute(radiiArr, 1));
    diskGeo.setIndex(indices);

    const diskMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uInnerR: { value: INNER_R },
        uOuterR: { value: OUTER_R },
      },
      vertexShader: `
        attribute float aRadius;
        uniform float uTime;
        uniform float uInnerR;
        uniform float uOuterR;
        varying vec2  vUv;
        varying float vRadius;
        varying float vNormR;

        float rand(vec2 co) {
          return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
        }

        void main() {
          vUv     = uv;
          vRadius = aRadius;
          vNormR  = (aRadius - uInnerR) / (uOuterR - uInnerR);

          float speed = 1.0 / (0.4 + vNormR * 1.8);
          float angle = uTime * speed * 0.6;
          float c = cos(angle);
          float s = sin(angle);

          vec3 pos = position;
          float x = pos.x * c - pos.z * s;
          float z = pos.x * s + pos.z * c;
          pos.x = x;
          pos.z = z;

          float warp = rand(vec2(aRadius, floor(uTime * 0.5))) * 0.06;
          pos.y += warp * (1.0 - vNormR);

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec2  vUv;
        varying float vRadius;
        varying float vNormR;

        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
        }

        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          float a = hash(i);
          float b = hash(i + vec2(1.0, 0.0));
          float c = hash(i + vec2(0.0, 1.0));
          float d = hash(i + vec2(1.0, 1.0));
          return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
        }

        vec3 diskColor(float r) {
          if (r < 0.12)
            return mix(vec3(1.0, 1.0, 0.92), vec3(1.0, 0.82, 0.45), r / 0.12);
          if (r < 0.35)
            return mix(vec3(1.0, 0.72, 0.28), vec3(0.95, 0.42, 0.08), (r - 0.12) / 0.23);
          if (r < 0.65)
            return mix(vec3(0.82, 0.28, 0.05), vec3(0.45, 0.12, 0.02), (r - 0.35) / 0.30);
          return mix(vec3(0.28, 0.07, 0.01), vec3(0.06, 0.01, 0.0), (r - 0.65) / 0.35);
        }

        void main() {
          float n1 = noise(vec2(vUv.x * 18.0 + uTime * 0.25, vUv.y * 6.0));
          float n2 = noise(vec2(vUv.x * 42.0 - uTime * 0.4,  vUv.y * 14.0));
          float filament = 0.78 + 0.14 * n1 + 0.08 * n2;

          vec3 col = diskColor(vNormR) * filament;
          float brightness = mix(2.2, 0.7, vNormR);
          col *= brightness;

          float edgeFade = smoothstep(0.0, 0.08, vNormR) * smoothstep(1.0, 0.75, vNormR);
          float alpha = edgeFade * mix(0.98, 0.5, vNormR);

          gl_FragColor = vec4(col, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const disk = new THREE.Mesh(diskGeo, diskMat);
    disk.rotation.x = Math.PI * 0.12;
    scene.add(disk);

    // ═══════════════════════════════════
    // CAPA 3 — HORIZONTE DE EVENTOS
    // ═══════════════════════════════════
    const blackHoleGeo = new THREE.SphereGeometry(1.85, 64, 64);
    const blackHoleMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      depthWrite: true,
    });
    const blackHole = new THREE.Mesh(blackHoleGeo, blackHoleMat);
    scene.add(blackHole);

    // ═══════════════════════════════════
    // CAPA 4 — ANILLO DE LENSING GRAVITACIONAL
    // ═══════════════════════════════════
    const lensGeo = new THREE.SphereGeometry(2.05, 64, 64);
    const lensMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor1: { value: new THREE.Color(0xfff5e0) },
        uColor2: { value: new THREE.Color(0xff9040) },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewDir;
        void main() {
          vNormal  = normalize(normalMatrix * normal);
          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
          vViewDir = normalize(-mvPos.xyz);
          gl_Position = projectionMatrix * mvPos;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3  uColor1;
        uniform vec3  uColor2;
        varying vec3  vNormal;
        varying vec3  vViewDir;
        void main() {
          float fresnel = pow(1.0 - clamp(dot(vNormal, vViewDir), 0.0, 1.0), 4.5);
          float pulse = 0.88 + 0.12 * sin(uTime * 2.2);
          vec3  col   = mix(uColor2, uColor1, fresnel) * pulse;
          float alpha = fresnel * 1.1;
          gl_FragColor = vec4(col, clamp(alpha, 0.0, 1.0));
        }
      `,
      transparent: true,
      side: THREE.FrontSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const lensGlow = new THREE.Mesh(lensGeo, lensMat);
    scene.add(lensGlow);

    // ═══════════════════════════════════
    // CAPA 5 — ARCO SUPERIOR (Gargantua Signature)
    // ═══════════════════════════════════
    let topArc, topArcMat;
    if (!isMobile) {
      const topArcGeo = new THREE.TorusGeometry(2.05, 0.09, 20, 140);
      topArcMat = new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 } },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float uTime;
          varying vec2 vUv;
          void main() {
            float pulse  = 0.82 + 0.18 * sin(uTime * 1.8 + vUv.x * 12.0);
            float bright = smoothstep(0.0, 0.35, vUv.y) * smoothstep(1.0, 0.65, vUv.y);
            vec3  col    = mix(vec3(1.0, 0.78, 0.35), vec3(1.0, 1.0, 0.92), bright);
            gl_FragColor = vec4(col * pulse, bright * 0.75);
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      });
      topArc = new THREE.Mesh(topArcGeo, topArcMat);
      topArc.rotation.x = Math.PI * 0.5;
      topArc.position.y = 0.15;
      scene.add(topArc);
    }

    // ═══════════════════════════════════
    // CAPA 6 — PARTÍCULAS ORBITALES
    // ═══════════════════════════════════
    let particlePoints, partMat;
    if (!isMobile) {
      const PART_COUNT = 320;
      const partPos = new Float32Array(PART_COUNT * 3);
      const partSpeeds = new Float32Array(PART_COUNT);

      for (let i = 0; i < PART_COUNT; i++) {
        const r = 2.4 + Math.random() * 5.0;
        const theta = Math.random() * Math.PI * 2;
        const yOff = (Math.random() - 0.5) * 0.5;
        partPos[i * 3]     = Math.cos(theta) * r;
        partPos[i * 3 + 1] = yOff;
        partPos[i * 3 + 2] = Math.sin(theta) * r;
        partSpeeds[i] = 0.08 + Math.random() * 0.18;
      }

      const partGeo = new THREE.BufferGeometry();
      partGeo.setAttribute('position', new THREE.Float32BufferAttribute(partPos, 3));
      partGeo.setAttribute('aSpeed', new THREE.Float32BufferAttribute(partSpeeds, 1));

      partMat = new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 } },
        vertexShader: `
          attribute float aSpeed;
          uniform float uTime;
          void main() {
            float angle = uTime * aSpeed;
            float c = cos(angle); float s = sin(angle);
            vec3 pos = position;
            float x  = pos.x * c - pos.z * s;
            float z  = pos.x * s + pos.z * c;
            pos.x = x; pos.z = z;
            vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = 1.8 * (300.0 / -mvPos.z);
            gl_Position  = projectionMatrix * mvPos;
          }
        `,
        fragmentShader: `
          void main() {
            vec2  uv = gl_PointCoord - 0.5;
            float d  = length(uv);
            float a  = smoothstep(0.5, 0.05, d);
            vec3  col = mix(vec3(1.0, 0.55, 0.12), vec3(1.0, 0.95, 0.7), smoothstep(0.0, 0.5, d));
            gl_FragColor = vec4(col, a * 0.8);
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      particlePoints = new THREE.Points(partGeo, partMat);
      particlePoints.rotation.x = Math.PI * 0.12;
      scene.add(particlePoints);
    }

    // ═══════════════════════════════════
    // CAPA 7 — LENS FLARE PROCEDIMENTAL
    // ═══════════════════════════════════
    const flareGeo = new THREE.PlaneGeometry(1.2, 1.2);
    const flareMat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 } },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec2  vUv;
        void main() {
          vec2  uv    = vUv - 0.5;
          float d     = length(uv);
          float pulse = 0.75 + 0.25 * sin(uTime * 3.5);
          float core  = smoothstep(0.10, 0.0,  d) * 1.8;
          float inner = smoothstep(0.22, 0.06, d) * 0.6;
          float halo  = smoothstep(0.50, 0.18, d) * 0.2;
          float total = (core + inner + halo) * pulse;
          vec3  col   = mix(vec3(1.0, 0.9, 0.5), vec3(1.0, 0.6, 0.2), smoothstep(0.0, 0.3, d));
          gl_FragColor = vec4(col, clamp(total, 0.0, 1.0));
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    const flare = new THREE.Mesh(flareGeo, flareMat);
    flare.position.set(4.2, 1.4, 0.5);
    scene.add(flare);

    // ═══════════════════════════════════
    // GSAP ANIMATIONS
    // ═══════════════════════════════════
    gsap.from([disk.scale, blackHole.scale, lensGlow.scale], {
      x: 0, y: 0, z: 0,
      duration: 1.6,
      ease: 'expo.out',
      delay: 0.2,
      stagger: 0.08,
    });

    gsap.from(camera.position, {
      z: isMobile ? 26 : 22,
      duration: 2.2,
      ease: 'power3.out',
      delay: 0.1,
    });

    gsap.from(flareMat.uniforms.uTime, {
      value: -2,
      duration: 1.4,
      delay: 0.5,
    });

    // ═══════════════════════════════════
    // EVENT LISTENERS
    // ═══════════════════════════════════
    const isTouch = 'ontouchstart' in window;
    const onMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    if (!isTouch) window.addEventListener('mousemove', onMouseMove);

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    // ═══════════════════════════════════
    // ANIMATION LOOP
    // ═══════════════════════════════════
    function animate() {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Update uniforms
      diskMat.uniforms.uTime.value = t;
      lensMat.uniforms.uTime.value = t;
      flareMat.uniforms.uTime.value = t;
      if (starMat)   starMat.uniforms.uTime.value = t;
      if (topArcMat) topArcMat.uniforms.uTime.value = t;
      if (partMat)   partMat.uniforms.uTime.value = t;

      // Parallax suavizado
      targetX += (mouseX - targetX) * 0.025;
      targetY += (mouseY - targetY) * 0.025;

      // Inclinación del sistema completo por mouse
      scene.rotation.x += (targetY * 0.12 - scene.rotation.x) * 0.04;
      scene.rotation.y += targetX * 0.008;

      // Rotación orbital muy lenta del conjunto
      scene.rotation.y += 0.0012;

      // Flare siempre mira a la cámara (billboard)
      flare.lookAt(camera.position);

      renderer.render(scene, camera);
    }
    animate();

    // ═══════════════════════════════════
    // CLEANUP
    // ═══════════════════════════════════
    return () => {
      cancelAnimationFrame(animId);
      if (!isTouch) window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);

      // Traverse and dispose everything
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach(m => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });

      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className={className} />;
}
