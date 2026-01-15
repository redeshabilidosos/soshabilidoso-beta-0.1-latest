'use client';

import { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share, Trophy, MoreHorizontal, Play, Mic, Radio, Laugh, ThumbsDown, Pencil, Trash2, Zap } from 'lucide-react';
import { Post, Comment } from '@/types/user';
import { ReactionButton } from './reaction-button';
import { CyberButton } from './cyber-button';
import { SharePostDialog } from './share-post-dialog';
import { PostDetailDialog } from './post-detail-dialog';
import { UserProfileDialog } from './user-profile-dialog';
import { useAuth } from '@/components/providers/providers';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface PostCardProps {
  post: Post;
  onPostUpdated: (updatedPost: Post) => void;
  onPostDeleted?: (postId: string) => void;
}

export function PostCard({ post, onPostUpdated, onPostDeleted }: PostCardProps) {
  const { user: currentUser } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [newCommentContent, setNewCommentContent] = useState('');
  const [postComments, setPostComments] = useState<Comment[]>(post.comments || []);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount || post.comments?.length || 0);
  const [reactions, setReactions] = useState({
    likes: post.likes,
    laughs: post.laughs || 0,
    dislikes: post.dislikes || 0,
  });
  const [userReaction, setUserReaction] = useState<string | null>(post.userReaction || null);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isUserProfileDialogOpen, setIsUserProfileDialogOpen] = useState(false);
  const [selectedUserForProfile, setSelectedUserForProfile] = useState<Post['user'] | null>(null);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [isPlayingPodcast, setIsPlayingPodcast] = useState(false);
  
  // Estados para editar y eliminar
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Verificar si el usuario actual es el dueño del post
  const isOwner = currentUser?.id === post.user.id;

  useEffect(() => {
    setPostComments(post.comments || []);
    setCommentsCount(post.commentsCount || post.comments?.length || 0);
    setReactions({
      likes: post.likes,
      laughs: post.laughs || 0,
      dislikes: post.dislikes || 0,
    });
    setUserReaction(post.userReaction || null);
    setIsPlayingVideo(false);
    setIsPlayingPodcast(false);
  }, [post]);

  const handleReaction = async (type: 'like' | 'laugh' | 'dislike') => {
    if (!currentUser) {
      toast.error('Debes iniciar sesión para reaccionar.');
      return;
    }

    const previousReaction = userReaction;
    const previousReactions = { ...reactions };
    
    // Determinar la nueva reacción
    const isRemovingReaction = userReaction === type;
    const newUserReaction = isRemovingReaction ? null : type;

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
      // Si el mensaje indica que se eliminó, userReaction debe ser null
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

  const handleAddComment = () => { // Renombrado para mayor claridad
    if (!currentUser) {
      toast.error('Debes iniciar sesión para comentar.');
      return;
    }
    if (newCommentContent.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        userId: currentUser.id,
        user: {
          id: currentUser.id,
          username: currentUser.username,
          displayName: currentUser.displayName,
          avatar: currentUser.avatar,
          email: currentUser.email,
          followers: currentUser.followers,
          following: currentUser.following,
          posts: currentUser.posts,
          createdAt: currentUser.createdAt,
        },
        content: newCommentContent.trim(),
        likes: 0,
        createdAt: new Date().toISOString(),
      };
      const updatedComments = [comment, ...postComments]; // Añadir el nuevo comentario al inicio
      setPostComments(updatedComments);
      setCommentsCount(prev => prev + 1); // Incrementar contador
      setNewCommentContent('');
      toast.success('Comentario añadido!');

      // Notificar al componente padre sobre la actualización de comentarios
      onPostUpdated({
        ...post,
        comments: updatedComments,
        commentsCount: commentsCount + 1,
      });
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsShareDialogOpen(true);
  };

  // Función para editar el post
  const handleEditPost = async () => {
    if (!editContent.trim()) {
      toast.error('El contenido no puede estar vacío');
      return;
    }

    try {
      setIsEditing(true);
      const { postsService } = await import('@/lib/services/posts.service');
      const updatedPost = await postsService.updatePost(post.id, { content: editContent });
      
      toast.success('Publicación actualizada');
      setIsEditDialogOpen(false);
      
      // Notificar al padre con el post actualizado
      onPostUpdated({
        ...post,
        content: editContent,
      });
    } catch (error) {
      console.error('Error al editar:', error);
      toast.error('Error al actualizar la publicación');
    } finally {
      setIsEditing(false);
    }
  };

  // Función para eliminar el post
  const handleDeletePost = async () => {
    try {
      setIsDeleting(true);
      const { postsService } = await import('@/lib/services/posts.service');
      await postsService.deletePost(post.id);
      
      toast.success('Publicación eliminada');
      setIsDeleteDialogOpen(false);
      
      // Notificar al padre que el post fue eliminado
      if (onPostDeleted) {
        onPostDeleted(post.id);
      }
    } catch (error) {
      console.error('Error al eliminar:', error);
      toast.error('Error al eliminar la publicación');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpenDetailDialog = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const isInteractive = target.closest('button') || target.closest('a') || target.closest('input') || target.closest('textarea') || target.closest('audio');
    if (!isInteractive) {
      setIsDetailDialogOpen(true);
    }
  };

  const handleOpenUserProfile = (user: Post['user']) => {
    setSelectedUserForProfile(user);
    setIsUserProfileDialogOpen(true);
  };

  const formatTimeAgo = (dateString: string | undefined | null) => {
    if (!dateString) return 'Hace un momento';
    
    try {
      const date = new Date(dateString);
      
      // Verificar si la fecha es válida
      if (isNaN(date.getTime())) {
        return 'Hace un momento';
      }
      
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

  // Estado para likes de comentarios
  const [commentLikes, setCommentLikes] = useState<Record<string, { count: number; liked: boolean }>>({});
  
  // Estado para responder a comentarios
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  
  // Estado para autocompletado de menciones
  const [showMentionSuggestions, setShowMentionSuggestions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [mentionSuggestions, setMentionSuggestions] = useState<Array<{ id: string; username: string; displayName: string; avatar: string }>>([]);
  const [selectedMentionIndex, setSelectedMentionIndex] = useState(0);
  const [contacts, setContacts] = useState<Array<{ id: string; username: string; displayName: string; avatar: string }>>([]);

  // Cargar contactos/amigos del usuario
  useEffect(() => {
    const loadContacts = async () => {
      if (!currentUser) return;
      
      try {
        // Intentar cargar amigos del backend
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/users/friends/`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          const friendsList = (data.results || data || []).map((friend: any) => ({
            id: friend.id,
            username: friend.username,
            displayName: friend.display_name || friend.displayName,
            avatar: friend.avatar_url || friend.avatar || `https://ui-avatars.com/api/?name=${friend.username}&background=00ff88&color=fff`,
          }));
          setContacts(friendsList);
        }
      } catch (error) {
        console.error('Error cargando contactos:', error);
        // Usar usuarios de los comentarios como fallback
        const commentUsers = postComments
          .filter(c => c.user && c.user.id !== currentUser?.id)
          .map(c => ({
            id: c.user.id,
            username: c.user.username,
            displayName: c.user.displayName,
            avatar: c.user.avatar,
          }));
        // Eliminar duplicados
        const uniqueUsers = commentUsers.filter((user, index, self) =>
          index === self.findIndex(u => u.id === user.id)
        );
        setContacts(uniqueUsers);
      }
    };
    
    loadContacts();
  }, [currentUser, postComments]);

  // Detectar @ en el contenido de respuesta
  const handleReplyContentChange = (value: string) => {
    setReplyContent(value);
    
    // Buscar si hay un @ seguido de texto
    const lastAtIndex = value.lastIndexOf('@');
    if (lastAtIndex !== -1) {
      const textAfterAt = value.substring(lastAtIndex + 1);
      // Verificar que no haya espacio después del @
      const spaceIndex = textAfterAt.indexOf(' ');
      
      if (spaceIndex === -1 && textAfterAt.length >= 0) {
        // Estamos escribiendo una mención
        setMentionQuery(textAfterAt.toLowerCase());
        
        // Filtrar contactos que coincidan
        const filtered = contacts.filter(contact =>
          contact.username.toLowerCase().includes(textAfterAt.toLowerCase()) ||
          contact.displayName.toLowerCase().includes(textAfterAt.toLowerCase())
        ).slice(0, 5); // Máximo 5 sugerencias
        
        setMentionSuggestions(filtered);
        setShowMentionSuggestions(filtered.length > 0);
        setSelectedMentionIndex(0);
      } else {
        setShowMentionSuggestions(false);
      }
    } else {
      setShowMentionSuggestions(false);
    }
  };

  // Seleccionar una mención
  const selectMention = (username: string) => {
    const lastAtIndex = replyContent.lastIndexOf('@');
    if (lastAtIndex !== -1) {
      const newContent = replyContent.substring(0, lastAtIndex) + `@${username} `;
      setReplyContent(newContent);
    }
    setShowMentionSuggestions(false);
    setMentionQuery('');
  };

  // Manejar teclas en el input de respuesta
  const handleReplyKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, commentId: string) => {
    if (showMentionSuggestions) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedMentionIndex(prev => 
          prev < mentionSuggestions.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedMentionIndex(prev => 
          prev > 0 ? prev - 1 : mentionSuggestions.length - 1
        );
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        if (mentionSuggestions[selectedMentionIndex]) {
          selectMention(mentionSuggestions[selectedMentionIndex].username);
        }
      } else if (e.key === 'Escape') {
        setShowMentionSuggestions(false);
      }
    } else {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmitReply(commentId);
      }
      if (e.key === 'Escape') {
        handleCancelReply();
      }
    }
  };

  // Inicializar likes de comentarios
  useEffect(() => {
    const initialLikes: Record<string, { count: number; liked: boolean }> = {};
    postComments.forEach(comment => {
      initialLikes[comment.id] = {
        count: comment.likes || 0,
        liked: false // TODO: obtener del backend si el usuario ya dio like
      };
    });
    setCommentLikes(initialLikes);
  }, [postComments]);

  // Función para dar like a un comentario
  const handleCommentLike = async (commentId: string) => {
    if (!currentUser) {
      toast.error('Debes iniciar sesión para dar like.');
      return;
    }

    const currentState = commentLikes[commentId] || { count: 0, liked: false };
    const newLiked = !currentState.liked;
    const newCount = newLiked ? currentState.count + 1 : Math.max(0, currentState.count - 1);

    // Actualizar UI optimísticamente
    setCommentLikes(prev => ({
      ...prev,
      [commentId]: { count: newCount, liked: newLiked }
    }));

    try {
      const { postsService } = await import('@/lib/services/posts.service');
      if (newLiked) {
        await postsService.likeComment(commentId);
      } else {
        await postsService.unlikeComment(commentId);
      }
    } catch (error) {
      console.error('Error al dar like al comentario:', error);
      // Revertir en caso de error
      setCommentLikes(prev => ({
        ...prev,
        [commentId]: currentState
      }));
    }
  };

  // Función para iniciar respuesta a un comentario
  const handleReplyToComment = (commentId: string, username: string) => {
    if (!currentUser) {
      toast.error('Debes iniciar sesión para responder.');
      return;
    }
    setReplyingTo(commentId);
    setReplyContent(`@${username} `);
  };

  // Función para cancelar respuesta
  const handleCancelReply = () => {
    setReplyingTo(null);
    setReplyContent('');
  };

  // Función para enviar respuesta
  const handleSubmitReply = async (parentCommentId: string) => {
    if (!currentUser) {
      toast.error('Debes iniciar sesión para responder.');
      return;
    }
    
    if (!replyContent.trim()) {
      toast.error('La respuesta no puede estar vacía.');
      return;
    }

    try {
      const { postsService } = await import('@/lib/services/posts.service');
      const newReply = await postsService.commentOnPost(post.id, replyContent.trim(), parentCommentId);
      
      // Mapear la respuesta del backend
      const mappedReply: Comment = {
        id: newReply.id,
        userId: newReply.user?.id || currentUser.id,
        user: {
          id: newReply.user?.id || currentUser.id,
          username: newReply.user?.username || currentUser.username,
          displayName: newReply.user?.display_name || currentUser.displayName,
          avatar: newReply.user?.avatar_url || currentUser.avatar,
          email: currentUser.email,
          followers: 0,
          following: 0,
          posts: 0,
          createdAt: new Date().toISOString(),
        },
        content: newReply.content || replyContent.trim(),
        likes: 0,
        createdAt: newReply.created_at || new Date().toISOString(),
        parentId: parentCommentId,
      };
      
      // Agregar la respuesta después del comentario padre
      const parentIndex = postComments.findIndex(c => c.id === parentCommentId);
      const updatedComments = [...postComments];
      
      if (parentIndex >= 0) {
        // Insertar después del padre y sus respuestas existentes
        let insertIndex = parentIndex + 1;
        while (insertIndex < updatedComments.length && updatedComments[insertIndex].parentId === parentCommentId) {
          insertIndex++;
        }
        updatedComments.splice(insertIndex, 0, mappedReply);
      } else {
        updatedComments.push(mappedReply);
      }
      
      setPostComments(updatedComments);
      setCommentsCount(prev => prev + 1);
      setCommentLikes(prev => ({ ...prev, [mappedReply.id]: { count: 0, liked: false } }));
      setReplyContent('');
      setReplyingTo(null);
      toast.success('Respuesta añadida!');

      // Notificar al componente padre
      onPostUpdated({
        ...post,
        comments: updatedComments,
        commentsCount: commentsCount + 1,
      });
    } catch (error) {
      console.error('Error al agregar respuesta:', error);
      toast.error('Error al agregar la respuesta');
    }
  };

  return (
    <>
      <div 
        className="football-card p-6 space-y-4 cursor-pointer w-full max-w-full overflow-hidden scrollbar-hide"
        onClick={handleOpenDetailDialog}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1 min-w-0">
            <button 
              onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleOpenUserProfile(post.user); }}
              className="flex-shrink-0 group"
            >
              <img
                src={post.user.avatar}
                alt={post.user.displayName}
                className="w-12 h-12 rounded-full ring-2 ring-neon-green/50 group-hover:ring-neon-blue transition-all duration-300"
              />
            </button>
            <div className="flex-1 min-w-0">
              {/* Nombre y username - Móvil: stack vertical, Desktop: horizontal */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-1">
                <h3 className="font-semibold text-white group-hover:text-neon-green transition-colors truncate">{post.user.displayName}</h3>
                <span className="text-gray-400 text-sm group-hover:text-white transition-colors truncate">@{post.user.username}</span>
              </div>
              
              {/* Badges de tipo de post */}
              <div className="flex flex-wrap gap-1 mb-2">
                {post.type === 'highlight' && (
                  <div className="flex items-center space-x-1 bg-yellow-500/20 px-2 py-1 rounded-full">
                    <Trophy className="text-yellow-400" size={12} />
                    <span className="text-yellow-400 text-xs font-medium">HIGHLIGHT</span>
                  </div>
                )}
                {post.type === 'podcast' && (
                  <div className="flex items-center space-x-1 bg-purple-500/20 px-2 py-1 rounded-full">
                    <Mic className="text-purple-400" size={12} />
                    <span className="text-purple-400 text-xs font-medium">PODCAST</span>
                  </div>
                )}
                {post.type === 'streaming' && (
                  <div className="flex items-center space-x-1 bg-red-500/20 px-2 py-1 rounded-full">
                    <Radio className="text-red-400" size={12} />
                    <span className="text-red-400 text-xs font-medium">STREAMING</span>
                  </div>
                )}
              </div>
              
              {/* Información del perfil - Móvil: stack vertical, Desktop: horizontal */}
              <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  {post.user.position && (
                    <span className="truncate">{post.user.position}</span>
                  )}
                  {post.user.position && post.user.team && (
                    <span className="hidden sm:inline">•</span>
                  )}
                  {post.user.team && (
                    <span className="truncate">{post.user.team}</span>
                  )}
                </div>
                <div className="flex items-center space-x-2 mt-1 sm:mt-0">
                  {(post.user.position || post.user.team) && (
                    <span className="hidden sm:inline">•</span>
                  )}
                  <span>{formatTimeAgo(post.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
          
          {isOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button 
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0" 
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="text-gray-400" size={20} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-gray-900 border-white/10">
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditContent(post.content);
                    setIsEditDialogOpen(true);
                  }}
                  className="text-white hover:bg-white/10 cursor-pointer"
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Editar publicación
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDeleteDialogOpen(true);
                  }}
                  className="text-red-400 hover:bg-red-500/10 cursor-pointer"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar publicación
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Content */}
        <div className="space-y-3 overflow-hidden">
          <p className="text-white leading-relaxed line-clamp-3">{post.content}</p>
          
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
                    className="w-full h-64 object-cover"
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
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
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

        {/* Reactions */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <div className="flex items-center gap-1">
            <ReactionButton
              icon={Heart}
              count={reactions.likes}
              color="text-red-500"
              hoverColor="hover:text-red-400"
              activeBg="bg-red-500/20"
              active={userReaction === 'like'}
              onClick={() => handleReaction('like')}
              label="Me gusta"
            />
            
            <ReactionButton
              icon={Laugh}
              count={reactions.laughs}
              color="text-yellow-500"
              hoverColor="hover:text-yellow-400"
              activeBg="bg-yellow-500/20"
              active={userReaction === 'laugh'}
              onClick={() => handleReaction('laugh')}
              label="Jajaja"
            />
            
            <ReactionButton
              icon={ThumbsDown}
              count={reactions.dislikes}
              color="text-blue-500"
              hoverColor="hover:text-blue-400"
              activeBg="bg-blue-500/20"
              active={userReaction === 'dislike'}
              onClick={() => handleReaction('dislike')}
              label="No me gusta"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={(e: React.MouseEvent) => { e.stopPropagation(); setShowComments(!showComments); }}
              className="flex items-center gap-1.5 px-2 py-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
            >
              <MessageCircle size={18} />
              <span className="text-sm">{commentsCount}</span>
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

        {/* Comments Section (collapsed in PostCard, full in PostDetailDialog) */}
        {showComments && (
          <div className="space-y-4 pt-4 border-t border-white/10 overflow-hidden">
            {/* Add Comment */}
            <div className="flex space-x-3">
              <img
                src={currentUser?.avatar || 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400'}
                alt={currentUser?.displayName || 'Tu avatar'}
                className="w-8 h-8 rounded-full ring-2 ring-neon-green/30"
              />
              <div className="flex-1 flex space-x-2">
                <input
                  type="text"
                  value={newCommentContent}
                  onChange={(e) => setNewCommentContent(e.target.value)}
                  placeholder="Escribe un comentario..."
                  className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-green/50"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                  disabled={!currentUser}
                />
                <CyberButton size="sm" onClick={handleAddComment} disabled={!newCommentContent.trim() || !currentUser}>
                  Enviar
                </CyberButton>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-3 overflow-hidden scrollbar-hide">
              {postComments.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">Sé el primero en comentar esta publicación.</p>
              ) : (
                postComments.map((comment) => {
                  const likeState = commentLikes[comment.id] || { count: comment.likes || 0, liked: false };
                  const isReply = !!comment.parentId;
                  
                  return (
                    <div key={comment.id} className={`${isReply ? 'ml-8 pl-3 border-l-2 border-neon-green/30' : ''}`}>
                      <div className="flex space-x-3">
                        <button 
                          onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleOpenUserProfile(comment.user); }}
                          className="group flex-shrink-0"
                        >
                          <img
                            src={comment.user?.avatar || 'https://ui-avatars.com/api/?name=User&background=00ff88&color=fff'}
                            alt={comment.user?.displayName || 'Usuario'}
                            className={`${isReply ? 'w-6 h-6' : 'w-8 h-8'} rounded-full ring-2 ring-neon-green/30 group-hover:ring-neon-blue transition-all duration-300`}
                          />
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className={`bg-white/5 rounded-lg p-3 ${isReply ? 'bg-neon-green/5' : ''}`}>
                            <div className="flex items-center space-x-2 mb-1">
                              {isReply && (
                                <MessageCircle size={10} className="text-neon-green" />
                              )}
                              <span className="font-medium text-white text-sm group-hover:text-neon-green transition-colors truncate">
                                {comment.user?.displayName || 'Usuario'}
                              </span>
                              <span className="text-gray-400 text-xs group-hover:text-white transition-colors truncate">
                                @{comment.user?.username || 'usuario'}
                              </span>
                            </div>
                            <p className="text-gray-300 text-sm break-words">{comment.content}</p>
                          </div>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                            <span>{formatTimeAgo(comment.createdAt)}</span>
                            {!isReply && (
                              <button 
                                onClick={(e: React.MouseEvent) => { 
                                  e.stopPropagation(); 
                                  handleReplyToComment(comment.id, comment.user?.username || 'usuario'); 
                                }}
                                className="hover:text-neon-green transition-colors"
                              >
                                Responder
                              </button>
                            )}
                            <button 
                              onClick={(e: React.MouseEvent) => { 
                                e.stopPropagation(); 
                                handleCommentLike(comment.id); 
                              }}
                              className={`flex items-center space-x-1 transition-colors ${
                                likeState.liked ? 'text-red-400' : 'hover:text-red-400'
                              }`}
                            >
                              <Heart size={12} className={likeState.liked ? 'fill-current' : ''} />
                              <span>{likeState.count}</span>
                            </button>
                          </div>
                          
                          {/* Formulario de respuesta */}
                          {replyingTo === comment.id && (
                            <div className="mt-3 flex space-x-2 relative" onClick={(e) => e.stopPropagation()}>
                              <img
                                src={currentUser?.avatar || 'https://ui-avatars.com/api/?name=User&background=00ff88&color=fff'}
                                alt={currentUser?.displayName || 'Tu avatar'}
                                className="w-6 h-6 rounded-full ring-2 ring-neon-green/30 flex-shrink-0"
                              />
                              <div className="flex-1 flex flex-col space-y-2 relative">
                                <div className="relative">
                                  <input
                                    type="text"
                                    value={replyContent}
                                    onChange={(e) => handleReplyContentChange(e.target.value)}
                                    placeholder={`Responder a @${comment.user?.username || 'usuario'}... (usa @ para mencionar)`}
                                    className="w-full px-3 py-1.5 bg-white/10 border border-neon-green/30 rounded-lg text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-green/50"
                                    onKeyDown={(e) => handleReplyKeyDown(e, comment.id)}
                                    autoFocus
                                  />
                                  
                                  {/* Dropdown de sugerencias de menciones */}
                                  {showMentionSuggestions && mentionSuggestions.length > 0 && (
                                    <div className="absolute bottom-full left-0 right-0 mb-1 bg-gray-900 border border-neon-green/30 rounded-lg shadow-lg overflow-hidden z-50">
                                      {mentionSuggestions.map((user, index) => (
                                        <button
                                          key={user.id}
                                          onClick={() => selectMention(user.username)}
                                          className={`w-full flex items-center space-x-2 px-3 py-2 text-left transition-colors ${
                                            index === selectedMentionIndex 
                                              ? 'bg-neon-green/20 text-white' 
                                              : 'text-gray-300 hover:bg-white/10'
                                          }`}
                                        >
                                          <img
                                            src={user.avatar}
                                            alt={user.displayName}
                                            className="w-6 h-6 rounded-full"
                                          />
                                          <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{user.displayName}</p>
                                            <p className="text-xs text-gray-400 truncate">@{user.username}</p>
                                          </div>
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                <div className="flex justify-end space-x-2">
                                  <button
                                    onClick={handleCancelReply}
                                    className="px-2 py-1 text-xs text-gray-400 hover:text-white transition-colors"
                                  >
                                    Cancelar
                                  </button>
                                  <button
                                    onClick={() => handleSubmitReply(comment.id)}
                                    disabled={!replyContent.trim()}
                                    className="px-3 py-1 text-xs bg-neon-green/20 text-neon-green rounded-lg hover:bg-neon-green/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    Responder
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      <SharePostDialog 
        isOpen={isShareDialogOpen} 
        onClose={() => setIsShareDialogOpen(false)} 
        postUrl={`${window.location.origin}/feed/${post.id}`}
      />

      {isDetailDialogOpen && (
        <PostDetailDialog
          isOpen={isDetailDialogOpen}
          onClose={() => setIsDetailDialogOpen(false)}
          post={post}
          onPostUpdated={onPostUpdated} // Pasar la función de actualización
        />
      )}

      {isUserProfileDialogOpen && selectedUserForProfile && (
        <UserProfileDialog
          isOpen={isUserProfileDialogOpen}
          onClose={() => setIsUserProfileDialogOpen(false)}
          profileUser={selectedUserForProfile}
        />
      )}

      {/* Dialog para editar publicación */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-gray-900 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Editar publicación</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="¿Qué estás pensando?"
              className="min-h-[120px] bg-white/5 border-white/10 text-white placeholder:text-gray-500"
            />
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setIsEditDialogOpen(false)}
              disabled={isEditing}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleEditPost}
              disabled={isEditing || !editContent.trim()}
              className="bg-[#00ff88] text-black hover:bg-[#00ff88]/80"
            >
              {isEditing ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmación para eliminar */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-gray-900 border-white/10 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar publicación?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Esta acción no se puede deshacer. La publicación será eliminada permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              className="bg-transparent border-white/10 text-white hover:bg-white/10"
              disabled={isDeleting}
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePost}
              disabled={isDeleting}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              {isDeleting ? 'Eliminando...' : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}