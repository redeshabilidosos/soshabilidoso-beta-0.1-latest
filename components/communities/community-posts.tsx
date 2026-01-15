'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CyberButton } from '@/components/ui/cyber-button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  Play,
  Clock,
  Users,
  Star,
  Award,
  TrendingUp,
  FileText,
  Video,
  Image as ImageIcon
} from 'lucide-react';

interface CommunityPost {
  id: string;
  type: 'announcement' | 'lesson' | 'achievement' | 'discussion' | 'assignment';
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    role: 'instructor' | 'student' | 'admin';
    badge?: string;
  };
  createdAt: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  isBookmarked: boolean;
  media?: {
    type: 'image' | 'video';
    url: string;
    thumbnail?: string;
    duration?: string;
  };
  tags?: string[];
  isPinned?: boolean;
}

const getPostsForCommunity = (communityId: string): CommunityPost[] => {
  if (communityId === 'escuela-molo') {
    return [
      {
        id: '1',
        type: 'announcement',
        title: '🚀 ¡Bienvenidos a Escuela Molo 2024!',
        content: '¡Hola Molos! Estamos emocionados de comenzar este nuevo año con ustedes. Tenemos increíbles novedades: nuevos cursos de IA, bootcamps intensivos y mentorías 1:1 con expertos de la industria. ¡Prepárense para ser desarrolladores Molo!',
        author: {
          name: 'Sofia Ramírez',
          avatar: '/api/placeholder/40/40',
          role: 'instructor',
          badge: 'Directora Académica'
        },
        createdAt: '2024-01-24T09:00:00Z',
        likes: 156,
        comments: 42,
        isLiked: true,
        isBookmarked: true,
        tags: ['Bienvenida', 'Novedades', '2024'],
        isPinned: true
      },
      {
        id: '2',
        type: 'lesson',
        title: '📱 Lección 8: Desarrollo de Apps con React Native',
        content: 'En esta lección aprenderemos a crear aplicaciones móviles nativas usando React Native. Cubriremos navegación, estado global, APIs y deployment en las tiendas de aplicaciones.',
        author: {
          name: 'Diego Morales',
          avatar: '/api/placeholder/40/40',
          role: 'instructor',
          badge: 'Especialista Mobile'
        },
        createdAt: '2024-01-23T14:30:00Z',
        likes: 234,
        comments: 67,
        isLiked: false,
        isBookmarked: true,
        media: {
          type: 'video',
          url: '/api/placeholder/video/react-native.mp4',
          thumbnail: '/api/placeholder/800/450',
          duration: '52:18'
        },
        tags: ['React Native', 'Mobile', 'Apps', 'iOS', 'Android']
      },
      {
        id: '3',
        type: 'achievement',
        title: '🏆 ¡Felicitaciones a nuestros Molos graduados!',
        content: '¡Estamos súper orgullosos! 🎓 Este mes 18 estudiantes Molo completaron exitosamente nuestro programa Full Stack. Todos han conseguido trabajo en empresas como Rappi, Mercado Libre y startups innovadoras. ¡Son unos cracks! 💪',
        author: {
          name: 'Escuela Molo',
          avatar: '/api/placeholder/40/40',
          role: 'admin',
          badge: 'Oficial Molo'
        },
        createdAt: '2024-01-22T16:45:00Z',
        likes: 312,
        comments: 89,
        isLiked: true,
        isBookmarked: false,
        media: {
          type: 'image',
          url: '/api/placeholder/800/400'
        },
        tags: ['Graduados', 'Éxito', 'Empleabilidad', 'Molo']
      },
      {
        id: '4',
        type: 'discussion',
        title: '💭 Debate Molo: ¿TypeScript vs JavaScript puro?',
        content: '¡Hora del debate semanal Molo! 🔥 ¿Qué opinan sobre usar TypeScript en todos los proyectos vs JavaScript puro? Compartan sus experiencias, pros y contras. ¡Queremos escuchar a todos los Molos!',
        author: {
          name: 'Camila Torres',
          avatar: '/api/placeholder/40/40',
          role: 'student',
          badge: 'Molo Destacado'
        },
        createdAt: '2024-01-21T11:20:00Z',
        likes: 145,
        comments: 156,
        isLiked: false,
        isBookmarked: true,
        tags: ['TypeScript', 'JavaScript', 'Debate', 'Molo']
      },
      {
        id: '5',
        type: 'assignment',
        title: '🎯 Proyecto Molo: Clon de Instagram',
        content: '¡Llegó el momento del proyecto estrella! 📸 Van a crear un clon completo de Instagram con React, Node.js, MongoDB y Socket.io para chat en tiempo real. Tienen 4 semanas. ¡A demostrar que son unos Molos!',
        author: {
          name: 'Andrés Villareal',
          avatar: '/api/placeholder/40/40',
          role: 'instructor',
          badge: 'Mentor Senior'
        },
        createdAt: '2024-01-20T13:15:00Z',
        likes: 89,
        comments: 45,
        isLiked: false,
        isBookmarked: true,
        tags: ['Proyecto', 'Instagram', 'Full Stack', 'Molo']
      },
      {
        id: '6',
        type: 'announcement',
        title: '🔥 Nuevo Bootcamp: Inteligencia Artificial para Molos',
        content: '¡NOTICIÓN MOLO! 🤖 Lanzamos nuestro nuevo bootcamp de IA y Machine Learning. Aprenderán Python, TensorFlow, OpenAI API y crearán sus propios chatbots. Cupos limitados, ¡inscríbanse ya!',
        author: {
          name: 'Dr. Roberto Sánchez',
          avatar: '/api/placeholder/40/40',
          role: 'instructor',
          badge: 'Experto en IA'
        },
        createdAt: '2024-01-19T10:00:00Z',
        likes: 267,
        comments: 78,
        isLiked: true,
        isBookmarked: true,
        tags: ['IA', 'Machine Learning', 'Python', 'Bootcamp', 'Molo']
      },
      {
        id: '7',
        type: 'lesson',
        title: '🌐 Lección 12: APIs REST con Node.js y Express',
        content: 'Masterclass sobre creación de APIs robustas y escalables. Aprenderemos middleware, autenticación JWT, validación de datos, manejo de errores y mejores prácticas de seguridad.',
        author: {
          name: 'Laura Jiménez',
          avatar: '/api/placeholder/40/40',
          role: 'instructor',
          badge: 'Backend Expert'
        },
        createdAt: '2024-01-18T15:45:00Z',
        likes: 198,
        comments: 34,
        isLiked: true,
        isBookmarked: false,
        media: {
          type: 'video',
          url: '/api/placeholder/video/nodejs-api.mp4',
          thumbnail: '/api/placeholder/800/450',
          duration: '1:23:45'
        },
        tags: ['Node.js', 'Express', 'API', 'Backend', 'JWT']
      },
      {
        id: '8',
        type: 'discussion',
        title: '🎨 Showcase Molo: Muestren sus proyectos',
        content: '¡Es viernes de showcase Molo! 🎉 Compartan capturas de sus proyectos actuales, reciban feedback de la comunidad y celebremos juntos los avances. ¡Todos los proyectos son bienvenidos!',
        author: {
          name: 'Valentina Cruz',
          avatar: '/api/placeholder/40/40',
          role: 'student',
          badge: 'Molo Creativo'
        },
        createdAt: '2024-01-17T18:30:00Z',
        likes: 123,
        comments: 67,
        isLiked: false,
        isBookmarked: false,
        media: {
          type: 'image',
          url: '/api/placeholder/800/600'
        },
        tags: ['Showcase', 'Proyectos', 'Feedback', 'Viernes', 'Molo']
      }
    ];
  }

  // Posts por defecto para otras comunidades
  return [
    {
      id: '1',
      type: 'announcement',
      title: '🎉 Nueva Masterclass: React Server Components',
      content: '¡Atención estudiantes! Mañana tendremos una masterclass especial sobre React Server Components. Aprenderemos las últimas funcionalidades de Next.js 14 y cómo implementar SSR de manera eficiente. No se la pierdan, será una sesión increíble con ejemplos prácticos.',
      author: {
        name: 'Carlos Mendoza',
        avatar: '/api/placeholder/40/40',
        role: 'instructor',
        badge: 'Instructor Principal'
      },
      createdAt: '2024-01-24T10:30:00Z',
      likes: 89,
      comments: 23,
      isLiked: false,
      isBookmarked: true,
      tags: ['React', 'Next.js', 'SSR'],
      isPinned: true
    },
  {
    id: '2',
    type: 'lesson',
    title: 'Lección 15: Autenticación con JWT',
    content: 'En esta lección aprenderemos a implementar un sistema de autenticación completo usando JSON Web Tokens. Cubriremos desde la teoría hasta la implementación práctica con Node.js y Express.',
    author: {
      name: 'Ana García',
      avatar: '/api/placeholder/40/40',
      role: 'instructor',
      badge: 'Especialista Backend'
    },
    createdAt: '2024-01-23T15:45:00Z',
    likes: 156,
    comments: 34,
    isLiked: true,
    isBookmarked: false,
    media: {
      type: 'video',
      url: '/api/placeholder/video/lesson15.mp4',
      thumbnail: '/api/placeholder/800/450',
      duration: '45:32'
    },
    tags: ['JWT', 'Authentication', 'Node.js', 'Security']
  },
  {
    id: '3',
    type: 'achievement',
    title: '🏆 ¡Felicitaciones a nuestros graduados de Enero!',
    content: 'Estamos orgullosos de anunciar que 25 estudiantes han completado exitosamente el programa Full Stack este mes. ¡Todos han conseguido trabajo en empresas tech reconocidas! 🎓✨',
    author: {
      name: 'Academia Full Stack',
      avatar: '/api/placeholder/40/40',
      role: 'admin',
      badge: 'Oficial'
    },
    createdAt: '2024-01-22T12:00:00Z',
    likes: 234,
    comments: 67,
    isLiked: true,
    isBookmarked: false,
    media: {
      type: 'image',
      url: '/api/placeholder/800/400'
    },
    tags: ['Graduados', 'Éxito', 'Empleabilidad']
  },
  {
    id: '4',
    type: 'discussion',
    title: '💭 Debate: ¿React vs Vue en 2024?',
    content: 'Iniciemos un debate constructivo sobre las ventajas y desventajas de React vs Vue.js en el contexto actual. ¿Cuál recomendarían para un proyecto nuevo y por qué?',
    author: {
      name: 'Luis Rodríguez',
      avatar: '/api/placeholder/40/40',
      role: 'student',
      badge: 'Estudiante Destacado'
    },
    createdAt: '2024-01-21T18:20:00Z',
    likes: 78,
    comments: 92,
    isLiked: false,
    isBookmarked: true,
    tags: ['React', 'Vue.js', 'Debate', 'Frontend']
  },
  {
    id: '5',
    type: 'assignment',
    title: '📝 Proyecto Final: E-commerce Full Stack',
    content: 'Es hora del proyecto final! Deberán crear un e-commerce completo con React, Node.js, MongoDB y Stripe. Tienen 3 semanas para completarlo. Todos los detalles en el documento adjunto.',
    author: {
      name: 'María López',
      avatar: '/api/placeholder/40/40',
      role: 'instructor',
      badge: 'Coordinadora Académica'
    },
    createdAt: '2024-01-20T09:15:00Z',
    likes: 45,
    comments: 28,
    isLiked: false,
    isBookmarked: true,
    tags: ['Proyecto Final', 'E-commerce', 'Full Stack']
  }
];
};

interface CommunityPostsProps {
  communityId: string;
  canPost?: boolean;
}

export function CommunityPosts({ communityId, canPost = false }: CommunityPostsProps) {
  const [posts, setPosts] = useState<CommunityPost[]>(getPostsForCommunity(communityId));
  const [filter, setFilter] = useState<'all' | 'announcement' | 'lesson' | 'achievement' | 'discussion' | 'assignment'>('all');

  const filteredPosts = posts.filter(post => {
    if (filter === 'all') return true;
    return post.type === filter;
  });

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };

  const handleBookmark = (postId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isBookmarked: !post.isBookmarked
        };
      }
      return post;
    }));
  };

  const getPostIcon = (type: CommunityPost['type']) => {
    switch (type) {
      case 'announcement':
        return <TrendingUp className="w-5 h-5 text-yellow-400" />;
      case 'lesson':
        return <Play className="w-5 h-5 text-blue-400" />;
      case 'achievement':
        return <Award className="w-5 h-5 text-green-400" />;
      case 'discussion':
        return <MessageSquare className="w-5 h-5 text-purple-400" />;
      case 'assignment':
        return <FileText className="w-5 h-5 text-orange-400" />;
      default:
        return <FileText className="w-5 h-5 text-gray-400" />;
    }
  };

  const getPostTypeLabel = (type: CommunityPost['type']) => {
    switch (type) {
      case 'announcement':
        return 'Anuncio';
      case 'lesson':
        return 'Lección';
      case 'achievement':
        return 'Logro';
      case 'discussion':
        return 'Discusión';
      case 'assignment':
        return 'Tarea';
      default:
        return 'Publicación';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'instructor':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'admin':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'student':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Hace unos minutos';
    if (diffInHours < 24) return `Hace ${diffInHours}h`;
    if (diffInHours < 48) return 'Ayer';
    return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'announcement', 'lesson', 'achievement', 'discussion', 'assignment'] as const).map((filterType) => (
          <CyberButton
            key={filterType}
            variant={filter === filterType ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(filterType)}
            className="text-sm"
          >
            {filterType === 'all' && 'Todas'}
            {filterType === 'announcement' && 'Anuncios'}
            {filterType === 'lesson' && 'Lecciones'}
            {filterType === 'achievement' && 'Logros'}
            {filterType === 'discussion' && 'Discusiones'}
            {filterType === 'assignment' && 'Tareas'}
          </CyberButton>
        ))}
      </div>

      {/* Create Post Button */}
      {canPost && (
        <Card className="glass-card">
          <CardContent className="p-4">
            <CyberButton className="w-full">
              <MessageSquare className="w-4 h-4 mr-2" />
              Crear nueva publicación
            </CyberButton>
          </CardContent>
        </Card>
      )}

      {/* Posts */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <Card key={post.id} className={`glass-card ${post.isPinned ? 'ring-2 ring-yellow-500/30' : ''}`}>
            <CardContent className="p-6">
              {/* Post Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={post.author.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-neon-green to-neon-blue text-white">
                      {post.author.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-white">{post.author.name}</h4>
                      <Badge className={getRoleColor(post.author.role)}>
                        {post.author.badge || post.author.role}
                      </Badge>
                      {post.isPinned && (
                        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                          Fijado
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      {getPostIcon(post.type)}
                      <span>{getPostTypeLabel(post.type)}</span>
                      <span>•</span>
                      <Clock className="w-4 h-4" />
                      <span>{formatTimeAgo(post.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleBookmark(post.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    post.isBookmarked 
                      ? 'text-yellow-400 bg-yellow-500/20' 
                      : 'text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/10'
                  }`}
                >
                  <Bookmark className={`w-5 h-5 ${post.isBookmarked ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Post Content */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-white mb-2">{post.title}</h3>
                <p className="text-gray-300 leading-relaxed">{post.content}</p>
              </div>

              {/* Media */}
              {post.media && (
                <div className="mb-4">
                  {post.media.type === 'video' ? (
                    <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                      <img
                        src={post.media.thumbnail}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                          <Play className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      {post.media.duration && (
                        <div className="absolute bottom-3 right-3">
                          <Badge className="bg-black/70 text-white">
                            {post.media.duration}
                          </Badge>
                        </div>
                      )}
                    </div>
                  ) : (
                    <img
                      src={post.media.url}
                      alt={post.title}
                      className="w-full rounded-lg object-cover max-h-96"
                    />
                  )}
                </div>
              )}

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Post Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                      post.isLiked 
                        ? 'bg-red-500/20 text-red-400' 
                        : 'hover:bg-gray-800 text-gray-300'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                    <span className="font-medium">{post.likes}</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-800 text-gray-300 transition-colors">
                    <MessageSquare className="w-5 h-5" />
                    <span className="font-medium">{post.comments}</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-800 text-gray-300 transition-colors">
                    <Share2 className="w-5 h-5" />
                    <span className="font-medium">Compartir</span>
                  </button>
                </div>

                {post.media?.type === 'video' && (
                  <CyberButton size="sm">
                    <Play className="w-4 h-4 mr-2" />
                    Ver lección
                  </CyberButton>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <CyberButton variant="outline">
          Cargar más publicaciones
        </CyberButton>
      </div>
    </div>
  );
}