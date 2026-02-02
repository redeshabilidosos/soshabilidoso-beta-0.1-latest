'use client';

import { useState, useEffect, useRef } from 'react';
import { ReelCard } from './reel-card';
import { cn } from '@/lib/utils';

interface Reel {
  id: string;
  videoUrl: string;
  thumbnail: string;
  title: string;
  description: string;
  user: {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
    isVerified: boolean;
    isFollowing?: boolean;
  };
  likes: number;
  comments: number;
  shares: number;
  views: number;
  isLiked: boolean;
  createdAt: string;
  tags: string[];
}

interface ReelsViewerProps {
  reels: Reel[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  onLike: (reelId: string) => void;
  onComment: (reelId: string) => void;
  onShare: (reel: Reel) => void;
  onFollow: (userId: string) => void;
  onView?: (reelId: string) => void;
}

export function ReelsViewer({
  reels,
  currentIndex,
  onIndexChange,
  onLike,
  onComment,
  onShare,
  onFollow,
  onView
}: ReelsViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  // Handle scroll to change reels
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (isScrolling) return;

      const scrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;
      const newIndex = Math.round(scrollTop / containerHeight);
      
      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < reels.length) {
        onIndexChange(newIndex);
      }

      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Set new timeout to snap to position
      scrollTimeoutRef.current = setTimeout(() => {
        const targetScrollTop = newIndex * containerHeight;
        if (Math.abs(scrollTop - targetScrollTop) > 10) {
          setIsScrolling(true);
          container.scrollTo({
            top: targetScrollTop,
            behavior: 'smooth'
          });
          setTimeout(() => setIsScrolling(false), 300);
        }
      }, 150);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [currentIndex, onIndexChange, reels.length, isScrolling]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' && currentIndex > 0) {
        e.preventDefault();
        const newIndex = currentIndex - 1;
        onIndexChange(newIndex);
        scrollToIndex(newIndex);
      } else if (e.key === 'ArrowDown' && currentIndex < reels.length - 1) {
        e.preventDefault();
        const newIndex = currentIndex + 1;
        onIndexChange(newIndex);
        scrollToIndex(newIndex);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, onIndexChange, reels.length]);

  const scrollToIndex = (index: number) => {
    const container = containerRef.current;
    if (!container) return;

    setIsScrolling(true);
    const targetScrollTop = index * container.clientHeight;
    container.scrollTo({
      top: targetScrollTop,
      behavior: 'smooth'
    });
    setTimeout(() => setIsScrolling(false), 300);
  };

  // Touch handling for mobile swipe
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isUpSwipe = distance > 50;
    const isDownSwipe = distance < -50;

    if (isUpSwipe && currentIndex < reels.length - 1) {
      const newIndex = currentIndex + 1;
      onIndexChange(newIndex);
      scrollToIndex(newIndex);
    }

    if (isDownSwipe && currentIndex > 0) {
      const newIndex = currentIndex - 1;
      onIndexChange(newIndex);
      scrollToIndex(newIndex);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Reels Container */}
      <div
        ref={containerRef}
        className="h-full w-full overflow-y-auto snap-y snap-mandatory scrollbar-hide"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {reels.map((reel, index) => (
          <div
            key={reel.id}
            className="w-full h-screen snap-start snap-always flex-shrink-0 flex items-center justify-center"
          >
            <ReelCard
              reel={reel}
              isActive={index === currentIndex}
              onLike={() => onLike(reel.id)}
              onComment={() => onComment(reel.id)}
              onShare={() => onShare(reel)}
              onFollow={() => onFollow(reel.user.id)}
              onView={onView ? () => onView(reel.id) : undefined}
            />
          </div>
        ))}
      </div>

      {/* Progress Indicators */}
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col space-y-2 z-20">
        {reels.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              onIndexChange(index);
              scrollToIndex(index);
            }}
            className={cn(
              "w-1 h-8 rounded-full transition-all duration-300",
              index === currentIndex 
                ? "bg-neon-green shadow-neon-green" 
                : "bg-white/30 hover:bg-white/50"
            )}
          />
        ))}
      </div>

      {/* Navigation Hints (Desktop) */}
      <div className="hidden lg:block absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 text-sm">
        <div className="flex flex-col items-center space-y-2">
          <div className="text-xs">↑ ↓</div>
          <div className="text-xs">Navegar</div>
        </div>
      </div>

      {/* Swipe Hint (Mobile) */}
      <div className="lg:hidden absolute bottom-32 left-1/2 transform -translate-x-1/2 text-white/60 text-xs text-center z-10">
        <div className="bg-black/60 backdrop-blur-sm px-3 py-2 rounded-full border border-white/20">
          Desliza para ver más
        </div>
      </div>
    </div>
  );
}