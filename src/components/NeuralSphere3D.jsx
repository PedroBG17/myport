import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { EffectComposer, Bloom, Noise } from '@react-three/postprocessing';

const vertexShader = `
  uniform float uTime;
  uniform float uDistortionFrequency;
  uniform float uDistortionStrength;

  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vViewPosition;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    
    // Breathing organic distortion based on sine waves and time
    float distortion = sin(position.x * uDistortionFrequency + uTime) 
                     * sin(position.y * uDistortionFrequency + uTime)
                     * sin(position.z * uDistortionFrequency + uTime);
                     
    vec3 newPosition = position + normal * (distortion * uDistortionStrength);
    
    vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec3 uColor;
  
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vViewPosition;

  void main() {
    // Fresnel effect for glowy edges
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);
    float fresnel = dot(viewDir, normal);
    fresnel = clamp(1.0 - fresnel, 0.0, 1.0);
    fresnel = pow(fresnel, 3.0); 
    
    // Scanline effect
    float scanline = sin(vPosition.y * 50.0 - uTime * 10.0) * 0.5 + 0.5;
    scanline = mix(0.85, 1.0, scanline);
    
    vec3 finalColor = uColor + (fresnel * vec3(1.0, 0.4, 0.4));
    finalColor *= scanline;
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

export function SpaceParticles() {
  const pointsRef = useRef();
  
  const [positions, colors] = useMemo(() => {
    const count = 400;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const color1 = new THREE.Color("#00FFFF");
    const color2 = new THREE.Color("#FFFFFF");
    
    for(let i=0; i<count; i++) {
        pos[i*3] = (Math.random() - 0.5) * 40;
        pos[i*3+1] = (Math.random() - 0.5) * 40;
        pos[i*3+2] = (Math.random() - 0.5) * 40;
        
        const mixedColor = color1.clone().lerp(color2, Math.random());
        col[i*3] = mixedColor.r;
        col[i*3+1] = mixedColor.g;
        col[i*3+2] = mixedColor.b;
    }
    return [pos, col];
  }, []);

  useFrame((state) => {
    if(!pointsRef.current) return;
    const targetX = (state.pointer.x * Math.PI) * 0.02;
    const targetY = (state.pointer.y * Math.PI) * 0.02;
    
    // Slow Parallax for background
    pointsRef.current.rotation.x += (targetY - pointsRef.current.rotation.x) * 0.05;
    pointsRef.current.rotation.y += (targetX - pointsRef.current.rotation.y) * 0.05;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={colors.length / 3} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.05} vertexColors transparent opacity={0.5} sizeAttenuation={true} />
    </points>
  );
}

export function OrbitalParticles() {
    const pointsRef = useRef();
    
    const [positions, colors, phases, speeds] = useMemo(() => {
        const count = 300;
        const pos = new Float32Array(count * 3);
        const col = new Float32Array(count * 3);
        const phs = new Float32Array(count);
        const spd = new Float32Array(count);
        
        const color1 = new THREE.Color("#00FFFF");
        const color2 = new THREE.Color("#FFFFFF");
        
        for(let i=0; i<count; i++) {
            const theta = Math.random() * Math.PI * 2;
            const yOffset = (Math.random() - 0.5) * 2.5; 
            const radius = 2.5 + Math.random() * 0.8;
            
            pos[i*3] = Math.cos(theta) * radius;
            pos[i*3+1] = yOffset;
            pos[i*3+2] = Math.sin(theta) * radius;
            
            const mixedColor = color1.clone().lerp(color2, Math.random());
            col[i*3] = mixedColor.r;
            col[i*3+1] = mixedColor.g;
            col[i*3+2] = mixedColor.b;
            
            phs[i] = theta;
            spd[i] = ((1.0 - Math.abs(yOffset)/1.25) * 0.5 + 0.2) * (Math.random() > 0.5 ? 1 : -1);
        }
        return [pos, col, phs, spd];
    }, []);
    
    useFrame((state, delta) => {
        if(!pointsRef.current) return;
        const positions = pointsRef.current.geometry.attributes.position.array;
        
        for(let i=0; i<300; i++) {
            phases[i] += speeds[i] * delta * 0.5;
            const radius = 2.5;
            positions[i*3] = Math.cos(phases[i]) * radius;
            positions[i*3+2] = Math.sin(phases[i]) * (radius * 0.8); 
        }
        pointsRef.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
                <bufferAttribute attach="attributes-color" count={colors.length / 3} array={colors} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial size={0.03} vertexColors transparent opacity={0.8} />
        </points>
    );
}

export function CoreSphere() {
  const meshRef = useRef();
  const wireframeRef = useRef();
  const ringRef = useRef();
  const groupRef = useRef();

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uDistortionFrequency: { value: 1.5 },
    uDistortionStrength: { value: 0.12 },
    uColor: { value: new THREE.Color("#FF4D4D") }
  }), []);

  useEffect(() => {
    if(groupRef.current) {
        gsap.fromTo(groupRef.current.scale, 
            { x: 0, y: 0, z: 0 },
            { x: 1, y: 1, z: 1, duration: 1.8, ease: "elastic.out(1, 0.5)" }
        );
    }
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if(meshRef.current) {
        meshRef.current.material.uniforms.uTime.value = t;
    }
    
    if(groupRef.current) {
        const isTouch = window.matchMedia("(pointer: coarse)").matches;
        if (!isTouch) {
            const targetX = (state.pointer.x * Math.PI) * 0.05;
            const targetY = (state.pointer.y * Math.PI) * 0.05;

            groupRef.current.rotation.x += (targetY - groupRef.current.rotation.x) * 0.05;
            groupRef.current.rotation.y += (targetX - groupRef.current.rotation.y) * 0.05;
        } else {
            groupRef.current.rotation.y += 0.005;
        }
    }

    if(ringRef.current) {
        ringRef.current.rotation.x = Math.PI/2 + Math.sin(t*0.5) * 0.2;
        ringRef.current.rotation.z = t * 0.2;
    }
    
    if(wireframeRef.current) {
        wireframeRef.current.rotation.y = -t * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Base Shader Material Sphere */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.5, 64]} />
        <shaderMaterial 
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            uniforms={uniforms}
            transparent={true}
        />
      </mesh>
      
      {/* Outer Wireframe structure (Red Coral) */}
      <mesh ref={wireframeRef}>
        <icosahedronGeometry args={[1.6, 2]} />
        <meshBasicMaterial color="#FF4D4D" wireframe={true} transparent opacity={0.3} />
      </mesh>

      {/* Orbital Golden Ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.2, 0.015, 16, 100]} />
        <meshBasicMaterial color="#FFFF00" transparent opacity={0.6} />
      </mesh>
      
      <OrbitalParticles />
    </group>
  );
}

export default function NeuralSphere3D() {
  return (
    <>
        <SpaceParticles />
        <CoreSphere />
        
        <EffectComposer disableNormalPass>
            <Bloom 
                luminanceThreshold={0.8} 
                luminanceSmoothing={0.9} 
                height={300} 
                intensity={0.3} 
            />
            <Noise opacity={0.05} />
        </EffectComposer>
    </>
  );
}
