"use client";

import { useState, useEffect, useCallback } from 'react';
import { Search, UserPlus, MessageCircle, UserCheck, Clock, X, Building2, Users, BadgeCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usersService, User } from '@/lib/services/users.service';
import { enterprisesService, Enterprise } from '@/lib/services/enterprises.service';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { debounce } from 'lodash';
import { cn } from '@/lib/utils';

interface UserSearchProps {
  onUserSelect?: (user: User) => void;
  onMessageUser?: (user: User) => void;
}

export function UserSearch({ onUserSelect, onMessageUser }: UserSearchProps) {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'enterprises'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersPage, setUsersPage] = useState(1);
  const [usersHasMore, setUsersHasMore] = useState(false);
  const [enterprises, setEnterprises] = useState<Enterprise[]>([]);
  const [enterprisesLoading, setEnterprisesLoading] = useState(false);
  const [enterprisesPage, setEnterprisesPage] = useState(1);
  const [enterprisesHasMore, setEnterprisesHasMore] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const debouncedSearchUsers = useCallback(
    debounce(async (searchQuery: string) => {
      setUsersLoading(true);
      try {
        const response = await usersService.searchUsers(searchQuery, 1);
        setUsers(response.results);
        setUsersHasMore(!!response.next);
        setUsersPage(1);
      } catch (error) {
        console.error('Error searching users:', error);
      } finally {
        setUsersLoading(false);
      }
    }, 300),
    []
  );

  const debouncedSearchEnterprises = useCallback(
    debounce(async (searchQuery: string) => {
      setEnterprisesLoading(true);
      try {
        const response = await enterprisesService.searchEnterprises(searchQuery, 1);
        setEnterprises(response.results);
        setEnterprisesHasMore(!!response.next);
        setEnterprisesPage(1);
      } catch (error) {
        console.error('Error searching enterprises:', error);
      } finally {
        setEnterprisesLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSearchUsers('');
    debouncedSearchEnterprises('');
  }, []);

  useEffect(() => {
    debouncedSearchUsers(query);
    debouncedSearchEnterprises(query);
  }, [query]);


  const handleFollowUser = async (user: User) => {
    try {
      if (user.is_following) {
        await usersService.unfollowUser(user.username);
        toast({ title: "Éxito", description: `Has dejado de seguir a ${user.display_name}` });
      } else {
        await usersService.followUser(user.username);
        toast({ title: "Éxito", description: `Ahora sigues a ${user.display_name}` });
      }
      setUsers(users.map(u => u.id === user.id ? { ...u, is_following: !u.is_following } : u));
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleFollowEnterprise = async (enterprise: Enterprise) => {
    try {
      if (enterprise.is_following) {
        await enterprisesService.unfollowEnterprise(enterprise.username);
        toast({ title: "Éxito", description: `Has dejado de seguir a ${enterprise.name}` });
      } else {
        await enterprisesService.followEnterprise(enterprise.username);
        toast({ title: "Éxito", description: `Ahora sigues a ${enterprise.name}` });
      }
      setEnterprises(enterprises.map(e => e.id === enterprise.id ? { ...e, is_following: !e.is_following } : e));
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleSendFriendRequest = async (user: User) => {
    try {
      await usersService.sendFriendRequest(user.username);
      toast({ title: "Éxito", description: `Solicitud de amistad enviada a ${user.display_name}` });
      setUsers(users.map(u => u.id === user.id ? { ...u, friend_request_status: 'sent' } : u));
    } catch (error: any) {
      if (error.message.includes('pendiente') || error.message.includes('Ya existe')) {
        setUsers(users.map(u => u.id === user.id ? { ...u, friend_request_status: 'sent' } : u));
        toast({ title: "Solicitud pendiente", description: "Ya enviaste una solicitud a este usuario." });
      } else if (error.message.includes('Ya son amigos')) {
        setUsers(users.map(u => u.id === user.id ? { ...u, is_friend: true } : u));
        toast({ title: "Ya son amigos", description: `${user.display_name} ya está en tu lista de amigos.` });
      } else {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      }
    }
  };

  const loadMoreUsers = async () => {
    if (!usersHasMore || usersLoading) return;
    setUsersLoading(true);
    try {
      const response = await usersService.searchUsers(query, usersPage + 1);
      setUsers([...users, ...response.results]);
      setUsersHasMore(!!response.next);
      setUsersPage(usersPage + 1);
    } catch (error) {
      console.error('Error loading more users:', error);
    } finally {
      setUsersLoading(false);
    }
  };

  const loadMoreEnterprises = async () => {
    if (!enterprisesHasMore || enterprisesLoading) return;
    setEnterprisesLoading(true);
    try {
      const response = await enterprisesService.searchEnterprises(query, enterprisesPage + 1);
      setEnterprises([...enterprises, ...response.results]);
      setEnterprisesHasMore(!!response.next);
      setEnterprisesPage(enterprisesPage + 1);
    } catch (error) {
      console.error('Error loading more enterprises:', error);
    } finally {
      setEnterprisesLoading(false);
    }
  };

  const getFriendRequestButton = (user: User) => {
    if (user.is_friend) {
      return (
        <div className="flex items-center gap-1 bg-green-500/20 px-3 py-1.5 rounded-full">
          <UserCheck className="w-3 h-3 text-green-400" />
          <span className="text-xs text-green-400 font-medium">Amigos</span>
        </div>
      );
    }
    if (user.friend_request_status === 'sent') {
      return (
        <div className="flex items-center gap-1 bg-yellow-500/20 px-3 py-1.5 rounded-full">
          <Clock className="w-3 h-3 text-yellow-400" />
          <span className="text-xs text-yellow-400 font-medium">Enviada</span>
        </div>
      );
    }
    if (user.friend_request_status === 'received') {
      return (
        <div className="flex items-center gap-1 bg-blue-500/20 px-3 py-1.5 rounded-full">
          <Clock className="w-3 h-3 text-blue-400" />
          <span className="text-xs text-blue-400 font-medium">Recibida</span>
        </div>
      );
    }
    return (
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => handleSendFriendRequest(user)} 
        className="text-xs border-white/20 hover:border-neon-green/50 hover:bg-neon-green/10 text-white hover:text-neon-green transition-all"
      >
        <UserPlus className="w-3 h-3 mr-1" />
        Agregar
      </Button>
    );
  };


  return (
    <div className="space-y-4">
      {/* Barra de búsqueda unificada */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Buscar usuarios o empresas..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-10"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setQuery('')}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Tabs para usuarios y empresas */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'users' | 'enterprises')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>Usuarios</span>
            {users.length > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">{users.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="enterprises" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            <span>Empresas</span>
            {enterprises.length > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">{enterprises.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Lista de usuarios */}
        <TabsContent value="users" className="mt-4">
          <div className="space-y-4">
            {users.map((user) => (
              <Card key={user.id} className="glass-card hover:border-neon-green/30 transition-all duration-300 overflow-hidden">
                <CardContent className="p-0">
                  {/* Contenedor principal */}
                  <div className="flex items-start gap-4 p-4">
                    {/* Avatar */}
                    <div 
                      className="shrink-0 cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => onUserSelect?.(user)}
                    >
                      <Avatar className="w-16 h-16 ring-2 ring-white/10 hover:ring-neon-green/50 transition-all">
                        <AvatarImage src={user.avatar_url} alt={user.display_name} />
                        <AvatarFallback className="bg-gradient-to-br from-neon-green/20 to-neon-blue/20 text-white font-bold">
                          {user.display_name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    {/* Información del usuario */}
                    <div className="flex-1 min-w-0">
                      <div 
                        className="cursor-pointer hover:text-neon-green transition-colors"
                        onClick={() => onUserSelect?.(user)}
                      >
                        {/* Nombre y verificación */}
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-white text-base truncate">{user.display_name}</h3>
                          {user.is_verified && (
                            <div className="flex items-center gap-1 bg-neon-green/20 px-2 py-0.5 rounded-full">
                              <BadgeCheck className="w-3 h-3 text-neon-green" />
                              <span className="text-xs text-neon-green font-medium">Verificado</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Username */}
                        <p className="text-sm text-gray-400 mb-2">@{user.username}</p>
                        
                        {/* Bio */}
                        {user.bio && (
                          <p className="text-sm text-gray-300 mb-3 line-clamp-2 leading-relaxed">{user.bio}</p>
                        )}
                        
                        {/* Tags de posición y equipo */}
                        {(user.position || user.team) && (
                          <div className="flex items-center gap-2 mb-3 flex-wrap">
                            {user.position && (
                              <Badge className="bg-neon-blue/20 text-neon-blue border-neon-blue/30 text-xs">
                                {user.position}
                              </Badge>
                            )}
                            {user.team && (
                              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                                {user.team}
                              </Badge>
                            )}
                          </div>
                        )}
                        
                        {/* Estadísticas */}
                        <div className="flex items-center gap-6 text-sm text-gray-400 mb-4">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{user.followers_count} seguidores</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>{user.posts_count} posts</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sección de botones separada */}
                  <div className="border-t border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between gap-3">
                      {/* Estado de amistad */}
                      <div className="flex-shrink-0">
                        {getFriendRequestButton(user)}
                      </div>
                      
                      {/* Botones de acción */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant={user.is_following ? "secondary" : "default"}
                          size="sm"
                          onClick={() => handleFollowUser(user)}
                          className={cn(
                            "text-xs font-medium transition-all",
                            user.is_following 
                              ? "bg-gray-600 hover:bg-gray-700 text-white" 
                              : "bg-neon-green hover:bg-neon-green/80 text-black"
                          )}
                        >
                          {user.is_following ? 'Siguiendo' : 'Seguir'}
                        </Button>
                        
                        {onMessageUser && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => onMessageUser(user)} 
                            className="text-xs border-white/20 hover:border-neon-blue/50 hover:bg-neon-blue/10 text-white hover:text-neon-blue transition-all"
                          >
                            <MessageCircle className="w-4 h-4 mr-1" />
                            Mensaje
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {usersHasMore && (
            <div className="text-center mt-4">
              <Button variant="outline" onClick={loadMoreUsers} disabled={usersLoading} className="w-full">
                {usersLoading ? 'Cargando...' : 'Cargar más usuarios'}
              </Button>
            </div>
          )}

          {!usersLoading && users.length === 0 && (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">
                {query ? 'No se encontraron usuarios' : 'No hay usuarios disponibles'}
              </h3>
              <p className="text-gray-400">
                {query ? 'Intenta con otro término de búsqueda' : 'No hay usuarios registrados'}
              </p>
            </div>
          )}

          {usersLoading && users.length === 0 && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-gray-500 mt-2">Buscando usuarios...</p>
            </div>
          )}
        </TabsContent>


        {/* Lista de empresas */}
        <TabsContent value="enterprises" className="mt-4">
          <div className="space-y-4">
            {enterprises.map((enterprise) => (
              <Card key={enterprise.id} className="glass-card hover:border-purple-500/30 transition-all duration-300 overflow-hidden border-l-4 border-l-purple-500/50">
                <CardContent className="p-0">
                  {/* Contenedor principal */}
                  <div className="flex items-start gap-4 p-4">
                    {/* Logo */}
                    <div 
                      className="shrink-0 cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => router.push(`/enterprise/${enterprise.id}`)}
                    >
                      <Avatar className="w-16 h-16 rounded-xl ring-2 ring-purple-500/20 hover:ring-purple-500/50 transition-all">
                        <AvatarImage src={enterprise.logo_url || ''} alt={enterprise.name} className="rounded-xl" />
                        <AvatarFallback className="rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 text-white">
                          <Building2 className="w-8 h-8 text-purple-400" />
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    {/* Información de la empresa */}
                    <div className="flex-1 min-w-0">
                      <div 
                        className="cursor-pointer hover:text-purple-400 transition-colors"
                        onClick={() => router.push(`/enterprise/${enterprise.id}`)}
                      >
                        {/* Nombre y verificación */}
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-white text-base truncate">{enterprise.name}</h3>
                          {enterprise.is_verified && (
                            <div className="flex items-center gap-1 bg-purple-500/20 px-2 py-0.5 rounded-full">
                              <BadgeCheck className="w-3 h-3 text-purple-400" />
                              <span className="text-xs text-purple-400 font-medium">Verificada</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Username */}
                        <p className="text-sm text-gray-400 mb-2">@{enterprise.username}</p>
                        
                        {/* Descripción */}
                        <p className="text-sm text-gray-300 mb-3 line-clamp-2 leading-relaxed">{enterprise.description}</p>
                        
                        {/* Tags de categoría e industria */}
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                            {enterprise.category}
                          </Badge>
                          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                            {enterprise.industry}
                          </Badge>
                          {enterprise.location && (
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              📍 {enterprise.location}
                            </span>
                          )}
                        </div>
                        
                        {/* Estadísticas */}
                        <div className="flex items-center gap-6 text-sm text-gray-400 mb-4 flex-wrap">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{enterprise.followers_count.toLocaleString()} seguidores</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>{enterprise.posts_count} publicaciones</span>
                          </div>
                          {enterprise.rating > 0 && (
                            <div className="flex items-center gap-1">
                              <span>⭐ {enterprise.rating.toFixed(1)}</span>
                              <span className="text-xs">({enterprise.reviews_count})</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sección de botones separada */}
                  <div className="border-t border-white/10 bg-purple-500/5 p-4">
                    <div className="flex items-center justify-between gap-3">
                      {/* Información adicional */}
                      <div className="flex-shrink-0">
                        <Badge variant="outline" className="text-xs border-purple-500/30 text-purple-400">
                          Empresa
                        </Badge>
                      </div>
                      
                      {/* Botones de acción */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant={enterprise.is_following ? "secondary" : "default"}
                          size="sm"
                          onClick={() => handleFollowEnterprise(enterprise)}
                          className={cn(
                            "text-xs font-medium transition-all",
                            enterprise.is_following 
                              ? "bg-gray-600 hover:bg-gray-700 text-white" 
                              : "bg-purple-600 hover:bg-purple-700 text-white"
                          )}
                        >
                          {enterprise.is_following ? 'Siguiendo' : 'Seguir'}
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/enterprise/${enterprise.id}`)}
                          className="text-xs border-white/20 hover:border-purple-500/50 hover:bg-purple-500/10 text-white hover:text-purple-400 transition-all"
                        >
                          Ver perfil
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {enterprisesHasMore && (
            <div className="text-center mt-4">
              <Button variant="outline" onClick={loadMoreEnterprises} disabled={enterprisesLoading} className="w-full">
                {enterprisesLoading ? 'Cargando...' : 'Cargar más empresas'}
              </Button>
            </div>
          )}

          {!enterprisesLoading && enterprises.length === 0 && (
            <div className="text-center py-8">
              <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">
                {query ? 'No se encontraron empresas' : 'No hay empresas disponibles'}
              </h3>
              <p className="text-gray-400">
                {query ? 'Intenta con otro término de búsqueda' : 'No hay empresas registradas'}
              </p>
            </div>
          )}

          {enterprisesLoading && enterprises.length === 0 && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
              <p className="text-gray-500 mt-2">Buscando empresas...</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
