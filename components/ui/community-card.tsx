'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Users, Sparkles, ChevronRight } from 'lucide-react';
import { Community } from '@/types/user';
import { CyberButton } from './cyber-button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/providers/providers';

interface CommunityCardProps {
  community: Community;
  onJoinLeave: (communityId: string, isMember: boolean) => void;
}

export function CommunityCard({ community, onJoinLeave }: CommunityCardProps) {
  const { user: currentUser } = useAuth();
  const isMember = currentUser?.communityIds?.includes(community.id) || false;

  const handleAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    onJoinLeave(community.id, isMember);
  };

  return (
    <div className="glass-card p-4 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 border border-white/10 hover:border-neon-green/30 transition-all duration-300">
      <div className="relative w-full sm:w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden">
        <Image
          src={community.coverImage}
          alt={community.name}
          fill
          style={{ objectFit: 'cover' }}
          className="group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-2">
          <span className="text-white text-xs font-medium bg-black/50 px-2 py-1 rounded-full">
            {community.category.charAt(0).toUpperCase() + community.category.slice(1)}
          </span>
        </div>
      </div>

      <div className="flex-1 text-center sm:text-left">
        <Link href={`/communities/${community.id}`} className="hover:text-neon-green transition-colors">
          <h3 className="text-xl font-semibold text-white mb-1">{community.name}</h3>
        </Link>
        <p className="text-gray-400 text-sm line-clamp-2 mb-2">{community.description}</p>
        <div className="flex items-center justify-center sm:justify-start space-x-4 text-sm text-gray-400">
          <span className="flex items-center space-x-1">
            <Users size={16} className="text-neon-blue" />
            <span>{community.membersCount} miembros</span>
          </span>
          <span className="flex items-center space-x-1">
            <Sparkles size={16} className="text-yellow-400" />
            <span>Creada por {community.creator.displayName}</span>
          </span>
        </div>
      </div>

      <div className="flex flex-col space-y-2 sm:ml-auto">
        <CyberButton
          size="sm"
          variant={isMember ? 'outline' : 'primary'}
          onClick={handleAction}
          disabled={!currentUser}
        >
          {isMember ? 'Dejar Comunidad' : 'Unirse'}
        </CyberButton>
        <Link href={`/communities/${community.id}`}>
          <CyberButton size="sm" variant="ghost" className="flex items-center space-x-2">
            <span>Ver Comunidad</span>
            <ChevronRight size={16} />
          </CyberButton>
        </Link>
      </div>
    </div>
  );
}