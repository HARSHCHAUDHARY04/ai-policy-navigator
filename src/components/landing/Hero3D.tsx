import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

function ShieldModel() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <Float
      speed={2} 
      rotationIntensity={1} 
      floatIntensity={2} 
      floatingRange={[-0.1, 0.1]}
    >
      <mesh ref={meshRef} scale={1.2}>
        {/* A simple torus knot that looks complex and tech-like, representing secure encrypted data */}
        <torusKnotGeometry args={[1.2, 0.35, 128, 32]} />
        <meshPhysicalMaterial 
          color="#00ff88" 
          emissive="#00ff88"
          emissiveIntensity={0.5}
          roughness={0.1}
          metalness={0.8}
          clearcoat={1}
          clearcoatRoughness={0.1}
          transmission={0.5} /* Glass-like property */
          thickness={0.5}
        />
      </mesh>
    </Float>
  );
}

export function Hero3D() {
  return (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center relative">
      <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full mix-blend-screen opacity-50" />
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          
          <ShieldModel />
          
          <Environment preset="city" />
          <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={15} blur={2.5} far={4} />
        </Suspense>
      </Canvas>
    </div>
  );
}
