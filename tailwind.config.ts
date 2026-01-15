import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['var(--font-poppins)', 'sans-serif'], // Usar la variable de fuente
        'hastro': ['Hastro', 'sans-serif'], // Añadiendo la fuente Hastro
      },
      colors: {
        // Futuristic color palette
        neon: {
          green: '#00ff88',
          blue: '#0088ff',
          purple: '#8800ff',
        },
        // Dark theme colors
        dark: {
          bg: '#0a0a0f',
          card: '#16213e',
          lighter: '#1a1a2e',
        },
        // Eliminados los colores 'cyber' ya que ahora se manejan con variables CSS para el gradiente de fondo.
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      boxShadow: {
        'neon-green': '0 0 20px rgba(0, 255, 136, 0.3)',
        'neon-blue': '0 0 20px rgba(0, 136, 255, 0.3)',
        'neon-purple': '0 0 20px rgba(136, 0, 255, 0.3)',
        'cyber': '0 8px 32px rgba(0, 0, 0, 0.3)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'glow': {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(0, 255, 136, 0.3)' 
          },
          '50%': { 
            boxShadow: '0 0 40px rgba(0, 255, 136, 0.6)' 
          },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'spin-slow': {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' },
        },
        'spin-360': { // Nueva animación
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'shake': { // Animación de vibración
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' },
        },
        'neon-border-pulse': { // Nueva animación para el borde neón
          '0%, 100%': {
            boxShadow: '0 0 0px rgba(0, 255, 136, 0.4), 0 0 0px rgba(0, 136, 255, 0.4)',
            borderColor: 'rgba(0, 255, 136, 0.5)',
          },
          '50%': {
            boxShadow: '0 0 10px rgba(0, 255, 136, 0.8), 0 0 20px rgba(0, 136, 255, 0.6)',
            borderColor: 'rgba(0, 255, 136, 0.8)',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse-slow 2s ease-in-out infinite',
        'spin-slow': 'spin-slow 3s linear infinite',
        'spin-360': 'spin-360 1s ease-in-out',
        'shake': 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
        'neon-border-pulse': 'neon-border-pulse 2s ease-in-out infinite alternate', // Aplicar la nueva animación
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;