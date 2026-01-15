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
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          <UserCheck className="w-3 h-3 mr-1" />
          Amigos
        </Badge>
      );
    }
    if (user.friend_request_status === 'sent') {
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
          <Clock className="w-3 h-3 mr-1" />
          Enviada
        </Badge>
      );
    }
    if (user.friend_request_status === 'received') {
      return (
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          <Clock className="w-3 h-3 mr-1" />
          Recibida
        </Badge>
      );
    }
    return (
      <Button variant="outline" size="sm" onClick={() => handleSendFriendRequest(user)} className="text-xs">
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
          <div className="space-y-3">
            {users.map((user) => (
              <Card key={user.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div 
                      className="flex items-center space-x-3 flex-1 cursor-pointer"
                      onClick={() => onUserSelect?.(user)}
                    >
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={user.avatar_url} alt={user.display_name} />
                        <AvatarFallback>{user.display_name.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-sm truncate">{user.display_name}</h3>
                          {user.is_verified && (
                            <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">✓</Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">@{user.username}</p>
                        {user.bio && <p className="text-xs text-gray-600 mt-1 line-clamp-2">{user.bio}</p>}
                        {(user.position || user.team) && (
                          <div className="flex items-center space-x-2 mt-1">
                            {user.position && <Badge variant="outline" className="text-xs">{user.position}</Badge>}
                            {user.team && <Badge variant="outline" className="text-xs">{user.team}</Badge>}
                          </div>
                        )}
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          <span>{user.followers_count} seguidores</span>
                          <span>{user.posts_count} posts</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      {getFriendRequestButton(user)}
                      <Button
                        variant={user.is_following ? "secondary" : "outline"}
                        size="sm"
                        onClick={() => handleFollowUser(user)}
                        className="text-xs"
                      >
                        {user.is_following ? 'Siguiendo' : 'Seguir'}
                      </Button>
                      {onMessageUser && (
                        <Button variant="outline" size="sm" onClick={() => onMessageUser(user)} className="text-xs">
                          <MessageCircle className="w-3 h-3" />
                        </Button>
                      )}
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
          <div className="space-y-3">
            {enterprises.map((enterprise) => (
              <Card key={enterprise.id} className="hover:shadow-md transition-shadow border-l-4 border-l-purple-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div 
                      className="flex items-center space-x-3 flex-1 cursor-pointer"
                      onClick={() => router.push(`/enterprise/${enterprise.id}`)}
                    >
                      <Avatar className="w-14 h-14 rounded-lg">
                        <AvatarImage src={enterprise.logo_url || ''} alt={enterprise.name} />
                        <AvatarFallback className="rounded-lg bg-purple-100 text-purple-700">
                          <Building2 className="w-6 h-6" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-sm truncate">{enterprise.name}</h3>
                          {enterprise.is_verified && (
                            <BadgeCheck className="w-4 h-4 text-purple-500" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500">@{enterprise.username}</p>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">{enterprise.description}</p>
                        <div className="flex items-center flex-wrap gap-2 mt-2">
                          <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                            {enterprise.category}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {enterprise.industry}
                          </Badge>
                          {enterprise.location && (
                            <span className="text-xs text-gray-500">📍 {enterprise.location}</span>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          <span>{enterprise.followers_count.toLocaleString()} seguidores</span>
                          <span>{enterprise.posts_count} publicaciones</span>
                          {enterprise.rating > 0 && (
                            <span className="flex items-center">
                              ⭐ {enterprise.rating.toFixed(1)} ({enterprise.reviews_count})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant={enterprise.is_following ? "secondary" : "default"}
                        size="sm"
                        onClick={() => handleFollowEnterprise(enterprise)}
                        className={enterprise.is_following ? "text-xs" : "text-xs bg-purple-600 hover:bg-purple-700"}
                      >
                        {enterprise.is_following ? 'Siguiendo' : 'Seguir'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/enterprise/${enterprise.id}`)}
                        className="text-xs"
                      >
                        Ver perfil
                      </Button>
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
