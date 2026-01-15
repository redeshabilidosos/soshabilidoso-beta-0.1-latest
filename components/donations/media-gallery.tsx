'use client';

import { useState, useRef } from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, X, Expand } from 'lucide-react';

interface MediaItem {
  type: string;
  url: string;
  thumbnail: string;
}

interface MediaGalleryProps {
  media: MediaItem[];
}

export function MediaGallery({ media }: MediaGalleryProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);
  const [fullscreenMedia, setFullscreenMedia] = useState<number | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const toggleVideo = (index: number) => {
    const video = videoRefs.current[index];
    if (video) {
      if (playingVideo === index) {
        video.pause();
        setPlayingVideo(null);
      } else {
        // Pausar cualquier otro video
        videoRefs.current.forEach((v, i) => {
          if (v && i !== index) v.pause();
        });
        video.play();
        setPlayingVideo(index);
      }
    }
  };

  const openFullscreen = (index: number) => {
    setFullscreenMedia(index);
    // Pausar videos cuando se abre fullscreen
    if (playingVideo !== null) {
      videoRefs.current[playingVideo]?.pause();
      setPlayingVideo(null);
    }
  };

  const closeFullscreen = () => {
    setFullscreenMedia(null);
  };

  if (!media || media.length === 0) {
    return null;
  }

  return (
    <>
      <div className="relative group">
        {/* Botones de navegación - solo en desktop */}
        {media.length > 2 && (
          <>
            <button
              onClick={() => scroll('left')}
              className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/70 hover:bg-black/90 rounded-full items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100 -translate-x-1/2"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/70 hover:bg-black/90 rounded-full items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100 translate-x-1/2"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Contenedor con scroll horizontal */}
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {media.map((item, index) => (
            <div
              key={index}
              className="flex-shrink-0 snap-center first:pl-0 last:pr-0"
            >
              <div className="relative w-72 h-72 md:w-80 md:h-80 rounded-xl overflow-hidden bg-gray-800 group/item">
                {item.type === 'video' ? (
                  <>
                    <video
                      ref={(el) => { videoRefs.current[index] = el; }}
                      src={item.url}
                      poster={item.thumbnail}
                      className="w-full h-full object-cover"
                      loop
                      playsInline
                      onClick={() => toggleVideo(index)}
                      onEnded={() => setPlayingVideo(null)}
                    />
                    {/* Overlay de play/pause */}
                    <div
                      className={`absolute inset-0 flex items-center justify-center transition-opacity ${
                        playingVideo === index ? 'opacity-0 hover:opacity-100' : 'opacity-100'
                      }`}
                      onClick={() => toggleVideo(index)}
                    >
                      <div className="w-16 h-16 bg-black/60 hover:bg-neon-green/80 rounded-full flex items-center justify-center transition-all cursor-pointer">
                        {playingVideo === index ? (
                          <Pause className="w-8 h-8 text-white" />
                        ) : (
                          <Play className="w-8 h-8 text-white ml-1" />
                        )}
                      </div>
                    </div>
                    {/* Badge de video */}
                    <div className="absolute top-3 left-3 px-2 py-1 bg-black/70 rounded-md text-white text-xs flex items-center">
                      <Play className="w-3 h-3 mr-1" />
                      Video
                    </div>
                  </>
                ) : (
                  <img
                    src={item.url}
                    alt={`Media ${index + 1}`}
                    className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                    onClick={() => openFullscreen(index)}
                  />
                )}

                {/* Botón expandir */}
                <button
                  onClick={() => openFullscreen(index)}
                  className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-black/80 rounded-full text-white opacity-0 group-hover/item:opacity-100 transition-opacity"
                >
                  <Expand size={16} />
                </button>

                {/* Indicador de posición */}
                <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/70 rounded-md text-white text-xs">
                  {index + 1} / {media.length}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Indicadores de scroll (dots) - solo móvil */}
        {media.length > 1 && (
          <div className="flex justify-center gap-1.5 mt-3 md:hidden">
            {media.map((_, index) => (
              <div
                key={index}
                className="w-2 h-2 rounded-full bg-white/30"
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal Fullscreen */}
      {fullscreenMedia !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeFullscreen}
        >
          <button
            onClick={closeFullscreen}
            className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
          >
            <X size={24} />
          </button>

          {/* Navegación en fullscreen */}
          {media.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFullscreenMedia((prev) =>
                    prev !== null ? (prev === 0 ? media.length - 1 : prev - 1) : 0
                  );
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFullscreenMedia((prev) =>
                    prev !== null ? (prev === media.length - 1 ? 0 : prev + 1) : 0
                  );
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* Contenido fullscreen */}
          <div
            className="max-w-4xl max-h-[90vh] w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {media[fullscreenMedia].type === 'video' ? (
              <video
                src={media[fullscreenMedia].url}
                poster={media[fullscreenMedia].thumbnail}
                className="w-full h-full max-h-[90vh] object-contain rounded-lg"
                controls
                autoPlay
              />
            ) : (
              <img
                src={media[fullscreenMedia].url}
                alt={`Media ${fullscreenMedia + 1}`}
                className="w-full h-full max-h-[90vh] object-contain rounded-lg"
              />
            )}
          </div>

          {/* Contador */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/70 rounded-full text-white text-sm">
            {fullscreenMedia + 1} / {media.length}
          </div>
        </div>
      )}
    </>
  );
}
