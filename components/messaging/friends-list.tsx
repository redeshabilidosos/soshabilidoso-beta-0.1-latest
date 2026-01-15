"use client";

import { useState, useEffect } from 'react';
import { Search, MessageCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usersService, User } from '@/lib/services/users.service';
import { useToast } from '@/hooks/use-toast';

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
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-green"></div>
      </div>
    );
  }

  if (friends.length === 0) {
    return (
      <div className="text-center p-8">
        <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">No tienes amigos aún</h3>
        <p className="text-gray-400 text-sm">
          Agrega amigos para poder chatear con ellos
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Buscador */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Buscar amigos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-white/5 border-white/10 text-white placeholder-gray-500"
        />
      </div>

      {/* Lista de amigos */}
      <div className="space-y-2 max-h-[500px] overflow-y-auto">
        {filteredFriends.length === 0 ? (
          <p className="text-center text-gray-400 py-4">
            No se encontraron amigos
          </p>
        ) : (
          filteredFriends.map((friend) => (
            <button
              key={friend.id}
              onClick={() => onFriendSelect(friend)}
              className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors text-left"
            >
              <Avatar className="w-12 h-12">
                <AvatarImage src={friend.avatar_url} alt={friend.display_name} />
                <AvatarFallback>{friend.display_name[0]}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white truncate">
                  {friend.display_name}
                </p>
                <p className="text-sm text-gray-400 truncate">
                  @{friend.username}
                </p>
              </div>

              <MessageCircle className="w-5 h-5 text-neon-green flex-shrink-0" />
            </button>
          ))
        )}
      </div>
    </div>
  );
}
