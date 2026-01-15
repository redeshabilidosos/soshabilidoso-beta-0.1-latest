'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CyberButton } from '@/components/ui/cyber-button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DollarSign,
  CreditCard,
  Smartphone,
  Building2,
  CheckCircle,
  Rocket,
  MapPin,
  TrendingUp,
} from 'lucide-react';
import { toast } from 'sonner';

interface Project {
  id: string;
  name: string;
  founder: string;
  avatar: string;
  category: string;
  location: string;
  description: string;
  fundingGoal: number;
  fundingRaised: number;
  investors: number;
  stage: string;
}

interface InvestmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
}

const predefinedAmounts = [100000, 250000, 500000, 1000000, 2500000, 5000000];

const paymentMethods = [
  { id: 'card', name: 'Tarjeta de Crédito/Débito', icon: CreditCard },
  { id: 'nequi', name: 'Nequi', icon: Smartphone },
  { id: 'daviplata', name: 'Daviplata', icon: Smartphone },
  { id: 'pse', name: 'PSE - Transferencia Bancaria', icon: Building2 },
];

export function InvestmentDialog({ isOpen, onClose, project }: InvestmentDialogProps) {
  const [step, setStep] = useState(1);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getAmount = () => {
    if (selectedAmount) return selectedAmount;
    if (customAmount) return parseInt(customAmount.replace(/\D/g, ''));
    return 0;
  };

  const handleCustomAmountChange = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    setCustomAmount(numericValue);
    setSelectedAmount(null);
  };

  const handleSelectAmount = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleContinue = () => {
    if (step === 1 && getAmount() >= 100000) {
      setStep(2);
    } else if (step === 2 && selectedPayment) {
      handleInvest();
    }
  };

  const handleInvest = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setStep(3);
    toast.success(`¡Inversión de ${formatCurrency(getAmount())} realizada con éxito!`);
  };

  const handleClose = () => {
    setStep(1);
    setSelectedAmount(null);
    setCustomAmount('');
    setSelectedPayment(null);
    onClose();
  };

  if (!project) return null;

  const progress = (project.fundingRaised / project.fundingGoal) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-gray-900 border border-white/10 text-white max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center space-x-2">
            <TrendingUp className="text-neon-green" />
            <span>Invertir en {project.name}</span>
          </DialogTitle>
        </DialogHeader>

        {/* Project Info Header */}
        <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl mb-4">
          <img
            src={project.avatar}
            alt={project.founder}
            className="w-16 h-16 rounded-xl ring-2 ring-neon-green/50 object-cover"
          />
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-lg">{project.name}</h3>
              <Badge className="bg-blue-500 text-white text-xs">
                <CheckCircle className="w-3 h-3 mr-1" />
                Verificado
              </Badge>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Badge variant="outline" className="text-neon-green border-neon-green/50">
                <Rocket className="w-3 h-3 mr-1" />
                {project.stage}
              </Badge>
              <span className="flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                {project.location.split(',')[0]}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-neon-green font-semibold">
              {formatCurrency(project.fundingRaised)} recaudados
            </span>
            <span className="text-gray-400">
              Meta: {formatCurrency(project.fundingGoal)}
            </span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-neon-green to-neon-blue rounded-full"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {project.investors} inversionistas han apoyado este proyecto
          </p>
        </div>

        {/* Step 1: Select Amount */}
        {step === 1 && (
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Selecciona el monto a invertir</h4>
            <p className="text-sm text-gray-400">Monto mínimo de inversión: $100.000 COP</p>
            
            <div className="grid grid-cols-3 gap-3">
              {predefinedAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => handleSelectAmount(amount)}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    selectedAmount === amount
                      ? 'border-neon-green bg-neon-green/20 text-neon-green'
                      : 'border-white/20 hover:border-white/40 text-white'
                  }`}
                >
                  <span className="font-semibold text-sm">{formatCurrency(amount)}</span>
                </button>
              ))}
            </div>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
              <Input
                type="text"
                placeholder="Otro monto (mín. $100.000)"
                value={customAmount ? formatCurrency(parseInt(customAmount)).replace('$', '').trim() : ''}
                onChange={(e) => handleCustomAmountChange(e.target.value)}
                className="pl-8 bg-white/5 border-white/20 text-white placeholder-gray-400"
              />
            </div>

            <CyberButton
              className="w-full"
              size="lg"
              disabled={getAmount() < 100000}
              onClick={handleContinue}
            >
              Continuar - {formatCurrency(getAmount())}
            </CyberButton>
          </div>
        )}

        {/* Step 2: Select Payment Method */}
        {step === 2 && (
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Selecciona método de pago</h4>
            
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedPayment(method.id)}
                  className={`w-full p-4 rounded-xl border-2 flex items-center space-x-4 transition-all ${
                    selectedPayment === method.id
                      ? 'border-neon-green bg-neon-green/20'
                      : 'border-white/20 hover:border-white/40'
                  }`}
                >
                  <method.icon className={`w-6 h-6 ${
                    selectedPayment === method.id ? 'text-neon-green' : 'text-gray-400'
                  }`} />
                  <span className="font-medium">{method.name}</span>
                  {selectedPayment === method.id && (
                    <CheckCircle className="w-5 h-5 text-neon-green ml-auto" />
                  )}
                </button>
              ))}
            </div>

            <div className="flex space-x-3">
              <CyberButton
                variant="outline"
                className="flex-1"
                onClick={() => setStep(1)}
              >
                Volver
              </CyberButton>
              <CyberButton
                className="flex-1"
                size="lg"
                disabled={!selectedPayment || isProcessing}
                onClick={handleContinue}
              >
                {isProcessing ? 'Procesando...' : `Invertir ${formatCurrency(getAmount())}`}
              </CyberButton>
            </div>
          </div>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <div className="text-center py-8 space-y-4">
            <div className="w-20 h-20 mx-auto bg-neon-green/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-neon-green" />
            </div>
            <h4 className="text-2xl font-bold text-white">¡Gracias por tu inversión!</h4>
            <p className="text-gray-400">
              Tu aporte de {formatCurrency(getAmount())} ayudará a {project.name} a alcanzar sus metas 
              y generar impacto positivo en la comunidad.
            </p>
            <div className="bg-white/5 rounded-xl p-4 text-left">
              <p className="text-sm text-gray-400 mb-2">Próximos pasos:</p>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Recibirás un correo de confirmación</li>
                <li>• El equipo de {project.name} te contactará</li>
                <li>• Podrás seguir el progreso del proyecto</li>
              </ul>
            </div>
            <CyberButton className="w-full" onClick={handleClose}>
              Cerrar
            </CyberButton>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
