'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { CyberButton } from '@/components/ui/cyber-button';
import { Settings, Palette, Image as ImageIcon, MessageSquare, Heart, Goal, Music, Sparkles, X, Check, LayoutGrid, GitFork } from 'lucide-react'; // Reemplazado Football por Goal
import { ChatPreview } from '@/types/user';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ChatSettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  chat: ChatPreview;
  onSaveSettings: (chatId: string, settings: { nickname?: string; chatBackground?: string; chatColor?: string; otherMessageColor?: string }) => void;
}

const backgroundOptions = [
  { id: 'none', label: 'Ninguno', icon: X },
  { id: 'particles', label: 'Partículas', icon: Sparkles },
  { id: 'hearts', label: 'Corazones', icon: Heart },
  { id: 'footballs', label: 'Balones', icon: Goal }, // Usando Goal para representar balones
  { id: 'music_notes', label: 'Notas Musicales', icon: Music },
  { id: 'circuits', label: 'Circuitos', icon: LayoutGrid }, // Nuevo patrón
  { id: 'geometric_lines', label: 'Líneas Geométricas', icon: GitFork }, // Nuevo patrón
];

const colorOptions = [
  { id: 'neon-green', label: 'Verde Neón', userColor: 'bg-neon-green/30', otherColor: 'bg-white/15', preview: '#00ff88' },
  { id: 'neon-blue', label: 'Azul Neón', userColor: 'bg-neon-blue/30', otherColor: 'bg-white/15', preview: '#0088ff' },
  { id: 'purple', label: 'Púrpura', userColor: 'bg-purple-500/30', otherColor: 'bg-white/15', preview: '#8800ff' },
  { id: 'pink', label: 'Rosa', userColor: 'bg-pink-500/30', otherColor: 'bg-white/15', preview: '#ff0088' },
  { id: 'orange', label: 'Naranja', userColor: 'bg-orange-500/30', otherColor: 'bg-white/15', preview: '#ff8800' },
  { id: 'gray', label: 'Gris', userColor: 'bg-gray-600/30', otherColor: 'bg-white/15', preview: '#666666' },
];

export function ChatSettingsDialog({ isOpen, onClose, chat, onSaveSettings }: ChatSettingsDialogProps) {
  const [nickname, setNickname] = useState(chat.nickname || '');
  const [selectedBackground, setSelectedBackground] = useState(chat.chatBackground || 'none');
  const [selectedChatColor, setSelectedChatColor] = useState(chat.chatColor || 'bg-neon-green/20');
  const [selectedOtherMessageColor, setSelectedOtherMessageColor] = useState(chat.otherMessageColor || 'bg-white/10');

  useEffect(() => {
    if (isOpen) {
      setNickname(chat.nickname || '');
      setSelectedBackground(chat.chatBackground || 'none');
      setSelectedChatColor(chat.chatColor || 'bg-neon-green/20');
      setSelectedOtherMessageColor(chat.otherMessageColor || 'bg-white/10');
    }
  }, [isOpen, chat]);

  const handleSave = () => {
    const settings = {
      nickname: nickname.trim() === '' ? undefined : nickname.trim(),
      chatBackground: selectedBackground === 'none' ? undefined : selectedBackground,
      chatColor: selectedChatColor,
      otherMessageColor: selectedOtherMessageColor,
    };
    
    onSaveSettings(chat.id, settings);
    
    // Toast personalizado según los cambios
    let message = 'Configuración de chat guardada!';
    if (settings.nickname) {
      message = `Apodo "${settings.nickname}" guardado!`;
    }
    
    toast.success(message, {
      description: settings.chatBackground 
        ? `Fondo: ${backgroundOptions.find(bg => bg.id === settings.chatBackground)?.label}`
        : 'Personalización aplicada'
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] glass-card border-neon-green/20">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center space-x-2">
            <Settings size={20} className="text-neon-green" />
            <span>Personalizar Chat con {chat.otherUser.displayName}</span>
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Ajusta el apodo, el fondo y los colores de las burbujas de este chat.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* Vista previa del chat */}
          <div className="p-4 bg-white/5 rounded-xl">
            <h4 className="text-sm font-medium text-gray-300 mb-3">Vista previa</h4>
            <div className="space-y-2 max-h-32 overflow-hidden">
              {/* Mensaje del otro usuario */}
              <div className="flex justify-start">
                <div className={cn("max-w-[70%] p-2 rounded-lg text-xs", selectedOtherMessageColor)}>
                  Hola! ¿Cómo estás?
                </div>
              </div>
              {/* Mensaje del usuario actual */}
              <div className="flex justify-end">
                <div className={cn("max-w-[70%] p-2 rounded-lg text-xs text-white", selectedChatColor)}>
                  ¡Todo bien! ¿Listo para el partido?
                </div>
              </div>
            </div>
          </div>
          {/* Apodo */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Apodo para {chat.otherUser.displayName}
            </label>
            <Input
              placeholder="Ej: Campeón, Mi Pana, Crack"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-neon-green/50"
            />
          </div>

          {/* Color de Burbujas de Chat */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center space-x-2">
              <Palette size={16} className="text-gray-400" />
              <span>Color de mis mensajes</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {colorOptions.map(option => (
                <button
                  key={option.id}
                  onClick={() => {
                    setSelectedChatColor(option.userColor);
                    setSelectedOtherMessageColor(option.otherColor);
                  }}
                  className={cn(
                    "p-3 rounded-xl border-2 flex flex-col items-center space-y-2 transition-all duration-200 group",
                    selectedChatColor === option.userColor 
                      ? 'border-neon-green bg-neon-green/10' 
                      : 'border-white/20 hover:border-white/40 hover:bg-white/5'
                  )}
                  title={option.label}
                >
                  <div 
                    className="w-8 h-8 rounded-full border-2 border-white/30"
                    style={{ backgroundColor: option.preview }}
                  />
                  <span className="text-xs text-gray-300 group-hover:text-white">
                    {option.label}
                  </span>
                  {selectedChatColor === option.userColor && (
                    <Check size={16} className="text-neon-green" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Fondo del Chat */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center space-x-2">
              <ImageIcon size={16} className="text-gray-400" />
              <span>Fondo del chat</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {backgroundOptions.map(option => {
                const Icon = option.icon;
                return (
                  <CyberButton
                    key={option.id}
                    variant={selectedBackground === option.id ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedBackground(option.id)}
                    className={cn(
                      "flex items-center space-x-2",
                      selectedBackground === option.id ? 'border-neon-green/50' : ''
                    )}
                  >
                    <Icon size={16} />
                    <span>{option.label}</span>
                  </CyberButton>
                );
              })}
            </div>
          </div>
        </div>

        <DialogFooter>
          <CyberButton variant="outline" onClick={onClose}>
            Cancelar
          </CyberButton>
          <CyberButton onClick={handleSave}>
            Guardar Cambios
          </CyberButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}