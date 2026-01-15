/**
 * Servicio de chat y mensajería
 */
import { api, PaginatedResponse } from '../api-client';
import { ChatPreview, Message } from '@/types/user';

export interface CreateChatData {
  name?: string;
  chat_type: 'private' | 'group' | 'community';
  description?: string;
  participant_ids: string[];
}

export interface SendMessageData {
  content: string;
  message_type?: 'text' | 'image' | 'video' | 'audio' | 'file' | 'emoji';
  image?: File;
  video?: File;
  audio?: File;
  file_url?: string;
  file_name?: string;
  file_size?: number;
  reply_to?: string;
}

export interface ChatSettings {
  other_user_nickname?: string;
  chat_background?: string;
  chat_color?: string;
  other_message_color?: string;
  notifications_enabled?: boolean;
  sound_enabled?: boolean;
}

export class ChatService {
  // Obtener lista de chats
  async getChats(): Promise<ChatPreview[]> {
    return api.get<ChatPreview[]>('/messaging/chats/');
  }

  // Obtener chat por ID
  async getChat(id: string): Promise<ChatPreview> {
    return api.get<ChatPreview>(`/messaging/chats/${id}/`);
  }

  // Crear nuevo chat
  async createChat(data: CreateChatData): Promise<ChatPreview> {
    return api.post<ChatPreview>('/messaging/chats/', data);
  }

  // Crear chat privado con usuario
  async createPrivateChat(userId: string): Promise<ChatPreview> {
    return this.createChat({
      chat_type: 'private',
      participant_ids: [userId]
    });
  }

  // Obtener mensajes de un chat
  async getMessages(chatId: string, page = 1): Promise<PaginatedResponse<Message>> {
    return api.get<PaginatedResponse<Message>>(`/messaging/chats/${chatId}/messages/?page=${page}`);
  }

  // Enviar mensaje
  async sendMessage(chatId: string, data: SendMessageData): Promise<Message> {
    // Si hay archivos multimedia, usar FormData
    if (data.image || data.video || data.audio) {
      const formData = new FormData();
      
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (value instanceof File) {
            formData.append(key, value);
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      return api.post<Message>(`/messaging/chats/${chatId}/send_message/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }

    return api.post<Message>(`/messaging/chats/${chatId}/send_message/`, data);
  }

  // Marcar mensajes como leídos
  async markAsRead(chatId: string): Promise<any> {
    return api.post(`/messaging/chats/${chatId}/mark_as_read/`);
  }

  // Configurar chat
  async updateChatSettings(chatId: string, settings: ChatSettings): Promise<any> {
    return api.patch(`/messaging/chats/${chatId}/settings/`, settings);
  }

  // Agregar participante a chat grupal
  async addParticipant(chatId: string, userId: string): Promise<any> {
    return api.post(`/messaging/chats/${chatId}/add_participant/`, { user_id: userId });
  }

  // Salir de chat grupal
  async leaveChat(chatId: string): Promise<any> {
    return api.post(`/messaging/chats/${chatId}/leave/`);
  }

  // Reaccionar a mensaje
  async reactToMessage(chatId: string, messageId: string, reactionType: string): Promise<any> {
    return api.post(`/messaging/chats/${chatId}/messages/${messageId}/react/`, {
      reaction_type: reactionType
    });
  }

  // Editar mensaje
  async editMessage(chatId: string, messageId: string, content: string): Promise<Message> {
    return api.put<Message>(`/messaging/chats/${chatId}/messages/${messageId}/`, { content });
  }

  // Eliminar mensaje
  async deleteMessage(chatId: string, messageId: string): Promise<any> {
    return api.delete(`/messaging/chats/${chatId}/messages/${messageId}/`);
  }

  // Subir archivo para mensaje
  async uploadMessageFile(file: File, type: 'image' | 'video' | 'audio' = 'image'): Promise<{ url: string }> {
    return api.uploadFile<{ url: string }>(`/media/upload/${type}/`, file);
  }
}

export const chatService = new ChatService();