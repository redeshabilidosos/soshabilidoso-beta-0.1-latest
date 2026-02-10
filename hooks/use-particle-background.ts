'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
}

export function useParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const pathname = usePathname();
  const lastFrameTimeRef = useRef<number>(0);

  useEffect(() => {
    // Aplicar en todas las páginas (removido el filtro de comunidades)
    // if (pathname?.startsWith('/communities')) {
    //   return;
    // }

    // Crear canvas
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '0';
    canvas.id = 'particle-background';
    
    document.body.appendChild(canvas);
    canvasRef.current = canvas;

    const ctx = canvas.getContext('2d', { 
      alpha: true,
      desynchronized: true // Mejor rendimiento
    });
    
    if (!ctx) {
      return;
    }

    // Configurar tamaño del canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // OPTIMIZACIÓN: Reducir partículas según tamaño de pantalla
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    const particleCount = isMobile ? 30 : isTablet ? 50 : 80; // Era 150
    
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.3,
      });
    }
    particlesRef.current = particles;

    // OPTIMIZACIÓN: Throttle a 30 FPS para mejor rendimiento
    const FPS_LIMIT = 30;
    const FRAME_MIN_TIME = 1000 / FPS_LIMIT;
    
    // OPTIMIZACIÓN: Distancia máxima para conexiones (reducida)
    const MAX_CONNECTION_DISTANCE = isMobile ? 80 : 100; // Era 120
    const MAX_CONNECTION_DISTANCE_SQ = MAX_CONNECTION_DISTANCE * MAX_CONNECTION_DISTANCE;

    // Función de animación optimizada
    const animate = (timestamp: number) => {
      if (!ctx || !canvas) return;

      // OPTIMIZACIÓN: Throttle FPS
      if (timestamp - lastFrameTimeRef.current < FRAME_MIN_TIME) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }
      lastFrameTimeRef.current = timestamp;

      // Limpiar canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dibujar y actualizar partículas
      particles.forEach((particle) => {
        // Actualizar posición
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Rebotar en los bordes
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.vx *= -1;
          particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.vy *= -1;
          particle.y = Math.max(0, Math.min(canvas.height, particle.y));
        }

        // Dibujar partícula
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(57, 255, 20, ${particle.opacity})`;
        ctx.fill();

        // Efecto de brillo
        const gradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.radius * 3
        );
        gradient.addColorStop(0, `rgba(57, 255, 20, ${particle.opacity * 0.8})`);
        gradient.addColorStop(1, 'rgba(57, 255, 20, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius * 3, 0, Math.PI * 2);
        ctx.fill();
      });

      // OPTIMIZACIÓN: Dibujar conexiones con distancia al cuadrado (evita sqrt)
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distanceSq = dx * dx + dy * dy; // Sin sqrt - más rápido

          if (distanceSq < MAX_CONNECTION_DISTANCE_SQ) {
            const distance = Math.sqrt(distanceSq); // Solo calcular si es necesario
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            const opacity = (1 - distance / MAX_CONNECTION_DISTANCE) * 0.15;
            ctx.strokeStyle = `rgba(57, 255, 20, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate(0);

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (canvasRef.current && canvasRef.current.parentNode) {
        canvasRef.current.parentNode.removeChild(canvasRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [pathname]);

  return null;
}
