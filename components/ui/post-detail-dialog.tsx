'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { CyberButton } from '@/components/ui/cyber-button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Heart, MessageCircle, Share, Trophy, X, User as UserIcon, Play, Mic, Radio, Laugh, ThumbsDown, Zap } from 'lucide-react';
import { Post, Comment } from '@/types/user';
import { useAuth } from '@/components/providers/providers';
import { SharePostDialog } from './share-post-dialog';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { UserProfileDialog } from './user-profile-dialog'; // Importar el nuevo componente
import { ConfirmDialog } from './confirm-dialog'; // Importar el diálogo de confirmación
import { EmojiPickerButton } from '@/components/ui/emoji-picker-button';

// Componente de botón de reacción con emoji
const EmojiReactionButton = React.memo(function EmojiReactionButton({
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

interface PostDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post;
  onPostUpdated: (updatedPost: Post) => void; // Nueva prop para notificar al padre
}

export function PostDetailDialog({ isOpen, onClose, post, onPostUpdated }: PostDetailDialogProps) {
  const { user: currentUser } = useAuth();
  const [newCommentContent, setNewCommentContent] = useState('');
  const [postComments, setPostComments] = useState<Comment[]>(post.comments || []);
  const [reactions, setReactions] = useState({
    likes: post.likes,
    laughs: post.laughs || 0,
    dislikes: post.dislikes || 0,
  });
  const [userReaction, setUserReaction] = useState<string | null>(null); // Simulate user's current reaction
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isUserProfileDialogOpen, setIsUserProfileDialogOpen] = useState(false); // Nuevo estado
  const [selectedUserForProfile, setSelectedUserForProfile] = useState<Post['user'] | null>(null); // Nuevo estado
  const [isPlayingVideo, setIsPlayingVideo] = useState(false); // Estado para la reproducción de video
  const [isPlayingPodcast, setIsPlayingPodcast] = useState(false); // Nuevo estado para la reproducción de podcast
  const [replyingTo, setReplyingTo] = useState<string | null>(null); // ID del comentario al que se está respondiendo
  const [replyContent, setReplyContent] = useState(''); // Contenido de la respuesta
  const [commentLikes, setCommentLikes] = useState<Record<string, number>>({}); // Likes por comentario
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set()); // Comentarios que el usuario ha dado like
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null); // ID del comentario que se está editando
  const [editContent, setEditContent] = useState(''); // Contenido del comentario en edición
  const [loadingComments, setLoadingComments] = useState(false); // Estado de carga de comentarios
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false); // Estado del diálogo de confirmación
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null); // ID del comentario a eliminar
  const [newCommentInputValue, setNewCommentInputValue] = useState(''); // Valor del input de comentario
  const commentInputRef = React.useRef<HTMLInputElement>(null); // Ref para el input de comentario

  useEffect(() => {
    if (isOpen) {
      loadComments();
    }
    
    setReactions({
      likes: post.likes,
      laughs: post.laughs || 0,
      dislikes: post.dislikes || 0,
    });
    setUserReaction(post.userReaction || null); // Inicializar con la reacción del usuario desde el post
    setIsPlayingVideo(false); // Reset video playback state when post changes
    setIsPlayingPodcast(false); // Reset podcast playback state when post changes
    setReplyingTo(null); // Reset reply state
    setReplyContent(''); // Reset reply content
    setEditingCommentId(null); // Reset edit state
    setEditContent(''); // Reset edit content
  }, [post, isOpen]);

  const loadComments = async () => {
    try {
      setLoadingComments(true);
      const { postsService } = await import('@/lib/services/posts.service');
      const comments = await postsService.getComments(post.id);
      
      // Mapear comentarios del backend al formato del frontend
      const mappedComments = comments.map((comment: any) => ({
        id: comment.id,
        userId: comment.user?.id || '',
        user: {
          id: comment.user?.id || '',
          username: comment.user?.username || 'usuario',
          displayName: comment.user?.display_name || 'Usuario',
          avatar: comment.user?.avatar_url || comment.user?.avatar || 'https://ui-avatars.com/api/?name=User&background=00ff88&color=fff',
          email: comment.user?.email || '',
          followers: 0,
          following: 0,
          posts: 0,
          createdAt: comment.user?.created_at || new Date().toISOString(),
        },
        content: comment.content || '',
        likes: comment.likes_count || 0,
        createdAt: comment.created_at || comment.createdAt || new Date().toISOString(),
        parentId: comment.parent,
        isLiked: comment.is_liked || false,
      }));
      
      setPostComments(mappedComments);
      
      // Inicializar likes de comentarios
      const initialLikes: Record<string, number> = {};
      const liked = new Set<string>();
      mappedComments.forEach((comment: any) => {
        initialLikes[comment.id] = comment.likes || 0;
        if (comment.isLiked) {
          liked.add(comment.id);
        }
      });
      setCommentLikes(initialLikes);
      setLikedComments(liked);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleReaction = async (type: 'like' | 'laugh' | 'dislike') => {
    if (!currentUser) {
      toast.error('Debes iniciar sesión para reaccionar.');
      return;
    }

    const previousReaction = userReaction;
    const previousReactions = { ...reactions };
    
    // Determinar la nueva reacción
    const isRemovingReaction = userReaction === type;

    // Actualizar UI optimísticamente
    if (isRemovingReaction) {
      // Quitar la reacción actual
      setUserReaction(null);
      setReactions(prev => {
        const key = type === 'like' ? 'likes' : type === 'laugh' ? 'laughs' : 'dislikes';
        return { ...prev, [key]: Math.max(0, prev[key] - 1) };
      });
    } else {
      // Cambiar a nueva reacción
      setReactions(prev => {
        const newReactions = { ...prev };
        
        // Si el usuario ya tenía una reacción diferente, quitarla
        if (previousReaction) {
          const oldKey = previousReaction === 'like' ? 'likes' : 
                        previousReaction === 'laugh' ? 'laughs' : 'dislikes';
          newReactions[oldKey] = Math.max(0, newReactions[oldKey] - 1);
        }
        
        // Agregar la nueva reacción
        const newKey = type === 'like' ? 'likes' : 
                      type === 'laugh' ? 'laughs' : 'dislikes';
        newReactions[newKey] = newReactions[newKey] + 1;
        
        return newReactions;
      });
      
      setUserReaction(type);
    }

    // Enviar al backend
    try {
      const { postsService } = await import('@/lib/services/posts.service');
      const response = await postsService.reactToPost(post.id, type);
      
      // Actualizar con los contadores reales del servidor
      if (response && response.counts) {
        setReactions({
          likes: response.counts.likes_count ?? 0,
          laughs: response.counts.laughs_count ?? 0,
          dislikes: response.counts.dislikes_count ?? 0,
        });
      }
      
      // Actualizar userReaction basado en la respuesta del servidor
      if (response.message === 'Reacción eliminada') {
        setUserReaction(null);
      } else {
        setUserReaction(type);
      }

      // Notificar al componente padre
      onPostUpdated({
        ...post,
        likes: response.counts?.likes_count ?? reactions.likes,
        laughs: response.counts?.laughs_count ?? reactions.laughs,
        dislikes: response.counts?.dislikes_count ?? reactions.dislikes,
        userReaction: response.message === 'Reacción eliminada' ? null : type,
      });
    } catch (error) {
      console.error('Error al enviar reacción:', error);
      // Revertir cambios en caso de error
      setReactions(previousReactions);
      setUserReaction(previousReaction);
      toast.error('Error al procesar la reacción');
    }
  };

  const handleAddComment = async () => {
    if (!currentUser) {
      toast.error('Debes iniciar sesión para comentar.');
      return;
    }
    if (newCommentContent.trim()) {
      try {
        const { postsService } = await import('@/lib/services/posts.service');
        const newComment = await postsService.commentOnPost(post.id, newCommentContent.trim());
        
        // Mapear el comentario del backend
        const mappedComment: Comment = {
          id: newComment.id,
          userId: newComment.user.id,
          user: {
            id: newComment.user.id,
            username: newComment.user.username,
            displayName: newComment.user.display_name,
            avatar: newComment.user.avatar_url,
            email: newComment.user.email || '',
            followers: 0,
            following: 0,
            posts: 0,
            createdAt: newComment.user.created_at || new Date().toISOString(),
          },
          content: newComment.content,
          likes: newComment.likes_count || 0,
          createdAt: newComment.created_at,
        };
        
        const updatedComments = [mappedComment, ...postComments];
        setPostComments(updatedComments);
        setCommentLikes(prev => ({ ...prev, [mappedComment.id]: 0 }));
        setNewCommentContent('');
        toast.success('Comentario añadido!');

        // Notificar al componente padre
        onPostUpdated({
          ...post,
          comments: updatedComments,
        });
      } catch (error) {
        console.error('Error adding comment:', error);
        toast.error('Error al agregar el comentario');
      }
    }
  };

  const handleReplyToComment = (commentId: string) => {
    if (!currentUser) {
      toast.error('Debes iniciar sesión para responder.');
      return;
    }
    setReplyingTo(commentId);
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setReplyContent('');
  };

  const handleSubmitReply = async (parentCommentId: string) => {
    if (!currentUser) {
      toast.error('Debes iniciar sesión para responder.');
      return;
    }
    if (replyContent.trim()) {
      try {
        const { postsService } = await import('@/lib/services/posts.service');
        const newReply = await postsService.commentOnPost(post.id, replyContent.trim(), parentCommentId);
        
        // Mapear la respuesta del backend
        const mappedReply: Comment = {
          id: newReply.id,
          userId: newReply.user.id,
          user: {
            id: newReply.user.id,
            username: newReply.user.username,
            displayName: newReply.user.display_name,
            avatar: newReply.user.avatar_url,
            email: newReply.user.email || '',
            followers: 0,
            following: 0,
            posts: 0,
            createdAt: newReply.user.created_at || new Date().toISOString(),
          },
          content: newReply.content,
          likes: newReply.likes_count || 0,
          createdAt: newReply.created_at,
          parentId: parentCommentId,
        };
        
        // Agregar la respuesta después del comentario padre
        const parentIndex = postComments.findIndex(c => c.id === parentCommentId);
        const updatedComments = [...postComments];
        updatedComments.splice(parentIndex + 1, 0, mappedReply);
        
        setPostComments(updatedComments);
        setCommentLikes(prev => ({ ...prev, [mappedReply.id]: 0 }));
        setReplyContent('');
        setReplyingTo(null);
        toast.success('Respuesta añadida!');

        // Notificar al componente padre
        onPostUpdated({
          ...post,
          comments: updatedComments,
        });
      } catch (error) {
        console.error('Error adding reply:', error);
        toast.error('Error al agregar la respuesta');
      }
    }
  };

  const handleLikeComment = async (commentId: string) => {
    if (!currentUser) {
      toast.error('Debes iniciar sesión para dar like.');
      return;
    }
    
    try {
      const { postsService } = await import('@/lib/services/posts.service');
      
      // Si ya dio like, quitarlo
      if (likedComments.has(commentId)) {
        await postsService.unlikeComment(commentId);
        
        setLikedComments(prev => {
          const newSet = new Set(prev);
          newSet.delete(commentId);
          return newSet;
        });
        
        setCommentLikes(prev => ({
          ...prev,
          [commentId]: Math.max(0, (prev[commentId] || 0) - 1)
        }));
        
        const updatedComments = postComments.map(comment => 
          comment.id === commentId 
            ? { ...comment, likes: Math.max(0, (comment.likes || 0) - 1) }
            : comment
        );
        setPostComments(updatedComments);
        
        toast.success('Like removido');
      } else {
        // Agregar like
        const response = await postsService.likeComment(commentId);
        
        setLikedComments(prev => new Set(prev).add(commentId));
        
        setCommentLikes(prev => ({
          ...prev,
          [commentId]: response.likes_count || (prev[commentId] || 0) + 1
        }));
        
        const updatedComments = postComments.map(comment => 
          comment.id === commentId 
            ? { ...comment, likes: response.likes_count || (comment.likes || 0) + 1 }
            : comment
        );
        setPostComments(updatedComments);
        
        toast.success('¡Like añadido!');
      }
    } catch (error) {
      console.error('Error liking comment:', error);
      toast.error('Error al dar like al comentario');
    }
  };

  const handleShare = () => {
    setIsShareDialogOpen(true);
  };

  const handleOpenUserProfile = (user: Post['user']) => {
    setSelectedUserForProfile(user);
    setIsUserProfileDialogOpen(true);
  };

  const handleCommentEmojiSelect = (emoji: string) => {
    const input = commentInputRef.current;
    if (!input) return;

    const start = input.selectionStart || 0;
    const end = input.selectionEnd || 0;
    const text = newCommentContent;
    const before = text.substring(0, start);
    const after = text.substring(end);
    
    setNewCommentContent(before + emoji + after);
    
    // Restaurar el foco y posición del cursor
    setTimeout(() => {
      input.focus();
      const newPosition = start + emoji.length;
      input.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const handleEditComment = (commentId: string, currentContent: string) => {
    setEditingCommentId(commentId);
    setEditContent(currentContent);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditContent('');
  };

  const handleSaveEdit = async (commentId: string) => {
    if (!editContent.trim()) {
      toast.error('El comentario no puede estar vacío');
      return;
    }

    try {
      const { postsService } = await import('@/lib/services/posts.service');
      const updatedComment = await postsService.updateComment(commentId, editContent.trim());
      
      // Actualizar el comentario en la lista
      const updatedComments = postComments.map(comment => 
        comment.id === commentId 
          ? { ...comment, content: updatedComment.content }
          : comment
      );
      setPostComments(updatedComments);
      setEditingCommentId(null);
      setEditContent('');
      toast.success('Comentario editado!');
    } catch (error) {
      console.error('Error editing comment:', error);
      toast.error('Error al editar el comentario');
    }
  };

  const handleDeleteComment = (commentId: string) => {
    setCommentToDelete(commentId);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteComment = async () => {
    if (!commentToDelete) return;

    try {
      const { postsService } = await import('@/lib/services/posts.service');
      await postsService.deleteComment(commentToDelete);
      
      // Eliminar el comentario de la lista
      const updatedComments = postComments.filter(comment => comment.id !== commentToDelete);
      setPostComments(updatedComments);
      toast.success('Comentario eliminado!');
      
      // Notificar al componente padre
      onPostUpdated({
        ...post,
        comments: updatedComments,
      });
      
      setCommentToDelete(null);
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Error al eliminar el comentario');
    }
  };

  const formatTimeAgo = (dateString: string) => {
    if (!dateString) return 'Fecha desconocida';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Fecha inválida';
    }
    
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Hace unos minutos';
    if (diffInHours < 24) return `Hace ${diffInHours}h`;
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-3xl lg:max-w-4xl max-h-[95vh] md:h-[90vh] flex flex-col glass-card border-neon-green/20 p-0 overflow-hidden w-[95vw] md:w-full">
          <DialogHeader className="p-3 md:p-6 pb-0 pr-10 md:pr-14 flex-shrink-0">
            <DialogTitle className="text-white flex items-center space-x-2 text-base md:text-lg">
              <MessageCircle size={18} className="text-neon-green md:w-5 md:h-5" />
              <span>Detalles de la Publicación</span>
            </DialogTitle>
            <DialogDescription className="text-gray-400 text-xs md:text-sm">
              Explora la publicación completa y sus interacciones.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-3 md:p-6 pt-2 md:pt-4 scrollbar-hide overflow-x-hidden">
            {/* Post Content */}
            <div className="space-y-3 md:space-y-4 mb-4 md:mb-6 max-w-full">
              {/* User Info */}
              <button 
                onClick={() => handleOpenUserProfile(post.user)}
                className="flex items-center space-x-2 md:space-x-3 group w-full"
              >
                <img
                  src={post.user.avatar}
                  alt={post.user.displayName}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full ring-2 ring-neon-green/50 group-hover:ring-neon-blue transition-all duration-300 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-1 md:space-x-2 flex-wrap">
                    <h3 className="font-semibold text-white group-hover:text-neon-green transition-colors text-sm md:text-base truncate">{post.user.displayName}</h3>
                    <span className="text-gray-400 text-xs md:text-sm group-hover:text-white transition-colors truncate">@{post.user.username}</span>
                    {post.type === 'highlight' && (
                      <div className="flex items-center space-x-1 bg-yellow-500/20 px-1.5 md:px-2 py-0.5 md:py-1 rounded-full">
                        <Trophy className="text-yellow-400" size={10} />
                        <span className="text-yellow-400 text-[10px] md:text-xs font-medium">HIGHLIGHT</span>
                      </div>
                    )}
                    {post.type === 'podcast' && (
                      <div className="flex items-center space-x-1 bg-purple-500/20 px-1.5 md:px-2 py-0.5 md:py-1 rounded-full">
                        <Mic className="text-purple-400" size={10} />
                        <span className="text-purple-400 text-[10px] md:text-xs font-medium">PODCAST</span>
                      </div>
                    )}
                    {post.type === 'streaming' && (
                      <div className="flex items-center space-x-1 bg-red-500/20 px-1.5 md:px-2 py-0.5 md:py-1 rounded-full">
                        <Radio className="text-red-400" size={10} />
                        <span className="text-red-400 text-[10px] md:text-xs font-medium">STREAMING</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-1 md:space-x-2 text-xs md:text-sm text-gray-400 flex-wrap">
                    {post.user.position && (
                      <>
                        <span className="truncate">{post.user.position}</span>
                        <span>•</span>
                      </>
                    )}
                    {post.user.team && (
                      <>
                        <span className="truncate">{post.user.team}</span>
                        <span>•</span>
                      </>
                    )}
                    <span>{formatTimeAgo(post.createdAt)}</span>
                  </div>
                </div>
              </button>

              {/* Post Text Content */}
              <p className="text-white leading-relaxed text-sm md:text-lg">{post.content}</p>

              {/* Images */}
              {post.images && post.images.length > 0 && (
                <div className={`grid gap-2 rounded-xl overflow-hidden ${
                  post.images.length === 1 ? 'grid-cols-1' : 
                  post.images.length === 2 ? 'grid-cols-2' : 
                  'grid-cols-2'
                }`}>
                  {post.images.map((image, index) => (
                    <div 
                      key={index} 
                      className={`relative overflow-hidden ${
                        post.images!.length === 3 && index === 0 ? 'col-span-2' : ''
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Post image ${index + 1}`}
                        className="w-full h-40 md:h-64 object-cover"
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
                    autoPlay
                    preload="metadata"
                    className="w-full h-full object-contain"
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

              {/* Streaming (placeholder for now) */}
              {post.streamingUrl && (
                <div className="relative rounded-xl overflow-hidden aspect-video bg-red-500/10 flex flex-col items-center justify-center p-4 text-center">
                  <Radio size={48} className="text-red-400 mb-2" />
                  <p className="text-white font-medium mb-1">¡Transmisión en vivo!</p>
                  <p className="text-gray-400 text-sm">Haz clic para ver el streaming en: <a href={post.streamingUrl} target="_blank" rel="noopener noreferrer" className="text-neon-blue hover:underline truncate">{post.streamingUrl}</a></p>
                </div>
              )}
            </div>

            {/* Reactions & Share */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
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
              
              <button 
                onClick={handleShare}
                className="flex items-center gap-1.5 px-2 py-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
              >
                <Share size={18} />
                <span className="text-sm">Compartir</span>
              </button>
            </div>

            {/* Comments Section */}
            <div className="space-y-3 md:space-y-4 pt-3 md:pt-4 border-t border-white/10 mt-4 md:mt-6">
              <h3 className="text-base md:text-xl font-semibold text-white">Comentarios ({postComments.length})</h3>
              
              {/* Add Comment */}
              <div className="flex space-x-2 md:space-x-3">
                <img
                  src={currentUser?.avatar || currentUser?.coverPhoto || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                  alt={currentUser?.displayName || 'Tu avatar'}
                  className="w-7 h-7 md:w-8 md:h-8 rounded-full ring-2 ring-neon-green/30 flex-shrink-0"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=default';
                  }}
                />
                <div className="flex-1 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 md:items-center">
                  <div className="relative flex-1">
                    <input
                      ref={commentInputRef}
                      type="text"
                      value={newCommentContent}
                      onChange={(e) => setNewCommentContent(e.target.value)}
                      placeholder="Escribe un comentario..."
                      className="w-full px-3 md:px-4 py-1.5 md:py-2 pr-10 md:pr-12 bg-white/10 border border-white/20 rounded-lg text-white text-sm md:text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-green/50"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                      disabled={!currentUser}
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                      <EmojiPickerButton onEmojiSelect={handleCommentEmojiSelect} />
                    </div>
                  </div>
                  <CyberButton size="sm" onClick={handleAddComment} disabled={!newCommentContent.trim() || !currentUser} className="w-full md:w-auto">
                    Enviar
                  </CyberButton>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-2 md:space-y-3">
                {loadingComments ? (
                  <div className="text-center py-6 md:py-8">
                    <div className="animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-b-2 border-neon-green mx-auto"></div>
                    <p className="text-gray-400 text-xs md:text-sm mt-2">Cargando comentarios...</p>
                  </div>
                ) : postComments.length === 0 ? (
                  <p className="text-gray-400 text-xs md:text-sm text-center py-3 md:py-4">Sé el primero en comentar esta publicación.</p>
                ) : (
                  postComments.map((comment) => (
                    <div key={comment.id}>
                      <div className={`flex space-x-2 md:space-x-3 ${comment.parentId ? 'ml-6 md:ml-8 mt-2 pl-3 md:pl-4 border-l-2 border-neon-green/30' : ''}`}>
                        <button 
                          onClick={() => handleOpenUserProfile(comment.user)}
                          className="group flex-shrink-0"
                        >
                          <img
                            src={comment.user.avatar}
                            alt={comment.user.displayName}
                            className={`${comment.parentId ? 'w-7 h-7' : 'w-8 h-8'} rounded-full ring-2 ring-neon-green/30 group-hover:ring-neon-blue transition-all duration-300`}
                          />
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className={`bg-white/5 rounded-lg p-3 ${comment.parentId ? 'bg-neon-green/5' : ''}`}>
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center space-x-2">
                                {comment.parentId && (
                                  <MessageCircle size={12} className="text-neon-green" />
                                )}
                                <span className="font-medium text-white text-sm hover:text-neon-green transition-colors">{comment.user.displayName}</span>
                                <span className="text-gray-400 text-xs hover:text-white transition-colors">@{comment.user.username}</span>
                              </div>
                              {currentUser && comment.userId === currentUser.id && editingCommentId !== comment.id && (
                                <div className="flex items-center space-x-1">
                                  <button
                                    onClick={() => handleEditComment(comment.id, comment.content)}
                                    className="text-gray-400 hover:text-neon-green transition-colors p-1"
                                    title="Editar"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => handleDeleteComment(comment.id)}
                                    className="text-gray-400 hover:text-red-400 transition-colors p-1"
                                    title="Eliminar"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <polyline points="3 6 5 6 21 6"></polyline>
                                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    </svg>
                                  </button>
                                </div>
                              )}
                            </div>
                            {editingCommentId === comment.id ? (
                              <div className="space-y-2">
                                <textarea
                                  value={editContent}
                                  onChange={(e) => setEditContent(e.target.value)}
                                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-green/50 resize-none"
                                  rows={2}
                                  autoFocus
                                />
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleSaveEdit(comment.id)}
                                    className="px-3 py-1 bg-neon-green/20 text-neon-green rounded-lg hover:bg-neon-green/30 transition-colors text-xs font-medium"
                                  >
                                    Guardar
                                  </button>
                                  <button
                                    onClick={handleCancelEdit}
                                    className="px-3 py-1 bg-white/5 text-gray-400 rounded-lg hover:bg-white/10 hover:text-white transition-colors text-xs"
                                  >
                                    Cancelar
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <p className="text-gray-300 text-sm leading-relaxed">{comment.content}</p>
                            )}
                          </div>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                            <span>{formatTimeAgo(comment.createdAt)}</span>
                            <button 
                              onClick={() => handleReplyToComment(comment.id)}
                              className="hover:text-neon-green transition-colors font-medium"
                            >
                              Responder
                            </button>
                            <button 
                              onClick={() => handleLikeComment(comment.id)}
                              className={`flex items-center space-x-1 transition-colors ${
                                likedComments.has(comment.id) 
                                  ? 'text-red-400' 
                                  : 'text-gray-400 hover:text-red-400'
                              }`}
                            >
                              <Heart 
                                size={12} 
                                className={likedComments.has(comment.id) ? 'fill-current' : ''} 
                              />
                              <span>{commentLikes[comment.id] || comment.likes || 0}</span>
                            </button>
                          </div>
                          
                          {/* Reply Input */}
                          {replyingTo === comment.id && (
                            <div className="mt-3 flex space-x-2">
                              <img
                                src={currentUser?.avatar || currentUser?.coverPhoto || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                                alt={currentUser?.displayName || 'Tu avatar'}
                                className="w-6 h-6 rounded-full ring-2 ring-neon-green/30 flex-shrink-0"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=default';
                                }}
                              />
                              <div className="flex-1 flex space-x-2">
                                <input
                                  type="text"
                                  value={replyContent}
                                  onChange={(e) => setReplyContent(e.target.value)}
                                  placeholder={`Responder a @${comment.user.username}...`}
                                  className="flex-1 px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-green/50"
                                  onKeyPress={(e) => e.key === 'Enter' && handleSubmitReply(comment.id)}
                                  autoFocus
                                />
                                <button
                                  onClick={() => handleSubmitReply(comment.id)}
                                  disabled={!replyContent.trim()}
                                  className="px-3 py-1.5 bg-neon-green/20 text-neon-green rounded-lg hover:bg-neon-green/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                                >
                                  Enviar
                                </button>
                                <button
                                  onClick={handleCancelReply}
                                  className="px-3 py-1.5 bg-white/5 text-gray-400 rounded-lg hover:bg-white/10 hover:text-white transition-colors text-sm"
                                >
                                  Cancelar
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <SharePostDialog 
            isOpen={isShareDialogOpen} 
            onClose={() => setIsShareDialogOpen(false)} 
            postUrl={`${window.location.origin}/feed/${post.id}`}
          />
        </DialogContent>
      </Dialog>

      {isUserProfileDialogOpen && selectedUserForProfile && (
        <UserProfileDialog
          isOpen={isUserProfileDialogOpen}
          onClose={() => setIsUserProfileDialogOpen(false)}
          profileUser={selectedUserForProfile}
        />
      )}

      {/* Diálogo de confirmación para eliminar comentario */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false);
          setCommentToDelete(null);
        }}
        onConfirm={confirmDeleteComment}
        title="Eliminar comentario"
        description="¿Estás seguro de que quieres eliminar este comentario? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
      />
    </>
  );
}