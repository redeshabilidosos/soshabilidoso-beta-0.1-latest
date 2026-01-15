'use client';

import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

interface MediaItem {
  type: string;
  url: string;
  thumbnail: string;
}

interface MediaSliderProps {
  media: MediaItem[];
}

export function MediaSlider({ media }: MediaSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));
    setIsPlaying(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1));
    setIsPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsPlaying(false);
  };

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

  const currentMedia = media[currentIndex];

  return (
    <div className="relative h-64 bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
      {/* Media Content */}
      <div className="w-full h-full">
        {currentMedia.type === 'video' ? (
          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              src={currentMedia.url}
              poster={currentMedia.thumbnail}
              className="w-full h-full object-cover"
              onEnded={() => setIsPlaying(false)}
            />
            {/* Play/Pause overlay */}
            <button
              onClick={toggleVideo}
              className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors group"
            >
              <div className="w-16 h-16 rounded-full bg-neon-green/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                {isPlaying ? (
                  <Pause className="w-8 h-8 text-black" />
                ) : (
                  <Play className="w-8 h-8 text-black ml-1" />
                )}
              </div>
            </button>
          </div>
        ) : (
          <img
            src={currentMedia.url}
            alt={`Slide ${currentIndex + 1}`}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Navigation Arrows */}
      {media.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-colors z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-colors z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Thumbnails / Dots */}
      {media.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center space-x-2 z-10">
          {media.map((item, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 ${
                index === currentIndex
                  ? 'w-8 h-2 bg-neon-green rounded-full'
                  : 'w-2 h-2 bg-white/50 hover:bg-white/80 rounded-full'
              }`}
            />
          ))}
        </div>
      )}

      {/* Media type indicator */}
      {currentMedia.type === 'video' && (
        <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 rounded-md text-white text-xs flex items-center z-10">
          <Play className="w-3 h-3 mr-1" />
          Video
        </div>
      )}

      {/* Counter */}
      <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 rounded-md text-white text-xs z-10">
        {currentIndex + 1} / {media.length}
      </div>
    </div>
  );
}
