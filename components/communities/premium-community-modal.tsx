'use client';

import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CyberButton } from '@/components/ui/cyber-button';
import { 
  Crown, 
  Star, 
  Users, 
  MessageSquare, 
  Check,
  X,
  Zap,
  Shield,
  Clock,
  Award
} from 'lucide-react';

interface PremiumCommunity {
  id: string;
  name: string;
  description: string;
  members: number;
  posts: number;
  category: string;
  profileImage: string | null;
  coverImage: string | null;
  subscriptionPrice: number;
  currency: string;
  features?: string[]; // Hacer opcional para evitar errores
  isJoined: boolean;
}

interface PremiumCommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  community: PremiumCommunity | null;
  onSubscribe: (communityId: string) => void;
}

export function PremiumCommunityModal({ 
  isOpen, 
  onClose, 
  community, 
  onSubscribe 
}: PremiumCommunityModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!community) return null;

  const handleSubscribe = async () => {
    setIsProcessing(true);
    
    // Simular proceso de suscripción
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onSubscribe(community.id);
    setIsProcessing(false);
    onClose();
  };

  const benefits = [
    'Acceso completo a todo el contenido premium',
    'Interacción directa con expertos y mentores',
    'Recursos descargables exclusivos',
    'Soporte prioritario y respuesta rápida',
    'Certificados de participación',
    'Acceso a eventos privados y webinars'
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900/95 border-white/10 p-0">
        {/* Header con imagen de portada */}
        <div className="relative h-48 overflow-hidden">
          {community.coverImage ? (
            <img 
              src={community.coverImage} 
              alt={`Portada de ${community.name}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-yellow-500/30 to-orange-500/30" />
          )}
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors z-10"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Profile image and basic info */}
          <div className="absolute bottom-6 left-6 flex items-end space-x-4">
            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white/20 bg-white/10">
              {community.profileImage ? (
                <img 
                  src={community.profileImage} 
                  alt={`Perfil de ${community.name}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Crown className="w-10 h-10 text-yellow-400" />
                </div>
              )}
            </div>
            
            <div className="pb-2">
              <div className="flex items-center space-x-2 mb-1">
                <h2 className="text-2xl font-bold text-white">{community.name}</h2>
                <Badge className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                  <Crown className="w-3 h-3 mr-1" />
                  Premium
                </Badge>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-300">
                <span className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{community.members.toLocaleString()} miembros</span>
                </span>
                <span className="flex items-center space-x-1">
                  <MessageSquare className="w-4 h-4" />
                  <span>{community.posts} posts</span>
                </span>
                <Badge variant="secondary" className="bg-black/50 text-white">
                  {community.category}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
              <Zap className="w-5 h-5 text-neon-green mr-2" />
              Acerca de esta comunidad
            </h3>
            <p className="text-gray-300 leading-relaxed">{community.description}</p>
          </div>

          {/* Features Grid */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Star className="w-5 h-5 text-yellow-400 mr-2" />
              Lo que incluye tu suscripción
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(community.features || []).map((feature, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <div className="w-6 h-6 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-yellow-400" />
                  </div>
                  <span className="text-gray-300 text-sm">{feature}</span>
                </div>
              ))}
              {(!community.features || community.features.length === 0) && (
                <div className="col-span-full text-center py-8 text-gray-400">
                  <Star className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Las características de esta comunidad se están cargando...</p>
                </div>
              )}
            </div>
          </div>

          {/* Additional Benefits */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Award className="w-5 h-5 text-neon-blue mr-2" />
              Beneficios adicionales
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-white/5 border border-white/10 rounded-lg">
                  <div className="w-5 h-5 bg-neon-green/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-neon-green" />
                  </div>
                  <span className="text-gray-300 text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing and CTA */}
          <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-6">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
                  <Crown className="w-6 h-6 text-yellow-400" />
                  <h3 className="text-xl font-bold text-white">Suscripción Premium</h3>
                </div>
                <div className="flex items-baseline justify-center md:justify-start space-x-1 mb-2">
                  <span className="text-3xl font-bold text-yellow-400">
                    ${community.subscriptionPrice.toLocaleString()}
                  </span>
                  <span className="text-lg text-yellow-400">{community.currency}</span>
                  <span className="text-gray-400">por mes</span>
                </div>
                <div className="flex items-center justify-center md:justify-start space-x-4 text-sm text-gray-400">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>Cancela cuando quieras</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Shield className="w-4 h-4" />
                    <span>Pago seguro</span>
                  </span>
                </div>
              </div>

              <div className="flex flex-col space-y-3">
                {community.isJoined ? (
                  <div className="text-center">
                    <Badge className="bg-neon-green/20 text-neon-green border border-neon-green/30 px-4 py-2">
                      <Check className="w-4 h-4 mr-2" />
                      Ya estás suscrito
                    </Badge>
                    <p className="text-xs text-gray-400 mt-2">Disfruta de todos los beneficios</p>
                  </div>
                ) : (
                  <>
                    <CyberButton
                      onClick={handleSubscribe}
                      disabled={isProcessing}
                      className="bg-yellow-500 text-black hover:bg-yellow-400 px-8 py-3 text-lg font-semibold min-w-[200px]"
                    >
                      {isProcessing ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                          <span>Procesando...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Crown className="w-5 h-5" />
                          <span>Suscribirse Ahora</span>
                        </div>
                      )}
                    </CyberButton>
                    <p className="text-xs text-gray-400 text-center">
                      Al hacer clic serás redirigido al proceso de pago
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-400 pt-4 border-t border-white/10">
            <div className="flex items-center space-x-1">
              <Shield className="w-4 h-4 text-green-400" />
              <span>Pago 100% seguro</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4 text-blue-400" />
              <span>Acceso inmediato</span>
            </div>
            <div className="flex items-center space-x-1">
              <Award className="w-4 h-4 text-purple-400" />
              <span>Garantía de satisfacción</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}