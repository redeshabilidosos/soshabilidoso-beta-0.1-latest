/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimizaciones de rendimiento
  reactStrictMode: false, // Desactivar para evitar doble render en desarrollo
  swcMinify: true,
  
  // Optimizar imágenes
  images: {
    domains: ['images.pexels.com', 'localhost', '127.0.0.1', 'ui-avatars.com'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Optimizar compilación
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  
  // Optimizar chunks - mantener configuración por defecto de Next.js
  // para evitar errores de carga de chunks en navegación
  webpack: (config, { isServer }) => {
    return config;
  },
  
  // Experimental features para mejor rendimiento
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', 'date-fns', 'framer-motion'],
  },
  
  // Prefetch más agresivo
  onDemandEntries: {
    maxInactiveAge: 120 * 1000, // 2 minutos - mantener páginas en memoria más tiempo
    pagesBufferLength: 10, // Más páginas en buffer
  },
  
  // Headers para mejor caching
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          }
        ],
      },
    ];
  },
};

module.exports = nextConfig;
