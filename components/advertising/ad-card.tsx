'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ExternalLink, Volume2, VolumeX, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { Advertisement, advertisingService } from '@/lib/services/advertising.service';
import { cn } from '@/lib/utils';

interface AdCardProps {
  ad: Advertisement;
  position?: number;
  variant?: 'feed' | 'sidebar' | 'reels';
}

export function AdCard({ ad, position = 0, variant = 'feed' }: AdCardProps) {
  const router = useRouter();
  const [impressionId, setImpressionId] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
  const [videoProgress, setVideoProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const hasRecordedImpression = useRef(false);

  // Registrar impresión y autoplay de video cuando el anuncio es visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Registrar impresión solo una vez
            if (!hasRecordedImpression.current) {
              hasRecordedImpression.current = true;
              advertisingService.recordImpression(ad.id, position).then((result) => {
                if (result.impression_id) {
                  setImpressionId(result.impression_id);
                }
              }).catch(() => {
                // Ignorar errores para anuncios de demo
              });
            }
            
            // Autoplay del video cuando es visible
            if (ad.ad_type === 'video' && videoRef.current && !isPlaying) {
              videoRef.current.play().then(() => {
                setIsPlaying(true);
              }).catch((error) => {
                console.log('Autoplay bloqueado por el navegador:', error);
              });
            }
          } else {
            // Pausar video cuando sale de la vista
            if (ad.ad_type === 'video' && videoRef.current && isPlaying) {
              videoRef.current.pause();
              setIsPlaying(false);
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [ad.id, ad.ad_type, position, isPlaying]);


  // Manejar click en el anuncio
  const handleAdClick = async () => {
    const targetUrl = ad.link_url;
    
    // Registrar click (ignorar errores para anuncios de demo)
    try {
      await advertisingService.recordClick(ad.id, impressionId || undefined);
    } catch (error) {
      console.log('Click registrado localmente');
    }
    
    // Si es un link interno (empieza con /), usar el router
    if (targetUrl && targetUrl.startsWith('/')) {
      router.push(targetUrl);
    } else if (targetUrl) {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Manejar progreso del video
  const handleVideoTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setVideoProgress(progress);
    }
  };

  // Manejar fin del video
  const handleVideoEnded = () => {
    if (videoRef.current) {
      advertisingService.recordVideoView(
        ad.id,
        Math.floor(videoRef.current.currentTime),
        Math.floor(videoRef.current.duration),
        true
      );
    }
    setIsPlaying(false);
  };

  // Toggle video play/pause
  const toggleVideo = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Navegación del carrusel
  const nextSlide = () => {
    setCurrentCarouselIndex((prev) => 
      prev === ad.carousel_images.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentCarouselIndex((prev) => 
      prev === 0 ? ad.carousel_images.length - 1 : prev - 1
    );
  };

  // Renderizar contenido multimedia
  const renderMedia = () => {
    if (ad.ad_type === 'video' && ad.media_url) {
      return (
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            src={ad.media_url}
            className="w-full h-full object-cover"
            muted={isMuted}
            playsInline
            onTimeUpdate={handleVideoTimeUpdate}
            onEnded={handleVideoEnded}
            onClick={toggleVideo}
          />
          
          {/* Controles de video */}
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
            {/* Barra de progreso */}
            <div className="w-full h-1 bg-white/30 rounded-full mb-2">
              <div 
                className="h-full bg-neon-green rounded-full transition-all"
                style={{ width: `${videoProgress}%` }}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <button
                onClick={(e) => { e.stopPropagation(); toggleVideo(); }}
                className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
              >
                <Play size={16} className={cn("text-white", isPlaying && "hidden")} />
              </button>
              
              <button
                onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
                className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
              >
                {isMuted ? <VolumeX size={16} className="text-white" /> : <Volume2 size={16} className="text-white" />}
              </button>
            </div>
          </div>
          
          {/* Overlay de play */}
          {!isPlaying && (
            <div 
              className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
              onClick={toggleVideo}
            >
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Play size={32} className="text-white ml-1" />
              </div>
            </div>
          )}
        </div>
      );
    }


    if (ad.ad_type === 'carousel' && ad.carousel_images.length > 0) {
      return (
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
          <img
            src={ad.carousel_images[currentCarouselIndex]}
            alt={`${ad.title || 'Anuncio'} - Imagen ${currentCarouselIndex + 1}`}
            className="w-full h-full object-cover"
          />
          
          {/* Controles del carrusel */}
          {ad.carousel_images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
              >
                <ChevronLeft size={20} className="text-white" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
              >
                <ChevronRight size={20} className="text-white" />
              </button>
              
              {/* Indicadores */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2">
                {ad.carousel_images.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => { e.stopPropagation(); setCurrentCarouselIndex(index); }}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all",
                      index === currentCarouselIndex ? "bg-white w-4" : "bg-white/50"
                    )}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      );
    }

    // Imagen por defecto
    if (ad.media_url) {
      return (
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
          <img
            src={ad.media_url}
            alt={ad.title || 'Imagen del anuncio'}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      );
    }

    return null;
  };

  return (
    <div
      ref={cardRef}
      className={cn(
        "glass-card overflow-hidden transition-all duration-300 hover:border-neon-green/30",
        variant === 'feed' && "p-4",
        variant === 'sidebar' && "p-3",
        variant === 'reels' && "p-2"
      )}
    >
      {/* Badge de publicidad */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-gray-400 bg-white/10 px-2 py-1 rounded-full">
          Publicidad
        </span>
      </div>

      {/* Header del anunciante */}
      <div className="flex items-center space-x-3 mb-3">
        {ad.advertiser_logo_url ? (
          <img
            src={ad.advertiser_logo_url}
            alt={ad.advertiser_name || 'Logo del anunciante'}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-neon-green/30"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-green to-neon-blue flex items-center justify-center">
            <span className="text-white font-bold text-sm">
              {ad.advertiser_name?.charAt(0)?.toUpperCase() || 'A'}
            </span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h4 className="text-white font-medium truncate">{ad.advertiser_name || 'Anunciante'}</h4>
          <p className="text-gray-400 text-xs">Patrocinado</p>
        </div>
      </div>

      {/* Título y descripción */}
      <div className="mb-3">
        <h3 className="text-white font-semibold mb-1 line-clamp-2">{ad.title || 'Anuncio'}</h3>
        {ad.description && (
          <p className="text-gray-300 text-sm line-clamp-2">{ad.description}</p>
        )}
      </div>

      {/* Contenido multimedia */}
      <div className="mb-3 cursor-pointer" onClick={handleAdClick}>
        {renderMedia()}
      </div>

      {/* Botón CTA */}
      {ad.link_url && (
        <button
          onClick={handleAdClick}
          className="w-full py-2.5 px-4 bg-gradient-to-r from-neon-green to-neon-blue text-black font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
        >
          <span>{ad.call_to_action || 'Ver más'}</span>
          <ExternalLink size={16} />
        </button>
      )}
    </div>
  );
}
