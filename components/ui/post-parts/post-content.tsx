'use client';

import { memo } from 'react';
import { Post } from '@/types/user';
import Image from 'next/image';
import { Zap, Mic, Radio } from 'lucide-react';

interface PostContentProps {
  post: Post;
}

export const PostContent = memo(function PostContent({ post }: PostContentProps) {
  return (
    <div className="space-y-3 overflow-hidden">
      <p className="text-white leading-relaxed line-clamp-3">{post.content}</p>
      
      {/* Images con Next/Image optimizado */}
      {post.images && post.images.length > 0 && (
        <div className={`grid gap-2 rounded-xl overflow-hidden ${
          post.images.length === 1 ? 'grid-cols-1' : 
          post.images.length === 2 ? 'grid-cols-2' : 
          'grid-cols-2'
        }`}>
          {post.images.map((image, index) => (
            <div 
              key={index} 
              className={`relative overflow-hidden h-64 ${
                post.images!.length === 3 && index === 0 ? 'col-span-2' : ''
              }`}
            >
              <Image
                src={image}
                alt={`Post image ${index + 1}`}
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                loading="lazy"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
              />
              {post.type === 'highlight' && index === 0 && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center pb-4">
                  <div className="flex items-center space-x-2 text-white">
                    <Zap className="text-yellow-400" size={20} />
                    <span className="font-medium">Momento Destacado</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Video */}
      {post.video && (
        <div className="relative rounded-xl overflow-hidden aspect-video bg-black flex items-center justify-center">
          <video
            src={post.video}
            controls
            preload="metadata"
            className="w-full h-full object-contain"
            playsInline
          />
        </div>
      )}

      {/* Podcast */}
      {post.podcastUrl && (
        <div className="relative rounded-xl overflow-hidden bg-white/5 p-4 flex items-center space-x-4">
          <Mic size={48} className="text-purple-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-white font-medium mb-2">Escucha nuestro podcast:</p>
            <audio controls src={post.podcastUrl} className="w-full">
              Tu navegador no soporta el elemento de audio.
            </audio>
          </div>
        </div>
      )}

      {/* Streaming */}
      {post.streamingUrl && (
        <div className="relative rounded-xl overflow-hidden aspect-video bg-red-500/10 flex flex-col items-center justify-center p-4 text-center">
          <Radio size={48} className="text-red-400 mb-2" />
          <p className="text-white font-medium mb-1">¡Transmisión en vivo!</p>
          <p className="text-gray-400 text-sm">
            Haz clic para ver el streaming en:{' '}
            <a 
              href={post.streamingUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-neon-blue hover:underline truncate"
              onClick={(e) => e.stopPropagation()}
            >
              {post.streamingUrl}
            </a>
          </p>
        </div>
      )}
    </div>
  );
});
