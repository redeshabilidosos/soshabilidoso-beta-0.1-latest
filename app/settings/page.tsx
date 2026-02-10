'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/providers';
import { Sidebar } from '@/components/navigation/sidebar';
import { MobileNav } from '@/components/navigation/mobile-nav';
import { CyberButton } from '@/components/ui/cyber-button';
import { Button } from '@/components/ui/button';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  HelpCircle,
  LogOut,
  Camera,
  Lock,
  Eye,
  EyeOff,
  Mail,
  Check,
  Building2,
  Plus,
} from 'lucide-react';

import { cn } from '@/lib/utils'; // Import cn for conditional classNames
import { useBackgroundColor } from '@/hooks/use-background-color';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'; // Importar componentes de Accordion
import { Input } from '@/components/ui/input'; // Importar Input para los campos de contraseña
import { Textarea } from '@/components/ui/textarea'; // Importar Textarea
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { CreateEnterpriseDialog } from '@/components/enterprise/create-enterprise-dialog';
import { enterprisesService, Enterprise } from '@/lib/services/enterprises.service';

// Lista completa de roles/posiciones
const allRoles = [
  // Deportes
  'Atleta profesional', 'Entrenador / DT', 'Árbitro / Juez deportivo', 'Preparador físico',
  'Fisioterapeuta deportivo', 'Fisioterapeuta deportivo', 'Scout / Ojeador', 'Delegado de equipo', 'Comentarista deportivo',
  'Agente deportivo', 'Nutricionista deportivo',
  // Cultura
  'Actor / Actriz', 'Director de cine o teatro', 'Guionista', 'Escritor / Novelista / Poeta',
  'Pintor / Artista visual', 'Escultor', 'Bailarín / Coreógrafo', 'Fotógrafo',
  'Gestor cultural', 'Crítico de arte',
  // Sociales
  'Trabajador social', 'Psicólogo comunitario', 'Sociólogo', 'Antropólogo',
  'Mediador familiar o comunitario', 'Activista social o ambiental', 'Educador social',
  'Promotor de salud comunitaria', 'Coordinador de ONG', 'Intérprete cultural',
  // Ramas educativas
  'Maestro / Profesor', 'Director de institución educativa', 'Orientador educativo', 'Pedagogo',
  'Investigador educativo', 'Tutor en línea', 'Especialista en educación especial',
  'Diseñador de materiales educativos', 'Administrador educativo', 'Formador corporativo',
  // Musicales
  'Músico / Instrumentista', 'Cantante / Solista', 'Compositor / Arreglista',
  'Director de orquesta o coro', 'Productor musical', 'Ingeniero de sonido', 'DJ',
  'Crítico musical', 'Luthier', 'Profesor de música',
  // Chefs / Gastronomía
  'Chef ejecutivo', 'Pastelero / Repostero', 'Panadero', 'Sous chef', 'Sommelier',
  'Bartender / Mixólogo', 'Crítico gastronómico', 'Investigador culinario',
  'Chef de catering', 'Instructor de cocina'
];

// Componente para seleccionar color de fondo
function BackgroundColorSelector() {
  const { selectedColor, backgroundColors, changeBackgroundColor } = useBackgroundColor();

  return (
    <Card className="glass-card border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Color de fondo personalizado</CardTitle>
        <CardDescription>
          Selecciona un color de fondo que se aplicará por toda la aplicación
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {backgroundColors.map((color) => (
            <div
              key={color.id}
              className={cn(
                "p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 group",
                selectedColor === color.id
                  ? "border-white/50 bg-white/10 scale-105"
                  : "border-transparent hover:border-white/30 hover:bg-white/5"
              )}
              onClick={() => changeBackgroundColor(color.id)}
            >
              <div className="text-center">
                <div 
                  className="w-12 h-12 rounded-full mx-auto mb-3 border-2 border-white/20 group-hover:border-white/40 transition-all duration-300"
                  style={{ backgroundColor: color.preview }}
                />
                <p className="text-white text-sm font-medium mb-1">{color.name}</p>
                {selectedColor === color.id && (
                  <p className="text-xs" style={{ color: color.preview }}>
                    Activo
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function SettingsPage() {
  const { user, updateProfile, logout, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  
  // Estados para la información del perfil
  const [profileFormData, setProfileFormData] = useState({
    displayName: '',
    email: '',
    bio: '',
    position: '',
    team: '',
  });

  // Estados para el flujo de cambio de contraseña
  const [passwordChangeStep, setPasswordChangeStep] = useState<'initial' | 'otpRequested' | 'otpVerified'>('initial');
  const [otpCode, setOtpCode] = useState('');
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmNewPasswordInput, setConfirmNewPasswordInput] = useState('');
  const [isPasswordChangeLoading, setIsPasswordChangeLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPasswordFields, setShowNewPasswordFields] = useState(false);

  const [notifications, setNotifications] = useState({
    likes: true,
    comments: true,
    follows: true,
    friendRequests: true,
    email: false,
    push: true,
  });
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showStats: true,
    allowMessages: 'friends',
  });

  // Estados para empresa
  const [myEnterprises, setMyEnterprises] = useState<Enterprise[]>([]);
  const [loadingEnterprises, setLoadingEnterprises] = useState(false);
  const [isCreateEnterpriseOpen, setIsCreateEnterpriseOpen] = useState(false);

  // Cargar empresas del usuario
  useEffect(() => {
    if (user) {
      loadMyEnterprises();
    }
  }, [user]);

  const loadMyEnterprises = async () => {
    setLoadingEnterprises(true);
    try {
      const enterprises = await enterprisesService.getMyEnterprises();
      setMyEnterprises(enterprises);
    } catch (error) {
      console.error('Error loading enterprises:', error);
    } finally {
      setLoadingEnterprises(false);
    }
  };

  useEffect(() => {
    // Solo redirigir si ya terminó de cargar la autenticación y no hay usuario
    if (!authLoading && !user) {
      router.push('/');
      return;
    }
    
    if (user) {
      setProfileFormData({
        displayName: user.displayName || '',
        email: user.email || '',
        bio: user.bio || '',
        position: user.position || '',
        team: user.team || '',
      });
    }
  }, [user, authLoading, router]);

  // Solo mostrar loading si está cargando Y no hay usuario
  if (authLoading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-10 h-10 border-3 border-neon-green border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return null;

  const handleProfileSave = useCallback(async () => {
    await updateProfile({
      displayName: profileFormData.displayName,
      bio: profileFormData.bio,
      position: profileFormData.position,
      team: profileFormData.team,
    });
  }, [profileFormData, updateProfile]);

  const handleProfileChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setProfileFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }, []);

  // Funciones para el flujo de cambio de contraseña
  const handleRequestOtp = async () => {
    if (!currentPasswordInput.trim()) {
      toast.error('Por favor, introduce tu contraseña actual.');
      return;
    }
    setIsPasswordChangeLoading(true);
    try {
      // Simular verificación de contraseña actual (en un entorno real, esto sería una llamada a la API)
      await new Promise(resolve => setTimeout(resolve, 1000)); 
      if (currentPasswordInput === 'password123') { // Contraseña mock para demostración
        // Simular envío de OTP al email del usuario
        await new Promise(resolve => setTimeout(resolve, 1500));
        toast.success(`Se ha enviado un código OTP a ${user.email}. Revisa tu bandeja de entrada.`);
        setPasswordChangeStep('otpRequested');
      } else {
        toast.error('Contraseña actual incorrecta.');
      }
    } catch (error) {
      console.error('Error al solicitar OTP:', error);
      toast.error('Error al solicitar el código. Inténtalo de nuevo.');
    } finally {
      setIsPasswordChangeLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otpCode.length !== 6) {
      toast.error('Por favor, introduce el código OTP de 6 dígitos.');
      return;
    }
    setIsPasswordChangeLoading(true);
    try {
      // Simular verificación de OTP (código mock '123456')
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (otpCode === '123456') { // OTP mock para demostración
        toast.success('Código OTP verificado correctamente.');
        setPasswordChangeStep('otpVerified');
        setShowNewPasswordFields(true);
      } else {
        toast.error('Código OTP inválido. Vuelve a intentarlo.');
      }
    } catch (error) {
      console.error('Error al verificar OTP:', error);
      toast.error('Hubo un problema al verificar el código. Vuelve a intentarlo.');
    } finally {
      setIsPasswordChangeLoading(false);
    }
  };

  const handleSetNewPassword = async () => {
    if (newPasswordInput.length < 6) {
      toast.error('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (newPasswordInput !== confirmNewPasswordInput) {
      toast.error('Las contraseñas no coinciden.');
      return;
    }
    setIsPasswordChangeLoading(true);
    try {
      // Simular actualización de contraseña (en un entorno real, esto sería una llamada a la API)
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Contraseña actualizada con éxito.');
      // Resetear el flujo
      setPasswordChangeStep('initial');
      setCurrentPasswordInput('');
      setNewPasswordInput('');
      setConfirmNewPasswordInput('');
      setOtpCode('');
      setShowNewPasswordFields(false);
    } catch (error) {
      console.error('Error al restablecer contraseña:', error);
      toast.error('Error al restablecer la contraseña. Inténtalo de nuevo.');
    } finally {
      setIsPasswordChangeLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'enterprise', label: 'Mi Empresa', icon: Building2 },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
    { id: 'privacy', label: 'Privacidad', icon: Shield },
    { id: 'appearance', label: 'Apariencia', icon: Palette },
    { id: 'help', label: 'Ayuda', icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen">
      <Sidebar />
      
      <main id="settings-page" className="pb-24 xl:ml-64 xl:pb-0">
        <div className="max-w-6xl mx-auto p-4 space-y-6">
          {/* Header */}
          <div className="glass-card p-6">
            <h1 className="text-2xl font-bold text-white flex items-center space-x-2 mb-2">
              <Settings className="text-neon-green" />
              <span>Configuración</span>
            </h1>
            <p className="text-gray-400">Personaliza tu experiencia en SOS-HABILIDOSO</p>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="glass-card p-4 space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 text-left ${
                      activeTab === tab.id
                        ? 'bg-neon-green/20 text-neon-green border border-neon-green/30'
                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <tab.icon size={20} />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
                
                <div className="pt-4 border-t border-white/10">
                  <button
                    onClick={logout}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all duration-300"
                  >
                    <LogOut size={20} />
                    <span className="font-medium">Cerrar Sesión</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              <div className="glass-card p-6">
                {activeTab === 'profile' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-white">Información del Perfil</h2>
                    
                    {/* Avatar Section */}
                    <div className="flex items-center space-x-6">
                      <div className="relative">
                        <img
                          src={user.avatar}
                          alt={user.displayName}
                          className="w-24 h-24 rounded-full ring-2 ring-neon-green/50"
                        />
                        <button className="absolute bottom-0 right-0 p-2 bg-neon-green rounded-full text-white hover:bg-neon-green/80 transition-colors">
                          <Camera size={16} />
                        </button>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-white">{user.displayName}</h3>
                        <p className="text-gray-400">@{user.username}</p>
                        <CyberButton size="sm" className="mt-2">
                          Cambiar Foto
                        </CyberButton>
                      </div>
                    </div>

                    {/* Form */}
                    <div className="grid lg:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Nombre Completo
                        </label>
                        <Input
                          type="text"
                          name="displayName"
                          value={profileFormData.displayName}
                          onChange={handleProfileChange}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-green/50"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Email
                        </label>
                        <Input
                          type="email"
                          name="email"
                          value={profileFormData.email}
                          onChange={handleProfileChange}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-green/50"
                          disabled // El email no se cambia desde aquí, solo se muestra
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Posición
                        </label>
                        <select
                          name="position"
                          value={profileFormData.position}
                          onChange={handleProfileChange}
                          className="w-full px-4 py-3 bg-gray-900 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-neon-green/50 [&>option]:bg-gray-900 [&>option]:text-white"
                        >
                          <option value="" className="bg-gray-900 text-white">Seleccionar posición</option>
                          {allRoles.filter(role => role !== 'all').map(role => (
                            <option key={role} value={role} className="bg-gray-900 text-white">{role}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Equipo Actual
                        </label>
                        <Input
                          type="text"
                          name="team"
                          value={profileFormData.team}
                          onChange={handleProfileChange}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-green/50"
                          placeholder="Nombre de tu equipo"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Biografía
                      </label>
                      <Textarea
                        name="bio"
                        value={profileFormData.bio}
                        onChange={handleProfileChange}
                        rows={4}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-green/50 resize-none"
                        placeholder="Cuéntanos sobre ti y tu pasión por el fútbol..."
                      />
                    </div>

                    <div className="flex justify-end space-x-4">
                      <CyberButton variant="outline">
                        Cancelar
                      </CyberButton>
                      <CyberButton onClick={handleProfileSave}>
                        Guardar Cambios
                      </CyberButton>
                    </div>

                    {/* Password Section */}
                    <div className="border-t border-white/10 pt-6">
                      <h3 className="text-lg font-medium text-white mb-4">Cambiar Contraseña</h3>
                      {passwordChangeStep === 'initial' && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Contraseña Actual
                            </label>
                            <div className="relative">
                              <Input
                                type={showCurrentPassword ? 'text' : 'password'}
                                name="currentPassword"
                                value={currentPasswordInput}
                                onChange={(e) => setCurrentPasswordInput(e.target.value)}
                                className="w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-green/50"
                                disabled={isPasswordChangeLoading}
                              />
                              <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white p-1"
                              >
                                {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                              </button>
                            </div>
                          </div>
                          <CyberButton onClick={handleRequestOtp} disabled={isPasswordChangeLoading || !currentPasswordInput.trim()}>
                            {isPasswordChangeLoading ? 'Enviando...' : <><Mail size={16} className="mr-2" /> Solicitar Código</>}
                          </CyberButton>
                        </div>
                      )}

                      {passwordChangeStep === 'otpRequested' && (
                        <div className="space-y-4">
                          <p className="text-gray-400 text-sm">Se ha enviado un código a tu email ({user.email}). Introdúcelo a continuación.</p>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Código OTP
                            </label>
                            <Input
                              type="text"
                              name="otpCode"
                              value={otpCode}
                              onChange={(e) => setOtpCode(e.target.value)}
                              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-green/50"
                              placeholder="XXXXXX"
                              maxLength={6}
                              disabled={isPasswordChangeLoading}
                            />
                          </div>
                          <CyberButton onClick={handleVerifyOtp} disabled={isPasswordChangeLoading || otpCode.length !== 6}>
                            {isPasswordChangeLoading ? 'Verificando...' : <><Check size={16} className="mr-2" /> Verificar Código</>}
                          </CyberButton>
                        </div>
                      )}

                      {passwordChangeStep === 'otpVerified' && (
                        <div className="space-y-4">
                          <p className="text-neon-green text-sm">Código verificado. Ahora puedes establecer tu nueva contraseña.</p>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Nueva Contraseña
                            </label>
                            <div className="relative">
                              <Input
                                type={showNewPasswordFields ? 'text' : 'password'}
                                name="newPassword"
                                value={newPasswordInput}
                                onChange={(e) => setNewPasswordInput(e.target.value)}
                                className="w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-green/50"
                                placeholder="••••••••"
                                disabled={isPasswordChangeLoading}
                              />
                              <button
                                type="button"
                                onClick={() => setShowNewPasswordFields(!showNewPasswordFields)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white p-1"
                              >
                                {showNewPasswordFields ? <EyeOff size={18} /> : <Eye size={18} />}
                              </button>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Confirmar Nueva Contraseña
                            </label>
                            <div className="relative">
                              <Input
                                type={showNewPasswordFields ? 'text' : 'password'}
                                name="confirmNewPassword"
                                value={confirmNewPasswordInput}
                                onChange={(e) => setConfirmNewPasswordInput(e.target.value)}
                                className="w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-green/50"
                                placeholder="••••••••"
                                disabled={isPasswordChangeLoading}
                              />
                              <button
                                type="button"
                                onClick={() => setShowNewPasswordFields(!showNewPasswordFields)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white p-1"
                              >
                                {showNewPasswordFields ? <EyeOff size={18} /> : <Eye size={18} />}
                              </button>
                            </div>
                          </div>
                          <CyberButton onClick={handleSetNewPassword} disabled={isPasswordChangeLoading || newPasswordInput.length < 6 || newPasswordInput !== confirmNewPasswordInput}>
                            {isPasswordChangeLoading ? 'Guardando...' : <><Lock size={16} className="mr-2" /> Guardar Nueva Contraseña</>}
                          </CyberButton>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'enterprise' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                          <Building2 className="text-purple-400" />
                          Mi Empresa
                        </h2>
                        <p className="text-gray-400 text-sm mt-1">
                          Crea y gestiona tu perfil empresarial
                        </p>
                      </div>
                      <CyberButton
                        onClick={() => setIsCreateEnterpriseOpen(true)}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        <Plus size={18} className="mr-2" />
                        Crear Empresa
                      </CyberButton>
                    </div>

                    {loadingEnterprises ? (
                      <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
                        <p className="text-gray-400 mt-2">Cargando empresas...</p>
                      </div>
                    ) : myEnterprises.length > 0 ? (
                      <div className="space-y-4">
                        <h3 className="text-white font-medium">Mis Empresas</h3>
                        {myEnterprises.map((enterprise) => (
                          <div
                            key={enterprise.id}
                            className="p-4 bg-white/5 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all"
                          >
                            <div className="flex items-center gap-4">
                              <img
                                src={enterprise.logo_url || `https://ui-avatars.com/api/?name=${enterprise.name}&background=8B5CF6&color=fff`}
                                alt={enterprise.name}
                                className="w-16 h-16 rounded-xl object-cover"
                              />
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="text-white font-semibold">{enterprise.name}</h4>
                                  {enterprise.is_verified && (
                                    <span className="text-purple-400">✓</span>
                                  )}
                                </div>
                                <p className="text-gray-400 text-sm">@{enterprise.username}</p>
                                <p className="text-gray-500 text-xs mt-1">
                                  {enterprise.category} • {enterprise.followers_count} seguidores
                                </p>
                              </div>
                              <CyberButton
                                variant="outline"
                                size="sm"
                                onClick={() => router.push(`/enterprise/${enterprise.id}`)}
                                className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                              >
                                <Eye size={16} className="mr-2" />
                                Ver Perfil
                              </CyberButton>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-white/5 rounded-xl border-2 border-dashed border-white/20">
                        <Building2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-white font-medium mb-2">No tienes empresas creadas</h3>
                        <p className="text-gray-400 text-sm mb-4 max-w-md mx-auto">
                          Crea tu perfil empresarial para promocionar tu negocio, publicar en clasificados y conectar con clientes potenciales.
                        </p>
                        <CyberButton
                          onClick={() => setIsCreateEnterpriseOpen(true)}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          <Plus size={18} className="mr-2" />
                          Crear Mi Primera Empresa
                        </CyberButton>
                      </div>
                    )}

                    {/* Beneficios */}
                    <div className="mt-8 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20">
                      <h3 className="text-white font-medium mb-3">Beneficios de tener un perfil empresarial</h3>
                      <div className="grid md:grid-cols-2 gap-3">
                        <div className="flex items-start gap-2">
                          <span className="text-purple-400">✓</span>
                          <span className="text-gray-300 text-sm">Perfil profesional destacado</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-purple-400">✓</span>
                          <span className="text-gray-300 text-sm">Publicar en clasificados como empresa</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-purple-400">✓</span>
                          <span className="text-gray-300 text-sm">Ganar seguidores y visibilidad</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-purple-400">✓</span>
                          <span className="text-gray-300 text-sm">Conectar con clientes potenciales</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold text-white mb-2">Preferencias de Notificaciones</h2>
                      <p className="text-gray-400 text-sm">Gestiona cómo y cuándo recibes notificaciones</p>
                    </div>
                    
                    <div className="space-y-3">
                      <Card className="glass-card border-white/10">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label className="text-white font-medium">Me gusta en publicaciones</Label>
                              <p className="text-gray-400 text-sm">Recibe notificaciones cuando alguien le dé me gusta a tus publicaciones</p>
                            </div>
                            <Switch
                              checked={notifications.likes}
                              onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, likes: checked }))}
                            />
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="glass-card border-white/10">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label className="text-white font-medium">Comentarios</Label>
                              <p className="text-gray-400 text-sm">Notificaciones de nuevos comentarios en tus publicaciones</p>
                            </div>
                            <Switch
                              checked={notifications.comments}
                              onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, comments: checked }))}
                            />
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="glass-card border-white/10">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label className="text-white font-medium">Nuevos seguidores</Label>
                              <p className="text-gray-400 text-sm">Cuando alguien comience a seguirte</p>
                            </div>
                            <Switch
                              checked={notifications.follows}
                              onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, follows: checked }))}
                            />
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="glass-card border-white/10">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label className="text-white font-medium">Solicitudes de conexión</Label>
                              <p className="text-gray-400 text-sm">Notificaciones de nuevas solicitudes de amistad</p>
                            </div>
                            <Switch
                              checked={notifications.friendRequests}
                              onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, friendRequests: checked }))}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}

                {activeTab === 'privacy' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold text-white mb-2">Configuración de Privacidad</h2>
                      <p className="text-gray-400 text-sm">Controla quién puede ver tu información</p>
                    </div>
                    
                    <div className="space-y-3">
                      <Card className="glass-card border-white/10">
                        <CardContent className="p-4 space-y-4">
                          <div className="space-y-2">
                            <Label className="text-white font-medium">Visibilidad del perfil</Label>
                            <p className="text-gray-400 text-sm">Controla quién puede ver tu perfil completo</p>
                            <Select
                              value={privacy.profileVisibility}
                              onValueChange={(value) => setPrivacy(prev => ({ ...prev, profileVisibility: value }))}
                            >
                              <SelectTrigger className="bg-gray-900 border-white/20 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="public">Público</SelectItem>
                                <SelectItem value="friends">Solo amigos</SelectItem>
                                <SelectItem value="private">Privado</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="glass-card border-white/10">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label className="text-white font-medium">Mostrar email</Label>
                              <p className="text-gray-400 text-sm">Permitir que otros vean tu dirección de email</p>
                            </div>
                            <Switch
                              checked={privacy.showEmail}
                              onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, showEmail: checked }))}
                            />
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="glass-card border-white/10">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label className="text-white font-medium">Mostrar estadísticas</Label>
                              <p className="text-gray-400 text-sm">Mostrar número de seguidores, siguiendo y publicaciones</p>
                            </div>
                            <Switch
                              checked={privacy.showStats}
                              onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, showStats: checked }))}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}

                {activeTab === 'appearance' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-white">Personalización Visual</h2>
                    
                    <BackgroundColorSelector />
                  </div>
                )}

                {activeTab === 'help' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-white">Centro de Ayuda</h2>
                    
                    <Accordion type="single" collapsible className="w-full space-y-4">
                      <AccordionItem value="item-1" className="p-4 bg-white/5 rounded-xl border-none">
                        <AccordionTrigger className="text-white font-medium hover:no-underline">
                          Tutorial Guiado
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-400 text-sm pt-2 space-y-3">
                          <p>¿Quieres volver a ver el tutorial de introducción? Haz clic en el botón de abajo para reiniciar el tour guiado por todas las funcionalidades de SOS-HABILIDOSO.</p>
                          <Button
                            onClick={() => {
                              localStorage.removeItem(`tutorial_seen_${user?.id}`);
                              window.location.href = '/feed';
                            }}
                            className="bg-gradient-to-r from-neon-green to-emerald-500 hover:from-neon-green/90 hover:to-emerald-500/90 text-black font-semibold"
                          >
                            🚀 Reiniciar Tutorial
                          </Button>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="item-2" className="p-4 bg-white/5 rounded-xl border-none">
                        <AccordionTrigger className="text-white font-medium hover:no-underline">
                          Preguntas Frecuentes
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-400 text-sm pt-2">
                          <p>Aquí encontrarás respuestas a las preguntas más comunes sobre el uso de SOS-HABILIDOSO, desde cómo crear una publicación hasta cómo gestionar tus conexiones.</p>
                          <p className="mt-2">Si no encuentras lo que buscas, no dudes en contactar a nuestro soporte.</p>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="item-3" className="p-4 bg-white/5 rounded-xl border-none">
                        <AccordionTrigger className="text-white font-medium hover:no-underline">
                          Contactar Soporte
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-400 text-sm pt-2">
                          <p>¿Necesitas ayuda personalizada? Nuestro equipo de soporte está disponible para asistirte.</p>
                          <p className="mt-2">Puedes enviarnos un email a <a href="mailto:soporte@habilidosos.com" className="text-neon-green hover:underline">soporte@habilidosos.com</a> o usar nuestro formulario de contacto en la web.</p>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="item-4" className="p-4 bg-white/5 rounded-xl border-none">
                        <AccordionTrigger className="text-white font-medium hover:no-underline">
                          Términos y Condiciones
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-400 text-sm pt-2">
                          <p>Es importante que conozcas las reglas de nuestra comunidad. Lee nuestros términos de uso para entender tus derechos y responsabilidades al usar SOS-HABILIDOSO.</p>
                          <p className="mt-2">Puedes encontrar el documento completo en la sección legal de nuestra web.</p>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="item-5" className="p-4 bg-white/5 rounded-xl border-none">
                        <AccordionTrigger className="text-white font-medium hover:no-underline">
                          Política de Privacidad
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-400 text-sm pt-2">
                          <p>Tu privacidad es nuestra prioridad. Esta política explica cómo recopilamos, usamos y protegemos tu información personal.</p>
                          <p className="mt-2">Te invitamos a revisar nuestra política de privacidad para estar informado.</p>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                    
                    <div className="border-t border-white/10 pt-6">
                      <div className="text-center text-gray-400">
                        <p className="text-sm">SOS-HABILIDOSO v1.0.0</p>
                        <p className="text-xs mt-1">© 2026 Todos los derechos reservados</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <MobileNav />

      {/* Diálogo para crear empresa */}
      <CreateEnterpriseDialog
        isOpen={isCreateEnterpriseOpen}
        onClose={() => setIsCreateEnterpriseOpen(false)}
        onSuccess={() => loadMyEnterprises()}
      />
    </div>
  );
}