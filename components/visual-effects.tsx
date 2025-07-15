"use client"

import { useEffect, useState } from "react"
import { Star, Heart, Sparkles, Zap, Coins } from "lucide-react"

interface Particle {
  id: number
  x: number
  y: number
  delay: number
  duration: number
}

export function FallingStars() {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    const newParticles = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 3 + Math.random() * 4,
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-fall"
          style={{
            left: `${particle.x}%`,
            top: `-10%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        >
          <Star
            className="w-3 h-3 text-yellow-500 dark:text-yellow-400 animate-sparkle drop-shadow-lg"
            style={{
              filter: "drop-shadow(0 0 4px rgba(234, 179, 8, 0.8))",
            }}
          />
        </div>
      ))}
    </div>
  )
}

export function FloatingParticles() {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 4,
      duration: 2 + Math.random() * 3,
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-float"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        >
          <div
            className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-pulse opacity-80 shadow-lg"
            style={{
              boxShadow: "0 0 8px rgba(59, 130, 246, 0.6)",
            }}
          />
        </div>
      ))}
    </div>
  )
}

export function AnimatedSparkles() {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 2 + Math.random() * 2,
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-bounce"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        >
          <Sparkles
            className="w-4 h-4 text-blue-500 dark:text-blue-300 animate-sparkle opacity-70 drop-shadow-md"
            style={{
              filter: "drop-shadow(0 0 3px rgba(59, 130, 246, 0.7))",
            }}
          />
        </div>
      ))}
    </div>
  )
}

export function FloatingMoney() {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    const newParticles = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 4,
      duration: 3 + Math.random() * 3,
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-float"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        >
          <Coins
            className="w-5 h-5 text-green-600 dark:text-green-400 animate-pulse opacity-80 drop-shadow-lg"
            style={{
              filter: "drop-shadow(0 0 4px rgba(34, 197, 94, 0.7))",
            }}
          />
        </div>
      ))}
    </div>
  )
}

export function FloatingHearts() {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    const newParticles = Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 2 + Math.random() * 2,
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-bounce"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        >
          <Heart
            className="w-4 h-4 text-pink-600 dark:text-pink-400 animate-pulse opacity-80 drop-shadow-md"
            style={{
              filter: "drop-shadow(0 0 3px rgba(236, 72, 153, 0.7))",
            }}
          />
        </div>
      ))}
    </div>
  )
}

export function ElectricSparks() {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    const newParticles = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 1 + Math.random() * 2,
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-ping"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        >
          <Zap
            className="w-5 h-5 text-yellow-600 dark:text-yellow-400 opacity-90 drop-shadow-lg"
            style={{
              filter: "drop-shadow(0 0 4px rgba(234, 179, 8, 0.8))",
            }}
          />
        </div>
      ))}
    </div>
  )
}
