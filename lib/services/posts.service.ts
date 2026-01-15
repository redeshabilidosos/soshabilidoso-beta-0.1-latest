/**
 * Servicio para gestión de publicaciones
 */

export interface CreatePostData {
  content: string;
  post_type: 'text' | 'image' | 'video' | 'podcast' | 'streaming' | 'highlight';
  category?: string;
  images?: string[];
  video?: string;
  podcast_url?: string;
  streaming_url?: string;
  is_public?: boolean;
}

export interface Post {
  id: string;
  user: {
    id: string;
    username: string;
    display_name: string;
    avatar_url: string;
    is_verified: boolean;
  };
  content: string;
  post_type: string;
  category: string;
  images: string[];
  video?: string;
  thumbnail?: string;
  podcast_url?: string;
  streaming_url?: string;
  likes_count: number;
  celebrations_count: number;
  golazos_count: number;
  comments_count: number;
  shares_count: number;
  views_count: number;
  is_pinned: boolean;
  is_archived: boolean;
  allow_comments: boolean;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface PostsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Post[];
}

class PostsService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

  private async getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async getAuthHeadersForFormData() {
    const token = localStorage.getItem('access_token');
    return {
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  /**
   * Crear una nueva publicación
   */
  async createPost(postData: CreatePostData): Promise<Post> {
    // Asegurar que la categoría sea válida
    const validCategories = ['football', 'general_sport', 'culture', 'music', 'dance', 'education', 'gaming', 'food', 'other'];
    if (!postData.category || !validCategories.includes(postData.category)) {
      postData.category = 'other'; // Usar 'other' como categoría por defecto
    }

    const response = await fetch(`${this.baseUrl}/posts/`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Error al crear la publicación');
    }

    return response.json();
  }

  /**
   * Crear publicación con archivo de imagen
   */
  async createPostWithImage(postData: Omit<CreatePostData, 'images'>, imageFile: File): Promise<Post> {
    const validCategories = ['football', 'general_sport', 'culture', 'music', 'dance', 'education', 'gaming', 'food', 'other'];
    const category = postData.category && validCategories.includes(postData.category) ? postData.category : 'other';

    const formData = new FormData();
    formData.append('content', postData.content);
    formData.append('post_type', postData.post_type);
    formData.append('category', category);
    if (postData.is_public !== undefined) formData.append('is_public', postData.is_public.toString());
    formData.append('image', imageFile);

    const response = await fetch(`${this.baseUrl}/posts/`, {
      method: 'POST',
      headers: await this.getAuthHeadersForFormData(),
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Error al crear la publicación con imagen');
    }

    return response.json();
  }

  /**
   * Crear publicación con archivo de video
   */
  async createPostWithVideo(postData: Omit<CreatePostData, 'video'>, videoFile: File): Promise<Post> {
    const validCategories = ['football', 'general_sport', 'culture', 'music', 'dance', 'education', 'gaming', 'food', 'other'];
    const category = postData.category && validCategories.includes(postData.category) ? postData.category : 'other';

    const formData = new FormData();
    formData.append('content', postData.content);
    formData.append('post_type', postData.post_type);
    formData.append('category', category);
    if (postData.is_public !== undefined) formData.append('is_public', postData.is_public.toString());
    formData.append('video', videoFile);

    const response = await fetch(`${this.baseUrl}/posts/`, {
      method: 'POST',
      headers: await this.getAuthHeadersForFormData(),
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Error al crear la publicación con video');
    }

    return response.json();
  }

  /**
   * Obtener todas las publicaciones (feed)
   */
  async getPosts(page: number = 1, filterByFriends: boolean = true): Promise<PostsResponse> {
    const params = new URLSearchParams();
    if (page > 1) params.append('page', page.toString());
    
    // Filtrar por amigos por defecto
    if (filterByFriends) {
      params.append('friends_only', 'true');
    }

    const response = await fetch(
      `${this.baseUrl}/posts/?${params.toString()}`,
      {
        headers: await this.getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error('Error al obtener las publicaciones');
    }

    return response.json();
  }

  /**
   * Obtener una publicación específica por UUID o short_id
   */
  async getPost(postId: string): Promise<Post> {
    // Si el ID tiene 8 caracteres, usar la ruta de short_id
    const endpoint = postId.length === 8 
      ? `${this.baseUrl}/posts/short/${postId}/`
      : `${this.baseUrl}/posts/${postId}/`;
    
    const response = await fetch(endpoint, {
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al obtener la publicación');
    }

    return response.json();
  }

  /**
   * Actualizar una publicación
   */
  async updatePost(postId: string, postData: Partial<CreatePostData>): Promise<Post> {
    const response = await fetch(`${this.baseUrl}/posts/${postId}/`, {
      method: 'PATCH',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Error al actualizar la publicación');
    }

    return response.json();
  }

  /**
   * Eliminar una publicación
   */
  async deletePost(postId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/posts/${postId}/`, {
      method: 'DELETE',
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al eliminar la publicación');
    }
  }

  /**
   * Reaccionar a una publicación
   */
  async reactToPost(postId: string, reactionType: 'like' | 'laugh' | 'dislike'): Promise<any> {
    const response = await fetch(`${this.baseUrl}/posts/${postId}/react/`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify({ reaction_type: reactionType }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Error al reaccionar a la publicación');
    }

    return response.json();
  }

  /**
   * Comentar en una publicación
   */
  async commentOnPost(postId: string, content: string, parentId?: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/posts/${postId}/comments/`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify({ 
        content,
        ...(parentId && { parent: parentId })
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Error al comentar en la publicación');
    }

    return response.json();
  }

  /**
   * Obtener comentarios de una publicación
   */
  async getComments(postId: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/posts/${postId}/comments/`, {
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al obtener los comentarios');
    }

    const data = await response.json();
    
    // Si la respuesta es paginada (tiene 'results'), devolver solo los resultados
    if (data.results) {
      return data.results;
    }
    
    // Si es un array directo, devolverlo como está
    if (Array.isArray(data)) {
      return data;
    }
    
    // Si es un objeto único, devolverlo en un array
    return [data];
  }

  /**
   * Editar un comentario
   */
  async updateComment(commentId: string, content: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/posts/comments/${commentId}/`, {
      method: 'PATCH',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Error al editar el comentario');
    }

    return response.json();
  }

  /**
   * Eliminar un comentario
   */
  async deleteComment(commentId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/posts/comments/${commentId}/`, {
      method: 'DELETE',
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al eliminar el comentario');
    }
  }

  /**
   * Dar like a un comentario
   */
  async likeComment(commentId: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/posts/comments/${commentId}/like/`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Error al dar like al comentario');
    }

    return response.json();
  }

  /**
   * Quitar like de un comentario
   */
  async unlikeComment(commentId: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/posts/comments/${commentId}/like/`, {
      method: 'DELETE',
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Error al quitar like del comentario');
    }

    return response.json();
  }

  /**
   * Compartir una publicación
   */
  async sharePost(postId: string, message?: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/posts/${postId}/share/`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify({ message: message || '' }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Error al compartir la publicación');
    }

    return response.json();
  }

  /**
   * Guardar/Desguardar una publicación
   */
  async bookmarkPost(postId: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/posts/${postId}/bookmark/`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Error al guardar la publicación');
    }

    return response.json();
  }
}

export const postsService = new PostsService();