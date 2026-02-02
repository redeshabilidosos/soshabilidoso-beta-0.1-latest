'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { X, Heart, Reply, Send, Smile, MoreVertical, Verified, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EmojiPickerButton } from '@/components/ui/emoji-picker-button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// Reacciones disponibles tipo Facebook
const REACTIONS = [
  { emoji: '❤️', name: 'Me encanta', color: 'text-red-500' },
  { emoji: '😂', name: 'Me divierte', color: 'text-yellow-500' },
  { emoji: '😮', name: 'Me asombra', color: 'text-blue-500' },
  { emoji: '😢', name: 'Me entristece', color: 'text-blue-400' },
  { emoji: '😡', name: 'Me enoja', color: 'text-orange-500' },
  { emoji: '👏', name: 'Aplaudo', color: 'text-yellow-400' },
];

interface Comment {
  id: string;
  user: {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
    isVerified: boolean;
  };
  content: string;
  likes: number;
  isLiked: boolean;
  createdAt: string;
  replies?: Comment[];
  parent?: string | null;
  reactions?: {
    [key: string]: number;
  };
  userReaction?: string | null;
}

interface ReelCommentsProps {
  isOpen: boolean;
  onClose: () => void;
  reelId: string;
  comments: Comment[];
  onAddComment: (content: string, parentId?: string) => void;
  onLikeComment: (commentId: string) => void;
}

export function ReelComments({
  isOpen,
  onClose,
  reelId,
  comments,
  onAddComment,
  onLikeComment
}: ReelCommentsProps) {
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [showReactions, setShowReactions] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const reactionsRef = useRef<HTMLDivElement>(null);

  // Cerrar panel de reacciones al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (reactionsRef.current && !reactionsRef.current.contains(event.target as Node)) {
        setShowReactions(null);
      }
    };

    if (showReactions) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showReactions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment.trim(), replyingTo || undefined);
      setNewComment('');
      setReplyingTo(null);
    }
  };

  const handleReaction = (commentId: string, emoji: string) => {
    // TODO: Implementar lógica de reacción en el backend
    console.log('Reacción:', emoji, 'al comentario:', commentId);
    setShowReactions(null);
  };

  const handleEmojiSelect = (emoji: string) => {
    setNewComment(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const getTotalReactions = (reactions?: { [key: string]: number }) => {
    if (!reactions) return 0;
    return Object.values(reactions).reduce((sum, count) => sum + count, 0);
  };

  const getTopReactions = (reactions?: { [key: string]: number }) => {
    if (!reactions) return [];
    return Object.entries(reactions)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([emoji]) => emoji);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Ahora';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d`;
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] p-0 gap-0 bg-gradient-to-br from-gray-900/98 to-black/98 backdrop-blur-xl border-2 border-neon-green/30 shadow-2xl shadow-neon-green/10">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b border-neon-green/20 bg-gradient-to-r from-neon-green/5 to-transparent">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-white text-xl font-bold">
                Comentarios
              </DialogTitle>
              <p className="text-gray-400 text-sm mt-1">
                {comments.length} {comments.length === 1 ? 'comentario' : 'comentarios'}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </DialogHeader>

        {/* Comments List */}
        <ScrollArea className="flex-1 h-[500px] px-6 py-4">
          {comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <MessageCircle className="w-10 h-10 text-gray-500" />
              </div>
              <p className="text-gray-400 font-medium">No hay comentarios aún</p>
              <p className="text-gray-500 text-sm mt-2">¡Sé el primero en comentar!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="space-y-3">
                  {/* Main Comment */}
                  <div className="flex space-x-3 group">
                    <Avatar className="w-10 h-10 ring-2 ring-white/10">
                      <AvatarImage src={comment.user.avatar} alt={comment.user.displayName} />
                      <AvatarFallback>{comment.user.displayName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="bg-white/5 hover:bg-white/10 rounded-2xl px-4 py-3 transition-colors border border-white/5">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-white font-semibold text-sm">
                            {comment.user.displayName}
                          </span>
                          {comment.user.isVerified && (
                            <Verified className="w-4 h-4 text-neon-green fill-current" />
                          )}
                          <span className="text-gray-400 text-xs">
                            @{comment.user.username}
                          </span>
                          <span className="text-gray-500 text-xs">•</span>
                          <span className="text-gray-500 text-xs">
                            {formatTimeAgo(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-white text-sm leading-relaxed">
                          {comment.content}
                        </p>
                      </div>
                      
                      {/* Reactions Display */}
                      {comment.reactions && getTotalReactions(comment.reactions) > 0 && (
                        <div className="flex items-center space-x-2 mt-2 ml-4">
                          <div className="flex items-center -space-x-1">
                            {getTopReactions(comment.reactions).map((emoji, idx) => (
                              <div 
                                key={idx}
                                className="text-sm bg-gray-800 rounded-full w-6 h-6 flex items-center justify-center border-2 border-gray-900"
                              >
                                {emoji}
                              </div>
                            ))}
                          </div>
                          <span className="text-xs text-gray-400 font-medium">
                            {getTotalReactions(comment.reactions)}
                          </span>
                        </div>
                      )}

                      {/* Comment Actions */}
                      <div className="flex items-center space-x-4 mt-3 ml-4 relative">
                        <div className="relative">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowReactions(showReactions === comment.id ? null : comment.id);
                            }}
                            onMouseEnter={() => setShowReactions(comment.id)}
                            className={cn(
                              "h-8 px-3 rounded-full transition-all",
                              comment.userReaction 
                                ? "text-neon-green hover:text-neon-green" 
                                : "text-gray-400 hover:text-red-500 hover:bg-red-500/10"
                            )}
                          >
                            {comment.userReaction ? (
                              <span className="text-base mr-1">{comment.userReaction}</span>
                            ) : (
                              <Heart className="w-4 h-4 mr-1" />
                            )}
                            <span className="text-xs font-medium">
                              {comment.userReaction ? 'Reacción' : 'Reaccionar'}
                            </span>
                          </Button>

                          {/* Reactions Popup */}
                          {showReactions === comment.id && (
                            <div 
                              ref={reactionsRef}
                              className="absolute bottom-full left-0 mb-2 bg-gray-800/98 backdrop-blur-xl rounded-full px-3 py-2 flex items-center space-x-1 shadow-2xl border border-neon-green/30 animate-in zoom-in-95 slide-in-from-bottom-2 duration-200"
                              onMouseLeave={() => setShowReactions(null)}
                              onClick={(e) => e.stopPropagation()}
                            >
                              {REACTIONS.map((reaction) => (
                                <button
                                  key={reaction.emoji}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleReaction(comment.id, reaction.emoji);
                                  }}
                                  className="group relative hover:scale-125 transition-all duration-200 p-1.5 rounded-full hover:bg-white/10 active:scale-110"
                                  title={reaction.name}
                                >
                                  <span className="text-2xl block">{reaction.emoji}</span>
                                  <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl border border-white/10">
                                    {reaction.name}
                                  </span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                          className={cn(
                            "h-8 px-3 rounded-full transition-all",
                            replyingTo === comment.id 
                              ? "text-neon-green hover:text-neon-green bg-neon-green/10" 
                              : "text-gray-400 hover:text-white hover:bg-white/10"
                          )}
                        >
                          <Reply className="w-4 h-4 mr-1" />
                          <span className="text-xs font-medium">
                            {replyingTo === comment.id ? 'Cancelar' : 'Responder'}
                          </span>
                        </Button>

                        {comment.replies && comment.replies.length > 0 && (
                          <Badge variant="secondary" className="bg-white/5 text-gray-400 hover:bg-white/10">
                            {comment.replies.length} {comment.replies.length === 1 ? 'respuesta' : 'respuestas'}
                          </Badge>
                        )}
                      </div>

                      {/* Replies */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="ml-6 mt-4 space-y-3 border-l-2 border-neon-green/20 pl-4">
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="flex space-x-3">
                              <Avatar className="w-8 h-8 ring-2 ring-white/10">
                                <AvatarImage src={reply.user.avatar} alt={reply.user.displayName} />
                                <AvatarFallback className="text-xs">{reply.user.displayName.charAt(0)}</AvatarFallback>
                              </Avatar>
                              
                              <div className="flex-1">
                                <div className="bg-white/5 hover:bg-white/10 rounded-xl px-3 py-2 transition-colors border border-white/5">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <span className="text-white font-semibold text-xs">
                                      {reply.user.displayName}
                                    </span>
                                    {reply.user.isVerified && (
                                      <Verified className="w-3 h-3 text-neon-green fill-current" />
                                    )}
                                    <span className="text-gray-400 text-xs">
                                      @{reply.user.username}
                                    </span>
                                    <span className="text-gray-500 text-xs">•</span>
                                    <span className="text-gray-500 text-xs">
                                      {formatTimeAgo(reply.createdAt)}
                                    </span>
                                  </div>
                                  <p className="text-white text-xs leading-relaxed">
                                    {reply.content}
                                  </p>
                                </div>
                                
                                {/* Reply Actions */}
                                <div className="flex items-center space-x-3 mt-2 ml-3">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onLikeComment(reply.id)}
                                    className={cn(
                                      "h-7 px-2 rounded-full",
                                      reply.isLiked 
                                        ? "text-red-500 hover:text-red-500" 
                                        : "text-gray-400 hover:text-red-500 hover:bg-red-500/10"
                                    )}
                                  >
                                    <Heart 
                                      className={cn(
                                        "w-3 h-3 mr-1",
                                        reply.isLiked && "fill-current"
                                      )} 
                                    />
                                    {reply.likes > 0 && (
                                      <span className="text-xs font-medium">{reply.likes}</span>
                                    )}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Separator between comments */}
                  <Separator className="bg-white/5" />
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Comment Input */}
        <div className="px-6 py-4 border-t border-neon-green/20 bg-gradient-to-r from-neon-green/5 to-transparent">
          {replyingTo && (
            <div className="flex items-center justify-between mb-3 px-4 py-2 bg-neon-green/10 rounded-lg border border-neon-green/20 animate-in slide-in-from-top-2 duration-200">
              <div className="flex items-center space-x-2">
                <Reply className="w-4 h-4 text-neon-green" />
                <span className="text-neon-green text-sm font-medium">
                  Respondiendo a {comments.find(c => c.id === replyingTo)?.user.displayName}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReplyingTo(null)}
                className="h-7 text-gray-400 hover:text-white hover:bg-white/10"
              >
                Cancelar
              </Button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex space-x-3">
              <div className="flex-1 relative">
                <Input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={
                    replyingTo 
                      ? `Respondiendo a ${comments.find(c => c.id === replyingTo)?.user.displayName || 'usuario'}...`
                      : "Añade un comentario..."
                  }
                  className="bg-white/10 border-white/20 rounded-full pl-4 pr-12 py-6 text-white placeholder-gray-400 focus:ring-2 focus:ring-neon-green focus:border-neon-green/50"
                  maxLength={500}
                />
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  <Smile className="w-5 h-5" />
                </button>
              </div>
              <Button
                type="submit"
                disabled={!newComment.trim()}
                size="icon"
                className={cn(
                  "rounded-full w-12 h-12 transition-all duration-200",
                  newComment.trim()
                    ? "bg-neon-green text-black hover:bg-neon-green/80 hover:scale-105 shadow-lg shadow-neon-green/20 active:scale-95"
                    : "bg-gray-600 text-gray-400 cursor-not-allowed"
                )}
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>

            {/* Character Counter */}
            {newComment.length > 400 && (
              <div className="text-right animate-in fade-in duration-200">
                <span className={cn(
                  "text-xs font-medium",
                  newComment.length > 480 ? "text-red-500" : "text-gray-400"
                )}>
                  {newComment.length}/500
                </span>
              </div>
            )}
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}