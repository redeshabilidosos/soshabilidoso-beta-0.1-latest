'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import type { Engine } from 'tsparticles-engine';

// Colores de estrellas según el tema de fondo
const getStarColors = (backgroundId: string) => {
  const colorSchemes = {
    'cyber-green': ["#ffffff", "#39FF14", "#00ffcc"],
    'ocean-blue': ["#ffffff", "#00d4ff", "#00ffff"],
    'fire-red': ["#ffffff", "#ff6600", "#ffaa00"],
    'blackout': ["#ffffff", "#dddddd", "#aaaaaa"],
    'purple-night': ["#ffffff", "#bf00ff", "#ff66ff"],
    'golden-sunset': ["#ffffff", "#ffcc00", "#ffdd66"]
  };

  return colorSchemes[backgroundId as keyof typeof colorSchemes] || colorSchemes['cyber-green'];
};

export function StarBackground() {
  const [starColors, setStarColors] = useState(getStarColors('cyber-green'));

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container: any) => {
    // console.log(container);
  }, []);

  useEffect(() => {
    // Escuchar cambios en el color de fondo
    const updateColors = () => {
      const savedColor = localStorage.getItem('background-color') || 'cyber-green';
      setStarColors(getStarColors(savedColor));
    };

    // Actualizar colores al cargar
    updateColors();

    // Escuchar cambios en localStorage
    window.addEventListener('storage', updateColors);
    window.addEventListener('background-color-changed', updateColors);

    return () => {
      window.removeEventListener('storage', updateColors);
      window.removeEventListener('background-color-changed', updateColors);
    };
  }, []);

  return (
    <Particles
      id="tsparticles-stars"
      init={particlesInit}
      loaded={particlesLoaded}
      options={{
        fullScreen: {
          enable: false, // Deshabilitar fullScreen para renderizar dentro del div padre
        },
        background: {
          color: {
            value: "transparent",
          },
        },
        fpsLimit: 60,
        interactivity: {
          events: {
            onClick: {
              enable: false,
              mode: "push",
            },
            onHover: {
              enable: false,
              mode: "repulse",
            },
            resize: true,
          },
        },
        particles: {
          number: {
            value: 100, // Más estrellas
            density: {
              enable: true,
              area: 1000,
            },
          },
          color: {
            value: starColors, // Colores dinámicos basados en el tema
          },
          shape: {
            type: "star", // Forma de estrella
            options: {
              star: {
                sides: 5,
              },
            },
          },
          opacity: {
            value: { min: 0.4, max: 1 }, // Opacidad más alta
            animation: {
              enable: true,
              speed: 2, // Parpadeo más rápido
              minimumValue: 0.4,
              sync: false,
              startValue: "random",
            },
          },
          size: {
            value: { min: 1.5, max: 4 }, // Estrellas más grandes
            random: true,
            animation: {
              enable: true,
              speed: 1,
              minimumValue: 1.5,
              sync: false,
            },
          },
          shadow: {
            enable: true,
            color: "#ffffff",
            blur: 6,
          },
          links: {
            enable: false, // Sin líneas entre estrellas
          },
          move: {
            enable: true,
            speed: 0.4, // Movimiento ligeramente más rápido
            direction: "none",
            random: true,
            straight: false,
            outModes: {
              default: "out",
            },
          },
          twinkle: {
            particles: {
              enable: true,
              frequency: 0.08,
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