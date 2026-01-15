'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/providers';
import { Sidebar } from '@/components/navigation/sidebar';
import { MobileNav } from '@/components/navigation/mobile-nav';
import { CyberButton } from '@/components/ui/cyber-button';
import { Users, UserPlus, MessageCircle, Search, Filter, Loader2 } from 'lucide-react';
import { usersService, User } from '@/lib/services/users.service';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function FriendsPage() {
  const { user: currentUser } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [friends, setFriends] = useState<User[]>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'friends' | 'suggested'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
      return;
    }
    loadData();
  }, [currentUser, router]);

  const loadData = async () => {
    try {
      setLoading(true);
      // Cargar amigos
      const friendsList = await usersService.getFriends();
      setFriends(friendsList);
      
      // Cargar usuarios sugeridos (todos los usuarios excepto amigos)
      const allUsers = await usersService.searchUsers('', 1);
      const suggested = allUsers.results.filter(u => 
        !friendsList.some(f => f.id === u.id)
      );
      setSuggestedUsers(suggested);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendFriendRequest = async (username: string) => {
    try {
      await usersService.sendFriendRequest(username);
      toast({
        title: "Éxito",
        description: "Solicitud de amistad enviada",
      });
      loadData(); // Recargar datos
    } catch (error: any) {
      // Manejar casos específicos
      if (error.message.includes('pendiente') || error.message.includes('Ya existe')) {
        toast({
          title: "Solicitud pendiente",
          description: "Ya enviaste una solicitud a este usuario. Espera su respuesta.",
        });
      } else if (error.message.includes('Ya son amigos')) {
        toast({
          title: "Ya son amigos",
          description: "Este usuario ya está en tu lista de amigos.",
        });
        loadData();
      } else {
        toast({
          title: "Error",
          description: error.message || "No se pudo enviar la solicitud",
          variant: "destructive",
        });
      }
    }
  };

  const handleOpenChat = (username: string) => {
    router.push(`/messages?user=${username}`);
  };

  const handleViewProfile = (username: string) => {
    router.push(`/profile/${username}`);
  };

  if (!currentUser) return null;

  const filteredFriends = friends.filter(friend =>
    searchQuery === '' ||
    friend.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSuggested = suggestedUsers.filter(user =>
    searchQuery === '' ||
    user.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayList = filter === 'friends' ? filteredFriends :
                      filter === 'suggested' ? filteredSuggested :
                      [...filteredFriends, ...filteredSuggested];

  return (
    <div className="min-h-screen">
      <Sidebar />
      
      <main className="pb-24 xl:ml-64 xl:pb-0">
        <div className="max-w-4xl mx-auto p-4 space-y-6">
          {/* Header */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
                  <Users className="text-neon-green" />
                  <span>Mis Amigos</span>
                </h1>
                <p className="text-gray-400">Conecta con tus amigos y descubre nuevos</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-neon-green">{friends.length}</div>
                <div className="text-sm text-gray-400">Amigos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-neon-blue">{suggestedUsers.length}</div>
                <div className="text-sm text-gray-400">Sugeridos</div>
              </div>
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar amigos..."
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-green/50"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-2">
              <Filter className="text-gray-400" size={16} />
              {[
                { key: 'all' as const, label: 'Todos', count: friends.length + suggestedUsers.length },
                { key: 'friends' as const, label: 'Amigos', count: friends.length },
                { key: 'suggested' as const, label: 'Sugeridos', count: suggestedUsers.length },
              ].map((filterOption) => (
                <button
                  key={filterOption.key}
                  onClick={() => setFilter(filterOption.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center space-x-2 ${
                    filter === filterOption.key
                      ? 'bg-neon-green/20 text-neon-green border border-neon-green/50'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  <span>{filterOption.label}</span>
                  <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                    {filterOption.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* List */}
          {loading ? (
            <div className="glass-card p-8 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-neon-green mx-auto mb-4" />
              <p className="text-gray-400">Cargando...</p>
            </div>
          ) : displayList.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <Users className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-semibold text-white mb-2">
                {filter === 'friends' ? 'No tienes amigos aún' : 'No se encontraron usuarios'}
              </h3>
              <p className="text-gray-400">
                {filter === 'friends' 
                  ? 'Envía solicitudes de amistad para conectar con otros usuarios'
                  : 'Intenta con otros términos de búsqueda'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {displayList.map((user) => {
                const isFriend = friends.some(f => f.id === user.id);
                
                return (
                  <div key={user.id} className="football-card p-6">
                    <div className="flex items-center space-x-4">
                      <button onClick={() => handleViewProfile(user.username)}>
                        <Avatar className="w-16 h-16 ring-2 ring-neon-green/50 hover:ring-neon-blue transition-all">
                          <AvatarImage src={user.avatar_url} alt={user.display_name} />
                          <AvatarFallback>{user.display_name[0]}</AvatarFallback>
                        </Avatar>
                      </button>
                      
                      <div className="flex-1">
                        <button 
                          onClick={() => handleViewProfile(user.username)}
                          className="text-left"
                        >
                          <h3 className="text-lg font-semibold text-white hover:text-neon-green transition-colors">
                            {user.display_name}
                          </h3>
                          <p className="text-gray-400">@{user.username}</p>
                        </button>
                        
                        {user.bio && (
                          <p className="text-gray-300 text-sm mt-1 line-clamp-2">{user.bio}</p>
                        )}
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-400 mt-2">
                          <span>{user.followers_count} seguidores</span>
                          <span>{user.posts_count} posts</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-2">
                        {isFriend ? (
                          <>
                            <CyberButton
                              onClick={() => handleOpenChat(user.username)}
                              className="flex items-center space-x-2"
                              size="sm"
                            >
                              <MessageCircle size={16} />
                              <span>Mensaje</span>
                            </CyberButton>
                            <CyberButton
                              onClick={() => handleViewProfile(user.username)}
                              variant="outline"
                              size="sm"
                            >
                              Ver perfil
                            </CyberButton>
                          </>
                        ) : (
                          <>
                            <CyberButton
                              onClick={() => handleSendFriendRequest(user.username)}
                              className="flex items-center space-x-2"
                              size="sm"
                              disabled={user.friend_request_status === 'pending'}
                            >
                              <UserPlus size={16} />
                              <span>
                                {user.friend_request_status === 'pending' ? 'Pendiente' : 'Agregar'}
                              </span>
                            </CyberButton>
                            <CyberButton
                              onClick={() => handleViewProfile(user.username)}
                              variant="outline"
                              size="sm"
                            >
                              Ver perfil
                            </CyberButton>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <MobileNav />
    </div>
  );
}
