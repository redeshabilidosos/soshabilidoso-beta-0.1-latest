'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CyberButton } from '@/components/ui/cyber-button';
import { 
  CreditCard, 
  Shield, 
  Lock,
  Check,
  Crown,
  X,
  Calendar,
  User,
  Building
} from 'lucide-react';
import { toast } from 'sonner';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  community: {
    name: string;
    subscriptionPrice: number;
    currency: string;
    profileImage: string | null;
  } | null;
  onPaymentSuccess: () => void;
}

export function PaymentModal({ 
  isOpen, 
  onClose, 
  community, 
  onPaymentSuccess 
}: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'pse' | 'nequi'>('card');
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    email: '',
    phone: ''
  });

  if (!community) return null;

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simular proceso de pago
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    toast.success('¡Pago procesado exitosamente! Bienvenido a la comunidad premium.');
    onPaymentSuccess();
    setIsProcessing(false);
    onClose();
  };

  const paymentMethods = [
    { id: 'card', name: 'Tarjeta de Crédito/Débito', icon: CreditCard },
    { id: 'pse', name: 'PSE', icon: Building },
    { id: 'nequi', name: 'Nequi', icon: Shield }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto bg-gray-900/95 border-white/10">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-white flex items-center space-x-2">
              <Lock className="w-5 h-5 text-neon-green" />
              <span>Pago Seguro</span>
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Order Summary */}
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
            <h3 className="text-white font-semibold mb-2 flex items-center text-sm">
              <Crown className="w-4 h-4 text-yellow-400 mr-2" />
              Resumen de tu suscripción
            </h3>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-yellow-500/30">
                {community.profileImage ? (
                  <img 
                    src={community.profileImage} 
                    alt={community.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-yellow-500/20 flex items-center justify-center">
                    <Crown className="w-5 h-5 text-yellow-400" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h4 className="text-white font-medium text-sm">{community.name}</h4>
                <p className="text-gray-400 text-xs">Suscripción mensual premium</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-yellow-400">
                  ${community.subscriptionPrice.toLocaleString()} {community.currency}
                </div>
                <div className="text-xs text-gray-400">por mes</div>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div>
            <h3 className="text-white font-semibold mb-2 text-sm">Método de pago</h3>
            <div className="grid grid-cols-3 gap-2">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id as any)}
                    className={`p-2 border rounded-lg transition-all duration-200 ${
                      paymentMethod === method.id
                        ? 'border-neon-green bg-neon-green/10 text-neon-green'
                        : 'border-white/20 bg-white/5 text-gray-300 hover:border-white/40'
                    }`}
                  >
                    <Icon className="w-5 h-5 mx-auto mb-1" />
                    <div className="text-xs font-medium">{method.name}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Payment Form */}
          {paymentMethod === 'card' && (
            <div className="space-y-3">
              <h3 className="text-white font-semibold text-sm">Información de la tarjeta</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Número de tarjeta
                  </label>
                  <Input
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, cardNumber: e.target.value }))}
                    className="bg-white/5 border-white/10 text-white text-sm h-9"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      Fecha de vencimiento
                    </label>
                    <Input
                      placeholder="MM/AA"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                      className="bg-white/5 border-white/10 text-white text-sm h-9"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      CVV
                    </label>
                    <Input
                      placeholder="123"
                      value={formData.cvv}
                      onChange={(e) => setFormData(prev => ({ ...prev, cvv: e.target.value }))}
                      className="bg-white/5 border-white/10 text-white text-sm h-9"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Nombre en la tarjeta
                  </label>
                  <Input
                    placeholder="Juan Pérez"
                    value={formData.cardName}
                    onChange={(e) => setFormData(prev => ({ ...prev, cardName: e.target.value }))}
                    className="bg-white/5 border-white/10 text-white text-sm h-9"
                  />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'pse' && (
            <div className="space-y-2">
              <h3 className="text-white font-semibold text-sm">Pago con PSE</h3>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                <p className="text-gray-300 text-xs">
                  Serás redirigido al portal de tu banco para completar el pago de forma segura.
                </p>
              </div>
            </div>
          )}

          {paymentMethod === 'nequi' && (
            <div className="space-y-2">
              <h3 className="text-white font-semibold text-sm">Pago con Nequi</h3>
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                <p className="text-gray-300 text-xs">
                  Recibirás una notificación en tu app Nequi para autorizar el pago.
                </p>
              </div>
            </div>
          )}

          {/* Contact Info */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold text-sm">Información de contacto</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-white/5 border-white/10 text-white text-sm h-9"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Teléfono
                </label>
                <Input
                  placeholder="+57 300 123 4567"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="bg-white/5 border-white/10 text-white text-sm h-9"
                />
              </div>
            </div>
          </div>

          {/* Security Info */}
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <Shield className="w-4 h-4 text-green-400 mt-0.5" />
              <div>
                <h4 className="text-green-400 font-medium mb-1 text-sm">Pago 100% seguro</h4>
                <p className="text-gray-300 text-xs">
                  Tu información está protegida con encriptación SSL de 256 bits. 
                  No almacenamos datos de tarjetas de crédito.
                </p>
              </div>
            </div>
          </div>

          {/* Payment Button */}
          <div className="sticky bottom-0 bg-gray-900/95 pt-4 border-t border-white/10 -mx-6 px-6 -mb-6 pb-6">
            <CyberButton
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full bg-neon-green text-black hover:bg-neon-green/80 py-3 text-base font-semibold shadow-lg"
            >
              {isProcessing ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  <span>Procesando pago...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <Lock className="w-4 h-4" />
                  <span>Pagar ${community.subscriptionPrice.toLocaleString()} {community.currency}</span>
                </div>
              )}
            </CyberButton>

            <div className="flex items-center justify-center space-x-3 text-xs text-gray-400 mt-2">
              <span className="flex items-center space-x-1">
                <Check className="w-3 h-3 text-green-400" />
                <span>Acceso inmediato</span>
              </span>
              <span className="flex items-center space-x-1">
                <Check className="w-3 h-3 text-green-400" />
                <span>Cancela cuando quieras</span>
              </span>
              <span className="flex items-center space-x-1">
                <Check className="w-3 h-3 text-green-400" />
                <span>Soporte 24/7</span>
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}