export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatar: string;
  coverPhoto?: string;
  cover_photo?: string; // Campo del backend
  cover_photo_url?: string; // URL del backend
  position?: string;
  team?: string;
  bio?: string;
  followers: number;
  following: number;
  posts: number;
  createdAt: string;
  friendIds?: string[]; // Nuevo campo para almacenar IDs de amigos
  interests?: string[]; // Nuevo campo para almacenar intereses del usuario
  communityIds?: string[]; // Nuevo campo para almacenar IDs de comunidades a las que pertenece el usuario
  socialLinks?: { platform: string; url: string }[]; // Nuevo campo para redes sociales
  contactNumber?: string; // Añadido contactNumber
  // Campos para tipo de cuenta
  account_type?: 'user' | 'enterprise'; // Tipo de cuenta
  accountType?: 'user' | 'enterprise'; // Alias para frontend
  // Campos adicionales para empresas
  company_name?: string;
  industry?: string;
  website?: string;
  is_verified?: boolean;
}

export interface Post {
  id: string;
  userId: string;
  user: User;
  content: string;
  images?: string[];
  video?: string;
  thumbnail?: string;
  podcastUrl?: string;
  streamingUrl?: string;
  type: 'text' | 'image' | 'video' | 'highlight' | 'podcast' | 'streaming';
  category?: 'football' | 'general_sport' | 'culture' | 'music' | 'dance' | 'education' | 'other' | 'gaming' | 'food';
  communityId?: string;
  likes: number;
  laughs: number;
  dislikes: number;
  // Campos legacy (mantener por compatibilidad)
  celebrations?: number;
  golazos?: number;
  comments: Comment[];
  commentsCount?: number; // Contador de comentarios del backend
  userReaction?: 'like' | 'laugh' | 'dislike' | null; // Reacción del usuario actual
  createdAt: string;
}

export interface Comment {
  id: string;
  userId: string;
  user: User;
  content: string;
  likes: number;
  createdAt: string;
  parentId?: string; // ID del comentario padre si es una respuesta
  replies?: Comment[]; // Respuestas anidadas
}

export interface ContactMessageDetails {
  senderName: string;
  senderDescription: string;
  senderPhone: string;
  senderEmail: string;
  resumeFileName?: string; // Nombre del archivo del currículum
  classifiedTitle: string; // Título del clasificado al que se responde
}

export interface Notification {
  id: string;
  userId: string;
  type: 'like' | 'comment' | 'follow' | 'friend_request' | 'community_invite' | 'contact_message'; // Añadido 'contact_message'
  fromUser: User;
  postId?: string;
  communityId?: string; // Nuevo campo para notificaciones de comunidad
  message: string;
  read: boolean;
  createdAt: string;
  contactMessageDetails?: ContactMessageDetails; // Detalles del mensaje de contacto
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'video' | 'emoji';
  imageUrl?: string;
  videoUrl?: string;
  emoji?: string;
}

export interface ChatPreview {
  id: string;
  otherUser: User;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  messages: Message[]; // Añadido para el historial de mensajes
  nickname?: string; // Nuevo: Apodo para el otro usuario en este chat
  chatBackground?: string; // Nuevo: Tipo de fondo del chat (ej: 'particles', 'hearts', 'footballs', 'music_notes')
  chatColor?: string; // Nuevo: Color de las burbujas de chat del usuario actual (ej: 'bg-neon-green/20')
  otherMessageColor?: string; // Nuevo: Color de las burbujas de chat del otro usuario (ej: 'bg-white/10')
}

export interface Community {
  id: string;
  name: string;
  description: string;
  category: 'football' | 'music' | 'art' | 'tech' | 'gaming' | 'social' | 'education' | 'travel' | 'food' | 'health' | 'people' | 'other'; // Categorías extendidas
  type: 'community' | 'page' | 'group'; // Nuevo campo para el tipo de entidad
  coverImage: string;
  creatorId: string;
  creator: User;
  memberIds: string[];
  membersCount: number;
  createdAt: string;
}

export interface Classified {
  id: string;
  userId: string;
  user: User;
  title: string;
  description: string;
  type: 'job' | 'sale' | 'help' | 'event' | 'other'; // Tipo de clasificado
  category: string; // Categoría específica del clasificado (ej: 'diseño gráfico', 'balón de fútbol', 'clases de música')
  location?: string; // Ubicación si aplica
  contactInfo: string; // Email o teléfono de contacto
  imageUrl?: string; // Imagen del clasificado (ej: para venta de artículos)
  price?: number; // Precio si es una venta
  createdAt: string;
  // Nuevos campos para detalles de trabajo/ayuda
  workingHours?: string; // Ej: 'Tiempo completo', 'Medio tiempo', 'Por horas'
  availability?: string; // Ej: 'Lunes a Viernes, Fines de semana, Flexible'
  urgency?: 'inmediata' | 'corto_plazo' | 'largo_plazo'; // Necesidad
  salaryEstimate?: string; // Estimación de salario o compensación
}