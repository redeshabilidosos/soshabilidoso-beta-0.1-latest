'use client';

import { memo, useState } from 'react';
import { MessageCircle, Share } from 'lucide-react';
import { Post } from '@/types/user';
import { SharePostDialog } from '../share-post-dialog';
import { toast } from 'sonner';
import { useAuth } from '@/components/providers/providers';

interface PostActionsProps {
  post: Post;
  onPostUpdated: (updatedPost: Post) => void;
  onToggleComments?: () => void;
}

// Componente de botón de reacción con emoji
const EmojiReactionButton = memo(function EmojiReactionButton({
  emoji,
  count,
  active,
  onClick,
  label,
}: {
  emoji: string;
  count: number;
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-all duration-200 ${
        active
          ? 'text-neon-green'
          : 'text-gray-400 hover:text-white'
      }`}
      aria-label={label}
      title={label}
    >
      <span className={`text-xl transition-all duration-300 inline-block ${active ? 'animate-reaction-pop' : ''}`}>
        {emoji}
      </span>
      <span className="text-sm font-medium">{count > 0 ? count : ''}</span>
    </button>
  );
});

export const PostActions = memo(function PostActions({ 
  post, 
  onPostUpdated,
  onToggleComments 
}: PostActionsProps) {
  const { user: currentUser } = useAuth();
  const [reactions, setReactions] = useState({
    likes: post.likes,
    laughs: post.laughs || 0,
    dislikes: post.dislikes || 0,
  });
  const [userReaction, setUserReaction] = useState<string | null>(post.userReaction || null);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  const handleReaction = async (type: 'like' | 'laugh' | 'dislike') => {
    if (!currentUser) {
      toast.error('Debes iniciar sesión para reaccionar.');
      return;
    }

    const previousReaction = userReaction;
    const previousReactions = { ...reactions };
    
    const isRemovingReaction = userReaction === type;
    const newUserReaction = isRemovingReaction ? null : type;

    // Actualizar UI optimísticamente
    if (isRemovingReaction) {
      setUserReaction(null);
      setReactions(prev => {
        const key = type === 'like' ? 'likes' : type === 'laugh' ? 'laughs' : 'dislikes';
        return { ...prev, [key]: Math.max(0, prev[key] - 1) };
      });
    } else {
      setReactions(prev => {
        const newReactions = { ...prev };
        if (previousReaction) {
          const oldKey = previousReaction === 'like' ? 'likes' : 
                        previousReaction === 'laugh' ? 'laughs' : 'dislikes';
          newReactions[oldKey] = Math.max(0, newReactions[oldKey] - 1);
        }
        const newKey = type === 'like' ? 'likes' : 
                      type === 'laugh' ? 'laughs' : 'dislikes';
        newReactions[newKey] = newReactions[newKey] + 1;
        return newReactions;
      });
      setUserReaction(type);
    }

    try {
      const { postsService } = await import('@/lib/services/posts.service');
      const response = await postsService.reactToPost(post.id, type);
      
      if (response && response.counts) {
        setReactions({
          likes: response.counts.likes_count ?? 0,
          laughs: response.counts.laughs_count ?? 0,
          dislikes: response.counts.dislikes_count ?? 0,
        });
      }
      
      setUserReaction(response.message === 'Reacción eliminada' ? null : type);

      onPostUpdated({
        ...post,
        likes: response.counts?.likes_count ?? reactions.likes,
        laughs: response.counts?.laughs_count ?? reactions.laughs,
        dislikes: response.counts?.dislikes_count ?? reactions.dislikes,
        userReaction: response.message === 'Reacción eliminada' ? null : type,
      });
    } catch (error) {
      console.error('Error al enviar reacción:', error);
      setReactions(previousReactions);
      setUserReaction(previousReaction);
      toast.error('Error al procesar la reacción');
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsShareDialogOpen(true);
  };

  return (
    <>
      <div className="flex items-center justify-between pt-2 border-t border-white/10">
        <div className="flex items-center gap-1">
          <EmojiReactionButton
            emoji="❤️"
            count={reactions.likes}
            active={userReaction === 'like'}
            onClick={() => handleReaction('like')}
            label="Me gusta"
          />
          
          <EmojiReactionButton
            emoji="😂"
            count={reactions.laughs}
            active={userReaction === 'laugh'}
            onClick={() => handleReaction('laugh')}
            label="Jajaja"
          />
          
          <EmojiReactionButton
            emoji="👎"
            count={reactions.dislikes}
            active={userReaction === 'dislike'}
            onClick={() => handleReaction('dislike')}
            label="No me gusta"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={(e: React.MouseEvent) => { 
              e.stopPropagation(); 
              onToggleComments?.();
            }}
            className="flex items-center gap-1.5 px-2 py-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
          >
            <MessageCircle size={18} />
            <span className="text-sm">{post.commentsCount || 0}</span>
          </button>
          
          <button 
            onClick={handleShare}
            className="flex items-center gap-1.5 px-2 py-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
          >
            <Share size={18} />
            <span className="text-sm hidden sm:inline">Compartir</span>
          </button>
        </div>
      </div>

      <SharePostDialog 
        isOpen={isShareDialogOpen} 
        onClose={() => setIsShareDialogOpen(false)} 
        postUrl={`${typeof window !== 'undefined' ? window.location.origin : ''}/feed/${post.id}`}
      />
    </>
  );
});
