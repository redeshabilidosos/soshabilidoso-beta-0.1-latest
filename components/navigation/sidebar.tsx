'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { memo, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  Home, 
  User, 
  Search, 
  Bell, 
  Users,
  Settings,
  LogOut,
  Newspaper,
  MessageSquare,
  Group,
  Briefcase,
  Play,
  Heart,
  Radio
} from 'lucide-react';
import { useAuth } from '@/components/providers/providers';
import { useNotifications } from '@/lib/hooks/use-notifications';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const navigation = [
  { name: 'Inicio', href: '/feed', icon: Home },
  { name: 'Perfil', href: '/profile', icon: User },
  { name: 'Buscar', href: '/users', icon: Search },
  { name: 'Notificaciones', href: '/notifications', icon: Bell },
  { name: 'Reels', href: '/reels', icon: Play },
  { name: 'En Vivo', href: '/live', icon: Radio },
  { name: 'Comunidades', href: '/communities', icon: Group },
  { name: 'Clasificados', href: '/classifieds', icon: Briefcase },
  { name: 'Donaciones', href: '/donations', icon: Heart },
  { name: 'Habil News', href: '/habil-news', icon: Newspaper },
  { name: 'Mensajes', href: '/messages', icon: MessageSquare },
  { name: 'Configuración', href: '/settings', icon: Settings },
];

// Memoizar el componente de navegación individual - navegación instantánea
const NavItem = memo(function NavItem({ 
  item, 
  isActive, 
  unreadCount,
  unreadMessages,
  communitiesCount,
  classifiedsCount
}: { 
  item: typeof navigation[0]; 
  isActive: boolean; 
  unreadCount?: number;
  unreadMessages?: number;
  communitiesCount?: number;
  classifiedsCount?: number;
}) {
  const isNotifications = item.href === '/notifications';
  const isMessages = item.href === '/messages';
  const isCommunities = item.href === '/communities';
  const isClassifieds = item.href === '/classifieds';
  
  // Determinar qué badge mostrar
  let badgeCount: number | undefined;
  if (isNotifications && unreadCount && unreadCount > 0) badgeCount = unreadCount;
  else if (isMessages && unreadMessages && unreadMessages > 0) badgeCount = unreadMessages;
  else if (isCommunities && communitiesCount && communitiesCount > 0) badgeCount = communitiesCount;
  else if (isClassifieds && classifiedsCount && classifiedsCount > 0) badgeCount = classifiedsCount;
  
  const showBadge = badgeCount !== undefined && badgeCount > 0;
  
  return (
    <Link
      href={item.href}
      prefetch={true}
      className={cn(
        'nav-item flex items-center space-x-3 px-4 py-2 rounded-xl transition-colors duration-50 overflow-hidden relative',
        isActive 
          ? 'bg-neon-green/20 text-neon-green border border-neon-green/30' 
          : 'text-gray-300 hover:bg-white/10 hover:text-white'
      )}
    >
      <item.icon size={20} />
      <span className="font-medium">{item.name}</span>
      {showBadge && badgeCount && (
        <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center">
          {badgeCount > 99 ? '99+' : badgeCount}
        </span>
      )}
    </Link>
  );
});

export const Sidebar = memo(function Sidebar() {
  const pathname = usePathname();
  const { user, logout, isLoading } = useAuth();
  const { unreadCount } = useNotifications();
  const [mounted, setMounted] = useState(false);
  
  // TODO: Reemplazar con hooks reales conectados a la API
  const unreadMessages = 3; // Mensajes no leídos
  const communitiesCount = 5; // Comunidades suscritas
  const classifiedsCount = 2; // Publicaciones en clasificados

  useEffect(() => {
    setMounted(true);
  }, []);

  // No mostrar nada si no hay usuario y no está cargando (no autenticado)
  if (!user && !isLoading) return null;

  const sidebarContent = (
    <aside 
      id="main-sidebar"
      className="hidden lg:flex flex-col w-64 h-screen p-4 bg-white/5 backdrop-blur-md border-r border-neon-green/20 rounded-r-2xl"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999,
        overflowY: 'auto',
        overflowX: 'hidden'
      }}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="mb-4">
          <Link href="/feed" className="flex items-center justify-center" prefetch={true}>
            <Image
              src="/logo-sos.png"
              alt="SOS-HABILIDOSO Logo"
              width={200}
              height={68}
              className="object-contain"
              priority
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto scrollbar-hide">
          {navigation.map((item) => (
            <NavItem
              key={item.name}
              item={item}
              isActive={pathname === item.href}
              unreadCount={unreadCount}
              unreadMessages={unreadMessages}
              communitiesCount={communitiesCount}
              classifiedsCount={classifiedsCount}
            />
          ))}
        </nav>

        {/* User Profile */}
        <div className="border-t border-white/10 pt-3">
          {user ? (
            <>
              <div className="flex items-center space-x-3 mb-3 px-2">
                <img
                  src={user.avatar}
                  alt={user.displayName || 'Usuario'}
                  className="w-12 h-12 rounded-full ring-2 ring-neon-green/50 object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate text-sm">{user.displayName}</p>
                  <p className="text-gray-400 text-xs truncate">@{user.username}</p>
                </div>
              </div>
              
              <button
                onClick={logout}
                className="flex items-center space-x-3 px-4 py-2 text-gray-400 hover:text-red-400 transition-colors w-full"
              >
                <LogOut size={18} />
                <span>Cerrar Sesión</span>
              </button>
            </>
          ) : (
            <div className="flex items-center space-x-3 mb-3 px-2 animate-pulse">
              <div className="w-12 h-12 rounded-full bg-gray-700 flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <div className="h-4 bg-gray-700 rounded w-24 mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-16"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );

  // Usar portal para renderizar el sidebar directamente en el body
  if (mounted && typeof document !== 'undefined') {
    return createPortal(sidebarContent, document.body);
  }

  return null;
});