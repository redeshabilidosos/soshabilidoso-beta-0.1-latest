'use client';

import { memo, useState, useRef } from 'react';
import { Post, Comment } from '@/types/user';
import { useAuth } from '@/components/providers/providers';
import { CyberButton } from '../cyber-button';
import { EmojiPickerButton } from '../emoji-picker-button';
import { toast } from 'sonner';
import Image from 'next/image';

interface PostCommentsProps {
  post: Post;
  onPostUpdated: (updatedPost: Post) => void;
  showComments?: boolean;
}

export const PostComments = memo(function PostComments({ 
  post, 
  onPostUpdated,
  showComments = false 
}: PostCommentsProps) {
  const { user: currentUser } = useAuth();
  const [newCommentContent, setNewCommentContent] = useState('');
  const [postComments, setPostComments] = useState<Comment[]>(post.comments || []);
  const [commentReactions, setCommentReactions] = useState<Record<string, { 
    likes: number;
    laughs: number;
    dislikes: number;
    userReaction: string | null;
  }>>({});
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddComment = async () => {
    if (!currentUser) {
      toast.error('Debes iniciar sesión para comentar.');
      return;
    }
    
    if (!newCommentContent.trim()) {
      return;
    }

    const comment: Comment = {
      id: Date.now().toString(),
      userId: currentUser.id,
      user: {
        id: currentUser.id,
        username: currentUser.username,
        displayName: currentUser.displayName,
        avatar: currentUser.avatar,
        email: currentUser.email,
        followers: currentUser.followers || 0,
        following: currentUser.following || 0,
        posts: currentUser.posts || 0,
        createdAt: currentUser.createdAt || new Date().toISOString(),
      },
      content: newCommentContent.trim(),
      likes: 0,
      createdAt: new Date().toISOString(),
    };
    
    const updatedComments = [comment, ...postComments];
    setPostComments(updatedComments);
    setNewCommentContent('');
    toast.success('Comentario añadido!');

    onPostUpdated({
      ...post,
      comments: updatedComments,
      commentsCount: (post.commentsCount || 0) + 1,
    });
  };

  const handleEmojiSelect = (emoji: string) => {
    const input = inputRef.current;
    if (!input) return;

    const start = input.selectionStart || 0;
    const end = input.selectionEnd || 0;
    const text = newCommentContent;
    const newText = text.substring(0, start) + emoji + text.substring(end);
    
    setNewCommentContent(newText);
    
    // Restaurar el foco y la posición del cursor
    setTimeout(() => {
      input.focus();
      const newPosition = start + emoji.length;
      input.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const handleCommentReaction = async (commentId: string, type: 'like' | 'laugh' | 'dislike') => {
    if (!currentUser) {
      toast.error('Debes iniciar sesión para reaccionar.');
      return;
    }

    const currentState = commentReactions[commentId] || { 
      likes: 0, 
      laughs: 0, 
      dislikes: 0, 
      userReaction: null 
    };
    
    const isRemovingReaction = currentState.userReaction === type;
    const newUserReaction = isRemovingReaction ? null : type;
    
    // Calcular nuevos contadores
    let newState = { ...currentState };
    
    if (isRemovingReaction) {
      // Quitar la reacción actual
      const key = type === 'like' ? 'likes' : type === 'laugh' ? 'laughs' : 'dislikes';
      newState[key] = Math.max(0, newState[key] - 1);
      newState.userReaction = null;
    } else {
      // Si había una reacción anterior diferente, quitarla
      if (currentState.userReaction) {
        const oldKey = currentState.userReaction === 'like' ? 'likes' : 
                      currentState.userReaction === 'laugh' ? 'laughs' : 'dislikes';
        newState[oldKey] = Math.max(0, newState[oldKey] - 1);
      }
      
      // Agregar la nueva reacción
      const newKey = type === 'like' ? 'likes' : type === 'laugh' ? 'laughs' : 'dislikes';
      newState[newKey] = newState[newKey] + 1;
      newState.userReaction = type;
    }

    setCommentReactions(prev => ({
      ...prev,
      [commentId]: newState
    }));

    try {
      const { postsService } = await import('@/lib/services/posts.service');
      // El backend solo soporta like/unlike para comentarios
      if (type === 'like') {
        if (isRemovingReaction) {
          await postsService.unlikeComment(commentId);
        } else {
          await postsService.likeComment(commentId);
        }
      }
      // Las reacciones laugh y dislike solo se manejan en el frontend por ahora
    } catch (error) {
      console.error('Error al reaccionar al comentario:', error);
      // Revertir en caso de error
      setCommentReactions(prev => ({
        ...prev,
        [commentId]: currentState
      }));
      toast.error('Error al procesar la reacción');
    }
  };

  const formatTimeAgo = (dateString: string | undefined | null) => {
    if (!dateString) return 'Hace un momento';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Hace un momento';
      
      const now = new Date();
      const diffInMs = now.getTime() - date.getTime();
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
      
      if (diffInMinutes < 1) return 'Ahora';
      if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`;
      if (diffInHours < 24) return `Hace ${diffInHours}h`;
      if (diffInDays < 7) return `Hace ${diffInDays}d`;
      
      return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    } catch {
      return 'Hace un momento';
    }
  };

  if (!showComments) return null;

  return (
    <div className="space-y-4 pt-4 border-t border-white/10 overflow-hidden">
      {/* Add Comment */}
      <div className="flex space-x-3">
        <div className="relative w-8 h-8 flex-shrink-0">
          <Image
            src={currentUser?.avatar || '/logo.png'}
            alt="Avatar"
            fill
            className="rounded-full ring-2 ring-neon-green/30 object-cover"
            sizes="32px"
          />
        </div>
        <div className="flex-1 flex flex-col space-y-2">
          <div className="flex space-x-2">
            <input
              ref={inputRef}
              type="text"
              value={newCommentContent}
              onChange={(e) => setNewCommentContent(e.target.value)}
              placeholder="Escribe un comentario..."
              className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-green/50"
              onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
              disabled={!currentUser}
            />
            <EmojiPickerButton onEmojiSelect={handleEmojiSelect} />
            <CyberButton 
              size="sm" 
              onClick={handleAddComment} 
              disabled={!newCommentContent.trim() || !currentUser}
            >
              Enviar
            </CyberButton>
          </div>
          {!currentUser && (
            <p className="text-xs text-gray-400">
              Debes iniciar sesión para comentar
            </p>
          )}
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-3 overflow-hidden scrollbar-hide max-h-96 overflow-y-auto">
        {postComments.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-4">
            Sé el primero en comentar esta publicación.
          </p>
        ) : (
          postComments.map((comment) => {
            const reactionState = commentReactions[comment.id] || { 
              likes: comment.likes || 0, 
              laughs: 0,
              dislikes: 0,
              userReaction: null 
            };
            const isReply = !!comment.parentId;
            
            return (
              <div 
                key={comment.id} 
                className={`${isReply ? 'ml-8 pl-3 border-l-2 border-neon-green/30' : ''}`}
              >
                <div className="flex space-x-3">
                  <div className={`relative ${isReply ? 'w-6 h-6' : 'w-8 h-8'} flex-shrink-0`}>
                    <Image
                      src={comment.user?.avatar || '/logo.png'}
                      alt={comment.user?.displayName || 'Usuario'}
                      fill
                      className="rounded-full ring-2 ring-neon-green/30 object-cover"
                      sizes={isReply ? '24px' : '32px'}
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className={`bg-white/5 rounded-lg p-3 ${isReply ? 'bg-neon-green/5' : ''}`}>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-white text-sm truncate">
                          {comment.user?.displayName || 'Usuario'}
                        </span>
                        <span className="text-gray-400 text-xs truncate">
                          @{comment.user?.username || 'usuario'}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm break-words">{comment.content}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-2 text-xs text-gray-400">
                      <span>{formatTimeAgo(comment.createdAt)}</span>
                      
                      <button 
                        onClick={(e: React.MouseEvent) => { 
                          e.stopPropagation(); 
                          handleCommentReaction(comment.id, 'like'); 
                        }}
                        className={`flex items-center gap-1 px-2 py-1 rounded transition-all duration-200 ${
                          reactionState.userReaction === 'like'
                            ? 'text-neon-green'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        <span className={`text-sm transition-all duration-300 inline-block ${
                          reactionState.userReaction === 'like' ? 'animate-reaction-pop' : ''
                        }`}>
                          ❤️
                        </span>
                        {reactionState.likes > 0 && (
                          <span className="text-xs">{reactionState.likes}</span>
                        )}
                      </button>
                      
                      <button 
                        onClick={(e: React.MouseEvent) => { 
                          e.stopPropagation(); 
                          handleCommentReaction(comment.id, 'laugh'); 
                        }}
                        className={`flex items-center gap-1 px-2 py-1 rounded transition-all duration-200 ${
                          reactionState.userReaction === 'laugh'
                            ? 'text-neon-green'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        <span className={`text-sm transition-all duration-300 inline-block ${
                          reactionState.userReaction === 'laugh' ? 'animate-reaction-pop' : ''
                        }`}>
                          😂
                        </span>
                        {reactionState.laughs > 0 && (
                          <span className="text-xs">{reactionState.laughs}</span>
                        )}
                      </button>
                      
                      <button 
                        onClick={(e: React.MouseEvent) => { 
                          e.stopPropagation(); 
                          handleCommentReaction(comment.id, 'dislike'); 
                        }}
                        className={`flex items-center gap-1 px-2 py-1 rounded transition-all duration-200 ${
                          reactionState.userReaction === 'dislike'
                            ? 'text-neon-green'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        <span className={`text-sm transition-all duration-300 inline-block ${
                          reactionState.userReaction === 'dislike' ? 'animate-reaction-pop' : ''
                        }`}>
                          👎
                        </span>
                        {reactionState.dislikes > 0 && (
                          <span className="text-xs">{reactionState.dislikes}</span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
});
