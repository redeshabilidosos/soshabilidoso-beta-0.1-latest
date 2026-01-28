'use client';

import Link from 'next/link';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Fondo animado con partículas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-neon-green/5 via-transparent to-neon-blue/5" />
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-neon-green/30 rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-2xl w-full text-center">
        {/* Logo o icono 404 */}
        <div className="mb-8 relative">
          <div className="text-[150px] md:text-[200px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-green via-neon-blue to-purple-500 leading-none animate-pulse">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-neon-green/10 blur-3xl animate-pulse" />
          </div>
        </div>

        {/* Mensaje principal */}
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
          Página no encontrada
        </h1>
        
        <p className="text-gray-400 text-lg md:text-xl mb-8 max-w-md mx-auto">
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-neon-green to-emerald-500 text-black font-semibold rounded-full hover:shadow-lg hover:shadow-neon-green/50 transition-all hover:scale-105 active:scale-95"
          >
            <Home className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            Volver al inicio
          </Link>
          
          <Link
            href="/search"
            className="group flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full border border-white/20 hover:bg-white/20 transition-all hover:scale-105 active:scale-95"
          >
            <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Buscar
          </Link>
        </div>

        {/* Enlaces adicionales */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-gray-500 text-sm mb-4">Enlaces útiles:</p>
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <Link href="/communities" className="text-neon-green hover:text-neon-blue transition-colors">
              Comunidades
            </Link>
            <Link href="/feed" className="text-neon-green hover:text-neon-blue transition-colors">
              Feed
            </Link>
            <Link href="/classifieds" className="text-neon-green hover:text-neon-blue transition-colors">
              Clasificados
            </Link>
            <Link href="/donations" className="text-neon-green hover:text-neon-blue transition-colors">
              Donaciones
            </Link>
          </div>
        </div>

        {/* Código de error decorativo */}
        <div className="mt-8 text-xs text-gray-600 font-mono">
          ERROR_CODE: 404_PAGE_NOT_FOUND
        </div>
      </div>
    </div>
  );
}
