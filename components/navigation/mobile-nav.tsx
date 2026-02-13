'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, memo, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Home, 
  Search, 
  Bell, 
  Users,
  Newspaper,
  MessageSquare,
  Briefcase,
  Play,
  MoreHorizontal,
  Settings,
  LogOut,
  X,
  Radio,
  Plus,
  GraduationCap,
  Heart
} from 'lucide-react';
import { useAuth } from '@/components/providers/providers';
import { useNotifications } from '@/lib/hooks/use-notifications';
import { LiveStreamsDropdown } from './live-streams-dropdown';
import { UploadReelModal } from '@/components/reels/upload-reel-modal';
import { CreateMenuModal } from '@/components/create/create-menu-modal';
import { NewPostDialog } from '@/components/ui/new-post-dialog';
import { cn } from '@/lib/utils';

// Navegación principal (siempre visible en la barra)
const leftNavigation = [
  { name: 'Inicio', href: '/feed', icon: Home },
  { name: 'Clips', href: '/reels', icon: Play },
  { name: 'Comunidades', href: '/communities', icon: Users },
];

const rightNavigation = [
  { name: 'Buscar', href: '/users', icon: Search },
  { name: 'Notificaciones', href: '/notifications', icon: Bell },
];

// Navegación secundaria (en el dropdown de más opciones)
const secondaryNavigation = [
  { name: 'Perfil', href: '/profile', icon: Users },
  { name: 'Mensajes', href: '/messages', icon: MessageSquare },
  { name: 'Clasificados', href: '/classifieds', icon: Briefcase },
  { name: 'Donaciones', href: '/donations', icon: Heart },
  { name: 'Habil News', href: '/habil-news', icon: Newspaper },
  { name: 'Capacitaciones', href: '/capacitaciones', icon: GraduationCap },
  { name: 'En Vivo', href: '/live', icon: Radio },
  { name: 'Configuración', href: '/settings', icon: Settings },
];

export const MobileNav = memo(function MobileNav() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  
  // Consolidar estados de modales en un solo objeto
  const [modals, setModals] = useState({
    dropdown: false,
    createMenu: false,
    uploadReel: false,
    newPost: false,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Función única para manejar todos los modales
  const toggleModal = useCallback((modal: keyof typeof modals, value?: boolean) => {
    setModals(prev => ({
      ...prev,
      [modal]: value ?? !prev[modal]
    }));
  }, []);

  const handleSelectCreateType = useCallback((type: string) => {
    if (type === 'reel') {
      toggleModal('uploadReel', true);
    } else if (type === 'post' || type === 'photo') {
      toggleModal('newPost', true);
    }
  }, [toggleModal]);

  if (!user) return null;

  const isSecondaryActive = secondaryNavigation.some(item => pathname === item.href);


  // Contenido del navbar
  const navbarContent = (
    <nav 
      id="mobile-nav-bar"
      className="lg:hidden glass-card border-t border-neon-green/20 py-3 px-2"
      style={{ 
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 2147483647,
      }}
    >
      <div className="flex justify-between items-center max-w-screen-xl mx-auto">
        {leftNavigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              prefetch={true}
              className={cn(
                'nav-item flex items-center justify-center p-2 rounded-lg transition-colors duration-50 flex-1',
                isActive ? 'text-neon-green' : 'text-white hover:text-neon-green'
              )}
            >
              <item.icon size={24} />
            </Link>
          );
        })}

        <button
          id="create-button-mobile"
          onClick={() => toggleModal('createMenu', true)}
          className="flex items-center justify-center p-1 rounded-lg transition-all duration-300 flex-1"
        >
          <div className="w-12 h-12 bg-gradient-to-r from-neon-green to-neon-blue rounded-full flex items-center justify-center shadow-lg shadow-neon-green/50 hover:shadow-neon-green/70 hover:scale-110 transition-all duration-300">
            <Plus className="w-7 h-7 text-black font-bold" strokeWidth={3} />
          </div>
        </button>

        {rightNavigation.map((item) => {
          const isActive = pathname === item.href;
          const isNotifications = item.name === 'Notificaciones';
          
          return (
            <Link
              key={item.name}
              href={item.href}
              prefetch={true}
              className={cn(
                'nav-item flex items-center justify-center p-2 rounded-lg transition-colors duration-50 flex-1 relative',
                isActive ? 'text-neon-green' : 'text-white hover:text-neon-green'
              )}
            >
              <div className="relative">
                <item.icon size={24} />
                {isNotifications && unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 min-w-[16px] h-[16px] bg-red-500 rounded-full flex items-center justify-center border-2 border-gray-900 animate-pulse">
                    <span className="text-white text-[9px] font-bold px-0.5">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  </div>
                )}
              </div>
            </Link>
          );
        })}

        <button
          onClick={() => {
            console.log('🔘 Botón de 3 puntos clickeado');
            console.log('📊 Estado actual del dropdown:', modals.dropdown);
            toggleModal('dropdown');
            console.log('📊 Nuevo estado del dropdown:', !modals.dropdown);
          }}
          className={cn(
            'flex items-center justify-center p-2 rounded-lg transition-all duration-300 flex-1',
            modals.dropdown || isSecondaryActive
              ? 'text-neon-green bg-neon-green/10' 
              : 'text-white hover:text-neon-green'
          )}
        >
          <MoreHorizontal size={24} />
        </button>
      </div>
    </nav>
  );


  // Contenido del dropdown de más opciones
  const dropdownContent = (
    <div 
      style={{ 
        position: 'fixed',
        inset: 0,
        zIndex: 999999999,
        pointerEvents: modals.dropdown ? 'auto' : 'none',
        display: modals.dropdown ? 'block' : 'none',
        backgroundColor: 'rgba(255, 0, 0, 0.5)' // ROJO para debugging
      }}
    >
      {/* Debug: Renderizando dropdown, estado: {modals.dropdown ? 'abierto' : 'cerrado'} */}
      
      {/* Overlay */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(4px)'
        }}
        onClick={() => {
          console.log('🖱️ Click en overlay');
          toggleModal('dropdown', false);
        }}
      />

      {/* Dropdown Menu */}
      <div 
        style={{ 
          position: 'absolute',
          right: '16px',
          left: '16px',
          bottom: '90px',
          maxHeight: 'calc(100vh - 180px)',
          overflowY: 'auto',
          zIndex: 999999999,
          backgroundColor: '#1a1a1a',
          border: '2px solid #00FF88',
          borderRadius: '16px',
          padding: '16px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Más opciones</h3>
          <button
            onClick={() => toggleModal('dropdown', false)}
            className="p-1 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          {secondaryNavigation.map((item) => {
            const isActive = pathname === item.href;
            const isLive = item.name === 'En Vivo';
            
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => toggleModal('dropdown', false)}
                className={cn(
                  'flex flex-col items-center space-y-2 p-3 rounded-xl transition-all duration-300',
                  isActive 
                    ? 'bg-neon-green/20 text-neon-green border border-neon-green/30' 
                    : isLive
                      ? 'text-white hover:bg-red-500/10 hover:text-red-400'
                      : 'text-white hover:bg-white/10 hover:text-neon-green'
                )}
              >
                <div className="relative">
                  <item.icon size={24} />
                  {isLive && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  )}
                </div>
                <span className="text-xs font-medium text-center">{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* User Info Section */}
        <div className="border-t border-white/10 mt-4 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={user.avatar}
                alt={user.displayName}
                className="w-8 h-8 rounded-full ring-2 ring-neon-green/50"
              />
              <div>
                <p className="text-white font-medium text-sm">{user.displayName}</p>
                <p className="text-gray-400 text-xs">@{user.username}</p>
              </div>
            </div>
            
            <button
              onClick={() => {
                logout();
                toggleModal('dropdown', false);
              }}
              className="flex items-center space-x-2 py-2 px-3 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
            >
              <LogOut size={16} />
              <span className="text-sm font-medium">Salir</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );


  return (
    <>
      {/* Modals - hidden on desktop */}
      <div className="lg:hidden">
        <CreateMenuModal
          isOpen={modals.createMenu}
          onClose={() => toggleModal('createMenu', false)}
          onSelectType={handleSelectCreateType}
        />

        <NewPostDialog
          isOpen={modals.newPost}
          onClose={() => toggleModal('newPost', false)}
          onPostCreated={(post) => {
            console.log('✅ Publicación creada:', post);
            toggleModal('newPost', false);
          }}
        />

        <UploadReelModal 
          isOpen={modals.uploadReel} 
          onClose={() => toggleModal('uploadReel', false)}
          onReelUploaded={(reel) => {
            console.log('✅ Reel subido:', reel);
            toggleModal('uploadReel', false);
          }}
        />

        {/* Live Streams Button - Ocultar en página de mensajes */}
        {!pathname?.startsWith('/messages') && (
          <div 
            id="live-streams-button"
            className="fixed right-4"
            style={{
              position: 'fixed',
              bottom: 'calc(80px + env(safe-area-inset-bottom, 0px))',
              right: '16px',
              zIndex: 2147483646,
              isolation: 'isolate',
            }}
          >
            <LiveStreamsDropdown />
          </div>
        )}
      </div>

      {/* Renderizar dropdown y navbar via Portal */}
      {mounted && typeof document !== 'undefined' && (
        <>
          {createPortal(dropdownContent, document.body)}
          {createPortal(navbarContent, document.body)}
        </>
      )}
    </>
  );
});
