'use client';

import { useState } from 'react';
import { CyberButton } from '@/components/ui/cyber-button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  ThumbsUp, 
  Laugh, 
  Angry, 
  Sad,
  MessageSquare,
  Share,
  Bookmark
} from 'lucide-react';

interface CommunityPostReactionsProps {
  post: {
    id: string;
    reactions: {
      like: number;
      love: number;
      laugh: number;
      angry: number;
      sad: number;
    };
    comments: number;
    shares: number;
    userReaction?: string;
  };
  onReact: (postId: string, reaction: string) => void;
  onComment: (postId: string) => void;
  onShare: (postId: string) => void;
  onBookmark: (postId: string) => void;
}

const reactionTypes = [
  { type: 'like', icon: ThumbsUp, color: 'text-blue-400', label: 'Me gusta' },
  { type: 'love', icon: Heart, color: 'text-red-400', label: 'Me encanta' },
  { type: 'laugh', icon: Laugh, color: 'text-yellow-400', label: 'Me divierte' },
  { type: 'angry', icon: Angry, color: 'text-red-500', label: 'Me enoja' },
  { type: 'sad', icon: Sad, color: 'text-gray-400', label: 'Me entristece' }
];

export function CommunityPostReactions({
  post,
  onReact,
  onComment,
  onShare,
  onBookmark
}: CommunityPostReactionsProps) {
  const [showReactions, setShowReactions] = useState(false);

  const totalReactions = Object.values(post.reactions).reduce((sum, count) => sum + count, 0);
  const userReactionType = reactionTypes.find(r => r.type === post.userReaction);

  const handleReactionClick = (reactionType: string) => {
    onReact(post.id, reactionType);
    setShowReactions(false);
  };

  return (
    <div className="space-y-3">
      {/* Reaction counts */}
      {totalReactions > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-400 px-1">
          <div className="flex items-center space-x-2">
            <div className="flex -space-x-1">
              {reactionTypes.map((reaction) => {
                const count = post.reactions[reaction.type as keyof typeof post.reactions];
                if (count === 0) return null;
                
                return (
                  <div
                    key={reaction.type}
                    className={`w-5 h-5 rounded-full bg-gray-800 border border-gray-600 flex items-center justify-center ${reaction.color}`}
                  >
                    <reaction.icon className="w-3 h-3" />
                  </div>
                );
              })}
            </div>
            <span>{totalReactions} reacciones</span>
          </div>
          
          <div className="flex items-center space-x-4">
            {post.comments > 0 && (
              <span>{post.comments} comentarios</span>
            )}
            {post.shares > 0 && (
              <span>{post.shares} compartidos</span>
            )}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex items-center justify-between border-t border-white/10 pt-3">
        <div className="flex items-center space-x-1">
          {/* Main reaction button */}
          <div className="relative">
            <CyberButton
              variant="ghost"
              size="sm"
              className={`flex items-center space-x-2 ${
                post.userReaction 
                  ? `${userReactionType?.color} hover:bg-white/10` 
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
              onClick={() => setShowReactions(!showReactions)}
              onMouseEnter={() => setShowReactions(true)}
              onMouseLeave={() => setTimeout(() => setShowReactions(false), 300)}
            >
              {userReactionType ? (
                <userReactionType.icon className="w-4 h-4" />
              ) : (
                <ThumbsUp className="w-4 h-4" />
              )}
              <span className="text-sm">
                {userReactionType?.label || 'Reaccionar'}
              </span>
            </CyberButton>

            {/* Reaction picker */}
            {showReactions && (
              <div 
                className="absolute bottom-full left-0 mb-2 bg-gray-900 border border-white/20 rounded-lg p-2 flex space-x-1 z-10"
                onMouseEnter={() => setShowReactions(true)}
                onMouseLeave={() => setShowReactions(false)}
              >
                {reactionTypes.map((reaction) => (
                  <button
                    key={reaction.type}
                    onClick={() => handleReactionClick(reaction.type)}
                    className={`p-2 rounded-lg hover:bg-white/10 transition-colors ${reaction.color}`}
                    title={reaction.label}
                  >
                    <reaction.icon className="w-5 h-5" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Comment button */}
          <CyberButton
            variant="ghost"
            size="sm"
            className="flex items-center space-x-2 text-gray-400 hover:text-white hover:bg-white/10"
            onClick={() => onComment(post.id)}
          >
            <MessageSquare className="w-4 h-4" />
            <span className="text-sm">Comentar</span>
          </CyberButton>

          {/* Share button */}
          <CyberButton
            variant="ghost"
            size="sm"
            className="flex items-center space-x-2 text-gray-400 hover:text-white hover:bg-white/10"
            onClick={() => onShare(post.id)}
          >
            <Share className="w-4 h-4" />
            <span className="text-sm">Compartir</span>
          </CyberButton>
        </div>

        {/* Bookmark button */}
        <CyberButton
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-white hover:bg-white/10"
          onClick={() => onBookmark(post.id)}
        >
          <Bookmark className="w-4 h-4" />
        </CyberButton>
      </div>
    </div>
  );
}