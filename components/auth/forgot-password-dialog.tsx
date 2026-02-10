'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { CyberButton } from '@/components/ui/cyber-button';
import { Mail, Check, Lock, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from '@/components/ui/input-otp';

interface ForgotPasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ForgotPasswordDialog({ isOpen, onClose }: ForgotPasswordDialogProps) {
  const [step, setStep] = useState<'email' | 'otp' | 'newPassword'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSendOtp = async () => {
    if (!email.trim()) {
      toast.error('Por favor, introduce tu correo electrónico.');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call to send OTP
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
      toast.success(`Se ha enviado un OTP a ${email}. Revisa tu bandeja de entrada.`);
      setStep('otp'); // Move to OTP verification step
    } catch (error) {
      console.error('Error sending OTP:', error);
      toast.error('Error al enviar el OTP. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      toast.error('Por favor, introduce el código OTP de 6 dígitos.');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate OTP verification
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      if (otp === '123456') { // Mock correct OTP
        toast.success('Código OTP verificado correctamente.');
        setStep('newPassword'); // Move to new password step
      } else {
        toast.error('Código OTP inválido. Vuelve a intentarlo.');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast.error('Hubo un problema al verificar el código. Vuelve a intentarlo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword.length < 6) {
      toast.error('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error('Las contraseñas no coinciden.');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call to reset password
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
      toast.success('Contraseña restablecida con éxito. Ya puedes iniciar sesión con tu nueva contraseña.');
      onClose(); // Close the dialog
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error('Error al restablecer la contraseña. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    switch (step) {
      case 'email':
        return (
          <>
            <DialogHeader>
              <DialogTitle className="text-white flex items-center space-x-2">
                <Mail size={20} className="text-neon-green" />
                <span>¿Olvidaste tu Contraseña?</span>
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                Introduce tu correo electrónico y te enviaremos un código para restablecer tu contraseña.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                required
              />
            </div>
            <DialogFooter>
              <CyberButton variant="outline" onClick={onClose} disabled={isLoading}>
                Cancelar
              </CyberButton>
              <CyberButton onClick={handleSendOtp} disabled={isLoading}>
                {isLoading ? 'Enviando...' : <><Check size={16} className="mr-2" /> Enviar OTP</>}
              </CyberButton>
            </DialogFooter>
          </>
        );
      case 'otp':
        return (
          <>
            <DialogHeader>
              <DialogTitle className="text-white flex items-center space-x-2">
                <Lock size={20} className="text-neon-green" />
                <span>Verificar Código OTP</span>
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                Hemos enviado un código de 6 dígitos a <span className="font-semibold text-white">{email}</span>. Introdúcelo a continuación.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 flex justify-center">
              <InputOTP maxLength={6} value={otp} onChange={(value) => setOtp(value)} disabled={isLoading}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <DialogFooter>
              <CyberButton variant="outline" onClick={onClose} disabled={isLoading}>
                Cancelar
              </CyberButton>
              <CyberButton onClick={handleVerifyOtp} disabled={isLoading || otp.length !== 6}>
                {isLoading ? 'Verificando...' : <><Check size={16} className="mr-2" /> Verificar</>}
              </CyberButton>
            </DialogFooter>
          </>
        );
      case 'newPassword':
        return (
          <>
            <DialogHeader>
              <DialogTitle className="text-white flex items-center space-x-2">
                <Lock size={20} className="text-neon-green" />
                <span>Establecer Nueva Contraseña</span>
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                Introduce tu nueva contraseña. Asegúrate de que tenga al menos 6 caracteres.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nueva Contraseña
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400 pr-12"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white p-1"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirmar Nueva Contraseña
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400 pr-12"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white p-1"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <CyberButton variant="outline" onClick={onClose} disabled={isLoading}>
                Cancelar
              </CyberButton>
              <CyberButton onClick={handleResetPassword} disabled={isLoading || newPassword.length < 6 || newPassword !== confirmNewPassword}>
                {isLoading ? 'Restableciendo...' : <><Check size={16} className="mr-2" /> Restablecer</>}
              </CyberButton>
            </DialogFooter>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] glass-card border-neon-green/20">
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}