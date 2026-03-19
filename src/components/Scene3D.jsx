"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function ParticleField({ count = 2000 }) {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        p[i * 3] = (Math.random() - 0.5) * 10;
        p[i * 3 + 1] = (Math.random() - 0.5) * 10;
        p[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return p;
  }, [count]);

  const groupRect = useRef();

  useFrame((state, delta) => {
    groupRect.current.rotation.y += delta * 0.05;
    groupRect.current.rotation.x += delta * 0.02;
  });

  return (
    <group ref={groupRect}>
      <Points positions={points} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#7cf7ff"
          size={0.015}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
}

function FloatingShapes() {
    return (
        <group>
            <Float speed={2} rotationIntensity={1} floatIntensity={2}>
                <mesh position={[-2, 1, -2]}>
                    <octahedronGeometry args={[0.5, 0]} />
                    <meshStandardMaterial color="#a78bfa" wireframe transparent opacity={0.3} />
                </mesh>
            </Float>
            <Float speed={1.5} rotationIntensity={1.5} floatIntensity={1.5}>
                <mesh position={[2, -1, -3]}>
                    <torusGeometry args={[0.4, 0.1, 16, 32]} />
                    <meshStandardMaterial color="#7cf7ff" wireframe transparent opacity={0.3} />
                </mesh>
            </Float>
        </group>
    )
}

export function Scene3D() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none" style={{ opacity: 0.6 }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#7cf7ff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#a78bfa" />
        <ParticleField />
        <FloatingShapes />
      </Canvas>
    </div>
  );
}
