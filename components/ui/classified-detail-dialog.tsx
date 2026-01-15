'use client';

import React from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { CyberButton } from '@/components/ui/cyber-button';
import { X, Briefcase, DollarSign, HelpCircle, MapPin, Mail, Phone, CalendarDays, User as UserIcon, Clock, Zap, Wallet } from 'lucide-react';
import { Classified } from '@/types/user';
import { cn } from '@/lib/utils';

interface ClassifiedDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  classified: Classified;
  onContact: (classified: Classified) => void;
}

export function ClassifiedDetailDialog({ isOpen, onClose, classified, onContact }: ClassifiedDetailDialogProps) {
  const getIconForType = (type: Classified['type']) => {
    switch (type) {
      case 'job': return <Briefcase size={20} className="text-neon-green" />;
      case 'sale': return <DollarSign size={20} className="text-yellow-400" />;
      case 'help': return <HelpCircle size={20} className="text-neon-blue" />;
      case 'event': return <CalendarDays size={20} className="text-purple-400" />;
      default: return <Briefcase size={20} className="text-gray-400" />;
    }
  };

  const formatPrice = (price: number | undefined) => {
    if (price === undefined) return 'N/A';
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(price);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const formatUrgency = (urgency: Classified['urgency'] | undefined) => {
    switch (urgency) {
      case 'inmediata': return 'Inmediata';
      case 'corto_plazo': return 'Corto Plazo';
      case 'largo_plazo': return 'Largo Plazo';
      default: return 'No especificada';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl lg:max-w-4xl h-[90vh] flex flex-col glass-card border-neon-green/20 p-0 bg-gradient-to-br from-gray-900/95 via-black/95 to-gray-900/95 backdrop-blur-xl">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-white flex items-center space-x-2">
            {getIconForType(classified.type)}
            <span>Detalles del Clasificado</span>
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Información completa sobre el anuncio "{classified.title}".
          </DialogDescription>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors"
          >
            <X size={20} />
          </button>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 pt-4 scrollbar-hide">
          {classified.imageUrl && (
            <div className="relative w-full h-64 sm:h-80 lg:h-96 rounded-xl overflow-hidden mb-6 shadow-2xl">
              <Image
                src={classified.imageUrl}
                alt={classified.title}
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20">
                <div className="absolute top-4 left-4">
                  <span className="text-white text-sm font-medium bg-black/60 backdrop-blur-sm px-3 py-2 rounded-full border border-white/20">
                    {classified.type.charAt(0).toUpperCase() + classified.type.slice(1)}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white text-lg font-bold mb-1">{classified.title}</h3>
                      <p className="text-gray-200 text-sm opacity-90">
                        {classified.location && (
                          <span className="flex items-center gap-1">
                            <MapPin size={14} />
                            {classified.location}
                          </span>
                        )}
                      </p>
                    </div>
                    {classified.price !== undefined && (
                      <div className="text-right">
                        <p className="text-neon-green text-xl font-bold">
                          {formatPrice(classified.price)}
                        </p>
                        <p className="text-gray-300 text-xs">Precio</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {!classified.imageUrl && (
            <>
              <h2 className="text-2xl font-bold text-white mb-3">{classified.title}</h2>
              <p className="text-gray-300 text-base leading-relaxed mb-6">{classified.description}</p>
            </>
          )}

          {classified.imageUrl && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">Descripción</h3>
              <p className="text-gray-300 text-base leading-relaxed bg-white/5 p-4 rounded-lg border border-white/10">
                {classified.description}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white/5 p-4 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-neon-green/20 rounded-lg">
                  <Briefcase size={20} className="text-neon-green" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Tipo de Anuncio</p>
                  <p className="text-white font-medium">{classified.type.charAt(0).toUpperCase() + classified.type.slice(1)}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 p-4 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-neon-blue/20 rounded-lg">
                  <span className="w-5 h-5 flex items-center justify-center">
                    <span className="w-2 h-2 bg-neon-blue rounded-full"></span>
                  </span>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Categoría</p>
                  <p className="text-white font-medium">{classified.category}</p>
                </div>
              </div>
            </div>
            
            {classified.location && (
              <div className="bg-white/5 p-4 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-yellow-400/20 rounded-lg">
                    <MapPin size={20} className="text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Ubicación</p>
                    <p className="text-white font-medium">{classified.location}</p>
                  </div>
                </div>
              </div>
            )}
            
            {classified.price !== undefined && !classified.imageUrl && (
              <div className="bg-white/5 p-4 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-400/20 rounded-lg">
                    <DollarSign size={20} className="text-purple-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Precio</p>
                    <p className="text-white font-medium">{formatPrice(classified.price)}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="bg-white/5 p-4 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-400/20 rounded-lg">
                  <CalendarDays size={20} className="text-gray-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Publicado el</p>
                  <p className="text-white font-medium">{formatTimeAgo(classified.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {(classified.type === 'job' || classified.type === 'help') && (
            <div className="border-t border-white/10 pt-6 mt-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-neon-green" />
                Detalles de la Oportunidad
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {classified.workingHours && (
                  <div className="bg-white/5 p-4 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-neon-green/20 rounded-lg">
                        <Clock size={20} className="text-neon-green" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Horas de Trabajo / Dedicación</p>
                        <p className="text-white font-medium">{classified.workingHours}</p>
                      </div>
                    </div>
                  </div>
                )}
                {classified.availability && (
                  <div className="bg-white/5 p-4 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-neon-blue/20 rounded-lg">
                        <CalendarDays size={20} className="text-neon-blue" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Disponibilidad</p>
                        <p className="text-white font-medium">{classified.availability}</p>
                      </div>
                    </div>
                  </div>
                )}
                {classified.urgency && (
                  <div className="bg-white/5 p-4 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-yellow-400/20 rounded-lg">
                        <Zap size={20} className="text-yellow-400" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Necesidad / Urgencia</p>
                        <p className="text-white font-medium">{formatUrgency(classified.urgency)}</p>
                      </div>
                    </div>
                  </div>
                )}
                {classified.salaryEstimate && (
                  <div className="bg-white/5 p-4 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-400/20 rounded-lg">
                        <Wallet size={20} className="text-purple-400" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Estimación de Salario / Compensación</p>
                        <p className="text-white font-medium">{classified.salaryEstimate}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="border-t border-white/10 pt-6 mt-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-neon-green" />
              Información del Anunciante
            </h3>
            <div className="bg-white/5 p-6 rounded-lg border border-white/10">
              <div className="flex items-center space-x-4 mb-4">
                <div className="relative">
                  <Image
                    src={classified.user.avatar}
                    alt={classified.user.displayName}
                    width={60}
                    height={60}
                    className="rounded-full ring-2 ring-neon-green/50"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-neon-green rounded-full border-2 border-gray-900"></div>
                </div>
                <div>
                  <p className="text-white font-semibold text-lg">{classified.user.displayName}</p>
                  <p className="text-gray-400 text-sm">@{classified.user.username}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="w-2 h-2 bg-neon-green rounded-full"></span>
                    <span className="text-xs text-gray-400">Activo</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center space-x-2 text-gray-300 bg-white/5 px-3 py-2 rounded-lg">
                  <Mail size={16} className="text-neon-blue" />
                  <span className="text-sm">{classified.contactInfo}</span>
                </div>
                {/* En una app real, podrías mostrar el teléfono si es diferente al email y si el usuario lo permite */}
                {/* <div className="flex items-center space-x-2 text-gray-300 bg-white/5 px-3 py-2 rounded-lg">
                  <Phone size={16} className="text-neon-green" />
                  <span className="text-sm">{classified.user.phone || 'N/A'}</span>
                </div> */}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-white/10 flex-shrink-0 bg-gradient-to-r from-gray-900/50 to-black/50">
          <div className="flex gap-3">
            <CyberButton
              onClick={() => onContact(classified)}
              className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-neon-green to-neon-blue hover:from-neon-blue hover:to-neon-green transition-all duration-300"
            >
              <Mail size={20} />
              <span>Contactar Anunciante</span>
            </CyberButton>
            <CyberButton
              variant="outline"
              className="px-4 border-neon-green/50 text-neon-green hover:bg-neon-green/10"
            >
              <span>💾</span>
            </CyberButton>
          </div>
          <p className="text-center text-xs text-gray-400 mt-3">
            Al contactar, acepta compartir su información de contacto
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}