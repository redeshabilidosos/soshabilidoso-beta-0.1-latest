'use client';

import { useState, useEffect, memo } from 'react';
import { Heart, MessageCircle, Share, Trophy, MoreHorizontal, Mic, Radio, Laugh, ThumbsDown, Pencil, Trash2, Zap } from 'lucide-react';
import { Post, Comment } from '@/types/user';
import { ReactionButton } from './reaction-button';
import { CyberButton } from './cyber-button';
import { SharePostDialog } from './share-post-dialog';
import { PostDetailDialog } from './post-detail-dialog';
import { UserProfileDialog } from './user-profile-dialog';
import { useAuth } from '@/components/providers/providers';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
import { Input } from '@/components/ui/input';

interface PostCardProps {
  post: Post;
  onPostUpdated: (updatedPost: Post) => void;
  onPostDeleted?: (postId: string) => void;
}

// Memoizar el componente completo para mejor rendimiento
export const PostCard = memo(function PostCard({ post, onPostUpdated, onPostDeleted }: PostCardProps) {
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

    // Enviar al backend
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
      
      if (response.message === 'Reacción eliminada') {
        setUserReaction(null);
      } else {
        setUserReaction(type);
      }

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

  const handleAddComment = async () => {
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
      const updatedComments = [comment, ...postComments];
      setPostComments(updatedComments);
      setCommentsCount(prev => prev + 1);
      setNewCommentContent('');
      toast.success('Comentario añadido!');

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

  const handleEditPost = async () => {
    if (!editContent.trim()) {
      toast.error('El contenido no puede estar vacío');
      return;
    }

    try {
      setIsEditing(true);
      const { postsService } = await import('@/lib/services/posts.service');
      await postsService.updatePost(post.id, { content: editContent });
      
      toast.success('Publicación actualizada');
      setIsEditDialogOpen(false);
      
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

  const handleDeletePost = async () => {
    try {
      setIsDeleting(true);
      const { postsService } = await import('@/lib/services/posts.service');
      await postsService.deletePost(post.id);
      
      toast.success('Publicación eliminada');
      setIsDeleteDialogOpen(false);
      
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

  return (
    <>
      <Card 
        className="bg-black/40 border-neon-green/20 hover:border-neon-green/40 transition-all cursor-pointer backdrop-blur-sm"
        onClick={handleOpenDetailDialog}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1 min-w-0">
              <button 
                onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleOpenUserProfile(post.user); }}
                className="flex-shrink-0"
              >
                <Avatar className="h-12 w-12 ring-2 ring-neon-green/50 hover:ring-neon-blue transition-all">
                  <AvatarImage src={post.user.avatar} alt={post.user.displayName} />
                  <AvatarFallback className="bg-neon-green/20 text-neon-green">
                    {post.user.displayName.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                  <CardTitle className="text-base text-white truncate">{post.user.displayName}</CardTitle>
                  <CardDescription className="text-sm truncate">@{post.user.username}</CardDescription>
                </div>
                
                {/* Badges de tipo de post */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {post.type === 'highlight' && (
                    <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30">
                      <Trophy className="mr-1" size={12} />
                      HIGHLIGHT
                    </Badge>
                  )}
                  {post.type === 'podcast' && (
                    <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 hover:bg-purple-500/30">
                      <Mic className="mr-1" size={12} />
                      PODCAST
                    </Badge>
                  )}
                  {post.type === 'streaming' && (
                    <Badge variant="secondary" className="bg-red-500/20 text-red-400 hover:bg-red-500/30">
                      <Radio className="mr-1" size={12} />
                      STREAMING
                    </Badge>
                  )}
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-400 mt-1">
                  <div className="flex items-center space-x-2">
                    {post.user.position && <span className="truncate">{post.user.position}</span>}
                    {post.user.position && post.user.team && <span className="hidden sm:inline">•</span>}
                    {post.user.team && <span className="truncate">{post.user.team}</span>}
                  </div>
                  <div className="flex items-center space-x-2 mt-1 sm:mt-0">
                    {(post.user.position || post.user.team) && <span className="hidden sm:inline">•</span>}
                    <span>{formatTimeAgo(post.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {isOwner && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/10"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal size={18} />
                  </Button>
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
        </CardHeader>

        <CardContent className="pb-3">
          <p className="text-white leading-relaxed line-clamp-3 mb-3">{post.content}</p>
          
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
                      <Badge variant="secondary" className="bg-yellow-500/80 text-black">
                        <Zap className="mr-1" size={16} />
                        Momento Destacado
                      </Badge>
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
            <Card className="bg-white/5 border-purple-500/20">
              <CardContent className="p-4 flex items-center space-x-4">
                <Mic size={48} className="text-purple-400 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-white font-medium mb-2">Escucha nuestro podcast:</p>
                  <audio controls src={post.podcastUrl} className="w-full">
                    Tu navegador no soporta el elemento de audio.
                  </audio>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Streaming */}
          {post.streamingUrl && (
            <Card className="bg-red-500/10 border-red-500/20">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <Radio size={48} className="text-red-400 mb-2" />
                <p className="text-white font-medium mb-1">¡Transmisión en vivo!</p>
                <a 
                  href={post.streamingUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-neon-blue hover:underline truncate"
                  onClick={(e) => e.stopPropagation()}
                >
                  Ver streaming
                </a>
              </CardContent>
            </Card>
          )}
        </CardContent>

        <Separator className="bg-white/10" />

        <CardFooter className="flex-col items-stretch pt-3 pb-3">
          <div className="flex items-center justify-between">
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
              <Button
                variant="ghost"
                size="sm"
                onClick={(e: React.MouseEvent) => { e.stopPropagation(); setShowComments(!showComments); }}
                className="text-gray-400 hover:text-white hover:bg-white/10"
              >
                <MessageCircle size={18} className="mr-1" />
                <span className="text-sm">{commentsCount}</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="text-gray-400 hover:text-white hover:bg-white/10"
              >
                <Share size={18} className="mr-1" />
                <span className="text-sm hidden sm:inline">Compartir</span>
              </Button>
            </div>
          </div>

          {/* Comments Section */}
          {showComments && (
            <>
              <Separator className="bg-white/10 my-3" />
              <div className="space-y-4">
                {/* Add Comment */}
                <div className="flex space-x-3">
                  <Avatar className="h-8 w-8 ring-2 ring-neon-green/30">
                    <AvatarImage src={currentUser?.avatar} alt={currentUser?.displayName} />
                    <AvatarFallback className="bg-neon-green/20 text-neon-green text-xs">
                      {currentUser?.displayName?.substring(0, 2).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 flex space-x-2">
                    <Input
                      type="text"
                      value={newCommentContent}
                      onChange={(e) => setNewCommentContent(e.target.value)}
                      placeholder="Escribe un comentario..."
                      className="flex-1 bg-white/10 border-white/20 text-white placeholder-gray-400"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                      disabled={!currentUser}
                    />
                    <CyberButton size="sm" onClick={handleAddComment} disabled={!newCommentContent.trim() || !currentUser}>
                      Enviar
                    </CyberButton>
                  </div>
                </div>

                {/* Comments List */}
                <div className="space-y-3">
                  {postComments.length === 0 ? (
                    <p className="text-gray-400 text-sm text-center py-4">Sé el primero en comentar esta publicación.</p>
                  ) : (
                    postComments.slice(0, 3).map((comment) => (
                      <div key={comment.id} className="flex space-x-3">
                        <Avatar className="h-8 w-8 ring-2 ring-neon-green/30">
                          <AvatarImage src={comment.user?.avatar} alt={comment.user?.displayName} />
                          <AvatarFallback className="bg-neon-green/20 text-neon-green text-xs">
                            {comment.user?.displayName?.substring(0, 2).toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <Card className="bg-white/5 border-white/10">
                            <CardContent className="p-3">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-medium text-white text-sm truncate">
                                  {comment.user?.displayName || 'Usuario'}
                                </span>
                                <span className="text-gray-400 text-xs truncate">
                                  @{comment.user?.username || 'usuario'}
                                </span>
                              </div>
                              <p className="text-gray-300 text-sm break-words">{comment.content}</p>
                            </CardContent>
                          </Card>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                            <span>{formatTimeAgo(comment.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  {postComments.length > 3 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => { e.stopPropagation(); setIsDetailDialogOpen(true); }}
                      className="w-full text-neon-green hover:text-neon-green/80 hover:bg-neon-green/10"
                    >
                      Ver todos los {commentsCount} comentarios
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </CardFooter>
      </Card>

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
          onPostUpdated={onPostUpdated}
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
});
