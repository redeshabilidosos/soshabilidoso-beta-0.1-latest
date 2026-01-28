'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { memo, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import * as Icons from 'lucide-react';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/components/providers/providers';
import { useNotifications } from '@/lib/hooks/use-notifications';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { menuConfigService, type MenuRoute } from '@/lib/services/menu-config';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Memoizar el componente de navegación individual - navegación instantánea
const NavItem = memo(function NavItem({ 
  item, 
  isActive, 
  unreadCount,
  unreadMessages,
  communitiesCount,
  classifiedsCount
}: { 
  item: MenuRoute; 
  isActive: boolean; 
  unreadCount?: number;
  unreadMessages?: number;
  communitiesCount?: number;
  classifiedsCount?: number;
}) {
  const isNotifications = item.path === '/notifications';
  const isMessages = item.path === '/messages';
  const isCommunities = item.path === '/communities';
  const isClassifieds = item.path === '/classifieds';
  
  // Determinar qué badge mostrar
  let badgeCount: number | undefined = item.badge_count > 0 ? item.badge_count : undefined;
  if (isNotifications && unreadCount && unreadCount > 0) badgeCount = unreadCount;
  else if (isMessages && unreadMessages && unreadMessages > 0) badgeCount = unreadMessages;
  else if (isCommunities && communitiesCount && communitiesCount > 0) badgeCount = communitiesCount;
  else if (isClassifieds && classifiedsCount && classifiedsCount > 0) badgeCount = classifiedsCount;
  
  const showBadge = badgeCount !== undefined && badgeCount > 0;
  
  // Obtener el icono dinámicamente
  const IconComponent = (Icons as any)[item.icon] || Icons.Home;
  
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={item.path}
            prefetch={true}
            className={cn(
              'nav-item flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200 overflow-hidden relative group',
              isActive 
                ? 'bg-neon-green/10 text-neon-green border border-neon-green/30 shadow-sm' 
                : 'text-gray-300 hover:bg-white/5 hover:text-white hover:border hover:border-white/10'
            )}
          >
            <IconComponent size={20} className={cn(
              'transition-transform duration-200',
              isActive ? 'scale-110' : 'group-hover:scale-105'
            )} />
            <span className="font-medium text-sm">{item.label}</span>
            {showBadge && badgeCount && (
              <Badge 
                variant="destructive" 
                className="ml-auto h-5 min-w-[20px] px-1.5 text-xs font-bold"
              >
                {badgeCount > 99 ? '99+' : badgeCount}
              </Badge>
            )}
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right" className="bg-gray-900 border-white/10">
          <p>{item.label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});

export const Sidebar = memo(function Sidebar() {
  const pathname = usePathname();
  const { user, logout, isLoading } = useAuth();
  const { unreadCount } = useNotifications();
  const [mounted, setMounted] = useState(false);
  const [menuRoutes, setMenuRoutes] = useState<MenuRoute[]>([]);
  const [loadingRoutes, setLoadingRoutes] = useState(true);
  
  // TODO: Reemplazar con hooks reales conectados a la API
  const unreadMessages = 3; // Mensajes no leídos
  const communitiesCount = 5; // Comunidades suscritas
  const classifiedsCount = 2; // Publicaciones en clasificados

  // Cargar rutas del menú desde el backend con caché - SOLO UNA VEZ
  useEffect(() => {
    let isMounted = true;
    
    const loadMenuRoutes = async () => {
      try {
        const routes = await menuConfigService.getMenuRoutes();
        if (isMounted) {
          setMenuRoutes(routes);
          setLoadingRoutes(false);
        }
      } catch (error) {
        console.error('Error loading menu routes:', error);
        if (isMounted) {
          setMenuRoutes([]);
          setLoadingRoutes(false);
        }
      }
    };

    loadMenuRoutes();
    
    return () => {
      isMounted = false;
    };
  }, []); // Sin dependencias - solo cargar una vez

  useEffect(() => {
    setMounted(true);
  }, []);

  // No mostrar nada si no hay usuario y no está cargando (no autenticado)
  if (!user && !isLoading) return null;

  const sidebarContent = (
    <aside 
      id="main-sidebar"
      className="hidden lg:flex flex-col w-64 h-screen p-4 bg-black/95 backdrop-blur-md border-r border-neon-green/20 rounded-r-2xl shadow-2xl"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999,
        overflowY: 'auto',
        overflowX: 'hidden',
        backgroundColor: '#000000 !important'
      }}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="mb-6 px-2">
          <Link href="/feed" className="flex items-center justify-center group" prefetch={true}>
            <Image
              src="/logososbetav1.png"
              alt="logososbetav1.png"
              width={200}
              height={68}
              className="object-contain transition-transform duration-200 group-hover:scale-105"
              priority
            />
          </Link>
        </div>

        <Separator className="mb-4 bg-white/10" />

        {/* Navigation */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto scrollbar-thin scrollbar-thumb-neon-green/20 scrollbar-track-transparent hover:scrollbar-thumb-neon-green/40 px-1">
          {loadingRoutes ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-2 border-neon-green/20 border-t-neon-green rounded-full animate-spin" />
            </div>
          ) : (
            menuRoutes.map((item) => (
              <NavItem
                key={item.route_key}
                item={item}
                isActive={pathname === item.path}
                unreadCount={unreadCount}
                unreadMessages={unreadMessages}
                communitiesCount={communitiesCount}
                classifiedsCount={classifiedsCount}
              />
            ))
          )}
        </nav>

        <Separator className="my-4 bg-white/10" />

        {/* User Profile */}
        <div className="px-2">
          {user ? (
            <div className="space-y-3">
              <Link href="/profile" prefetch={true}>
                <div className="flex items-center space-x-3 p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-neon-green/30 transition-all duration-200 cursor-pointer group">
                  <Avatar className="h-10 w-10 ring-2 ring-neon-green/50 group-hover:ring-neon-green transition-all">
                    <AvatarImage src={user.avatar} alt={user.displayName || 'Usuario'} />
                    <AvatarFallback className="bg-neon-green/20 text-neon-green group-hover:bg-neon-green/30">
                      {user.displayName?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate text-sm group-hover:text-neon-green transition-colors">{user.displayName}</p>
                    <p className="text-gray-400 text-xs truncate">@{user.username}</p>
                  </div>
                </div>
              </Link>
              
              <Button
                onClick={logout}
                variant="ghost"
                className="w-full justify-start text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 border border-transparent hover:border-red-500/30"
                size="sm"
              >
                <LogOut size={18} className="mr-2" />
                <span>Cerrar Sesión</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-3 p-2 animate-pulse">
              <div className="w-10 h-10 rounded-full bg-gray-700 flex-shrink-0"></div>
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