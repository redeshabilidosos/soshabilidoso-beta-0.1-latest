'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CyberButton } from '@/components/ui/cyber-button';
import { 
  CalendarDays, 
  MapPin, 
  Clock, 
  Users, 
  Music, 
  Palette, 
  Theater, 
  Camera,
  Heart,
  Share2,
  ExternalLink,
  Instagram,
  Facebook,
  Twitter,
  Globe,
  Star,
  Ticket,
  Play,
  X,
  DollarSign,
  Eye,
  Navigation,
  CheckCircle
} from 'lucide-react';

interface EventDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  event: any;
  onLike?: (eventId: string) => void;
}

// Modal de confirmación de asistencia
function AttendanceConfirmationModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-gray-900/95 border-green-400/30">
        <div className="text-center space-y-6 py-4">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">
              ¡Asistencia Confirmada!
            </h3>
            <p className="text-gray-400">
              Has confirmado tu asistencia exitosamente. Te enviaremos recordatorios antes del evento.
            </p>
          </div>

          <CyberButton 
            onClick={onClose}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
          >
            Aceptar
          </CyberButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function EventDetailDialog({ isOpen, onClose, event, onLike }: EventDetailDialogProps) {
  const [showAttendanceConfirmation, setShowAttendanceConfirmation] = useState(false);
  const [showProfilePreview, setShowProfilePreview] = useState(false);

  if (!event) return null;

  const getCategoryIcon = (category: string) => {
    const categoryMap: { [key: string]: any } = {
      'Música': Music,
      'Arte': Palette,
      'Teatro': Theater,
      'Educación': Camera,
      'Danza': Users,
      'Literatura': CalendarDays
    };
    const IconComponent = categoryMap[category] || CalendarDays;
    return <IconComponent className="w-4 h-4" />;
  };

  const getCategoryColor = (category: string) => {
    const colorMap: { [key: string]: string } = {
      'Música': 'bg-blue-500/20 text-blue-400 border-blue-400/30',
      'Arte': 'bg-purple-500/20 text-purple-400 border-purple-400/30',
      'Teatro': 'bg-red-500/20 text-red-400 border-red-400/30',
      'Educación': 'bg-green-500/20 text-green-400 border-green-400/30',
      'Danza': 'bg-pink-500/20 text-pink-400 border-pink-400/30',
      'Literatura': 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30'
    };
    return colorMap[category] || 'bg-gray-500/20 text-gray-400 border-gray-400/30';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time: string) => {
    return time;
  };

  const getVideoEmbedUrl = (url: string) => {
    if (!url) return null;
    
    // YouTube
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }
    
    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }
    
    return url;
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href
      });
    } else {
      // Fallback: copiar al portapapeles
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleViewInMaps = () => {
    const address = event.address || event.location;
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(mapsUrl, '_blank');
  };

  const handleConfirmAttendance = () => {
    setShowAttendanceConfirmation(true);
  };

  const handleAttendanceConfirmed = () => {
    setShowAttendanceConfirmation(false);
    // Aquí podrías actualizar el estado del evento o hacer una llamada a la API
  };

  const handleLikeEvent = () => {
    if (onLike) {
      onLike(event.id);
    }
  };

  const handleOrganizerClick = () => {
    setShowProfilePreview(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900/95 border-purple-400/30 mx-4 xl:mx-auto">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1 pr-4">
                <DialogTitle className="text-xl font-bold text-white mb-2">
                  {event.title}
                </DialogTitle>
                <div className="flex items-center space-x-2 mb-4">
                  <Badge className={`flex items-center space-x-1 ${getCategoryColor(event.category)}`}>
                    {getCategoryIcon(event.category)}
                    <span>{event.category}</span>
                  </Badge>
                  {event.featured && (
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      <Star className="w-3 h-3 mr-1" />
                      Destacado
                    </Badge>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-6 mt-6">
            {/* Video Promocional */}
            {event.video && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                  <Play className="w-5 h-5 text-purple-400" />
                  <span>Video Promocional</span>
                </h3>
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                  <iframe
                    src={getVideoEmbedUrl(event.video) || undefined}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* Información Principal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Detalles del Evento */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Detalles del Evento</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-gray-300">
                    <CalendarDays className="w-5 h-5 text-purple-400" />
                    <div>
                      <p className="font-medium">{formatDate(event.date)}</p>
                      <p className="text-sm text-gray-400">
                        {formatTime(event.time)} - {formatTime(event.endTime)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 text-gray-300">
                    <MapPin className="w-5 h-5 text-purple-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium">{event.location}</p>
                      {event.address && (
                        <p className="text-sm text-gray-400">{event.address}</p>
                      )}
                      <button
                        onClick={handleViewInMaps}
                        className="flex items-center space-x-1 text-xs text-purple-400 hover:text-purple-300 mt-1 transition-colors"
                      >
                        <Navigation className="w-3 h-3" />
                        <span>Ver en Maps</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-gray-300">
                    <Users className="w-5 h-5 text-purple-400" />
                    <div>
                      <p className="font-medium">{event.attendees}/{event.capacity} asistentes</p>
                      <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                          style={{ width: `${(event.attendees / event.capacity) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-gray-300">
                    <DollarSign className="w-5 h-5 text-purple-400" />
                    <div>
                      <p className="font-medium text-purple-400">{event.price}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Organizador */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Organizador</h3>
                
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <button
                      onClick={handleOrganizerClick}
                      className="flex items-center space-x-3 hover:bg-white/5 rounded-lg p-2 -m-2 transition-colors"
                    >
                      <img
                        src={event.organizer.avatar}
                        alt={event.organizer.name}
                        className="w-12 h-12 rounded-full ring-2 ring-purple-400/50"
                      />
                      <div>
                        <p className="font-medium text-white">{event.organizer.name}</p>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-400">{event.organizer.rating}</span>
                          {event.organizer.verified && (
                            <Badge className="bg-green-500/20 text-green-400 border-green-400/30 text-xs ml-2">
                              Verificado
                            </Badge>
                          )}
                        </div>
                      </div>
                    </button>
                  </div>

                  {/* Enlaces Sociales */}
                  {Object.keys(event.socialLinks).some(key => event.socialLinks[key]) && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-300">Enlaces:</p>
                      <div className="flex items-center space-x-2">
                        {event.socialLinks.instagram && (
                          <a 
                            href={event.socialLinks.instagram} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-pink-500/20 text-pink-400 hover:bg-pink-500/30 transition-colors"
                          >
                            <Instagram className="w-4 h-4" />
                          </a>
                        )}
                        {event.socialLinks.facebook && (
                          <a 
                            href={event.socialLinks.facebook} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                          >
                            <Facebook className="w-4 h-4" />
                          </a>
                        )}
                        {event.socialLinks.twitter && (
                          <a 
                            href={event.socialLinks.twitter} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-blue-300/20 text-blue-300 hover:bg-blue-300/30 transition-colors"
                          >
                            <Twitter className="w-4 h-4" />
                          </a>
                        )}
                        {event.socialLinks.website && (
                          <a 
                            href={event.socialLinks.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                          >
                            <Globe className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Descripción */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white">Descripción</h3>
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <p className="text-gray-300 leading-relaxed">{event.description}</p>
              </div>
            </div>

            {/* Etiquetas */}
            {event.tags && event.tags.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white">Etiquetas</h3>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="outline" className="border-purple-400/50 text-purple-300">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Estadísticas */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="flex items-center justify-center space-x-1 text-gray-400 mb-1">
                    <Eye className="w-4 h-4" />
                    <span className="text-sm">Vistas</span>
                  </div>
                  <p className="text-lg font-semibold text-white">{event.views}</p>
                </div>
                <div>
                  <div className="flex items-center justify-center space-x-1 text-gray-400 mb-1">
                    <Heart className="w-4 h-4" />
                    <span className="text-sm">Me gusta</span>
                  </div>
                  <p className="text-lg font-semibold text-white">{event.likes}</p>
                </div>
                <div>
                  <div className="flex items-center justify-center space-x-1 text-gray-400 mb-1">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">Asistentes</span>
                  </div>
                  <p className="text-lg font-semibold text-white">{event.attendees}</p>
                </div>
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
              <CyberButton 
                onClick={handleConfirmAttendance}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Ticket className="w-4 h-4 mr-2" />
                Confirmar Asistencia
              </CyberButton>
              
              <div className="flex gap-2">
                <CyberButton 
                  variant="outline" 
                  onClick={handleShare}
                  className="border-purple-400/50 hover:bg-purple-500/20"
                >
                  <Share2 className="w-4 h-4" />
                </CyberButton>
                
                <CyberButton 
                  variant="outline"
                  onClick={handleLikeEvent}
                  className={`border-purple-400/50 hover:bg-purple-500/20 transition-all duration-300 ${
                    event.isLiked ? 'bg-red-500/20 border-red-400/50' : ''
                  }`}
                >
                  <Heart className={`w-4 h-4 transition-all duration-300 ${
                    event.isLiked ? 'fill-current text-red-400 scale-110' : ''
                  }`} />
                </CyberButton>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de confirmación de asistencia */}
      <AttendanceConfirmationModal
        isOpen={showAttendanceConfirmation}
        onClose={handleAttendanceConfirmed}
      />
    </>
  );
}