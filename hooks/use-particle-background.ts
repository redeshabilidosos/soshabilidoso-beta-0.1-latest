'use client';
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

  useEffect(() => {
    // No aplicar en páginas de comunidades
    if (pathname?.startsWith('/communities')) {
      console.log('🚫 Partículas deshabilitadas en comunidades');
      return;
    }

    console.log('✨ Iniciando fondo de partículas en:', pathname);

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
    
    console.log('✅ Canvas creado y agregado al DOM');

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('❌ No se pudo obtener el contexto 2D del canvas');
      return;
    }

    // Configurar tamaño del canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Crear partículas
    const particleCount = 150;
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
    
    console.log(`✅ ${particleCount} partículas creadas`);

    // Función de animación
    const animate = () => {
      if (!ctx || !canvas) return;

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

      // Dibujar conexiones entre partículas cercanas
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            const opacity = (1 - distance / 120) * 0.15;
            ctx.strokeStyle = `rgba(57, 255, 20, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (canvasRef.current) {
        document.body.removeChild(canvasRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [pathname]);

  return null;
}
