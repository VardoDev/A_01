// @ts-nocheck
import { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber'
import * as THREE from 'three'

declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}

const PARTICLE_COUNT = 2000

function ParticleCloud({ mouseRef }: { mouseRef: React.MutableRefObject<{ x: number; y: number }> }) {
  const ref = useRef<THREE.Points>(null)
  const positions = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const radius = 4 + Math.random() * 4
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = radius * Math.cos(phi)
    }
    return pos
  }, [])

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime * 0.08
    ref.current.rotation.x = t * 0.15 + mouseRef.current.y * 0.3
    ref.current.rotation.y = t * 0.2 + mouseRef.current.x * 0.3
  })

  return (
    <group rotation={[0, 0, Math.PI / 6]}>
      <points ref={ref} frustumCulled={false}>
        <bufferGeometry>
          {/* @ts-ignore */}
          <bufferAttribute
            attach="attributes-position"
            count={PARTICLE_COUNT}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        {/* @ts-ignore */}
        <pointsMaterial
          transparent
          size={0.04}
          sizeAttenuation
          depthWrite={false}
          color="#8B5CF6"
          opacity={0.6}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  )
}

export function ParticleBackground() {
  const mouseRef = useRef({ x: 0, y: 0 })
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setMounted(true)
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouseRef.current.y = -(e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', handleMouse)
    return () => {
      window.removeEventListener('resize', checkMobile)
      window.removeEventListener('mousemove', handleMouse)
    }
  }, [])

  if (!mounted || isMobile) {
    return (
      <div
        className="fixed inset-0 -z-10 bg-background"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(139, 92, 246, 0.08) 0%, #050505 70%)',
        }}
      />
    )
  }

  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }} dpr={[1, 1.5]}>
        <color attach="background" args={['#050505']} />
        <ambientLight intensity={0.2} />
        <ParticleCloud mouseRef={mouseRef} />
      </Canvas>
    </div>
  )
}
