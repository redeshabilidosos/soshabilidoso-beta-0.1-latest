"use client";

import { useState, useEffect } from 'react';
import { Check, X, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usersService, FriendRequest } from '@/lib/services/users.service';
import { useToast } from '@/hooks/use-toast';

export function FriendRequests() {
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    loadFriendRequests();
  }, []);

  const loadFriendRequests = async () => {
    try {
      const requests = await usersService.getFriendRequests();
      setFriendRequests(requests);
    } catch (error) {
      console.error('Error loading friend requests:', error);
      toast({
        title: "Error",
        description: "Error al cargar solicitudes de amistad",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = async (requestId: string, action: 'accept' | 'reject') => {
    setProcessingIds(prev => new Set(prev).add(requestId));
    
    try {
      await usersService.respondFriendRequest(requestId, action);
      
      // Remover la solicitud de la lista
      setFriendRequests(prev => prev.filter(req => req.id !== requestId));
      
      const actionText = action === 'accept' ? 'aceptada' : 'rechazada';
      toast({
        title: "Éxito",
        description: `Solicitud de amistad ${actionText}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(requestId);
        return newSet;
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Hace unos minutos';
    } else if (diffInHours < 24) {
      return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Solicitudes de Amistad</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-gray-500 mt-2">Cargando solicitudes...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Solicitudes de Amistad</span>
          </div>
          {friendRequests.length > 0 && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {friendRequests.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {friendRequests.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay solicitudes pendientes
            </h3>
            <p className="text-gray-500">
              Las nuevas solicitudes de amistad aparecerán aquí
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {friendRequests.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3 flex-1">
                  <Avatar className="w-12 h-12">
                    <AvatarImage 
                      src={request.sender.avatar_url} 
                      alt={request.sender.display_name} 
                    />
                    <AvatarFallback>
                      {request.sender.display_name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-sm truncate">
                        {request.sender.display_name}
                      </h3>
                      {request.sender.is_verified && (
                        <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                          ✓
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">@{request.sender.username}</p>
                    
                    {request.message && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        "{request.message}"
                      </p>
                    )}
                    
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDate(request.created_at)}
                    </p>
                    
                    <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                      <span>{request.sender.followers_count} seguidores</span>
                      <span>{request.sender.posts_count} posts</span>
                    </div>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleResponse(request.id, 'reject')}
                    disabled={processingIds.has(request.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleResponse(request.id, 'accept')}
                    disabled={processingIds.has(request.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}