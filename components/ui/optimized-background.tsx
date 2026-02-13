'use client';

import { useEffect, useRef, memo } from 'react';
import anime from 'animejs';

export const OptimizedBackground = memo(function OptimizedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<any[]>([]);
  const animationFrameRef = useRef<number>();
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Configurar canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();

    // Reducir partículas en móvil para mejor rendimiento
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 40 : 80;

    // Crear partículas
    class Particle {
      x: number;
      y: number;
      size: number;
      baseX: number;
      baseY: number;
      density: number;
      color: string;
      opacity: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2.5 + 0.5;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = Math.random() * 30 + 1;
        this.color = Math.random() > 0.5 ? '16, 185, 129' : '14, 165, 233'; // RGB de neon-green y neon-blue
        this.opacity = Math.random() * 0.5 + 0.3;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }

      update() {
        // Movimiento suave con anime.js (solo actualizar posición)
        this.x += Math.sin(Date.now() * 0.001 + this.density) * 0.3;
        this.y += Math.cos(Date.now() * 0.001 + this.density) * 0.3;

        // Mantener dentro del canvas
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
      }
    }

    // Inicializar partículas
    particlesRef.current = [];
    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push(new Particle());
    }

    // Animar opacidad de partículas con anime.js
    particlesRef.current.forEach((particle, index) => {
      anime({
        targets: particle,
        opacity: [0.3, 0.8],
        duration: 2000 + Math.random() * 1000,
        easing: 'easeInOutSine',
        direction: 'alternate',
        loop: true,
        delay: index * 50,
      });
    });

    // Función de animación optimizada
    let lastTime = 0;
    const fps = 30; // Limitar a 30 FPS para mejor rendimiento
    const fpsInterval = 1000 / fps;

    const animate = (currentTime: number) => {
      if (!isAnimatingRef.current) return;

      animationFrameRef.current = requestAnimationFrame(animate);

      const elapsed = currentTime - lastTime;
      if (elapsed < fpsInterval) return;

      lastTime = currentTime - (elapsed % fpsInterval);

      // Limpiar canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Actualizar y dibujar partículas
      particlesRef.current.forEach(particle => {
        particle.update();
        particle.draw();
      });

      // Conectar partículas cercanas (optimizado)
      if (!isMobile) {
        const maxDistance = 100;
        for (let i = 0; i < particlesRef.current.length; i++) {
          for (let j = i + 1; j < particlesRef.current.length; j++) {
            const dx = particlesRef.current[i].x - particlesRef.current[j].x;
            const dy = particlesRef.current[i].y - particlesRef.current[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < maxDistance) {
              const opacity = (1 - distance / maxDistance) * 0.3;
              ctx.strokeStyle = `rgba(16, 185, 129, ${opacity})`;
              ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(particlesRef.current[i].x, particlesRef.current[i].y);
              ctx.lineTo(particlesRef.current[j].x, particlesRef.current[j].y);
              ctx.stroke();
            }
          }
        }
      }
    };

    // Iniciar animación
    isAnimatingRef.current = true;
    animate(0);

    // Manejar resize con debounce
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        resizeCanvas();
      }, 250);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      isAnimatingRef.current = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', handleResize);
      anime.remove(particlesRef.current);
    };
  }, []);

  return (
    <>
      {/* Canvas de partículas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 1 }}
      />
      
      {/* Estrellas CSS (más ligeras que canvas) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() < 0.7 ? '1px' : '2px',
              height: Math.random() < 0.7 ? '1px' : '2px',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.2,
              animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>
    </>
  );
});
