'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CyberButton } from '@/components/ui/cyber-button';
import { 
  Group, 
  Users, 
  MessageSquare, 
  Crown,
  Lock,
  Globe,
  Star,
  TrendingUp
} from 'lucide-react';

interface Community {
  id: string;
  slug?: string;
  name: string;
  description: string;
  members: number;
  posts: number;
  category: string;
  type: 'public' | 'private' | 'premium' | 'page';
  isJoined: boolean;
  profileImage: string | null;
  coverImage: string | null;
  subscriptionPrice?: number;
  currency?: string;
  features?: string[];
}

interface CommunityListViewProps {
  communities: Community[];
  onJoinCommunity: (communityId: string) => void;
  onViewProfile: (community: Community) => void;
  onCommunityClick?: (community: Community) => void;
}

const typeIcons = {
  public: Users,
  private: Lock,
  premium: Crown,
  page: Globe
};

const typeColors = {
  public: 'text-green-400',
  private: 'text-blue-400',
  premium: 'text-yellow-400',
  page: 'text-purple-400'
};

const typeBadges = {
  public: { label: 'Pública', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  private: { label: 'Privada', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  premium: { label: 'Premium', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  page: { label: 'Página', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' }
};

export function CommunityListView({ communities, onJoinCommunity, onViewProfile, onCommunityClick }: CommunityListViewProps) {
  return (
    <div className="space-y-4">
      {communities.map((community) => {
        const TypeIcon = typeIcons[community.type];
        const typeColor = typeColors[community.type];
        const typeBadge = typeBadges[community.type];
        
        return (
          <Card 
            key={community.id} 
            className="glass-card hover:border-neon-green/50 hover:shadow-lg hover:shadow-neon-green/20 hover:scale-102 transition-all duration-300 transform group cursor-pointer"
            onClick={() => onCommunityClick?.(community)}
          >
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                {/* Profile Image */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/20 bg-white/10 group-hover:border-neon-green/50 group-hover:shadow-lg group-hover:shadow-neon-green/30 group-hover:scale-110 transition-all duration-300">
                    {community.profileImage ? (
                      <img 
                        src={community.profileImage} 
                        alt={`Perfil de ${community.name}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Group className="w-8 h-8 text-neon-green group-hover:text-neon-blue transition-colors duration-300" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-semibold text-white truncate group-hover:text-neon-green transition-colors duration-300">{community.name}</h3>
                        <TypeIcon className={`w-4 h-4 ${typeColor} flex-shrink-0 group-hover:scale-110 transition-transform duration-300`} />
                        {community.type === 'premium' && community.subscriptionPrice && (
                          <div className="text-yellow-400 font-bold text-sm ml-auto group-hover:text-yellow-300 group-hover:scale-105 transition-all duration-300">
                            ${community.subscriptionPrice.toLocaleString()} {community.currency}/mes
                          </div>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm line-clamp-2 mb-2 group-hover:text-gray-300 transition-colors duration-300">{community.description}</p>
                      {community.type === 'premium' && community.features && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {community.features.slice(0, 3).map((feature, index) => (
                            <span key={index} className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full group-hover:bg-yellow-500/30 group-hover:text-yellow-300 group-hover:scale-105 transition-all duration-300">
                              {feature}
                            </span>
                          ))}
                          {community.features.length > 3 && (
                            <span className="text-xs px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full group-hover:bg-gray-500/30 group-hover:text-gray-300 group-hover:scale-105 transition-all duration-300">
                              +{community.features.length - 3} más
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center space-x-2 ml-4 group-hover:scale-105 transition-transform duration-300">
                      <CyberButton
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewProfile(community);
                        }}
                        className="text-xs whitespace-nowrap hover:border-neon-green/50 hover:text-neon-green hover:shadow-lg hover:shadow-neon-green/20 transition-all duration-300"
                      >
                        Ver Perfil
                      </CyberButton>
                      <CyberButton
                        size="sm"
                        variant={community.isJoined ? 'outline' : 'primary'}
                        className={`text-xs whitespace-nowrap ${
                          community.isJoined ? 'border-neon-green text-neon-green hover:bg-neon-green/10' : ''
                        } ${
                          community.type === 'premium' && !community.isJoined ? 'bg-yellow-500 text-black hover:bg-yellow-400 hover:shadow-lg hover:shadow-yellow-500/30' : ''
                        } transition-all duration-300 hover:scale-110`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (community.type === 'premium' && !community.isJoined) {
                            onCommunityClick?.(community);
                          } else {
                            onJoinCommunity(community.id);
                          }
                        }}
                      >
                        {community.type === 'page' 
                          ? (community.isJoined ? 'Siguiendo' : 'Seguir')
                          : community.type === 'premium'
                            ? (community.isJoined ? 'Suscrito' : 'Suscribirse')
                            : (community.isJoined ? 'Unido' : 'Unirse')
                        }
                      </CyberButton>
                    </div>
                  </div>

                  {/* Stats and Badges */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                      <span className="flex items-center space-x-1 group-hover:scale-105 transition-transform duration-300">
                        <Users className="w-3 h-3 group-hover:text-neon-green transition-colors duration-300" />
                        <span>
                          {community.members.toLocaleString()} {community.type === 'page' ? 'seguidores' : 'miembros'}
                        </span>
                      </span>
                      <span className="flex items-center space-x-1 group-hover:scale-105 transition-transform duration-300">
                        <MessageSquare className="w-3 h-3 group-hover:text-neon-blue transition-colors duration-300" />
                        <span>{community.posts} posts</span>
                      </span>
                      {community.type === 'premium' && (
                        <span className="flex items-center space-x-1 group-hover:scale-105 transition-transform duration-300">
                          <Star className="w-3 h-3 text-yellow-400 group-hover:animate-pulse" />
                          <span className="text-yellow-400 group-hover:text-yellow-300 transition-colors duration-300">Premium</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs group-hover:scale-105 group-hover:bg-white/10 transition-all duration-300">
                        {community.category}
                      </Badge>
                      <Badge variant="secondary" className={`text-xs ${typeBadge.color} group-hover:scale-105 transition-all duration-300`}>
                        {typeBadge.label}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}