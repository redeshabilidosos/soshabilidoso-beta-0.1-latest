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
  { name: 'Buscar', href: '/users', icon: Search },
  { name: 'Comunidades', href: '/communities', icon: Users },
];

const rightNavigation = [
  { name: 'Clips', href: '/reels', icon: Play },
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
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [showUploadReel, setShowUploadReel] = useState(false);
  const [showNewPost, setShowNewPost] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const closeDropdown = useCallback(() => setShowDropdown(false), []);
  const toggleDropdown = useCallback(() => setShowDropdown(prev => !prev), []);
  const openCreateMenu = useCallback(() => setShowCreateMenu(true), []);
  const closeCreateMenu = useCallback(() => setShowCreateMenu(false), []);
  const closeUploadReel = useCallback(() => setShowUploadReel(false), []);

  const handleSelectCreateType = useCallback((type: string) => {
    if (type === 'reel') {
      setShowUploadReel(true);
    } else if (type === 'post' || type === 'photo') {
      setShowNewPost(true);
    }
  }, []);

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
          onClick={openCreateMenu}
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
          onClick={toggleDropdown}
          className={cn(
            'flex items-center justify-center p-2 rounded-lg transition-all duration-300 flex-1',
            showDropdown || isSecondaryActive
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
      className={cn(
        "lg:hidden fixed inset-0 transition-all duration-300",
        showDropdown ? "pointer-events-auto" : "pointer-events-none"
      )}
      style={{ zIndex: 2147483646 }}
    >
      {/* Overlay */}
      <div 
        className={cn(
          "absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300",
          showDropdown ? "opacity-100" : "opacity-0"
        )}
        onClick={closeDropdown}
      />

      {/* Dropdown Menu */}
      <div 
        className={cn(
          "absolute right-4 left-4 glass-card border border-neon-green/20 rounded-2xl p-4 transition-all duration-300 transform",
          showDropdown 
            ? "opacity-100 translate-y-0 scale-100" 
            : "opacity-0 translate-y-4 scale-95 pointer-events-none"
        )}
        style={{ bottom: 'calc(80px + env(safe-area-inset-bottom, 0px))' }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Más opciones</h3>
          <button
            onClick={closeDropdown}
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
                onClick={closeDropdown}
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
                closeDropdown();
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
          isOpen={showCreateMenu}
          onClose={closeCreateMenu}
          onSelectType={handleSelectCreateType}
        />

        <NewPostDialog
          isOpen={showNewPost}
          onClose={() => setShowNewPost(false)}
          onPostCreated={(post) => {
            console.log('✅ Publicación creada:', post);
            setShowNewPost(false);
          }}
        />

        <UploadReelModal 
          isOpen={showUploadReel} 
          onClose={closeUploadReel}
          onReelUploaded={(reel) => {
            console.log('✅ Reel subido:', reel);
            closeUploadReel();
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
