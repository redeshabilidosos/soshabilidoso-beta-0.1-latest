'use client';

import { memo, useState } from 'react';
import { MoreHorizontal, Pencil, Trash2, Trophy, Mic, Radio } from 'lucide-react';
import { Post } from '@/types/user';
import { useAuth } from '@/components/providers/providers';
import { toast } from 'sonner';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
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
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface PostHeaderProps {
  post: Post;
  onPostUpdated: (updatedPost: Post) => void;
  onPostDeleted?: (postId: string) => void;
}

export const PostHeader = memo(function PostHeader({ 
  post, 
  onPostUpdated,
  onPostDeleted 
}: PostHeaderProps) {
  const { user: currentUser } = useAuth();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const isOwner = currentUser?.id === post.user.id;

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

  return (
    <>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1 min-w-0">
          <div className="relative w-12 h-12 flex-shrink-0">
            <Image
              src={post.user.avatar}
              alt={post.user.displayName}
              fill
              className="rounded-full ring-2 ring-neon-green/50 object-cover"
              sizes="48px"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-1">
              <h3 className="font-semibold text-white truncate">{post.user.displayName}</h3>
              <span className="text-gray-400 text-sm truncate">@{post.user.username}</span>
            </div>
            
            {/* Badges */}
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
            
            <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-400">
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
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0">
                <MoreHorizontal className="text-gray-400" size={20} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-gray-900 border-white/10">
              <DropdownMenuItem 
                onClick={() => {
                  setEditContent(post.content);
                  setIsEditDialogOpen(true);
                }}
                className="text-white hover:bg-white/10 cursor-pointer"
              >
                <Pencil className="mr-2 h-4 w-4" />
                Editar publicación
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setIsDeleteDialogOpen(true)}
                className="text-red-400 hover:bg-red-500/10 cursor-pointer"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar publicación
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-gray-900 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Editar publicación</DialogTitle>
          </DialogHeader>
          <Textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            placeholder="¿Qué estás pensando?"
            className="min-h-[120px] bg-white/5 border-white/10 text-white"
          />
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsEditDialogOpen(false)} disabled={isEditing}>
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

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-gray-900 border-white/10 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar publicación?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Esta acción no se puede deshacer. La publicación será eliminada permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-white/10 text-white hover:bg-white/10" disabled={isDeleting}>
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
