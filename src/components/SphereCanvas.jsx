import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

export default function SphereCanvas({ className = '' }) {
  const mountRef = useRef(null);

  useEffect(() => {
    let animId;
    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;

    const canvas = mountRef.current;
    if (!canvas) return;

    // SCENE, CAMERA, RENDERER
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;

    // AMBIENT LIGHT
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(ambientLight);

    // COMMON VERTEX SHADER FOR BREATHING EFFECT
    const customVertexShader = `
      uniform float uTime;
      varying vec3 vNormal;
      varying vec3 vViewDir;
      varying vec3 vPosition;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        
        // Organic breathing distortion (frequency 1.5, strength 0.08)
        float distortion = sin(position.x * 1.5 + uTime) 
                         * sin(position.y * 1.5 + uTime)
                         * sin(position.z * 1.5 + uTime);
                         
        vec3 newPos = position + normal * (distortion * 0.08);
        
        vec4 worldPos = modelViewMatrix * vec4(newPos, 1.0);
        vViewDir = normalize(-worldPos.xyz);
        gl_Position = projectionMatrix * worldPos;
      }
    `;

    // CAPA 2: ESFERA BASE (CON SHADER PARA RESPIRACIÓN Y SCANLINE)
    const sphereGeo = new THREE.SphereGeometry(2.8, 32, 32);
    const sphereMat = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(0xCC2200) },
        uTime: { value: 0 },
      },
      vertexShader: customVertexShader,
      fragmentShader: `
        uniform vec3 uColor;
        uniform float uTime;
        varying vec3 vPosition;
        void main() {
          // Subtle scanline on the base
          float scanline = sin(vPosition.y * 50.0 - uTime * 5.0) * 0.5 + 0.5;
          scanline = mix(0.9, 1.0, scanline);
          gl_FragColor = vec4(uColor * scanline, 0.85);
        }
      `,
      transparent: true,
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(sphere);

    // GLOW (FRESNEL)
    const fresnelMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(0xff2200) },
        uIntensity: { value: 1.4 },
        uTime: { value: 0 },
      },
      vertexShader: customVertexShader,
      fragmentShader: `
        uniform vec3 uColor;
        uniform float uIntensity;
        uniform float uTime;
        varying vec3 vNormal;
        varying vec3 vViewDir;
        varying vec3 vPosition;
        void main() {
          float fresnel = pow(1.0 - dot(vNormal, vViewDir), 3.0);
          float scanline = sin(vPosition.y * 50.0 - uTime * 10.0) * 0.5 + 0.5;
          scanline = mix(0.9, 1.0, scanline);
          gl_FragColor = vec4(uColor, fresnel * uIntensity * 0.6 * scanline);
        }
      `,
      transparent: true,
      side: THREE.FrontSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const glowGeo = new THREE.SphereGeometry(3.4, 32, 32);
    const glowMesh = new THREE.Mesh(glowGeo, fresnelMaterial);
    scene.add(glowMesh);

    // CAPA 3: WIREFRAME LOW-POLY
    const icoGeo = new THREE.IcosahedronGeometry(3.0, 1);
    const edges = new THREE.EdgesGeometry(icoGeo);
    const wireMat = new THREE.LineBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.6,
    });
    const wireframe = new THREE.LineSegments(edges, wireMat);
    scene.add(wireframe);

    // CAPA 4: ANILLO ORBITAL DORADO
    const torusGeo = new THREE.TorusGeometry(3.2, 0.04, 8, 80);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xFFD700 });
    const ring = new THREE.Mesh(torusGeo, ringMat);
    ring.rotation.x = Math.PI * 0.25;
    scene.add(ring);

    // CAPA 5: PARTICULAS ORBITALES
    const particlePositions = [];
    for (let i = 0; i < 180; i++) {
      const theta = (i / 180) * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 3.8 + Math.random() * 1.2;
      particlePositions.push(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.Float32BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x00ffff,
      size: 0.05,
      transparent: true,
      opacity: 0.7,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // DEGRADACIÓN MOBILE
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      const s = 0.65;
      sphere.scale.set(s, s, s);
      wireframe.scale.set(s, s, s);
      glowMesh.scale.set(s, s, s);
      ring.scale.set(s, s, s);
      particles.scale.set(s, s, s);
      particles.visible = false;
      renderer.setPixelRatio(1);
    }

    // EVENT LISTENERS
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      if (isMobile) {
          renderer.setPixelRatio(1);
      } else {
          renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      }
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    const isTouch = 'ontouchstart' in window;
    const onMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    if (!isTouch) {
      window.addEventListener('mousemove', onMouseMove);
    }

    // GSAP ANIMATIONS
    gsap.from(sphere.scale, {
      x: 0, y: 0, z: 0,
      duration: 1.4,
      ease: 'elastic.out(1, 0.5)',
      delay: 0.3,
    });

    // Make sure glowMesh scales together with the sphere since we decoupled them this time
    gsap.from(glowMesh.scale, {
      x: 0, y: 0, z: 0,
      duration: 1.4,
      ease: 'elastic.out(1, 0.5)',
      delay: 0.3,
    });

    gsap.from(wireMat, {
      opacity: 0,
      duration: 0.8,
      delay: 0.9,
    });

    gsap.from(ring.scale, {
      x: 0, y: 0, z: 0,
      duration: 1.0,
      ease: 'back.out(2)',
      delay: 1.1,
    });

    gsap.from(particleMat, {
      opacity: 0,
      duration: 1.2,
      delay: 1.4,
    });

    // ANIMATION LOOP
    const clock = new THREE.Clock();
    function animate() {
      // Loop is ALWAYS invoked to ensure breathing & rotation works in all devices
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Update Custom Shaders Data
      sphereMat.uniforms.uTime.value = time;
      fresnelMaterial.uniforms.uTime.value = time;

      // Parallax suavizado con lerp
      targetX += (mouseX - targetX) * 0.04;
      targetY += (mouseY - targetY) * 0.04;

      // Rotación base + parallax
      sphere.rotation.y += 0.003;
      sphere.rotation.x += (targetY * 0.3 - sphere.rotation.x) * 0.05;
      sphere.rotation.y += (targetX * 0.3 - sphere.rotation.y) * 0.05; // Added lerp for smooth X parallax to match wireframe exactly

      // Wireframe rota junto a la esfera
      wireframe.rotation.y = sphere.rotation.y * 0.85;
      wireframe.rotation.x = sphere.rotation.x * 0.85;

      // Glow sigue exactamente a la esfera
      glowMesh.rotation.copy(sphere.rotation);

      // Anillo orbital rotación independiente
      ring.rotation.z += 0.003;

      // Partículas rotación muy lenta
      particles.rotation.y += 0.0008;
      particles.rotation.x += 0.0003;

      renderer.render(scene, camera);
    }
    
    // START LOOP
    animate();

    // CLEANUP
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);

      icoGeo.dispose();
      edges.dispose();
      sphereGeo.dispose();
      glowGeo.dispose();
      torusGeo.dispose();
      particleGeo.dispose();

      wireMat.dispose();
      sphereMat.dispose();
      fresnelMaterial.dispose();
      ringMat.dispose();
      particleMat.dispose();

      renderer.dispose();
    };
  }, []);

  return (
    <canvas ref={mountRef} className={className} />
  );
}
