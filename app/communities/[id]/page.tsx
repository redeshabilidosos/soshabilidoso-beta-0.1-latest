'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/providers';
import { CyberButton } from '@/components/ui/cyber-button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Sidebar } from '@/components/navigation/sidebar';
import { MobileNav } from '@/components/navigation/mobile-nav';

import {
  Users,
  MessageSquare,
  Heart,
  Image,
  Video,
  Mic,
  Radio,
  Crown,
  Lock,
  Globe,
  ArrowLeft,
  Trash2,
  FileText,
  Grid3x3,
  Music,
  Zap,
  X,
  Link as LinkIcon,
  Settings,
  Camera,
  ImageIcon,
  ThumbsDown,
  Laugh,
  Shield
} from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { UserProfileDialog } from '@/components/ui/user-profile-dialog';
import { toast } from 'sonner';
import { useForceBlackBackground } from '@/hooks/use-force-black-background';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Community {
  id: string;
  name: string;
  description: string;
  category: string;
  type: 'public' | 'private' | 'premium' | 'page';
  owner: {
    id: string;
    username: string;
    avatar?: string;
  };
  profile_image?: string;
  cover_image?: string;
  member_count: number;
  post_count: number;
  created_at: string;
  is_member?: boolean;
  is_owner?: boolean;
}

interface Post {
  id: string;
  content: string;
  author: {
    id: string;
    username: string;
    avatar?: string;
  };
  post_type: 'text' | 'image' | 'video' | 'podcast' | 'live' | 'link';
  image_url?: string;
  video_file_url?: string;
  podcast_file_url?: string;
  video_url?: string;
  podcast_url?: string;
  like_count: number;
  comment_count: number;
  is_liked: boolean;
  created_at: string;
}

export default function CommunityPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  
  // Forzar fondo negro en páginas de comunidades
  useForceBlackBackground();
  
  const communityId = Array.isArray(params.id) ? params.id[0] : (params.id as string);

  const [community, setCommunity] = useState<Community | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostType, setNewPostType] = useState<'text' | 'image' | 'video' | 'podcast' | 'link' | 'live'>('text');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [expandedComments, setExpandedComments] = useState<string | null>(null);
  const [comments, setComments] = useState<{[key: string]: any[]}>({});
  const [newComment, setNewComment] = useState('');
  const [linkPreview, setLinkPreview] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'gallery' | 'podcasts' | 'streaming'>('all');
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<{ show: boolean; postId: string | null }>({ show: false, postId: null });
  const [isDeleting, setIsDeleting] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ url: string; type: 'profile' | 'cover' } | null>(null);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    rules: '',
    category: ''
  });
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [selectedProfileUser, setSelectedProfileUser] = useState<any>(null);
  const [editingComment, setEditingComment] = useState<{ id: string; content: string } | null>(null);
  const [replyingTo, setReplyingTo] = useState<{ commentId: string; username: string } | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [activeInfoTab, setActiveInfoTab] = useState<'about' | 'stats'>('about');

  useEffect(() => {
    // Solo redirigir si ya terminó de cargar la autenticación y no hay usuario
    if (!authLoading && !user) {
      router.push('/');
      return;
    }
    
    // Solo cargar datos si hay usuario autenticado
    if (user) {
      fetchCommunityData();
    }
  }, [user, authLoading, communityId, router]);

  const fetchCommunityData = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        router.push('/');
        return;
      }

      const communityRes = await fetch(`http://127.0.0.1:8000/api/communities/${communityId}/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!communityRes.ok) {
        toast.error('Comunidad no encontrada');
        router.push('/communities');
        return;
      }

      const communityData = await communityRes.json();
      setCommunity(communityData);

      const postsRes = await fetch(`http://127.0.0.1:8000/api/communities/${communityId}/posts/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (postsRes.ok) {
        const postsData = await postsRes.json();
        const postsArray = Array.isArray(postsData) ? postsData : (postsData.results || []);
        setPosts(postsArray);
      }
    } catch (error) {
      console.error('Error fetching community:', error);
      toast.error('Error al cargar la comunidad');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinCommunity = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://127.0.0.1:8000/api/communities/${communityId}/join/`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setCommunity(prev => prev ? { ...prev, is_member: data.is_member, member_count: data.is_member ? (prev.member_count + 1) : (prev.member_count - 1) } : null);
        toast.success(data.message);
      } else {
        toast.error('Error al unirse a la comunidad');
      }
    } catch (error) {
      console.error('Error joining community:', error);
      toast.error('Error al unirse a la comunidad');
    }
  };

  const fetchLinkPreview = async (url: string) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/posts/preview/?url=${encodeURIComponent(url)}`);
      if (response.ok) {
        const data = await response.json();
        setLinkPreview(data);
      }
    } catch (error) {
      console.error('Error fetching link preview:', error);
    }
  };

  const handleContentChange = (value: string) => {
    setNewPostContent(value);
    
    // Detectar URLs en el contenido
    if (newPostType === 'link') {
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const urls = value.match(urlRegex);
      if (urls && urls[0]) {
        fetchLinkPreview(urls[0]);
      }
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim() && !selectedFile) {
      toast.error('Escribe algo o selecciona un archivo');
      return;
    }

    setIsCreatingPost(true);
    try {
      const token = localStorage.getItem('access_token');
      const formData = new FormData();
      formData.append('content', newPostContent);
      formData.append('post_type', newPostType);

      if (selectedFile) {
        if (newPostType === 'image') {
          formData.append('image', selectedFile);
        } else if (newPostType === 'video') {
          formData.append('video', selectedFile);
        } else if (newPostType === 'podcast') {
          formData.append('podcast', selectedFile);
        }
      }

      const response = await fetch(`http://127.0.0.1:8000/api/communities/${communityId}/posts/`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error response:', errorData);
        throw new Error(errorData.error || errorData.detail || 'Error al crear la publicación');
      }

      const newPost = await response.json();
      setPosts([newPost, ...posts]);
      setNewPostContent('');
      setSelectedFile(null);
      setNewPostType('text');
      setLinkPreview(null);
      setShowPostModal(false);
      toast.success('Publicación creada exitosamente');
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Error al crear la publicación');
    } finally {
      setIsCreatingPost(false);
    }
  };

  const closePostModal = () => {
    setShowPostModal(false);
    setNewPostContent('');
    setSelectedFile(null);
    setNewPostType('text');
    setLinkPreview(null);
  };

  const handleLikePost = async (postId: string) => {
    await handleReaction(postId, 'like');
  };

  const handleReaction = async (postId: string, reactionType: 'like' | 'laugh' | 'dislike') => {
    try {
      const token = localStorage.getItem('access_token');
      
      // Para like usamos el endpoint existente
      if (reactionType === 'like') {
        const response = await fetch(`http://127.0.0.1:8000/api/communities/posts/${postId}/like/`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          setPosts(posts.map(post =>
            post.id === postId
              ? {
                ...post,
                is_liked: !post.is_liked,
                like_count: post.is_liked ? post.like_count - 1 : post.like_count + 1
              }
              : post
          ));
        }
      } else {
        // Para otras reacciones (laugh, dislike) - actualización optimista
        // TODO: Implementar endpoint en backend para otras reacciones
        setPosts(posts.map(post => {
          if (post.id === postId) {
            const countField = `${reactionType}_count` as keyof Post;
            const currentCount = (post as any)[countField] || 0;
            return {
              ...post,
              [countField]: currentCount + 1
            };
          }
          return post;
        }));
        
        toast.success(reactionType === 'laugh' ? '😂 ¡Jajaja!' : '👎 No me gusta');
      }
    } catch (error) {
      console.error('Error en reacción:', error);
      toast.error('Error al reaccionar');
    }
  };

  const handleDeletePost = (postId: string) => {
    setDeleteConfirmModal({ show: true, postId });
  };

  const confirmDeletePost = async () => {
    if (!deleteConfirmModal.postId) return;
    
    setIsDeleting(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://127.0.0.1:8000/api/communities/posts/${deleteConfirmModal.postId}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setPosts(posts.filter(post => post.id !== deleteConfirmModal.postId));
        toast.success('Publicación eliminada');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Error al eliminar la publicación');
    } finally {
      setIsDeleting(false);
      setDeleteConfirmModal({ show: false, postId: null });
    }
  };

  const toggleComments = async (postId: string) => {
    if (expandedComments === postId) {
      setExpandedComments(null);
      return;
    }
    
    setExpandedComments(postId);
    
    // Cargar comentarios si no están cargados
    if (!comments[postId]) {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`http://127.0.0.1:8000/api/communities/posts/${postId}/comments/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          setComments(prev => ({ ...prev, [postId]: data.results || data }));
        }
      } catch (error) {
        console.error('Error loading comments:', error);
      }
    }
  };

  const handleAddComment = async (postId: string) => {
    if (!newComment.trim()) return;
    
    try {
      const token = localStorage.getItem('access_token');
      const body: any = { content: newComment };
      
      // Si es una respuesta, agregar el parent
      if (replyingTo) {
        body.parent = replyingTo.commentId;
      }
      
      const response = await fetch(`http://127.0.0.1:8000/api/communities/posts/${postId}/comments/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        const comment = await response.json();
        setComments(prev => ({
          ...prev,
          [postId]: [comment, ...(prev[postId] || [])]
        }));
        setPosts(posts.map(post =>
          post.id === postId
            ? { ...post, comment_count: post.comment_count + 1 }
            : post
        ));
        setNewComment('');
        setReplyingTo(null);
        toast.success(replyingTo ? 'Respuesta agregada' : 'Comentario agregado');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Error al agregar comentario');
    }
  };

  const handleEditComment = async (postId: string, commentId: string, newContent: string) => {
    if (!newContent.trim()) return;
    
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://127.0.0.1:8000/api/communities/comments/${commentId}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: newContent })
      });

      if (response.ok) {
        setComments(prev => ({
          ...prev,
          [postId]: prev[postId]?.map(c => 
            c.id === commentId ? { ...c, content: newContent } : c
          ) || []
        }));
        setEditingComment(null);
        toast.success('Comentario editado');
      }
    } catch (error) {
      console.error('Error editing comment:', error);
      toast.error('Error al editar comentario');
    }
  };

  const handleDeleteComment = async (postId: string, commentId: string) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://127.0.0.1:8000/api/communities/comments/${commentId}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setComments(prev => ({
          ...prev,
          [postId]: prev[postId]?.filter(c => c.id !== commentId) || []
        }));
        setPosts(posts.map(post =>
          post.id === postId
            ? { ...post, comment_count: Math.max(0, post.comment_count - 1) }
            : post
        ));
        toast.success('Comentario eliminado');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Error al eliminar comentario');
    }
  };

  const handleLikeComment = async (postId: string, commentId: string) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://127.0.0.1:8000/api/communities/comments/${commentId}/like/`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setComments(prev => ({
          ...prev,
          [postId]: prev[postId]?.map(c => 
            c.id === commentId 
              ? { ...c, is_liked: !c.is_liked, like_count: c.is_liked ? (c.like_count || 1) - 1 : (c.like_count || 0) + 1 } 
              : c
          ) || []
        }));
      }
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const openSettingsModal = () => {
    if (community) {
      setEditForm({
        name: community.name || '',
        description: community.description || '',
        rules: '', // TODO: Cargar reglas desde el backend si existe
        category: community.category || ''
      });
      setProfileImagePreview(community.profile_image || null);
      setCoverImagePreview(community.cover_image || null);
      setProfileImageFile(null);
      setCoverImageFile(null);
      setSettingsModalOpen(true);
    }
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImageFile(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImageFile(file);
      setCoverImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSaveSettings = async () => {
    if (!community) return;
    
    setIsSavingSettings(true);
    try {
      const token = localStorage.getItem('access_token');
      const formData = new FormData();
      
      formData.append('name', editForm.name);
      formData.append('description', editForm.description);
      formData.append('category', editForm.category);
      
      if (profileImageFile) {
        formData.append('profile_image', profileImageFile);
      }
      if (coverImageFile) {
        formData.append('cover_image', coverImageFile);
      }

      const response = await fetch(`http://127.0.0.1:8000/api/communities/${communityId}/`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (response.ok) {
        const updatedCommunity = await response.json();
        setCommunity(updatedCommunity);
        setSettingsModalOpen(false);
        toast.success('Comunidad actualizada correctamente');
      } else {
        const error = await response.json();
        toast.error(error.detail || 'Error al actualizar la comunidad');
      }
    } catch (error) {
      console.error('Error updating community:', error);
      toast.error('Error al actualizar la comunidad');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const filteredPosts = posts.filter(post => {
    if (activeTab === 'gallery') return post.post_type === 'image';
    if (activeTab === 'podcasts') return post.post_type === 'podcast';
    if (activeTab === 'streaming') return post.post_type === 'live';
    return true;
  });

  // Solo mostrar loading si está cargando Y no hay usuario
  if (authLoading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-10 h-10 border-3 border-neon-green border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-black text-white">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <MobileNav />
          <div className="flex items-center justify-center flex-1">
            <div className="w-10 h-10 border-3 border-neon-green border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="flex min-h-screen bg-black text-white">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <MobileNav />
          <div className="flex items-center justify-center flex-1">
            <div className="text-center">
              <p className="text-gray-400 mb-4">Comunidad no encontrada</p>
              <Button onClick={() => router.push('/communities')}>Volver a Comunidades</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Verificar si es owner - el backend envía is_owner, también comparamos username por seguridad
  const isOwner = community.is_owner === true || 
    (user && community.owner && community.owner.username === user.username);
  const isMember = community.is_member;

  return (
    <div className="flex min-h-screen bg-black text-white relative overflow-x-hidden">
      {/* Fondo de estrellas animadas - igual que en mensajes */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="stars-container">
          <div className="star star-1">✦</div>
          <div className="star star-2">✧</div>
          <div className="star star-3">✦</div>
          <div className="star star-4">✧</div>
          <div className="star star-5">✦</div>
          <div className="star star-6">✧</div>
          <div className="star star-7">✦</div>
          <div className="star star-8">✧</div>
          <div className="star star-9">✦</div>
          <div className="star star-10">✧</div>
          <div className="star star-11">✦</div>
          <div className="star star-12">✧</div>
          <div className="star star-13">✦</div>
          <div className="star star-14">✧</div>
          <div className="star star-15">✦</div>
          <div className="star star-16">✧</div>
          <div className="star star-17">✦</div>
          <div className="star star-18">✧</div>
          <div className="star star-19">✦</div>
          <div className="star star-20">✧</div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-amber-500/5" />
      </div>

      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <MobileNav />
        <main className="flex-1 overflow-y-auto overflow-x-hidden w-full xl:ml-64">
          <div className="w-full px-4 md:px-6 lg:px-8 xl:px-12 py-4 md:py-6 pb-24 md:pb-6 space-y-4 md:space-y-6 max-w-[1600px] mx-auto">
            {/* Header con portada y avatar */}
            <div className="relative -mx-4 md:-mx-6 lg:-mx-8 xl:-mx-12 mb-4">
              <div 
                className="relative h-32 md:h-48 lg:h-56 bg-gradient-to-b from-neon-green/10 to-transparent rounded-none md:rounded-lg overflow-hidden backdrop-blur-sm border-0 md:border border-white/10 cursor-pointer"
                onClick={() => {
                  if (community.cover_image) {
                    setSelectedImage({ url: community.cover_image, type: 'cover' });
                    setImageModalOpen(true);
                  }
                }}
              >
                {community.cover_image && (
                  <img
                    src={community.cover_image}
                    alt="Portada"
                    className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"></div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push('/communities');
                  }}
                  className="absolute top-4 left-4 p-2 bg-black/50 rounded-lg hover:bg-black/70 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </div>

              <div className="relative px-4 md:px-6 lg:px-8 xl:px-12 -mt-10 md:-mt-14 z-10 flex items-end space-x-3 md:space-x-4 mb-3">
                <div 
                  className="w-20 md:w-28 lg:w-32 h-20 md:h-28 lg:h-32 rounded-lg bg-gradient-to-br from-neon-green/30 to-neon-green/10 border-2 border-neon-green/50 overflow-hidden flex-shrink-0 shadow-lg backdrop-blur-sm cursor-pointer hover:border-neon-green transition-colors"
                  onClick={() => {
                    if (community.profile_image) {
                      setSelectedImage({ url: community.profile_image, type: 'profile' });
                      setImageModalOpen(true);
                    }
                  }}
                >
                  {community.profile_image && (
                    <img
                      src={community.profile_image}
                      alt={community.name}
                      className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                    />
                  )}
                </div>

                <div className="flex-1 pb-2 md:pb-3">
                  <div className="flex items-center space-x-2 mb-1 md:mb-2 flex-wrap">
                    <h1 className="text-xl md:text-3xl lg:text-4xl font-bold">{community.name}</h1>
                    
                    {/* Avatar del creador con Tooltip */}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-1.5 cursor-pointer hover:scale-105 transition-transform">
                            <Avatar className="w-6 h-6 md:w-7 md:h-7 ring-2 ring-yellow-500/50">
                              <AvatarImage 
                                src={community.owner?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(community.owner?.username || 'A')}&background=FFD700&color=000`}
                                alt={community.owner?.username}
                              />
                              <AvatarFallback className="bg-yellow-500/20 text-yellow-500 text-xs">
                                {community.owner?.username?.charAt(0).toUpperCase() || 'A'}
                              </AvatarFallback>
                            </Avatar>
                            <Crown className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="bg-black/95 border-yellow-500/30">
                          <div className="flex items-center gap-2">
                            <Crown className="w-4 h-4 text-yellow-500" />
                            <div>
                              <p className="text-xs font-semibold text-white">Creador</p>
                              <p className="text-xs text-yellow-400">{community.owner?.username}</p>
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    {community.type === 'premium' && <Crown className="w-4 md:w-5 h-4 md:h-5 text-yellow-400" />}
                    {community.type === 'private' && <Lock className="w-4 md:w-5 h-4 md:h-5 text-blue-400" />}
                    {community.type === 'page' && <Globe className="w-4 md:w-5 h-4 md:h-5 text-purple-400" />}
                    
                    {/* Botón de configuración - al lado del nombre */}
                    {isOwner && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openSettingsModal();
                        }}
                        className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors ml-2"
                        title="Configuración de la comunidad"
                      >
                        <Settings className="w-4 md:w-5 h-4 md:h-5 text-gray-300 hover:text-white" />
                      </button>
                    )}
                  </div>
                  <Badge variant="outline" className="text-xs md:text-sm">
                    {community.category}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Contenido reorganizado - Sistema completo de 2 columnas */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 relative z-10 max-w-[1500px] mx-auto px-2 lg:px-4">
              
              {/* COLUMNA IZQUIERDA - Sidebar con toda la información (4 columnas) */}
              <div className="lg:col-span-4 space-y-2 lg:pr-4">
                {/* Botón de unirse/miembro */}
                <Card className="glass-card border-white/10">
                  <CardContent className="pt-3 pb-3">
                    {!community.is_member ? (
                      <CyberButton 
                        className="w-full cursor-pointer" 
                        onClick={handleJoinCommunity}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <Users className="w-4 h-4" />
                          <span className="text-sm">Unirse</span>
                        </div>
                      </CyberButton>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-neon-green justify-center py-2">
                          <Users className="w-4 h-4" />
                          <span className="font-semibold text-sm">Miembro</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Estadísticas rápidas */}
                <Card className="glass-card border-white/10">
                  <CardContent className="pt-2.5 pb-2.5">
                    <h3 className="text-xs font-semibold text-white mb-2 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-neon-green" />
                      Estadísticas
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Miembros</span>
                        <span className="text-white font-semibold">{community.member_count}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Posts</span>
                        <span className="text-white font-semibold">{community.post_count}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Tipo</span>
                        <Badge variant="outline" className="text-xs capitalize">
                          {community.type}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Acerca de */}
                <Card className="glass-card border-white/10">
                  <CardContent className="pt-2.5 pb-2.5">
                    <h3 className="text-xs font-semibold text-white mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-400" />
                      Acerca de
                    </h3>
                    <p className="text-xs text-gray-300 leading-relaxed mb-2">
                      {community.description}
                    </p>
                    <div className="pt-2 border-t border-white/10 space-y-1.5">
                      <div className="flex items-center gap-2 text-xs">
                        <Badge variant="outline" className="text-xs">
                          {community.category}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span>Creada: {new Date(community.created_at).toLocaleDateString('es-ES')}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Reglas */}
                <Card className="glass-card border-white/10">
                  <CardContent className="pt-2.5 pb-2.5">
                    <h3 className="text-xs font-semibold text-white mb-2 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-blue-400" />
                      Reglas
                    </h3>
                    <div className="space-y-1.5">
                      {[
                        'Respeto mutuo',
                        'No spam',
                        'Contenido apropiado',
                        'Sigue las normas'
                      ].map((rule, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-gray-400">
                          <span className="text-neon-green mt-0.5">✓</span>
                          <span>{rule}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Creador */}
                <Card className="glass-card border-white/10">
                  <CardContent className="pt-2.5 pb-2.5">
                    <h3 className="text-xs font-semibold text-white mb-2 flex items-center gap-2">
                      <Crown className="w-4 h-4 text-yellow-500" />
                      Creador
                    </h3>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10 ring-2 ring-yellow-500/30">
                        <AvatarImage 
                          src={community.owner?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(community.owner?.username || 'A')}&background=FFD700&color=000`}
                          alt={community.owner?.username}
                        />
                        <AvatarFallback className="bg-yellow-500/20 text-yellow-500">
                          {community.owner?.username?.charAt(0).toUpperCase() || 'A'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">
                          {community.owner?.username}
                        </p>
                        <p className="text-xs text-yellow-500">Fundador</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Actividad reciente - Desktop */}
                <div className="hidden lg:block">
                  <Card className="glass-card border-white/10">
                    <CardContent className="pt-2.5 pb-2.5">
                      <h3 className="text-xs font-semibold text-white mb-2 flex items-center gap-2">
                        <div className="w-1 h-4 bg-purple-500 rounded-full" />
                        Actividad Reciente
                      </h3>
                      <div className="space-y-2">
                        {posts.slice(0, 3).map((post) => (
                          <div 
                            key={post.id}
                            className="flex items-start gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                            onClick={() => {
                              setActiveTab('all');
                              setActiveInfoTab('about');
                            }}
                          >
                            <img
                              src={post.author?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author?.username || 'U')}&background=39FF14&color=000`}
                              alt={post.author?.username}
                              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-white truncate">
                                {post.author?.username}
                              </p>
                              <p className="text-xs text-gray-400 truncate">
                                {post.content || 'Publicó contenido multimedia'}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {new Date(post.created_at).toLocaleDateString('es-ES')}
                              </p>
                            </div>
                          </div>
                        ))}
                        {posts.length === 0 && (
                          <p className="text-xs text-gray-500 text-center py-2">
                            No hay actividad reciente
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* COLUMNA DERECHA - Feed de publicaciones (8 columnas) */}
              <div className="lg:col-span-8 space-y-2.5 lg:pl-4 lg:pr-6">
                {/* Crear publicación (solo para miembros) */}
                {community.is_member && (
                  <Card className="glass-card border-white/10 hover:border-neon-green/30 transition-colors">
                    <CardContent className="pt-3 pb-3">
                      <div 
                        className="flex items-center gap-3 cursor-pointer"
                        onClick={() => setShowPostModal(true)}
                      >
                        <Avatar className="w-10 h-10">
                          <AvatarImage 
                            src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.username || 'U')}&background=39FF14&color=000`}
                            alt={user?.username}
                          />
                          <AvatarFallback className="bg-neon-green/20 text-neon-green">
                            {user?.username?.charAt(0).toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 bg-white/5 rounded-full px-4 py-2.5 text-sm text-gray-400 hover:bg-white/10 transition-colors">
                          ¿Qué quieres compartir?
                        </div>
                        <CyberButton size="sm">
                          <MessageSquare className="w-4 h-4" />
                        </CyberButton>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Tabs de filtro */}
                <Card className="glass-card border-white/10">
                  <CardContent className="p-0">
                    <div className="flex items-center border-b border-white/10 overflow-x-auto scrollbar-hide">
                      {[
                        { id: 'all', label: 'Todo', icon: FileText },
                        { id: 'gallery', label: 'Fotos', icon: Image },
                        { id: 'podcasts', label: 'Audio', icon: Music },
                        { id: 'streaming', label: 'Live', icon: Radio }
                      ].map(({ id, label, icon: Icon }) => (
                        <button
                          key={id}
                          onClick={() => setActiveTab(id as any)}
                          className={`flex items-center gap-1.5 px-4 py-3 text-xs font-medium transition-all whitespace-nowrap border-b-2 ${
                            activeTab === id
                              ? 'text-neon-green border-neon-green bg-neon-green/5'
                              : 'text-gray-400 border-transparent hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{label}</span>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Feed de publicaciones */}
                <div className="space-y-2.5 pb-4">
                  {posts.length === 0 ? (
                    <Card className="glass-card border-white/10">
                      <CardContent className="py-12 text-center">
                        <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                        <p className="text-gray-400 text-sm mb-2">No hay publicaciones</p>
                        <p className="text-gray-500 text-xs mb-4">Sé el primero en compartir</p>
                        {community.is_member && (
                          <CyberButton onClick={() => setShowPostModal(true)}>
                            Crear publicación
                          </CyberButton>
                        )}
                      </CardContent>
                    </Card>
                  ) : (
                    posts
                      .filter(post => {
                        if (activeTab === 'gallery') return post.post_type === 'image';
                        if (activeTab === 'podcasts') return post.post_type === 'podcast';
                        if (activeTab === 'streaming') return post.post_type === 'live';
                        return true;
                      })
                      .map(post => (
                        <Card key={post.id} className="glass-card border-white/10 hover:border-neon-green/30 transition-colors backdrop-blur-md overflow-hidden w-full">
                          <CardContent className="pt-3 md:pt-4 px-3 md:px-4 pb-3 md:pb-4">
                            <div className="flex items-start justify-between mb-2 md:mb-3">
                              <div className="flex items-center space-x-2">
                                <img
                                  src={post.author?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author?.username || 'U')}&background=39FF14&color=000`}
                                  alt={post.author?.username || 'Usuario'}
                                  className="w-8 md:w-10 h-8 md:h-10 rounded-full object-cover flex-shrink-0 ring-2 ring-neon-green/30 cursor-pointer hover:ring-neon-green transition-all"
                                  onClick={() => {
                                    if (post.author) {
                                      setSelectedProfileUser({
                                        id: post.author.id,
                                        username: post.author.username,
                                        displayName: post.author.username,
                                        avatar: post.author.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author.username)}&background=39FF14&color=000`,
                                        email: '',
                                        bio: '',
                                        coverPhoto: undefined,
                                        position: '',
                                        team: '',
                                        followers: 0,
                                        following: 0,
                                        posts: 0,
                                        interests: [],
                                        createdAt: new Date().toISOString(),
                                      });
                                      setShowUserProfile(true);
                                    }
                                  }}
                                />
                                <div>
                                  <p 
                                    className="font-semibold text-xs md:text-sm cursor-pointer hover:text-neon-green transition-colors"
                                    onClick={() => {
                                      if (post.author) {
                                        setSelectedProfileUser({
                                          id: post.author.id,
                                          username: post.author.username,
                                          displayName: post.author.username,
                                          avatar: post.author.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author.username)}&background=39FF14&color=000`,
                                          email: '',
                                          bio: '',
                                          coverPhoto: undefined,
                                          position: '',
                                          team: '',
                                          followers: 0,
                                          following: 0,
                                          posts: 0,
                                          interests: [],
                                          createdAt: new Date().toISOString(),
                                        });
                                        setShowUserProfile(true);
                                      }
                                    }}
                                  >
                                    {post.author?.username || 'Usuario'}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {new Date(post.created_at).toLocaleDateString('es-ES')}
                                  </p>
                                </div>
                              </div>

                              {user?.id === post.author?.id && (
                                <button
                                  onClick={() => handleDeletePost(post.id)}
                                  className="p-1 hover:bg-red-500/10 rounded transition-colors"
                                >
                                  <Trash2 className="w-4 h-4 text-red-400" />
                                </button>
                              )}
                            </div>

                            {post.content && (
                              <p className="text-gray-200 text-xs md:text-sm mb-2 md:mb-3 leading-relaxed">{post.content}</p>
                            )}

                            {post.post_type === 'image' && post.image_url && (
                              <div className="rounded-lg overflow-hidden mb-2 md:mb-3 -mx-3 md:-mx-4">
                                <img
                                  src={post.image_url}
                                  alt="Post"
                                  className="w-full h-auto object-contain max-h-96"
                                />
                              </div>
                            )}

                            {post.post_type === 'video' && (post.video_file_url || post.video_url) && (
                              <div className="rounded-lg overflow-hidden mb-2 md:mb-3 -mx-3 md:-mx-4 bg-black">
                                <video
                                  src={post.video_file_url || post.video_url}
                                  controls
                                  className="w-full h-auto max-h-[500px] object-contain"
                                  style={{ aspectRatio: 'auto' }}
                                />
                              </div>
                            )}

                            {post.post_type === 'podcast' && (post.podcast_file_url || post.podcast_url) && (
                              <audio
                                src={post.podcast_file_url || post.podcast_url}
                                controls
                                className="w-full mb-2 md:mb-3 h-10"
                              />
                            )}

                            {post.post_type === 'live' && (
                              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-2 text-center mb-2 md:mb-3">
                                <div className="flex items-center justify-center space-x-2">
                                  <Radio className="w-3 h-3 text-red-500 animate-pulse" />
                                  <span className="text-xs text-red-400">EN VIVO</span>
                                </div>
                              </div>
                            )}

                            <div className="flex items-center space-x-2 text-xs text-gray-400 pt-2 md:pt-3 border-t border-white/10">
                              <button
                                onClick={() => handleReaction(post.id, 'like')}
                                className={`flex items-center space-x-1 px-2 py-1 rounded transition-colors ${
                                  post.is_liked
                                    ? 'text-red-500 bg-red-500/10'
                                    : 'text-gray-400 hover:text-red-500 hover:bg-red-500/10'
                                }`}
                                title="Me gusta"
                              >
                                <Heart className={`w-3 h-3 ${post.is_liked ? 'fill-current' : ''}`} />
                                <span>{post.like_count || 0}</span>
                              </button>
                              
                              <button
                                onClick={() => handleReaction(post.id, 'laugh')}
                                className="flex items-center space-x-1 px-2 py-1 rounded transition-colors text-gray-400 hover:text-yellow-500 hover:bg-yellow-500/10"
                                title="Jajaja"
                              >
                                <span className="text-sm">😂</span>
                                <span>{(post as any).laugh_count || 0}</span>
                              </button>
                              
                              <button
                                onClick={() => handleReaction(post.id, 'dislike')}
                                className="flex items-center space-x-1 px-2 py-1 rounded transition-colors text-gray-400 hover:text-blue-500 hover:bg-blue-500/10"
                                title="No me gusta"
                              >
                                <ThumbsDown className="w-3 h-3" />
                                <span>{(post as any).dislike_count || 0}</span>
                              </button>
                              
                              <button
                                onClick={() => toggleComments(post.id)}
                                className={`flex items-center space-x-1 px-2 py-1 rounded transition-colors ${
                                  expandedComments === post.id
                                    ? 'text-neon-green bg-neon-green/10'
                                    : 'text-gray-400 hover:text-neon-green hover:bg-neon-green/10'
                                }`}
                                title="Comentarios"
                              >
                                <MessageSquare className="w-3 h-3" />
                                <span>{post.comment_count}</span>
                              </button>
                            </div>

                            {/* Sección de comentarios */}
                            {expandedComments === post.id && (
                              <div className="mt-3 pt-3 border-t border-white/10 space-y-3">
                                {replyingTo && (
                                  <div className="flex items-center justify-between bg-neon-green/10 border border-neon-green/30 rounded-lg px-3 py-2">
                                    <span className="text-xs text-neon-green">
                                      Respondiendo a @{replyingTo.username}
                                    </span>
                                    <button
                                      onClick={() => setReplyingTo(null)}
                                      className="text-gray-400 hover:text-white"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                )}

                                <div className="flex space-x-2">
                                  <img
                                    src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.username || 'U')}&background=39FF14&color=000`}
                                    alt="Tu avatar"
                                    className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                                  />
                                  <div className="flex-1 flex space-x-2">
                                    <input
                                      type="text"
                                      value={newComment}
                                      onChange={(e) => setNewComment(e.target.value)}
                                      placeholder={replyingTo ? `Responder a @${replyingTo.username}...` : "Escribe un comentario..."}
                                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-neon-green/50"
                                      onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                                    />
                                    <button
                                      onClick={() => handleAddComment(post.id)}
                                      className="px-3 py-1.5 bg-neon-green/20 text-neon-green rounded-lg text-xs hover:bg-neon-green/30 transition-colors"
                                    >
                                      Enviar
                                    </button>
                                  </div>
                                </div>

                                <div className="space-y-2 max-h-80 overflow-y-auto">
                                  {comments[post.id]?.length === 0 && (
                                    <p className="text-gray-500 text-xs text-center py-2">No hay comentarios aún</p>
                                  )}
                                  {comments[post.id]?.map((comment: any) => (
                                    <div key={comment.id} className="bg-white/5 rounded-lg p-2">
                                      <div className="flex space-x-2">
                                        <img
                                          src={comment.author?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.author?.username || 'U')}&background=39FF14&color=000`}
                                          alt={comment.author?.username}
                                          className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                                        />
                                        <div className="flex-1">
                                          <div className="flex items-center justify-between">
                                            <span className="text-xs font-semibold text-white">
                                              {comment.author?.username}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                              {new Date(comment.created_at).toLocaleDateString('es-ES')}
                                            </span>
                                          </div>
                                          <p className="text-xs text-gray-300 mt-0.5">{comment.content}</p>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))
                  )}
                </div>

                {/* Tab: Acerca de */}
                {activeInfoTab === 'about' && activeTab === 'all' && (
                  <div className="grid grid-cols-1 gap-3 w-full pb-4">
                    {/* Descripción */}
                    <Card className="glass-card border-white/10 hover:border-neon-green/30 transition-all duration-300 w-full">
                      <CardContent className="pt-4 pb-4">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-1 h-6 bg-neon-green rounded-full" />
                          <h3 className="text-sm font-semibold text-neon-green uppercase tracking-wider">
                            Descripción
                          </h3>
                        </div>
                        <p className="text-sm text-gray-300 leading-relaxed">
                          {community.description}
                        </p>
                      </CardContent>
                    </Card>

                    {/* Reglas */}
                    <Card className="glass-card border-white/10 hover:border-blue-500/30 transition-all duration-300 w-full">
                      <CardContent className="pt-4 pb-4">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-1 h-6 bg-blue-500 rounded-full" />
                          <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider">
                            Reglas de la Comunidad
                          </h3>
                        </div>
                        <div className="space-y-2">
                          {[
                            { icon: '✓', text: 'Mantén el respeto entre miembros' },
                            { icon: '✓', text: 'No hagas spam ni publicidad' },
                            { icon: '✓', text: 'Sigue las normas de la comunidad' },
                            { icon: '✓', text: 'Contenido apropiado y relevante' }
                          ].map((rule, idx) => (
                            <div 
                              key={idx}
                              className="flex items-start gap-2 text-sm text-gray-400 hover:text-gray-300 transition-colors group"
                            >
                              <span className="text-neon-green group-hover:scale-110 transition-transform">
                                {rule.icon}
                              </span>
                              <span>{rule.text}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Tab: Estadísticas */}
                {activeInfoTab === 'stats' && activeTab === 'all' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full pb-4">
                    {/* Miembros */}
                    <Card className="glass-card border-white/10 hover:border-neon-green/30 transition-all duration-300 group cursor-pointer w-full">
                      <CardContent className="pt-4 pb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-xl bg-neon-green/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Users className="w-7 h-7 text-neon-green" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-gray-400 mb-1">Total Miembros</p>
                            <p className="text-2xl font-bold text-white">{community.member_count}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Publicaciones */}
                    <Card className="glass-card border-white/10 hover:border-blue-500/30 transition-all duration-300 group cursor-pointer w-full">
                      <CardContent className="pt-4 pb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-xl bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <MessageSquare className="w-7 h-7 text-blue-400" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-gray-400 mb-1">Publicaciones</p>
                            <p className="text-2xl font-bold text-white">{community.post_count}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Actividad */}
                    <Card className="glass-card border-white/10 hover:border-purple-500/30 transition-all duration-300 group cursor-pointer w-full">
                      <CardContent className="pt-4 pb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-xl bg-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Zap className="w-7 h-7 text-purple-400" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-gray-400 mb-1">Actividad</p>
                            <p className="text-lg font-semibold text-white">Alta</p>
                            <div className="flex gap-0.5 mt-1">
                              {[1, 2, 3, 4, 5].map((i) => (
                                <div
                                  key={i}
                                  className="w-1 bg-purple-400 rounded-full"
                                  style={{
                                    height: `${i * 3 + 6}px`,
                                    opacity: i <= 4 ? 1 : 0.3
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Engagement */}
                    <Card className="glass-card border-white/10 hover:border-yellow-500/30 transition-all duration-300 group cursor-pointer w-full">
                      <CardContent className="pt-4 pb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-xl bg-yellow-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Heart className="w-7 h-7 text-yellow-400" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-gray-400 mb-1">Engagement</p>
                            <p className="text-2xl font-bold text-white">
                              {Math.round((community.post_count / Math.max(community.member_count, 1)) * 100)}%
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Feed de publicaciones filtradas (Galería, Podcasts, Streaming) */}
                {activeTab !== 'all' && (
                  <div className="space-y-2.5 pb-4 w-full">
                    {filteredPosts.length === 0 ? (
                      <Card className="glass-card border-white/10 w-full">
                        <CardContent className="py-12 text-center">
                          <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                          <p className="text-gray-400 text-sm">No hay publicaciones en esta categoría</p>
                          {community.is_member && (
                            <Button 
                              variant="outline" 
                              className="mt-4"
                              onClick={() => setShowPostModal(true)}
                            >
                              Crear la primera publicación
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    ) : (
                      filteredPosts.map(post => (
                      <Card key={post.id} className="glass-card border-white/10 hover:border-neon-green/30 transition-colors backdrop-blur-md overflow-hidden w-full">
                        <CardContent className="pt-3 md:pt-4 px-3 md:px-4 pb-3 md:pb-4">
                          <div className="flex items-start justify-between mb-2 md:mb-3">
                            <div className="flex items-center space-x-2">
                              <img
                                src={post.author?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author?.username || 'U')}&background=39FF14&color=000`}
                                alt={post.author?.username || 'Usuario'}
                                className="w-8 md:w-10 h-8 md:h-10 rounded-full object-cover flex-shrink-0 ring-2 ring-neon-green/30 cursor-pointer hover:ring-neon-green transition-all"
                                onClick={() => {
                                  if (post.author) {
                                    setSelectedProfileUser({
                                      id: post.author.id,
                                      username: post.author.username,
                                      displayName: post.author.username,
                                      avatar: post.author.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author.username)}&background=39FF14&color=000`,
                                      email: '',
                                      bio: '',
                                      coverPhoto: undefined,
                                      position: '',
                                      team: '',
                                      followers: 0,
                                      following: 0,
                                      posts: 0,
                                      interests: [],
                                      createdAt: new Date().toISOString(),
                                    });
                                    setShowUserProfile(true);
                                  }
                                }}
                              />
                              <div>
                                <p 
                                  className="font-semibold text-xs md:text-sm cursor-pointer hover:text-neon-green transition-colors"
                                  onClick={() => {
                                    if (post.author) {
                                      setSelectedProfileUser({
                                        id: post.author.id,
                                        username: post.author.username,
                                        displayName: post.author.username,
                                        avatar: post.author.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author.username)}&background=39FF14&color=000`,
                                        email: '',
                                        bio: '',
                                        coverPhoto: undefined,
                                        position: '',
                                        team: '',
                                        followers: 0,
                                        following: 0,
                                        posts: 0,
                                        interests: [],
                                        createdAt: new Date().toISOString(),
                                      });
                                      setShowUserProfile(true);
                                    }
                                  }}
                                >
                                  {post.author?.username || 'Usuario'}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {new Date(post.created_at).toLocaleDateString('es-ES')}
                                </p>
                              </div>
                            </div>

                            {user?.id === post.author?.id && (
                              <button
                                onClick={() => handleDeletePost(post.id)}
                                className="p-1 hover:bg-red-500/10 rounded transition-colors"
                              >
                                <Trash2 className="w-4 h-4 text-red-400" />
                              </button>
                            )}
                          </div>

                          {post.content && (
                            <p className="text-gray-200 text-xs md:text-sm mb-2 md:mb-3 leading-relaxed">{post.content}</p>
                          )}

                          {post.post_type === 'image' && post.image_url && (
                            <div className="rounded-lg overflow-hidden mb-2 md:mb-3 -mx-3 md:-mx-4">
                              <img
                                src={post.image_url}
                                alt="Post"
                                className="w-full h-auto object-contain max-h-96"
                              />
                            </div>
                          )}

                          {post.post_type === 'video' && (post.video_file_url || post.video_url) && (
                            <div className="rounded-lg overflow-hidden mb-2 md:mb-3 -mx-3 md:-mx-4 bg-black">
                              <video
                                src={post.video_file_url || post.video_url}
                                controls
                                className="w-full h-auto max-h-[500px] object-contain"
                                style={{ aspectRatio: 'auto' }}
                              />
                            </div>
                          )}

                          {post.post_type === 'podcast' && (post.podcast_file_url || post.podcast_url) && (
                            <audio
                              src={post.podcast_file_url || post.podcast_url}
                              controls
                              className="w-full mb-2 md:mb-3 h-10"
                            />
                          )}

                          {post.post_type === 'live' && (
                            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-2 text-center mb-2 md:mb-3">
                              <div className="flex items-center justify-center space-x-2">
                                <Radio className="w-3 h-3 text-red-500 animate-pulse" />
                                <span className="text-xs text-red-400">EN VIVO</span>
                              </div>
                            </div>
                          )}

                          <div className="flex items-center space-x-2 text-xs text-gray-400 pt-2 md:pt-3 border-t border-white/10">
                            {/* Like */}
                            <button
                              onClick={() => handleReaction(post.id, 'like')}
                              className={`flex items-center space-x-1 px-2 py-1 rounded transition-colors ${
                                post.is_liked
                                  ? 'text-red-500 bg-red-500/10'
                                  : 'text-gray-400 hover:text-red-500 hover:bg-red-500/10'
                              }`}
                              title="Me gusta"
                            >
                              <Heart className={`w-3 h-3 ${post.is_liked ? 'fill-current' : ''}`} />
                              <span>{post.like_count || 0}</span>
                            </button>
                            
                            {/* Jajaja */}
                            <button
                              onClick={() => handleReaction(post.id, 'laugh')}
                              className="flex items-center space-x-1 px-2 py-1 rounded transition-colors text-gray-400 hover:text-yellow-500 hover:bg-yellow-500/10"
                              title="Jajaja"
                            >
                              <span className="text-sm">😂</span>
                              <span>{(post as any).laugh_count || 0}</span>
                            </button>
                            
                            {/* No me gusta */}
                            <button
                              onClick={() => handleReaction(post.id, 'dislike')}
                              className="flex items-center space-x-1 px-2 py-1 rounded transition-colors text-gray-400 hover:text-blue-500 hover:bg-blue-500/10"
                              title="No me gusta"
                            >
                              <ThumbsDown className="w-3 h-3" />
                              <span>{(post as any).dislike_count || 0}</span>
                            </button>
                            
                            {/* Comentarios */}
                            <button
                              onClick={() => toggleComments(post.id)}
                              className={`flex items-center space-x-1 px-2 py-1 rounded transition-colors ${
                                expandedComments === post.id
                                  ? 'text-neon-green bg-neon-green/10'
                                  : 'text-gray-400 hover:text-neon-green hover:bg-neon-green/10'
                              }`}
                              title="Comentarios"
                            >
                              <MessageSquare className="w-3 h-3" />
                              <span>{post.comment_count}</span>
                            </button>
                          </div>

                          {/* Sección de comentarios expandible */}
                          {expandedComments === post.id && (
                            <div className="mt-3 pt-3 border-t border-white/10 space-y-3">
                              {/* Indicador de respuesta */}
                              {replyingTo && (
                                <div className="flex items-center justify-between bg-neon-green/10 border border-neon-green/30 rounded-lg px-3 py-2">
                                  <span className="text-xs text-neon-green">
                                    Respondiendo a @{replyingTo.username}
                                  </span>
                                  <button
                                    onClick={() => setReplyingTo(null)}
                                    className="text-gray-400 hover:text-white"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              )}

                              {/* Input para nuevo comentario */}
                              <div className="flex space-x-2">
                                <img
                                  src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.username || 'U')}&background=39FF14&color=000`}
                                  alt="Tu avatar"
                                  className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                                />
                                <div className="flex-1 flex space-x-2">
                                  <input
                                    type="text"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder={replyingTo ? `Responder a @${replyingTo.username}...` : "Escribe un comentario..."}
                                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-neon-green/50"
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                                  />
                                  <button
                                    onClick={() => handleAddComment(post.id)}
                                    className="px-3 py-1.5 bg-neon-green/20 text-neon-green rounded-lg text-xs hover:bg-neon-green/30 transition-colors"
                                  >
                                    Enviar
                                  </button>
                                </div>
                              </div>

                              {/* Lista de comentarios */}
                              <div className="space-y-2 max-h-80 overflow-y-auto">
                                {comments[post.id]?.length === 0 && (
                                  <p className="text-gray-500 text-xs text-center py-2">No hay comentarios aún</p>
                                )}
                                {comments[post.id]?.map((comment: any) => (
                                  <div key={comment.id} className="bg-white/5 rounded-lg p-2">
                                    {editingComment?.id === comment.id && editingComment ? (
                                      /* Modo edición */
                                      <div className="flex space-x-2">
                                        <input
                                          type="text"
                                          value={editingComment.content}
                                          onChange={(e) => setEditingComment({ id: editingComment.id, content: e.target.value })}
                                          className="flex-1 bg-white/10 border border-neon-green/50 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                                          autoFocus
                                        />
                                        <button
                                          onClick={() => handleEditComment(post.id, comment.id, editingComment.content)}
                                          className="px-2 py-1 bg-neon-green/20 text-neon-green rounded text-xs hover:bg-neon-green/30"
                                        >
                                          ✓
                                        </button>
                                        <button
                                          onClick={() => setEditingComment(null)}
                                          className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs hover:bg-red-500/30"
                                        >
                                          ✕
                                        </button>
                                      </div>
                                    ) : (
                                      /* Vista normal */
                                      <div className="flex space-x-2">
                                        <img
                                          src={comment.author?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.author?.username || 'U')}&background=39FF14&color=000`}
                                          alt={comment.author?.username}
                                          className="w-6 h-6 rounded-full object-cover flex-shrink-0 cursor-pointer"
                                          onClick={() => {
                                            if (comment.author) {
                                              setSelectedProfileUser({
                                                id: comment.author.id,
                                                username: comment.author.username,
                                                displayName: comment.author.username,
                                                avatar: comment.author.avatar,
                                                email: '',
                                                bio: '',
                                                coverPhoto: undefined,
                                                position: '',
                                                team: '',
                                                followers: 0,
                                                following: 0,
                                                posts: 0,
                                                interests: [],
                                                createdAt: new Date().toISOString(),
                                              });
                                              setShowUserProfile(true);
                                            }
                                          }}
                                        />
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                              <span 
                                                className="text-xs font-semibold text-white cursor-pointer hover:text-neon-green"
                                                onClick={() => {
                                                  if (comment.author) {
                                                    setSelectedProfileUser({
                                                      id: comment.author.id,
                                                      username: comment.author.username,
                                                      displayName: comment.author.username,
                                                      avatar: comment.author.avatar,
                                                      email: '',
                                                      bio: '',
                                                      coverPhoto: undefined,
                                                      position: '',
                                                      team: '',
                                                      followers: 0,
                                                      following: 0,
                                                      posts: 0,
                                                      interests: [],
                                                      createdAt: new Date().toISOString(),
                                                    });
                                                    setShowUserProfile(true);
                                                  }
                                                }}
                                              >
                                                {comment.author?.username}
                                              </span>
                                              <span className="text-xs text-gray-500">
                                                {new Date(comment.created_at).toLocaleDateString('es-ES')}
                                              </span>
                                            </div>
                                            
                                            {/* Opciones del comentario (solo para el autor) */}
                                            {user?.id === comment.author?.id && (
                                              <div className="flex items-center space-x-1">
                                                <button
                                                  onClick={() => setEditingComment({ id: comment.id, content: comment.content })}
                                                  className="p-1 text-gray-400 hover:text-neon-green transition-colors"
                                                  title="Editar"
                                                >
                                                  <span className="text-xs">✏️</span>
                                                </button>
                                                <button
                                                  onClick={() => handleDeleteComment(post.id, comment.id)}
                                                  className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                                                  title="Eliminar"
                                                >
                                                  <Trash2 className="w-3 h-3" />
                                                </button>
                                              </div>
                                            )}
                                          </div>
                                          
                                          {/* Contenido del comentario */}
                                          <p className="text-xs text-gray-300 mt-0.5">{comment.content}</p>
                                          
                                          {/* Acciones del comentario */}
                                          <div className="flex items-center space-x-3 mt-2">
                                            {/* Like */}
                                            <button
                                              onClick={() => handleLikeComment(post.id, comment.id)}
                                              className={`flex items-center space-x-1 text-xs transition-colors ${
                                                comment.is_liked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                                              }`}
                                            >
                                              <Heart className={`w-3 h-3 ${comment.is_liked ? 'fill-current' : ''}`} />
                                              <span>{comment.like_count || 0}</span>
                                            </button>
                                            
                                            {/* Responder */}
                                            <button
                                              onClick={() => setReplyingTo({ commentId: comment.id, username: comment.author?.username })}
                                              className="flex items-center space-x-1 text-xs text-gray-400 hover:text-neon-green transition-colors"
                                            >
                                              <MessageSquare className="w-3 h-3" />
                                              <span>Responder</span>
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal para crear publicación */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <Card className="glass-card border-neon-green/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Nueva publicación</h2>
                <button
                  onClick={closePostModal}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400 hover:text-white" />
                </button>
              </div>

              {/* Selector de tipo de contenido */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-6">
                {[
                  { type: 'text', icon: FileText, label: 'Estado' },
                  { type: 'image', icon: Image, label: 'Foto' },
                  { type: 'video', icon: Video, label: 'Video' },
                  { type: 'podcast', icon: Mic, label: 'Podcast' },
                  { type: 'link', icon: LinkIcon, label: 'Link' },
                  { type: 'live', icon: Radio, label: 'En Vivo' }
                ].map(({ type, icon: Icon, label }) => (
                  <button
                    key={type}
                    onClick={() => {
                      setNewPostType(type as any);
                      setSelectedFile(null);
                      setLinkPreview(null);
                    }}
                    className={`flex flex-col items-center space-y-2 p-3 rounded-lg transition-colors ${
                      newPostType === type
                        ? 'bg-neon-green/20 border-2 border-neon-green'
                        : 'bg-white/5 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${newPostType === type ? 'text-neon-green' : 'text-gray-400'}`} />
                    <span className={`text-xs font-semibold ${newPostType === type ? 'text-neon-green' : 'text-gray-400'}`}>
                      {label}
                    </span>
                  </button>
                ))}
              </div>

              <form onSubmit={handleCreatePost} className="space-y-4">
                <Textarea
                  placeholder={
                    newPostType === 'link' 
                      ? 'Pega un link aquí...' 
                      : '¿Qué quieres compartir?'
                  }
                  value={newPostContent}
                  onChange={(e) => handleContentChange(e.target.value)}
                  className="bg-white/5 border-white/10 text-white min-h-[100px] resize-none"
                />

                {/* Preview de link */}
                {newPostType === 'link' && linkPreview && (
                  <div className="border border-white/20 rounded-lg overflow-hidden bg-white/5">
                    {linkPreview.image && (
                      <img 
                        src={linkPreview.image} 
                        alt="Preview" 
                        className="w-full h-32 object-cover"
                      />
                    )}
                    <div className="p-3">
                      {linkPreview.title && (
                        <h3 className="font-semibold text-sm text-white mb-1 line-clamp-2">
                          {linkPreview.title}
                        </h3>
                      )}
                      {linkPreview.description && (
                        <p className="text-xs text-gray-400 line-clamp-2 mb-2">
                          {linkPreview.description}
                        </p>
                      )}
                      {linkPreview.url && (
                        <p className="text-xs text-neon-green truncate">
                          {new URL(linkPreview.url).hostname}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Selector de archivo */}
                {newPostType === 'image' && (
                  <div className="border-2 border-dashed border-white/20 rounded-lg p-4 text-center hover:border-neon-green/50 transition-colors">
                    <input
                      type="file"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      className="hidden"
                      id="file-input"
                      accept="image/*"
                    />
                    <label htmlFor="file-input" className="cursor-pointer block">
                      {selectedFile ? (
                        <p className="text-sm text-neon-green font-semibold">{selectedFile.name}</p>
                      ) : (
                        <div className="space-y-1">
                          <Image className="w-6 h-6 text-gray-400 mx-auto" />
                          <p className="text-sm text-gray-400">Haz clic para seleccionar una imagen</p>
                        </div>
                      )}
                    </label>
                  </div>
                )}

                {newPostType === 'video' && (
                  <div className="border-2 border-dashed border-white/20 rounded-lg p-4 text-center hover:border-neon-green/50 transition-colors">
                    <input
                      type="file"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      className="hidden"
                      id="video-input"
                      accept="video/*"
                    />
                    <label htmlFor="video-input" className="cursor-pointer block">
                      {selectedFile ? (
                        <p className="text-sm text-neon-green font-semibold">{selectedFile.name}</p>
                      ) : (
                        <div className="space-y-1">
                          <Video className="w-6 h-6 text-gray-400 mx-auto" />
                          <p className="text-sm text-gray-400">Haz clic para seleccionar un video</p>
                        </div>
                      )}
                    </label>
                  </div>
                )}

                {newPostType === 'podcast' && (
                  <div className="border-2 border-dashed border-white/20 rounded-lg p-4 text-center hover:border-neon-green/50 transition-colors">
                    <input
                      type="file"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      className="hidden"
                      id="podcast-input"
                      accept="audio/*"
                    />
                    <label htmlFor="podcast-input" className="cursor-pointer block">
                      {selectedFile ? (
                        <p className="text-sm text-neon-green font-semibold">{selectedFile.name}</p>
                      ) : (
                        <div className="space-y-1">
                          <Mic className="w-6 h-6 text-gray-400 mx-auto" />
                          <p className="text-sm text-gray-400">Haz clic para seleccionar un archivo de audio</p>
                          <p className="text-xs text-gray-500">MP3, WAV, OGG</p>
                        </div>
                      )}
                    </label>
                  </div>
                )}

                {newPostType === 'live' && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <Radio className="w-5 h-5 text-red-500 animate-pulse" />
                      <span className="text-sm text-red-400">Transmisión en vivo</span>
                    </div>
                    
                    {/* Opciones de streaming */}
                    <div className="grid grid-cols-2 gap-3">
                      {/* Opción 1: Iniciar con cámara */}
                      <button
                        type="button"
                        onClick={() => {
                          // Redirigir a la página de streaming con la comunidad
                          router.push(`/live/start?community=${communityId}`);
                        }}
                        className="flex flex-col items-center p-4 bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-xl hover:border-red-500/60 transition-all group"
                      >
                        <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mb-2 group-hover:bg-red-500/30 transition-colors">
                          <Video className="w-6 h-6 text-red-400" />
                        </div>
                        <span className="text-sm font-semibold text-white">Iniciar Transmisión</span>
                        <span className="text-xs text-gray-400 mt-1">Usar mi cámara</span>
                      </button>
                      
                      {/* Opción 2: URL externa */}
                      <button
                        type="button"
                        onClick={() => setLinkPreview({ showUrlInput: true, type: 'live' })}
                        className="flex flex-col items-center p-4 bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-xl hover:border-purple-500/60 transition-all group"
                      >
                        <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mb-2 group-hover:bg-purple-500/30 transition-colors">
                          <LinkIcon className="w-6 h-6 text-purple-400" />
                        </div>
                        <span className="text-sm font-semibold text-white">URL Externa</span>
                        <span className="text-xs text-gray-400 mt-1">YouTube, Twitch, etc.</span>
                      </button>
                    </div>
                    
                    {/* Input de URL si se selecciona URL externa */}
                    {linkPreview?.showUrlInput && (
                      <div className="space-y-2">
                        <input
                          type="url"
                          placeholder="URL de la transmisión (YouTube, Twitch, etc.)"
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-neon-green/50 focus:outline-none"
                          onChange={(e) => setLinkPreview({ ...linkPreview, url: e.target.value })}
                        />
                        <p className="text-xs text-gray-500">
                          Pega el enlace de tu transmisión en YouTube, Twitch, Facebook Live, etc.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-end space-x-2 pt-4 border-t border-white/10">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closePostModal}
                  >
                    Cancelar
                  </Button>
                  <CyberButton
                    type="submit"
                    disabled={isCreatingPost}
                  >
                    {isCreatingPost ? 'Publicando...' : 'Publicar'}
                  </CyberButton>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal de confirmación para eliminar publicación */}
      {deleteConfirmModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <Card className="glass-card border-red-500/30 w-full max-w-md animate-in fade-in zoom-in duration-200">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-red-500/20 rounded-full flex items-center justify-center">
                  <Trash2 className="w-8 h-8 text-red-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Eliminar publicación</h3>
                  <p className="text-gray-400 text-sm">
                    ¿Estás seguro de que deseas eliminar esta publicación? Esta acción no se puede deshacer.
                  </p>
                </div>
                <div className="flex space-x-3 pt-2">
                  <Button
                    variant="outline"
                    className="flex-1 border-white/20 hover:bg-white/10"
                    onClick={() => setDeleteConfirmModal({ show: false, postId: null })}
                    disabled={isDeleting}
                  >
                    Cancelar
                  </Button>
                  <Button
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white border-0"
                    onClick={confirmDeletePost}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <span className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Eliminando...</span>
                      </span>
                    ) : (
                      'Eliminar'
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal para ver imagen expandida */}
      <Dialog open={imageModalOpen} onOpenChange={setImageModalOpen}>
        <DialogContent className="max-w-4xl w-full p-0 bg-black/95 border-white/10">
          <div className="relative">
            <button
              onClick={() => setImageModalOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            
            {selectedImage && (
              <div className={`flex items-center justify-center ${selectedImage.type === 'cover' ? 'min-h-[300px] max-h-[70vh]' : 'p-8'}`}>
                <img
                  src={selectedImage.url}
                  alt={selectedImage.type === 'profile' ? 'Foto de perfil' : 'Foto de portada'}
                  className={`${
                    selectedImage.type === 'profile' 
                      ? 'w-80 h-80 rounded-lg object-cover ring-4 ring-neon-green/50' 
                      : 'w-full h-full object-contain max-h-[70vh]'
                  }`}
                />
              </div>
            )}
            
            {selectedImage && (
              <div className="p-4 text-center text-gray-400 text-sm">
                {selectedImage.type === 'profile' ? 'Foto de perfil' : 'Foto de portada'} de {community?.name}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Configuración de la Comunidad */}
      <Dialog open={settingsModalOpen} onOpenChange={setSettingsModalOpen}>
        <DialogContent className="max-w-2xl w-full bg-black/95 border-white/10 max-h-[90vh] overflow-y-auto">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-neon-green" />
                Configuración de la Comunidad
              </h2>
              <button
                onClick={() => setSettingsModalOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Foto de Portada */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Foto de Portada</label>
              <div className="relative h-32 bg-white/5 rounded-lg overflow-hidden border border-white/10">
                {coverImagePreview ? (
                  <img src={coverImagePreview} alt="Portada" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                )}
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                  <div className="flex items-center gap-2 text-white">
                    <Camera className="w-5 h-5" />
                    <span>Cambiar portada</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Foto de Perfil */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Foto de Perfil</label>
              <div className="flex items-center gap-4">
                <div className="relative w-24 h-24 bg-white/5 rounded-lg overflow-hidden border border-white/10">
                  {profileImagePreview ? (
                    <img src={profileImagePreview} alt="Perfil" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}
                  <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="w-5 h-5 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfileImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500">Haz clic para cambiar la foto de perfil</p>
              </div>
            </div>

            {/* Nombre */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Nombre de la Comunidad</label>
              <Input
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                placeholder="Nombre de la comunidad"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>

            {/* Categoría */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Categoría / Etiqueta</label>
              <Input
                value={editForm.category}
                onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                placeholder="ej: tecnología, deportes, música"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Descripción</label>
              <Textarea
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                placeholder="Describe tu comunidad..."
                className="bg-white/5 border-white/10 text-white min-h-[80px]"
              />
            </div>

            {/* Reglas */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Reglas de la Comunidad</label>
              <Textarea
                value={editForm.rules}
                onChange={(e) => setEditForm({ ...editForm, rules: e.target.value })}
                placeholder="Define las reglas de tu comunidad..."
                className="bg-white/5 border-white/10 text-white min-h-[100px]"
              />
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <Button
                variant="outline"
                onClick={() => setSettingsModalOpen(false)}
                className="border-white/20"
              >
                Cancelar
              </Button>
              <CyberButton
                onClick={handleSaveSettings}
                disabled={isSavingSettings}
              >
                {isSavingSettings ? 'Guardando...' : 'Guardar Cambios'}
              </CyberButton>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de perfil de usuario */}
      {selectedProfileUser && (
        <UserProfileDialog
          isOpen={showUserProfile}
          onClose={() => {
            setShowUserProfile(false);
            setSelectedProfileUser(null);
          }}
          profileUser={selectedProfileUser}
        />
      )}
    </div>
  );
}

// Estilos CSS para las estrellas animadas
const styles = `
  .stars-container {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .star {
    position: absolute;
    font-size: 14px;
    opacity: 0.3;
    color: #ffd700;
    text-shadow: 0 0 8px #ffd700;
  }
  @media (min-width: 768px) {
    .star { font-size: 18px; opacity: 0.25; }
  }
  @media (min-width: 1024px) {
    .star { font-size: 22px; opacity: 0.2; }
  }
  /* Tamaños variados */
  .star-1, .star-6, .star-11, .star-16 { font-size: 10px; }
  .star-3, .star-8, .star-13, .star-18 { font-size: 18px; }
  .star-5, .star-10, .star-15, .star-20 { font-size: 12px; }
  /* Colores variados */
  .star-2, .star-7, .star-12, .star-17 { color: #ffec8b; text-shadow: 0 0 8px #ffec8b; }
  .star-4, .star-9, .star-14, .star-19 { color: #fff8dc; text-shadow: 0 0 8px #fff8dc; }
  /* Posiciones y animaciones */
  .star-1 { top: 5%; left: 10%; animation: starFloat1 12s ease-in-out infinite; }
  .star-2 { top: 12%; right: 8%; animation: starFloat2 14s ease-in-out infinite; }
  .star-3 { top: 22%; left: 25%; animation: starFloat3 11s ease-in-out infinite; }
  .star-4 { top: 8%; right: 30%; animation: starFloat4 13s ease-in-out infinite; }
  .star-5 { top: 32%; left: 5%; animation: starFloat5 15s ease-in-out infinite; }
  .star-6 { top: 42%; right: 12%; animation: starFloat6 12s ease-in-out infinite; }
  .star-7 { top: 18%; left: 55%; animation: starFloat1 14s ease-in-out infinite reverse; }
  .star-8 { top: 52%; right: 20%; animation: starFloat2 11s ease-in-out infinite reverse; }
  .star-9 { top: 38%; left: 75%; animation: starFloat3 13s ease-in-out infinite; }
  .star-10 { top: 62%; left: 12%; animation: starFloat4 15s ease-in-out infinite; }
  .star-11 { top: 48%; right: 45%; animation: starFloat5 12s ease-in-out infinite reverse; }
  .star-12 { top: 72%; right: 8%; animation: starFloat6 14s ease-in-out infinite reverse; }
  .star-13 { top: 58%; left: 38%; animation: starFloat1 11s ease-in-out infinite; }
  .star-14 { top: 82%; left: 60%; animation: starFloat2 13s ease-in-out infinite; }
  .star-15 { top: 68%; right: 35%; animation: starFloat3 15s ease-in-out infinite reverse; }
  .star-16 { top: 78%; left: 5%; animation: starFloat4 12s ease-in-out infinite reverse; }
  .star-17 { top: 88%; right: 55%; animation: starFloat5 14s ease-in-out infinite; }
  .star-18 { top: 28%; left: 88%; animation: starFloat6 11s ease-in-out infinite; }
  .star-19 { top: 92%; left: 25%; animation: starFloat1 13s ease-in-out infinite reverse; }
  .star-20 { top: 3%; left: 42%; animation: starFloat2 15s ease-in-out infinite reverse; }

  @keyframes starFloat1 {
    0% { transform: translate(0, 0) rotate(0deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
    12.5% { transform: translate(20px, 15px) rotate(22deg); opacity: 0.45; text-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
    25% { transform: translate(40px, 30px) rotate(45deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
    37.5% { transform: translate(30px, 42px) rotate(67deg); opacity: 0.45; text-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
    50% { transform: translate(20px, 55px) rotate(90deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
    62.5% { transform: translate(1px, 43px) rotate(112deg); opacity: 0.45; text-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
    75% { transform: translate(-18px, 32px) rotate(135deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
    87.5% { transform: translate(-9px, 16px) rotate(157deg); opacity: 0.45; text-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
    100% { transform: translate(0, 0) rotate(180deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
  }
  @keyframes starFloat2 {
    0% { transform: translate(0, 0) rotate(0deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
    12.5% { transform: translate(-16px, 21px) rotate(-22deg); opacity: 0.45; text-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
    25% { transform: translate(-32px, 42px) rotate(-45deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
    37.5% { transform: translate(-22px, 10px) rotate(-67deg); opacity: 0.45; text-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
    50% { transform: translate(-12px, -22px) rotate(-90deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
    62.5% { transform: translate(5px, -2px) rotate(-112deg); opacity: 0.45; text-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
    75% { transform: translate(22px, 18px) rotate(-135deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
    87.5% { transform: translate(11px, 9px) rotate(-157deg); opacity: 0.45; text-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
    100% { transform: translate(0, 0) rotate(-180deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
  }
  @keyframes starFloat3 {
    0% { transform: translate(0, 0) rotate(0deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
    12.5% { transform: translate(14px, -16px) rotate(30deg); opacity: 0.45; text-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
    25% { transform: translate(28px, -32px) rotate(60deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
    37.5% { transform: translate(38px, -7px) rotate(90deg); opacity: 0.45; text-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
    50% { transform: translate(48px, 18px) rotate(120deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
    62.5% { transform: translate(30px, 31px) rotate(150deg); opacity: 0.45; text-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
    75% { transform: translate(12px, 45px) rotate(180deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
    87.5% { transform: translate(6px, 22px) rotate(210deg); opacity: 0.45; text-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
    100% { transform: translate(0, 0) rotate(240deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
  }
  @keyframes starFloat4 {
    0% { transform: translate(0, 0) rotate(0deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
    12.5% { transform: translate(-11px, -19px) rotate(-30deg); opacity: 0.45; text-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
    25% { transform: translate(-22px, -38px) rotate(-60deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
    37.5% { transform: translate(-2px, -28px) rotate(-90deg); opacity: 0.45; text-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
    50% { transform: translate(18px, -18px) rotate(-120deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
    62.5% { transform: translate(-10px, -3px) rotate(-150deg); opacity: 0.45; text-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
    75% { transform: translate(-38px, 12px) rotate(-180deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
    87.5% { transform: translate(-19px, 6px) rotate(-210deg); opacity: 0.45; text-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
    100% { transform: translate(0, 0) rotate(-240deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
  }
  @keyframes starFloat5 {
    0% { transform: translate(0, 0) rotate(0deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
    12.5% { transform: translate(16px, -11px) rotate(15deg); opacity: 0.45; text-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
    25% { transform: translate(32px, -22px) rotate(30deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
    37.5% { transform: translate(11px, -35px) rotate(45deg); opacity: 0.45; text-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
    50% { transform: translate(-10px, -48px) rotate(60deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
    62.5% { transform: translate(5px, -29px) rotate(75deg); opacity: 0.45; text-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
    75% { transform: translate(20px, -10px) rotate(90deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
    87.5% { transform: translate(10px, -5px) rotate(105deg); opacity: 0.45; text-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
    100% { transform: translate(0, 0) rotate(120deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
  }
  @keyframes starFloat6 {
    0% { transform: translate(0, 0) rotate(0deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
    12.5% { transform: translate(-14px, 11px) rotate(-15deg); opacity: 0.45; text-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
    25% { transform: translate(-28px, 22px) rotate(-30deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
    37.5% { transform: translate(-3px, 35px) rotate(-45deg); opacity: 0.45; text-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
    50% { transform: translate(22px, 48px) rotate(-60deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
    62.5% { transform: translate(31px, 16px) rotate(-75deg); opacity: 0.45; text-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
    75% { transform: translate(40px, -15px) rotate(-90deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
    87.5% { transform: translate(20px, -7px) rotate(-105deg); opacity: 0.45; text-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
    100% { transform: translate(0, 0) rotate(-120deg); opacity: 0.2; text-shadow: 0 0 5px currentColor; }
  }
`;

// Inyectar estilos
if (typeof document !== 'undefined') {
  const styleElement = document.getElementById('community-stars-styles');
  if (!styleElement) {
    const style = document.createElement('style');
    style.id = 'community-stars-styles';
    style.textContent = styles;
    document.head.appendChild(style);
  }
}
