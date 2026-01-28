"use client";

import { useState, useEffect } from 'react';
import { Search, MessageCircle, Sparkles, Users as UsersIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usersService, User } from '@/lib/services/users.service';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface FriendsListProps {
  onFriendSelect: (friend: User) => void;
}

export function FriendsList({ onFriendSelect }: FriendsListProps) {
  const [friends, setFriends] = useState<User[]>([]);
  const [filteredFriends, setFilteredFriends] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadFriends();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredFriends(friends);
    } else {
      const filtered = friends.filter(friend =>
        friend.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        friend.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredFriends(filtered);
    }
  }, [searchQuery, friends]);

  const loadFriends = async () => {
    try {
      setLoading(true);
      const friendsList = await usersService.getFriends();
      setFriends(friendsList);
      setFilteredFriends(friendsList);
    } catch (error) {
      console.error('Error loading friends:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar tus amigos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="relative">
          <div className="w-12 h-12 border-3 border-neon-green/20 border-t-neon-green rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <UsersIcon className="w-5 h-5 text-neon-green/50" />
          </div>
        </div>
        <p className="text-gray-500 text-sm mt-4">Cargando amigos...</p>
      </div>
    );
  }

  if (friends.length === 0) {
    return (
      <Card className="bg-black/40 backdrop-blur-xl border-white/10">
        <CardHeader className="text-center pb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/10 flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
            <UsersIcon className="w-8 h-8 text-blue-400" />
          </div>
          <CardTitle className="text-white text-lg">No tienes amigos aún</CardTitle>
          <CardDescription className="text-gray-400 text-sm">
            Agrega amigos para poder chatear con ellos
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Buscador mejorado */}
      <Card className="bg-black/40 backdrop-blur-xl border-white/10">
        <div className="p-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-neon-green transition-colors" />
            <Input
              placeholder="Buscar amigos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-neon-green/50 focus:ring-2 focus:ring-neon-green/20"
            />
          </div>
          
          {friends.length > 0 && (
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
              <p className="text-xs text-gray-500">
                {filteredFriends.length} de {friends.length} amigos
              </p>
              <Badge className="bg-neon-green/20 text-neon-green border-neon-green/30 text-[10px]">
                Disponibles
              </Badge>
            </div>
          )}
        </div>
      </Card>

      {/* Lista de amigos mejorada */}
      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
        {filteredFriends.length === 0 ? (
          <Card className="bg-black/40 backdrop-blur-xl border-white/10">
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3 border border-white/10">
                <Search className="w-6 h-6 text-gray-600" />
              </div>
              <p className="text-gray-500 text-sm">No se encontraron amigos</p>
              <p className="text-gray-600 text-xs mt-1">Intenta con otro término</p>
            </div>
          </Card>
        ) : (
          filteredFriends.map((friend) => (
            <button
              key={friend.id}
              onClick={() => onFriendSelect(friend)}
              className="w-full group"
            >
              <Card className="bg-black/40 backdrop-blur-xl border-white/10 hover:border-neon-green/30 hover:bg-black/60 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
                <div className="flex items-center space-x-3 p-3">
                  <div className="relative">
                    <Avatar className="w-12 h-12 ring-2 ring-transparent group-hover:ring-neon-green/30 transition-all">
                      <AvatarImage src={friend.avatar_url} alt={friend.display_name} />
                      <AvatarFallback className="bg-gradient-to-br from-neon-green/80 to-emerald-600 text-white font-semibold">
                        {friend.display_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-black" />
                  </div>
                  
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <p className="font-medium text-white truncate text-sm">
                        {friend.display_name}
                      </p>
                      {friend.is_verified && (
                        <Badge className="bg-blue-500/20 text-blue-400 border-0 text-[10px] px-1 py-0">✓</Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 truncate">
                      @{friend.username}
                    </p>
                  </div>

                  <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-neon-green/10 to-emerald-500/5 flex items-center justify-center border border-neon-green/20 group-hover:from-neon-green/20 group-hover:to-emerald-500/10 transition-all">
                    <MessageCircle className="w-4 h-4 text-neon-green" />
                  </div>
                </div>
              </Card>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
