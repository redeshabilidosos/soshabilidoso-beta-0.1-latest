'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Users, Sparkles, Plus, MessageCircle, Settings } from 'lucide-react';
import { Community, User } from '@/types/user';
import { CyberButton } from './cyber-button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/providers/providers';
import { NewPostDialog } from './new-post-dialog';
import { toast } from 'sonner';

interface CommunityHeaderProps {
  community: Community;
  onCommunityUpdated: (updatedCommunity: Community) => void;
  onPostCreated: (newPost: any) => void; // Callback para cuando se crea una nueva publicación
}

export function CommunityHeader({ community, onCommunityUpdated, onPostCreated }: CommunityHeaderProps) {
  const { user: currentUser } = useAuth();
  
  // Función local para manejar membresía
  const toggleCommunityMembership = async (communityId: string, isMember: boolean) => {
    console.log(`Toggling membership for community ${communityId}, currently member: ${isMember}`);
    return Promise.resolve();
  };
  const [isMember, setIsMember] = useState(false);
  const [isNewPostDialogOpen, setIsNewPostDialogOpen] = useState(false);

  useEffect(() => {
    setIsMember(currentUser?.communityIds?.includes(community.id) || false);
  }, [currentUser, community.id]);

  const handleJoinLeave = async () => {
    if (!currentUser) {
      toast.error('Debes iniciar sesión para unirte o dejar una comunidad.');
      return;
    }
    await toggleCommunityMembership(community.id, isMember);
    // Optimistically update UI
    setIsMember(!isMember);
    onCommunityUpdated({
      ...community,
      memberIds: isMember
        ? community.memberIds.filter(id => id !== currentUser.id)
        : [...community.memberIds, currentUser.id],
      membersCount: isMember ? community.membersCount - 1 : community.membersCount + 1,
    });
  };

  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long' });
  };

  return (
    <div className="glass-card overflow-hidden">
      {/* Cover Photo */}
      <div className="relative h-48 lg:h-64 bg-gradient-to-r from-neon-blue/30 to-purple-500/30">
        <Image
          src={community.coverImage}
          alt={community.name}
          fill
          style={{ objectFit: 'cover' }}
          className="absolute inset-0 opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Community Info */}
      <div className="p-6 -mt-16 relative z-10">
        <div className="flex flex-col items-center text-center">
          {/* Community "Avatar" - could be a logo or a default icon */}
          <div className="w-28 h-28 rounded-full bg-white/10 ring-4 ring-neon-green/50 mb-4 flex items-center justify-center">
            <Users size={64} className="text-neon-green" />
          </div>
          <h1 className="text-3xl font-bold text-white">{community.name}</h1>
          <p className="text-gray-400 text-lg">@{community.category}</p>
          <p className="text-gray-300 max-w-md mt-3 text-center">{community.description}</p>
        </div>

        <div className="flex flex-wrap justify-center mt-6 gap-2">
          <CyberButton
            variant={isMember ? 'outline' : 'primary'}
            onClick={handleJoinLeave}
            disabled={!currentUser}
          >
            {isMember ? 'Dejar Comunidad' : 'Unirse a la Comunidad'}
          </CyberButton>
          {isMember && (
            <CyberButton variant="secondary" onClick={() => setIsNewPostDialogOpen(true)}>
              <Plus size={16} className="mr-2" />
              <span>Nueva Publicación</span>
            </CyberButton>
          )}
          {community.creatorId === currentUser?.id && (
            <CyberButton variant="ghost">
              <Settings size={16} className="mr-2" />
              <span>Administrar</span>
            </CyberButton>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4 text-center mt-8 border-t border-white/10 pt-6">
          <div>
            <div className="text-2xl font-bold text-neon-green">{community.membersCount}</div>
            <div className="text-sm text-gray-400">Miembros</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-neon-blue">
              {/* Placeholder for community posts count */}
              {/* In a real app, you'd fetch this */}
              {0}
            </div>
            <div className="text-sm text-gray-400">Publicaciones</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">
              {/* Placeholder for community events count */}
              {/* In a real app, you'd fetch this */}
              {0}
            </div>
            <div className="text-sm text-gray-400">Eventos</div>
          </div>
        </div>

        <div className="space-y-4 mt-8 border-t border-white/10 pt-6">
          <h2 className="text-xl font-bold text-white mb-4">Información Adicional</h2>
          <div className="flex items-center space-x-3">
            <Sparkles size={20} className="text-yellow-400" />
            <div>
              <p className="text-gray-400 text-sm">Creada por</p>
              <p className="text-white font-medium">{community.creator.displayName}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <MessageCircle size={20} className="text-neon-blue" />
            <div>
              <p className="text-gray-400 text-sm">Categoría</p>
              <p className="text-white font-medium">{community.category.charAt(0).toUpperCase() + community.category.slice(1)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Users size={20} className="text-neon-green" />
            <div>
              <p className="text-gray-400 text-sm">Miembro desde</p>
              <p className="text-white font-medium">{formatJoinDate(community.createdAt)}</p>
            </div>
          </div>
        </div>
      </div>

      {isNewPostDialogOpen && (
        <NewPostDialog
          isOpen={isNewPostDialogOpen}
          onClose={() => setIsNewPostDialogOpen(false)}
          onPostCreated={onPostCreated}
          communityId={community.id} // Pasar el ID de la comunidad
        />
      )}
    </div>
  );
}