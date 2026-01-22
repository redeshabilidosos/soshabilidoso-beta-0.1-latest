'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/providers/providers';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RegisterHabilidososMenuContent } from './register-habilidosos-menu-content';
import { X, Trophy } from 'lucide-react';
import { CyberButton } from './cyber-button';
import { getSiteSettings } from '@/lib/services/site-settings';

export function FloatingLogoAndMenuButton() {
  const { user } = useAuth();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isLogoShaking, setIsLogoShaking] = useState(false);
  const [isRegisterButtonExpanded, setIsRegisterButtonExpanded] = useState(false);
  const [isRegisterButtonShaking, setIsRegisterButtonShaking] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showRegisterButton, setShowRegisterButton] = useState(true);

  const pathname = usePathname();
  const isOnRegisterPage = pathname === '/register-habilidosos';

  useEffect(() => {
    setMounted(true);
    
    // Consultar la configuración del sitio
    const fetchSettings = async () => {
      try {
        console.log('🔄 FloatingButton: Consultando configuraciones...');
        const settings = await getSiteSettings();
        console.log('📊 FloatingButton: Configuración recibida:', settings);
        console.log('🎯 FloatingButton: show_register_habilidosos_button =', settings.show_register_habilidosos_button);
        setShowRegisterButton(settings.show_register_habilidosos_button);
      } catch (error) {
        console.error('❌ FloatingButton: Error al obtener configuraciones, ocultando botón por seguridad');
        // En caso de error, ocultar el botón por seguridad
        setShowRegisterButton(false);
      }
    };
    
    fetchSettings();
    
    // Actualizar cada 5 segundos para reflejar cambios rápidamente
    const interval = setInterval(fetchSettings, 5000);
    
    return () => clearInterval(interval);
  }, []);

  console.log('🔍 FloatingButton: Renderizando con showRegisterButton =', showRegisterButton);

  if (!user || !isVisible || !showRegisterButton) {
    console.log('❌ FloatingButton: No se muestra. user:', !!user, 'isVisible:', isVisible, 'showRegisterButton:', showRegisterButton);
    return null;
  }

  const handleLogoClick = () => {
    setIsLogoShaking(true);
    setTimeout(() => setIsLogoShaking(false), 500); // La animación dura 0.5s
  };

  const handleRegisterButtonClick = () => {
    setIsRegisterButtonShaking(true);
    setTimeout(() => setIsRegisterButtonShaking(false), 500); // La animación dura 0.5s
  };

  const handleToggleRegisterButtonExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRegisterButtonExpanded(prev => !prev);
    handleRegisterButtonClick(); // Vibrar al expandir/colapsar en móvil
  };

  const handleCloseComponent = () => {
    setIsVisible(false);
  };

  const renderLogoContent = (props?: any) => (
    <Image
      src="/Loggo.png"
      alt="SOS-HABILIDOSO Logo"
      width={160}
      height={160}
      className="w-full h-full object-contain"
      priority
      {...props}
    />
  );

  const logoContainerClasses = cn(
    "relative",
    "w-24 h-24", // Smaller size for the floating logo
    "lg:w-28 lg:h-28",
    "shadow-lg shadow-neon-green/50",
    "transition-all duration-300 ease-in-out",
    "hover:scale-110 hover:shadow-neon-blue/70",
    isLogoShaking && "animate-shake" // Aplicar la animación de vibración condicionalmente
  );

  // Clases para el botón de registro, sin el borde neón pulsante ni sombra extra
  const registerButtonClasses = cn(
    "flex items-center justify-center space-x-2",
    isRegisterButtonShaking && "animate-shake" // Aplicar la animación de vibración condicionalmente
  );

  const floatingContent = (
    <div 
      id="floating-trophy-button"
      className="fixed z-[2147483645] flex flex-col items-end space-y-2"
      style={{
        position: 'fixed',
        bottom: 'calc(90px + env(safe-area-inset-bottom, 0px))',
        right: '16px',
      }}
    >
      <div className="glass-card p-2 flex flex-col items-center space-y-2 relative">
        {/* Botón de cierre para todo el componente flotante */}
        <button
          onClick={handleCloseComponent}
          className="absolute top-1 right-1 p-1 bg-white/10 rounded-full text-gray-400 hover:bg-white/20 hover:text-white transition-colors z-10"
          aria-label="Esconder botón de menú"
        >
          <X size={14} />
        </button>

        {/* Logo y Popover */}
        {isOnRegisterPage ? (
          <Popover
            open={isPopoverOpen}
            onOpenChange={(open: boolean) => {
              setIsPopoverOpen(open);
            }}
          >
            <PopoverTrigger asChild>
              <button
                onClick={handleLogoClick}
                className={logoContainerClasses}
                title="Un Golazo a tus sueños"
              >
                {renderLogoContent()}
              </button>
            </PopoverTrigger>
            <PopoverContent 
              className="w-auto p-0 glass-card border-neon-green/20" 
              side="top" 
              align="end"
            >
              <RegisterHabilidososMenuContent onClose={() => setIsPopoverOpen(false)} />
            </PopoverContent>
          </Popover>
        ) : (
          // Cuando NO estamos en la página de registro
          // Mostrar el logo solo en escritorio, ocultar en móvil
          <Link
            href="/register-habilidosos"
            onClick={handleLogoClick}
            className={cn(logoContainerClasses, "hidden lg:block")}
            title="Un Golazo a tus sueños"
          >
            {renderLogoContent()}
          </Link>
        )}

        {/* Botón de Registro "Regístrate al Reality acá" */}
        {!isOnRegisterPage && (
          <div className="w-full flex flex-col items-center space-y-2 mt-2">
            {/* Versión móvil (icono de copa que se expande) */}
            <div className="block lg:hidden relative">
              {isRegisterButtonExpanded ? (
                <Link href="/register-habilidosos">
                  <CyberButton
                    size="xs"
                    className={registerButtonClasses}
                    onClick={() => { setIsRegisterButtonExpanded(false); handleRegisterButtonClick(); }}
                  >
                    <span>Regístrate al Reality acá</span>
                  </CyberButton>
                </Link>
              ) : (
                <CyberButton
                  size="icon"
                  className={cn("rounded-full p-2", registerButtonClasses)}
                  onClick={handleToggleRegisterButtonExpand}
                  title="Regístrate al Reality"
                >
                  <Trophy size={24} className="text-white" />
                </CyberButton>
              )}
            </div>

            {/* Versión escritorio (botón de texto directo) */}
            <div className="hidden lg:block relative">
              <Link href="/register-habilidosos">
                <CyberButton
                  size="sm"
                  className={registerButtonClasses}
                  onClick={handleRegisterButtonClick}
                >
                  <span>Regístrate al Reality acá</span>
                </CyberButton>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Usar portal para renderizar directamente en el body
  if (mounted && typeof document !== 'undefined') {
    return createPortal(floatingContent, document.body);
  }

  return null;
}