/**
 * Servicio para sistema de mensajería
 */

export interface ChatRoom {
  id: string;
  name?: string;
  chat_type: 'private' | 'group' | 'community';
  description?: string;
  avatar?: string;
  is_active: boolean;
  created_by: {
    id: string;
    username: string;
    display_name: string;
    avatar_url: string;
  };
  participants: ChatParticipant[];
  created_at: string;
  updated_at: string;
  last_activity: string;
  display_name?: string;
  unread_count?: number;
  last_message?: Message;
}

export interface ChatParticipant {
  id: string;
  user: {
    id: string;
    username: string;
    display_name: string;
    avatar_url: string;
    is_verified: boolean;
    account_type?: 'user' | 'enterprise';
  };
  role: 'member' | 'admin' | 'owner';
  other_user_nickname?: string;
  chat_background?: string;
  chat_color?: string;
  other_message_color?: string;
  notifications_enabled: boolean;
  sound_enabled: boolean;
  is_muted: boolean;
  is_blocked: boolean;
  joined_at: string;
  last_read_at: string;
}

export interface Message {
  id: string;
  chat_room: string;
  sender: {
    id: string;
    username: string;
    display_name: string;
    avatar_url: string;
  };
  content: string;
  message_type: 'text' | 'image' | 'video' | 'audio' | 'file' | 'emoji' | 'system' | 'story_reply';
  image?: string;
  video?: string;
  audio?: string;
  file_url?: string;
  file_name?: string;
  file_size?: number;
  reply_to?: Message;
  is_edited: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  reactions: MessageReaction[];
  read_by: MessageRead[];
  story_id?: string;
  story_preview?: {
    id: string;
    media_url: string;
    media_type: 'image' | 'video';
    user: {
      id: string;
      username: string;
      display_name: string;
    };
    created_at: string;
    is_expired: boolean;
  };
}

export interface MessageReaction {
  id: string;
  user: {
    id: string;
    username: string;
    display_name: string;
  };
  reaction_type: 'like' | 'love' | 'laugh' | 'wow' | 'sad' | 'angry' | 'fire' | 'golazo';
  created_at: string;
}

export interface MessageRead {
  id: string;
  user: {
    id: string;
    username: string;
    display_name: string;
  };
  read_at: string;
}

export interface ChatListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ChatRoom[];
}

export interface MessagesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Message[];
}

class MessagingService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

  private async getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  /**
   * Obtener lista de chats del usuario
   */
  async getChats(page: number = 1): Promise<ChatListResponse> {
    const params = new URLSearchParams();
    if (page > 1) params.append('page', page.toString());

    const response = await fetch(
      `${this.baseUrl}/messaging/chats/?${params.toString()}`,
      {
        headers: await this.getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error('Error al obtener chats');
    }

    return response.json();
  }

  /**
   * Crear o obtener chat privado con un usuario
   */
  async createOrGetChat(username: string): Promise<{ chat: ChatRoom; created: boolean; message?: string }> {
    const response = await fetch(
      `${this.baseUrl}/users/chat/${username}/`,
      {
        method: 'POST',
        headers: await this.getAuthHeaders(),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al crear chat');
    }

    return response.json();
  }

  /**
   * Obtener detalles de un chat
   */
  async getChat(chatId: string): Promise<ChatRoom> {
    const response = await fetch(
      `${this.baseUrl}/messaging/chats/${chatId}/`,
      {
        headers: await this.getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error('Error al obtener chat');
    }

    return response.json();
  }

  /**
   * Obtener mensajes de un chat
   */
  async getMessages(chatId: string, page: number = 1): Promise<MessagesResponse> {
    const params = new URLSearchParams();
    if (page > 1) params.append('page', page.toString());

    const response = await fetch(
      `${this.baseUrl}/messaging/chats/${chatId}/messages/?${params.toString()}`,
      {
        headers: await this.getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error('Error al obtener mensajes');
    }

    return response.json();
  }

  /**
   * Enviar mensaje
   */
  async sendMessage(chatId: string, content: string, messageType: string = 'text', replyTo?: string): Promise<Message> {
    const response = await fetch(
      `${this.baseUrl}/messaging/chats/${chatId}/send_message/`,
      {
        method: 'POST',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify({
          content,
          message_type: messageType,
          reply_to: replyTo,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al enviar mensaje');
    }

    return response.json();
  }

  /**
   * Enviar mensaje con imagen
   */
  async sendImageMessage(chatId: string, imageFile: File, content?: string): Promise<Message> {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('message_type', 'image');
    if (content) formData.append('content', content);

    const token = localStorage.getItem('access_token');
    const response = await fetch(
      `${this.baseUrl}/messaging/chats/${chatId}/send_message/`,
      {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al enviar imagen');
    }

    return response.json();
  }

  /**
   * Marcar mensajes como leídos
   */
  async markAsRead(chatId: string): Promise<{ message: string; count: number }> {
    const response = await fetch(
      `${this.baseUrl}/messaging/chats/${chatId}/mark_as_read/`,
      {
        method: 'POST',
        headers: await this.getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error('Error al marcar mensajes como leídos');
    }

    return response.json();
  }

  /**
   * Reaccionar a mensaje
   */
  async reactToMessage(
    chatId: string, 
    messageId: string, 
    reactionType: string
  ): Promise<{ message: string; reacted: boolean; reaction_type?: string }> {
    const response = await fetch(
      `${this.baseUrl}/messaging/chats/${chatId}/messages/${messageId}/react/`,
      {
        method: 'POST',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify({ reaction_type: reactionType }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al reaccionar');
    }

    return response.json();
  }

  /**
   * Editar mensaje
   */
  async editMessage(chatId: string, messageId: string, content: string): Promise<Message> {
    const response = await fetch(
      `${this.baseUrl}/messaging/chats/${chatId}/messages/${messageId}/`,
      {
        method: 'PATCH',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify({ content }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al editar mensaje');
    }

    return response.json();
  }

  /**
   * Eliminar mensaje
   */
  async deleteMessage(chatId: string, messageId: string): Promise<{ message: string }> {
    const response = await fetch(
      `${this.baseUrl}/messaging/chats/${chatId}/messages/${messageId}/`,
      {
        method: 'DELETE',
        headers: await this.getAuthHeaders(),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al eliminar mensaje');
    }

    return response.json();
  }

  /**
   * Actualizar configuraciones del chat
   */
  async updateChatSettings(
    chatId: string, 
    settings: Partial<ChatParticipant>
  ): Promise<{ message: string; settings: any }> {
    const response = await fetch(
      `${this.baseUrl}/messaging/chats/${chatId}/settings/`,
      {
        method: 'PATCH',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify(settings),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al actualizar configuraciones');
    }

    return response.json();
  }
}

export const messagingService = new MessagingService();