import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Center, Float, Sparkles, SpotLight } from '@react-three/drei';
import * as THREE from 'three';

// Procedurally generated sporty shape since we don't have GLTF models
function SynthCarNode({ color }) {
  const group = useRef();
  
  // Animate the car slightly
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (group.current) {
      group.current.rotation.y = Math.sin(t / 4) * 0.1;
      group.current.position.y = Math.sin(t * 2) * 0.05;
    }
  });

  // Materials
  const bodyMaterial = new THREE.MeshPhysicalMaterial({
    color: color,
    metalness: 0.8,
    roughness: 0.2,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
  });

  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x111111,
    metalness: 0.9,
    roughness: 0.1,
    transmission: 0.9,
    transparent: true,
  });

  const wheelMaterial = new THREE.MeshStandardMaterial({
    color: 0x151515,
    roughness: 0.8,
    metalness: 0.2,
  });

  const neonMaterial = new THREE.MeshBasicMaterial({
    color: color,
  });

  return (
    <group ref={group}>
      {/* Main Body */}
      <mesh castShadow receiveShadow position={[0, 0.4, 0]} material={bodyMaterial}>
        <boxGeometry args={[1.8, 0.4, 4.2]} />
      </mesh>
      
      {/* Cabin/Glass */}
      <mesh castShadow position={[0, 0.75, -0.2]} material={glassMaterial}>
        <boxGeometry args={[1.4, 0.35, 2.0]} />
      </mesh>
      
      {/* Spoiler */}
      <mesh castShadow position={[0, 0.8, -1.9]} material={bodyMaterial}>
        <boxGeometry args={[1.6, 0.05, 0.3]} />
      </mesh>
      <mesh castShadow position={[-0.7, 0.65, -1.9]} material={bodyMaterial}>
        <boxGeometry args={[0.05, 0.3, 0.2]} />
      </mesh>
      <mesh castShadow position={[0.7, 0.65, -1.9]} material={bodyMaterial}>
        <boxGeometry args={[0.05, 0.3, 0.2]} />
      </mesh>

      {/* Wheels */}
      {[-1.2, 1.2].map((z, idx1) => (
        [-0.95, 0.95].map((x, idx2) => (
          <mesh 
            key={`${idx1}-${idx2}`} 
            castShadow 
            position={[x, 0.35, z]} 
            rotation={[0, 0, Math.PI / 2]} 
            material={wheelMaterial}
          >
            <cylinderGeometry args={[0.35, 0.35, 0.25, 32]} />
          </mesh>
        ))
      ))}

      {/* Headlights */}
      <mesh position={[-0.7, 0.45, 2.11]} material={new THREE.MeshBasicMaterial({ color: 0xffffff })}>
        <boxGeometry args={[0.4, 0.05, 0.05]} />
      </mesh>
      <mesh position={[0.7, 0.45, 2.11]} material={new THREE.MeshBasicMaterial({ color: 0xffffff })}>
        <boxGeometry args={[0.4, 0.05, 0.05]} />
      </mesh>
      
      {/* Taillights */}
      <mesh position={[0, 0.45, -2.11]} material={neonMaterial}>
        <boxGeometry args={[1.5, 0.05, 0.05]} />
      </mesh>

      {/* Underglow */}
      <mesh position={[0, 0.1, 0]} material={neonMaterial}>
        <planeGeometry args={[1.6, 3.8]} />
      </mesh>
      <pointLight position={[0, 0, 0]} color={color} intensity={2} distance={3} decay={2} />
    </group>
  );
}

export default function Scene({ activeCar }) {
  return (
    <group>
      {/* Main light shining on the car */}
      <SpotLight
        position={[0, 5, 5]}
        angle={0.5}
        penumbra={0.5}
        intensity={80}
        color={0xffffff}
        castShadow
        shadow-bias={-0.0001}
      />
      
      {/* Backlight / Rim light */}
      <SpotLight
        position={[0, 5, -5]}
        angle={1.0}
        penumbra={1}
        intensity={40}
        color={activeCar.ambientColor}
      />

      {/* Studio Fill Light */}
      <ambientLight intensity={0.2} />
      
      <Center>
        <Float 
          speed={2} 
          rotationIntensity={0.1} 
          floatIntensity={0.2} 
          floatingRange={[-0.05, 0.05]}
        >
          <SynthCarNode color={activeCar.ambientColor} />
        </Float>
      </Center>

      {/* Atmospheric particles based on selected car */}
      <Sparkles 
        count={50} 
        scale={8} 
        size={4} 
        speed={0.4} 
        opacity={0.2} 
        color={activeCar.ambientColor} 
      />
    </group>
  );
}
