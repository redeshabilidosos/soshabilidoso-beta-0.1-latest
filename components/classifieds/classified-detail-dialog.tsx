'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CyberButton } from '@/components/ui/cyber-button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  MapPin, 
  Calendar, 
  Eye, 
  Heart, 
  Star,
  Phone,
  Mail,
  MessageSquare,
  Send,
  User,
  Shield,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

interface ClassifiedDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  classified: any;
  onContactSeller: (message: string) => void;
}

export function ClassifiedDetailDialog({ 
  isOpen, 
  onClose, 
  classified,
  onContactSeller 
}: ClassifiedDetailDialogProps) {
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const [contactMethod, setContactMethod] = useState<'chat' | 'phone' | 'email' | 'whatsapp'>('chat');
  const [isLoading, setIsLoading] = useState(false);

  if (!classified) return null;

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: currency === 'COP' ? 'COP' : 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Hace menos de 1 hora';
    if (diffInHours < 24) return `Hace ${diffInHours} horas`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `Hace ${diffInDays} días`;
  };

  const handleSendMessage = async () => {
    if (!contactMessage.trim()) {
      toast.error('Por favor, escribe un mensaje');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simular envío del mensaje
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      onContactSeller(contactMessage);
      toast.success('¡Mensaje enviado! El vendedor recibirá tu solicitud.');
      
      setContactMessage('');
      setShowContactForm(false);
      
    } catch (error) {
      toast.error('Error al enviar el mensaje');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContactMethodClick = (method: 'phone' | 'email' | 'whatsapp') => {
    const contact = classified.contact;
    
    switch (method) {
      case 'phone':
        if (contact?.phone) {
          window.open(`tel:${contact.phone}`, '_blank');
          toast.success('Abriendo aplicación de teléfono...');
        }
        break;
      case 'email':
        if (contact?.email) {
          window.open(`mailto:${contact.email}?subject=Interés en: ${classified.title}`, '_blank');
          toast.success('Abriendo aplicación de email...');
        }
        break;
      case 'whatsapp':
        if (contact?.whatsapp) {
          const message = encodeURIComponent(`Hola! Me interesa tu producto: ${classified.title}`);
          window.open(`https://wa.me/${contact.whatsapp.replace(/\D/g, '')}?text=${message}`, '_blank');
          toast.success('Abriendo WhatsApp...');
        }
        break;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] glass-card border-neon-green/20 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">
            {classified.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Imágenes */}
          {classified.images && classified.images.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {classified.images.slice(0, 4).map((image: string, index: number) => (
                <div key={index} className="relative h-48 bg-gray-800 rounded-lg overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-r from-gray-700 to-gray-600 flex items-center justify-center">
                    <span className="text-gray-400">Imagen {index + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Información principal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Detalles del producto */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-2xl font-bold text-neon-green">
                    {formatPrice(classified.price, classified.currency)}
                  </h3>
                  {classified.negotiable && (
                    <Badge variant="outline" className="border-neon-green text-neon-green">
                      Negociable
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-400 mb-4">
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{classified.location}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{getTimeAgo(classified.createdAt)}</span>
                  </span>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-400 mb-4">
                  <span className="flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>{classified.views} vistas</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Heart className="w-4 h-4" />
                    <span>{classified.likes} me gusta</span>
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary" className="bg-white/10 text-white">
                    {classified.category}
                  </Badge>
                  <Badge variant="outline" className="border-white/20 text-gray-300">
                    {classified.condition}
                  </Badge>
                  {classified.featured && (
                    <Badge className="bg-neon-green text-black">
                      <Star className="w-3 h-3 mr-1" />
                      Destacado
                    </Badge>
                  )}
                </div>

                {classified.tags && classified.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {classified.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs bg-white/5 border-white/10 text-gray-300">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Descripción</h4>
                <p className="text-gray-300 leading-relaxed">
                  {classified.description}
                </p>
              </div>
            </div>

            {/* Información del vendedor y contacto */}
            <div className="space-y-4">
              <Card className="glass-card">
                <CardContent className="p-4">
                  <h4 className="text-lg font-semibold text-white mb-3">Vendedor</h4>
                  
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-neon-green/20 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-neon-green" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h5 className="font-semibold text-white">{classified.seller.name}</h5>
                        {classified.seller.verified && (
                          <Shield className="w-4 h-4 text-blue-400" />
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-400">{classified.seller.rating}</span>
                      </div>
                    </div>
                  </div>

                  {!showContactForm ? (
                    <div className="space-y-3">
                      <CyberButton
                        onClick={() => setShowContactForm(true)}
                        className="w-full flex items-center justify-center space-x-2"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Enviar Mensaje</span>
                      </CyberButton>

                      <div className="grid grid-cols-3 gap-2">
                        {classified.contact?.phone && (
                          <CyberButton
                            variant="outline"
                            size="sm"
                            onClick={() => handleContactMethodClick('phone')}
                            className="flex items-center justify-center space-x-1"
                          >
                            <Phone className="w-3 h-3" />
                            <span className="hidden sm:inline">Llamar</span>
                          </CyberButton>
                        )}
                        
                        {classified.contact?.email && (
                          <CyberButton
                            variant="outline"
                            size="sm"
                            onClick={() => handleContactMethodClick('email')}
                            className="flex items-center justify-center space-x-1"
                          >
                            <Mail className="w-3 h-3" />
                            <span className="hidden sm:inline">Email</span>
                          </CyberButton>
                        )}
                        
                        {classified.contact?.whatsapp && (
                          <CyberButton
                            variant="outline"
                            size="sm"
                            onClick={() => handleContactMethodClick('whatsapp')}
                            className="flex items-center justify-center space-x-1 bg-green-600/20 border-green-500 text-green-400 hover:bg-green-600/30"
                          >
                            <MessageSquare className="w-3 h-3" />
                            <span className="hidden sm:inline">WhatsApp</span>
                          </CyberButton>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Mensaje para el vendedor
                        </label>
                        <Textarea
                          placeholder="Hola! Me interesa tu producto. ¿Podrías darme más información?"
                          value={contactMessage}
                          onChange={(e) => setContactMessage(e.target.value)}
                          className="bg-white/10 border-white/20 text-white placeholder-gray-400 min-h-[100px]"
                        />
                      </div>

                      <div className="flex space-x-2">
                        <CyberButton
                          onClick={handleSendMessage}
                          disabled={isLoading || !contactMessage.trim()}
                          className="flex-1 flex items-center justify-center space-x-2"
                        >
                          <Send className="w-4 h-4" />
                          <span>{isLoading ? 'Enviando...' : 'Enviar'}</span>
                        </CyberButton>
                        <CyberButton
                          variant="outline"
                          onClick={() => setShowContactForm(false)}
                          disabled={isLoading}
                        >
                          Cancelar
                        </CyberButton>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Consejos de seguridad */}
              <Card className="glass-card">
                <CardContent className="p-4">
                  <h4 className="text-sm font-semibold text-white mb-2 flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-neon-green" />
                    <span>Consejos de Seguridad</span>
                  </h4>
                  <ul className="text-xs text-gray-400 space-y-1">
                    <li>• Reúnete en lugares públicos</li>
                    <li>• Inspecciona el producto antes de pagar</li>
                    <li>• No envíes dinero por adelantado</li>
                    <li>• Confía en tu instinto</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}