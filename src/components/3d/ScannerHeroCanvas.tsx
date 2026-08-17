'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Float } from '@react-three/drei';
import { useRef, useMemo, useEffect, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScannerModelProps {
  scrollProgress: number;
}

function ScannerTablet({ scrollProgress }: ScannerModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const screenRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef<THREE.Mesh>(null);
  
  const { clock } = useThree();
  
  // Dynamic materials based on scroll
  const screenMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#00F0FF',
      emissive: '#00F0FF',
      emissiveIntensity: 0.5 + scrollProgress * 0.5,
      roughness: 0.2,
      metalness: 0.8,
    });
  }, [scrollProgress]);

  const bodyMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#1A2332',
      roughness: 0.4,
      metalness: 0.9,
    });
  }, []);

  useFrame(() => {
    if (groupRef.current) {
      // Subtle floating animation
      groupRef.current.position.y = Math.sin(clock.elapsedTime * 0.5) * 0.1;
      groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.3) * 0.05;
      
      // Scroll-based rotation
      groupRef.current.rotation.x = scrollProgress * Math.PI * 0.3;
      groupRef.current.rotation.z = scrollProgress * 0.1;
    }
    
    if (screenRef.current) {
      // Pulsing screen effect
      const pulse = Math.sin(clock.elapsedTime * 2) * 0.2 + 0.8;
      (screenRef.current.material as THREE.Material).opacity = pulse;
    }
    
    if (pulseRef.current) {
      // Expanding pulse rings
      const scale = 1 + Math.sin(clock.elapsedTime * 3 + scrollProgress * 10) * 0.1;
      pulseRef.current.scale.set(scale, scale, 1);
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Tablet Body */}
      <mesh position={[0, 0, -0.05]}>
        <boxGeometry args={[2.4, 3.2, 0.1]} />
        <primitive object={bodyMaterial} attach="material" />
      </mesh>
      
      {/* Screen */}
      <mesh ref={screenRef} position={[0, 0, 0.02]}>
        <planeGeometry args={[2, 2.8]} />
        <meshStandardMaterial 
          color="#0D1117" 
          emissive="#00F0FF"
          emissiveIntensity={0.3 + scrollProgress * 0.7}
          roughness={0.1}
          metalness={0.5}
        />
      </mesh>
      
      {/* Screen Content - Grid Lines */}
      <mesh position={[0, 0, 0.03]}>
        <planeGeometry args={[1.8, 2.6]} />
        <meshBasicMaterial 
          color="#00F0FF" 
          wireframe 
          transparent 
          opacity={0.3 + scrollProgress * 0.4}
        />
      </mesh>
      
      {/* Pulse Ring */}
      <mesh ref={pulseRef} position={[0, 0, 0.04]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.5, 0.6, 32]} />
        <meshBasicMaterial 
          color="#00FF87" 
          transparent 
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Connector Port */}
      <mesh position={[0, -1.7, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.2, 16]} />
        <meshStandardMaterial color="#333" roughness={0.5} metalness={0.8} />
      </mesh>
      
      {/* Buttons */}
      <mesh position={[1.25, 0.5, 0]}>
        <boxGeometry args={[0.05, 0.3, 0.05]} />
        <meshStandardMaterial color="#00F0FF" emissive="#00F0FF" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[1.25, -0.5, 0]}>
        <boxGeometry args={[0.05, 0.3, 0.05]} />
        <meshStandardMaterial color="#00F0FF" emissive="#00F0FF" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

function HolographicCar({ scrollProgress }: ScannerModelProps) {
  const carGroupRef = useRef<THREE.Group>(null);
  const { clock } = useThree();
  
  useFrame(() => {
    if (carGroupRef.current) {
      carGroupRef.current.rotation.y = -scrollProgress * Math.PI * 0.5;
      carGroupRef.current.position.z = -2 - scrollProgress * 2;
      carGroupRef.current.position.y = -0.5 + scrollProgress * 0.5;
    }
  });

  // Create a wireframe car chassis
  return (
    <group ref={carGroupRef} position={[0, -0.5, -2]}>
      {/* Car Body Outline */}
      <mesh rotation={[0, 0, 0]}>
        <boxGeometry args={[1.8, 0.8, 3.5]} />
        <meshBasicMaterial 
          color="#00FF87" 
          wireframe 
          transparent 
          opacity={0.3 - scrollProgress * 0.2}
        />
      </mesh>
      
      {/* Wheels */}
      {([[-0.9, -0.4, 1.2], [0.9, -0.4, 1.2], [-0.9, -0.4, -1.2], [0.9, -0.4, -1.2]] as [number, number, number][]).map((pos, i) => (
        <mesh key={i} position={pos}>
          <cylinderGeometry args={[0.35, 0.35, 0.2, 16]} rotation={[Math.PI / 2, 0, 0]} />
          <meshBasicMaterial color="#00FF87" wireframe transparent opacity={0.4} />
        </mesh>
      ))}
      
      {/* ECU Points */}
      <mesh position={[0, 0.2, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color="#FFB800" />
      </mesh>
      
      {/* Connection Lines to Scanner */}
      <line>
        <bufferGeometry>
          <float32BufferAttribute attach="attributes-position" count={2} array={new Float32Array([0, 0.2, 0, 0, 0.5, 1.5])} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial color="#00F0FF" transparent opacity={0.5 - scrollProgress * 0.3} />
      </line>
    </group>
  );
}

function DiagnosticParticles({ scrollProgress }: ScannerModelProps) {
  const particlesRef = useRef<THREE.Points>(null);
  const { clock } = useThree();
  
  const particlesData = useMemo(() => {
    const positions = new Float32Array(500 * 3);
    for (let i = 0; i < 500; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return positions;
  }, []);

  useFrame(() => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = clock.elapsedTime * 0.05;
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < 500; i++) {
        positions[i * 3 + 1] += Math.sin(clock.elapsedTime + i) * 0.002;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <float32BufferAttribute attach="attributes-position" count={500} array={particlesData} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#00F0FF" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

function HUDOverlays({ scrollProgress }: ScannerModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { clock } = useThree();
  
  const telemetryTexts = ['RPM: 2847', 'VOLT: 12.6V', 'TEMP: 89°C', 'DTC: P0300'];
  
  return (
    <group ref={groupRef}>
      {telemetryTexts.map((text, i) => (
        <mesh key={i} position={[2.5 + Math.sin(i) * 0.5, 1 - i * 0.6, 0]}>
          <textGeometry args={[text, { size: 0.15, height: 0.02, curveSegments: 12 }]} />
          <meshBasicMaterial color="#00FF87" transparent opacity={0.8 - scrollProgress * 0.3} />
        </mesh>
      ))}
    </group>
  );
}

export default function ScannerHeroCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const progress = Math.min(scrollTop / maxScroll, 1);
      setScrollProgress(progress);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <div ref={containerRef} className="fixed inset-0 z-0 pointer-events-none">
      <Canvas gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00F0FF" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00FF87" />
        
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
          <ScannerTablet scrollProgress={scrollProgress} />
        </Float>
        
        <HolographicCar scrollProgress={scrollProgress} />
        <DiagnosticParticles scrollProgress={scrollProgress} />
        
        <Environment preset="city" />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          autoRotate 
          autoRotateSpeed={0.5}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  );
}
