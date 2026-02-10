'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/components/providers/providers';
import { Sidebar } from '@/components/navigation/sidebar';
import { MobileNav } from '@/components/navigation/mobile-nav';
import { PostDetailDialog } from '@/components/ui/post-detail-dialog';
import { ArrowLeft } from 'lucide-react';
import { Post } from '@/types/user';

export default function PostPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Solo redirigir si ya terminó de cargar la autenticación y no hay usuario
    if (!authLoading && !user) {
      router.push('/');
      return;
    }
    
    // Solo cargar el post si hay usuario autenticado
    if (user) {
      loadPost();
    }
  }, [user, authLoading, postId]);

  const loadPost = async () => {
    try {
      setLoading(true);
      const { postsService } = await import('@/lib/services/posts.service');
      const postData = await postsService.getPost(postId);
      
      // Mapear el post del backend al formato del frontend
      const mappedPost: Post = {
        id: postData.id,
        userId: postData.user.id,
        user: {
          id: postData.user.id,
          username: postData.user.username,
          displayName: postData.user.display_name,
          avatar: postData.user.avatar_url,
          email: (postData.user as any).email || '',
          bio: (postData.user as any).bio || '',
          position: (postData.user as any).position || '',
          team: (postData.user as any).team || '',
          followers: (postData.user as any).followers_count || 0,
          following: (postData.user as any).following_count || 0,
          posts: (postData.user as any).posts_count || 0,
          createdAt: (postData.user as any).created_at || new Date().toISOString(),
        },
        content: postData.content,
        images: postData.images || [],
        video: postData.video,
        thumbnail: postData.thumbnail,
        podcastUrl: postData.podcast_url,
        streamingUrl: postData.streaming_url,
        type: postData.post_type as any,
        category: postData.category as any,
        likes: (postData as any).likes_count || 0,
        laughs: (postData as any).laughs_count || 0,
        dislikes: (postData as any).dislikes_count || 0,
        celebrations: (postData as any).celebrations_count,
        golazos: (postData as any).golazos_count,
        comments: [],
        createdAt: postData.created_at,
      };
      
      setPost(mappedPost);
    } catch (error) {
      console.error('Error loading post:', error);
      router.push('/feed');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    router.back();
  };

  const handlePostUpdated = (updatedPost: Post) => {
    setPost(updatedPost);
  };

  // Solo mostrar loading si está cargando Y no hay usuario
  if (authLoading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-10 h-10 border-3 border-neon-green border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen">
      <Sidebar />
      
      <main className="pb-24 xl:ml-64 xl:pb-0">
        <div className="max-w-4xl mx-auto p-4">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={handleClose}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Volver</span>
            </button>
          </div>

          {loading ? (
            <div className="glass-card p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-green mx-auto mb-4"></div>
              <p className="text-gray-400">Cargando publicación...</p>
            </div>
          ) : post ? (
            <PostDetailDialog
              isOpen={true}
              onClose={handleClose}
              post={post}
              onPostUpdated={handlePostUpdated}
            />
          ) : (
            <div className="glass-card p-8 text-center">
              <p className="text-gray-400">No se encontró la publicación</p>
            </div>
          )}
        </div>
      </main>

      <MobileNav />
    </div>
  );
}
