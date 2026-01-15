'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { 
  Home, 
  User, 
  Search, 
  Bell, 
  Users,
  Newspaper,
  MessageSquare,
  Group,
  Briefcase,
  Play,
  MoreHorizontal,
  Image as ImageIcon,
  Settings,
  LogOut,
  X,
  ChevronUp
} from 'lucide-react';
import { useAuth } from '@/components/providers/providers';
import { cn } from '@/lib/utils';

// Navegación principal (siempre visible)
const mainNavigation = [
  { name: 'Inicio', href: '/feed', icon: Home },
  { name: 'Reels', href: '/reels', icon: Play },
  { name: 'Buscar', href: '/search', icon: Search },
  { name: 'Comunidades', href: '/communities', icon: Group },
];

// Navegación secundaria (en el dropdown)
const secondaryNavigation = [
  { name: 'Galería', href: '/gallery', icon: ImageIcon },
  { name: 'Amigos', href: '/friends', icon: Users },
  { name: 'Clasificados', href: '/classifieds', icon: Briefcase },
  { name: 'Habil News', href: '/habil-news', icon: Newspaper },
  { name: 'Mensajes', href: '/messages', icon: MessageSquare },
  { name: 'Notificaciones', href: '/notifications', icon: Bell },
  { name: 'Configuración', href: '/settings', icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  if (!user) return null;

  const isSecondaryActive = secondaryNavigation.some(item => pathname === item.href);

  // Close dropdown when route changes
  useEffect(() => {
    setShowDropdown(false);
  }, [pathname]);

  return (
    <>
      {/* Main Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 glass-card border-t border-neon-green/20 p-2 z-40 lg:hidden">
        <div className="flex justify-around items-center">
          {/* Main Navigation Items */}
          {mainNavigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-300',
                  isActive 
                    ? 'text-neon-green' 
                    : 'text-white hover:text-neon-green'
                )}
              >
                <item.icon size={20} />
                <span className="text-xs font-medium">{item.name}</span>
              </Link>
            );
          })}

          {/* More Options Button */}
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className={cn(
              'flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-300',
              showDropdown || isSecondaryActive
                ? 'text-neon-green bg-neon-green/10' 
                : 'text-white hover:text-neon-green'
            )}
          >
            <MoreHorizontal size={20} />
            <span className="text-xs font-medium">Más</span>
          </button>
        </div>
      </div>

      {/* Dropdown Menu */}
      {showDropdown && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setShowDropdown(false)}
          />
          
          {/* Menu Content */}
          <div className="fixed bottom-20 right-4 left-4 glass-card border border-neon-green/20 rounded-2xl p-4 z-40 lg:hidden animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Más opciones</h3>
              <button
                onClick={() => setShowDropdown(false)}
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-3 mb-4">
              {secondaryNavigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setShowDropdown(false)}
                    className={cn(
                      'flex flex-col items-center space-y-2 p-3 rounded-xl transition-all duration-300',
                      isActive 
                        ? 'bg-neon-green/20 text-neon-green border border-neon-green/30' 
                        : 'text-white hover:bg-white/10 hover:text-neon-green'
                    )}
                  >
                    <item.icon size={24} />
                    <span className="text-xs font-medium text-center">{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* User Section */}
            <div className="border-t border-white/10 pt-4">
              <div className="flex items-center space-x-3 mb-3">
                <img
                  src={user.avatar}
                  alt={user.displayName}
                  className="w-10 h-10 rounded-full ring-2 ring-neon-green/50"
                />
                <div>
                  <p className="text-white font-medium text-sm">{user.displayName}</p>
                  <p className="text-gray-400 text-xs">@{user.username}</p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Link
                  href="/profile"
                  onClick={() => setShowDropdown(false)}
                  className="flex-1 flex items-center justify-center space-x-2 py-2 px-3 bg-neon-green/20 text-neon-green rounded-lg hover:bg-neon-green/30 transition-colors"
                >
                  <User size={16} />
                  <span className="text-sm font-medium">Perfil</span>
                </Link>
                
                <button
                  onClick={() => {
                    logout();
                    setShowDropdown(false);
                  }}
                  className="flex items-center justify-center space-x-2 py-2 px-3 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                >
                  <LogOut size={16} />
                  <span className="text-sm font-medium">Salir</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}