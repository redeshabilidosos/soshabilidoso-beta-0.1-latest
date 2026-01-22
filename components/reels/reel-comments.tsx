'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, Heart, Reply, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment.trim(), replyingTo);
      setNewComment('');
      setReplyingTo(null);
    }
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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end lg:items-center lg:justify-center">
      <div className="w-full lg:w-96 bg-gray-900/95 backdrop-blur-xl lg:rounded-t-2xl lg:rounded-b-2xl max-h-[85vh] flex flex-col border border-white/10">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h3 className="text-white font-semibold">Comentarios</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">No hay comentarios aún</p>
              <p className="text-gray-500 text-sm mt-1">¡Sé el primero en comentar!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="space-y-2">
                {/* Main Comment */}
                <div className="flex space-x-3">
                  <Image
                    src={comment.user.avatar}
                    alt={comment.user.displayName}
                    width={32}
                    height={32}
                    className="rounded-full flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="bg-white/5 rounded-2xl px-3 py-2">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-white font-medium text-sm">
                          {comment.user.displayName}
                        </span>
                        <span className="text-gray-400 text-xs">
                          @{comment.user.username}
                        </span>
                        <span className="text-gray-500 text-xs">
                          {formatTimeAgo(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-white text-sm leading-relaxed">
                        {comment.content}
                      </p>
                    </div>
                    
                    {/* Comment Actions */}
                    <div className="flex items-center space-x-4 mt-2 ml-3">
                      <button
                        onClick={() => onLikeComment(comment.id)}
                        className="flex items-center space-x-1 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Heart 
                          className={cn(
                            "w-4 h-4",
                            comment.isLiked ? "text-red-500 fill-current" : ""
                          )} 
                        />
                        {comment.likes > 0 && (
                          <span className="text-xs">{comment.likes}</span>
                        )}
                      </button>
                      <button
                        onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                        className={cn(
                          "flex items-center space-x-1 transition-colors",
                          replyingTo === comment.id 
                            ? "text-neon-green" 
                            : "text-gray-400 hover:text-white"
                        )}
                      >
                        <Reply className="w-4 h-4" />
                        <span className="text-xs">
                          {replyingTo === comment.id ? 'Cancelar' : 'Responder'}
                        </span>
                      </button>
                    </div>

                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="ml-6 mt-3 space-y-2 border-l-2 border-white/10 pl-4">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex space-x-2">
                            <Image
                              src={reply.user.avatar}
                              alt={reply.user.displayName}
                              width={24}
                              height={24}
                              className="rounded-full flex-shrink-0"
                            />
                            <div className="flex-1">
                              <div className="bg-white/5 rounded-xl px-3 py-2">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="text-white font-medium text-xs">
                                    {reply.user.displayName}
                                  </span>
                                  <span className="text-gray-400 text-xs">
                                    @{reply.user.username}
                                  </span>
                                  <span className="text-gray-500 text-xs">
                                    {formatTimeAgo(reply.createdAt)}
                                  </span>
                                </div>
                                <p className="text-white text-xs leading-relaxed">
                                  {reply.content}
                                </p>
                              </div>
                              
                              {/* Reply Actions */}
                              <div className="flex items-center space-x-4 mt-1 ml-3">
                                <button
                                  onClick={() => onLikeComment(reply.id)}
                                  className="flex items-center space-x-1 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                  <Heart 
                                    className={cn(
                                      "w-3 h-3",
                                      reply.isLiked ? "text-red-500 fill-current" : ""
                                    )} 
                                  />
                                  {reply.likes > 0 && (
                                    <span className="text-xs">{reply.likes}</span>
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Comment Input */}
        <div className="p-4 border-t border-white/10">
          <form onSubmit={handleSubmit} className="flex space-x-3">
            <div className="flex-1">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={
                  replyingTo 
                    ? `Respondiendo a ${comments.find(c => c.id === replyingTo)?.user.displayName || 'usuario'}...`
                    : "Añade un comentario..."
                }
                className="w-full bg-white/10 border border-white/20 rounded-full px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-green focus:border-transparent"
                maxLength={500}
              />
            </div>
            <button
              type="submit"
              disabled={!newComment.trim()}
              className={cn(
                "p-2 rounded-full transition-all duration-200",
                newComment.trim()
                  ? "bg-neon-green text-black hover:bg-neon-green/80"
                  : "bg-gray-600 text-gray-400 cursor-not-allowed"
              )}
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          
          {replyingTo && (
            <div className="flex items-center justify-between mt-2 px-2 py-2 bg-neon-green/10 rounded-lg border border-neon-green/20">
              <div className="flex items-center space-x-2">
                <Reply className="w-4 h-4 text-neon-green" />
                <span className="text-neon-green text-sm">
                  Respondiendo a {comments.find(c => c.id === replyingTo)?.user.displayName}
                </span>
              </div>
              <button
                onClick={() => setReplyingTo(null)}
                className="text-gray-400 hover:text-white text-sm px-2 py-1 rounded hover:bg-white/10 transition-colors"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}