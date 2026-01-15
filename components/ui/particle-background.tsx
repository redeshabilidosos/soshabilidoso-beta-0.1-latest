'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import type { Engine } from 'tsparticles-engine';

// Colores de partículas según el tema de fondo - más vivos y saturados
const getParticleColors = (backgroundId: string) => {
  const colorSchemes = {
    'cyber-green': ["#ffffff", "#39FF14", "#00ff88", "#00ffcc", "#88ff00"],
    'ocean-blue': ["#ffffff", "#00d4ff", "#0099ff", "#00ffff", "#4488ff"],
    'fire-red': ["#ffffff", "#ff3333", "#ff6600", "#ffaa00", "#ff0066"],
    'blackout': ["#ffffff", "#cccccc", "#aaaaaa", "#888888"],
    'purple-night': ["#ffffff", "#bf00ff", "#9933ff", "#cc66ff", "#ff00ff"],
    'golden-sunset': ["#ffffff", "#ffcc00", "#ff9900", "#ffdd44", "#ffaa00"]
  };

  return colorSchemes[backgroundId as keyof typeof colorSchemes] || colorSchemes['cyber-green'];
};

export function ParticleBackground() {
  const [particleColors, setParticleColors] = useState(getParticleColors('cyber-green'));

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async () => {
    // Particles loaded successfully
  }, []);

  useEffect(() => {
    // Escuchar cambios en el color de fondo
    const updateColors = () => {
      const savedColor = localStorage.getItem('background-color') || 'cyber-green';
      setParticleColors(getParticleColors(savedColor));
    };

    // Actualizar colores al cargar
    updateColors();

    // Escuchar cambios en localStorage
    window.addEventListener('storage', updateColors);

    // También escuchar un evento personalizado para cambios inmediatos
    window.addEventListener('background-color-changed', updateColors);

    return () => {
      window.removeEventListener('storage', updateColors);
      window.removeEventListener('background-color-changed', updateColors);
    };
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      loaded={particlesLoaded}
      options={{
        fullScreen: {
          enable: true, // Deshabilitar fullScreen para renderizar dentro del div padre
        },
        background: {
          color: {
            value: "transparent", // El fondo ya lo maneja el body con el color del tema
          },
        },
        fpsLimit: 60,
        pauseOnBlur: true,
        pauseOnOutsideViewport: true,
        interactivity: {
          events: {
            onClick: {
              enable: false, // Deshabilitar interacción al hacer click
              mode: "push",
            },
            onHover: {
              enable: false, // Deshabilitar interacción al pasar el ratón
              mode: "repulse",
            },
            resize: true,
          },
          modes: {
            push: {
              quantity: 4,
            },
            repulse: {
              distance: 200,
              duration: 0.4,
            },
          },
        },
        particles: {
          number: {
            value: 150, // Cantidad intermedia de partículas
            density: {
              enable: true,
              area: 1200, // Área más grande para menor densidad
            },
          },
          color: {
            value: particleColors, // Colores dinámicos basados en el tema de fondo
          },
          shape: {
            type: ["circle", "star"], // Círculos y estrellas
            options: {
              star: {
                sides: 5,
              },
            },
          },
          opacity: {
            value: { min: 0.4, max: 0.8 }, // Opacidad más visible
            animation: {
              enable: true,
              speed: 1,
              minimumValue: 0.4,
              sync: false,
              startValue: "random",
            },
          },
          size: {
            value: { min: 1, max: 3 }, // Tamaños ligeramente más grandes
            random: true,
            animation: {
              enable: true,
              speed: 2,
              minimumValue: 1,
              sync: false,
            },
          },
          shadow: {
            enable: true,
            color: "#ffffff",
            blur: 8,
          },
          stroke: {
            width: 0,
          },
          links: {
            enable: false,
          },
          move: {
            enable: true,
            speed: { min: 0.2, max: 1.5 }, // Velocidades variables
            direction: "none", // Movimiento en todas las direcciones
            random: true,
            straight: false,
            outModes: {
              default: "bounce", // Rebotar en los bordes
            },
            attract: {
              enable: false,
            },
            gravity: {
              enable: false,
            },
            drift: 0,
            warp: false,
          },
          twinkle: {
            particles: {
              enable: true,
              frequency: 0.05, // Más frecuencia de parpadeo para más brillo
              opacity: 1,
            },
          },
        },
        detectRetina: true,
      }}
      width="100%"
      height="100%"
    />
  );
}