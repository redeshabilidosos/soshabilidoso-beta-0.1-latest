'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/providers';
import { CyberButton } from '@/components/ui/cyber-button';
import { Zap, Users, Trophy, Star, Eye, EyeOff } from 'lucide-react';
import { TruncatedIcosahedron } from '@/components/ui/truncated-icosahedron';
import { toast } from 'sonner';
import { ForgotPasswordDialog } from '@/components/auth/forgot-password-dialog';
import { TestCredentials } from '@/components/auth/test-credentials';
import { motion, AnimatePresence } from 'framer-motion';

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    displayName: '',
    position: '',
    team: '',
    interests: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotPasswordDialogOpen, setIsForgotPasswordDialogOpen] = useState(false);

  const { login, register, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/feed');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const success = await login({
          login: formData.email,
          password: formData.password
        });
        if (success) {
          router.push('/feed');
        }
      } else {
        if (formData.password.length < 6) {
          toast.error('La contraseña debe tener al menos 6 caracteres.');
          setIsLoading(false);
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          toast.error('Las contraseñas no coinciden.');
          setIsLoading(false);
          return;
        }

        const success = await register({
          email: formData.email,
          username: formData.username,
          display_name: formData.displayName,
          password: formData.password,
          password_confirm: formData.confirmPassword,
          position: formData.position,
          team: formData.team,
          bio: formData.interests
        });
        if (success) {
          router.push('/feed');
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
      toast.error('Error en la autenticación. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="h-screen flex items-center justify-center p-2 lg:p-4 relative overflow-hidden">
      <div className="relative z-10 w-full max-w-6xl">
        <div className="relative w-full flex items-center justify-center">
          {/* Sección izquierda - Se oculta cuando isLogin es false */}
          <motion.div 
            className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 w-[45%] space-y-3"
            initial={false}
            animate={{ 
              opacity: isLogin ? 1 : 0,
              x: isLogin ? 0 : -100,
              pointerEvents: isLogin ? 'auto' : 'none'
            }}
            transition={{ duration: 0.4 }}
          >
            <div className="space-y-2">
              <div className="flex flex-col items-center justify-center relative h-[120px] w-[140px]">
                <TruncatedIcosahedron
                  logoSrc="/logo.png"
                  logoAlt="SOS-HABILIDOSO Logo"
                  logoWidth={120}
                  logoHeight={120}
                />
              </div>

              <p className="text-xs text-gray-300 leading-relaxed">
                Conecta con personas de todo el mundo, comparte tus pasiones
                y descubre nuevos talentos.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="glass-card p-2 space-y-0.5">
                <Users className="text-neon-green" size={18} />
                <h3 className="text-white font-semibold text-[10px]">Comunidad Global</h3>
                <p className="text-gray-400 text-[9px]">Miles conectadas</p>
              </div>

              <div className="glass-card p-2 space-y-0.5">
                <Trophy className="text-neon-blue" size={18} />
                <h3 className="text-white font-semibold text-[10px]">Momentos</h3>
                <p className="text-gray-400 text-[9px]">Comparte</p>
              </div>

              <div className="glass-card p-2 space-y-0.5">
                <Zap className="text-neon-green" size={18} />
                <h3 className="text-white font-semibold text-[10px]">Tiempo Real</h3>
                <p className="text-gray-400 text-[9px]">Instantáneo</p>
              </div>

              <div className="glass-card p-2 space-y-0.5">
                <Star className="text-neon-blue" size={18} />
                <h3 className="text-white font-semibold text-[10px]">Descubre</h3>
                <p className="text-gray-400 text-[9px]">Nuevas pasiones</p>
              </div>
            </div>
          </motion.div>

          {/* Formulario - Se expande cuando isLogin es false */}
          <motion.div 
            className="glass-card p-4 space-y-2.5 w-full lg:w-auto overflow-y-auto max-h-[calc(100vh-1rem)]"
            initial={false}
            animate={{ 
              width: isLogin ? '400px' : '90%',
              maxWidth: isLogin ? '400px' : '900px',
              marginLeft: isLogin ? 'auto' : '0'
            }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <div className="space-y-0.5 text-center">
              <h2 className="text-base font-bold text-white">
                {isLogin ? 'Bienvenido de vuelta' : 'Únete a la comunidad'}
              </h2>
              <p className="text-[10px] text-gray-400">
                {isLogin
                  ? 'Inicia sesión para continuar tu aventura'
                  : 'Crea tu perfil y comienza a conectar'
                }
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-2">
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-2"
                  >
                    <div>
                      <label className="block text-[9px] font-medium text-gray-300 mb-0.5">
                        Nombre de usuario
                      </label>
                      <div className="relative">
                        <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-[10px]">@</span>
                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleChange}
                          className="w-full pl-5 pr-2 py-1 text-[10px] bg-white/10 border border-white/20 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-neon-green/50"
                          placeholder="usuario"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] font-medium text-gray-300 mb-0.5">
                        Nombre completo
                      </label>
                      <input
                        type="text"
                        name="displayName"
                        value={formData.displayName}
                        onChange={handleChange}
                        className="w-full px-2 py-1 text-[10px] bg-white/10 border border-white/20 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-neon-green/50"
                        placeholder="Tu nombre"
                        required
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="block text-[9px] font-medium text-gray-300 mb-0.5">
                  {isLogin ? 'Email o nombre de usuario' : 'Email'}
                </label>
                <input
                  type={isLogin ? 'text' : 'email'}
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-2 py-1 text-[10px] bg-white/10 border border-white/20 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-neon-green/50"
                  placeholder={isLogin ? 'tu@email.com o @usuario' : 'tu@email.com'}
                  required
                />
              </div>

              <div>
                <label className="block text-[9px] font-medium text-gray-300 mb-0.5">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-2 pr-7 py-1 text-[10px] bg-white/10 border border-white/20 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-neon-green/50"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-0.5"
                  >
                    {showPassword ? <EyeOff size={12} /> : <Eye size={12} />}
                  </button>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-2"
                  >
                    <div>
                      <label className="block text-[9px] font-medium text-gray-300 mb-0.5">
                        Confirmar Contraseña
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="w-full pl-2 pr-7 py-1 text-[10px] bg-white/10 border border-white/20 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-neon-green/50"
                          placeholder="••••••••"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-0.5"
                        >
                          {showPassword ? <EyeOff size={12} /> : <Eye size={12} />}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[9px] font-medium text-gray-300 mb-0.5">
                          Habilidad
                        </label>
                        <input
                          type="text"
                          name="position"
                          value={formData.position}
                          onChange={handleChange}
                          className="w-full px-2 py-1 text-[10px] bg-white/10 border border-white/20 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-neon-green/50"
                          placeholder="Delantero"
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] font-medium text-gray-300 mb-0.5">
                          Equipo
                        </label>
                        <input
                          type="text"
                          name="team"
                          value={formData.team}
                          onChange={handleChange}
                          className="w-full px-2 py-1 text-[10px] bg-white/10 border border-white/20 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-neon-green/50"
                          placeholder="Habilidosos"
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] font-medium text-gray-300 mb-0.5">
                          Intereses
                        </label>
                        <input
                          type="text"
                          name="interests"
                          value={formData.interests}
                          onChange={handleChange}
                          className="w-full px-2 py-1 text-[10px] bg-white/10 border border-white/20 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-neon-green/50"
                          placeholder="fútbol, música"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <CyberButton
                type="submit"
                size="lg"
                className="w-full !py-1.5 !text-xs"
                disabled={isLoading}
              >
                {isLoading
                  ? 'Procesando...'
                  : isLogin
                    ? 'Iniciar Sesión'
                    : 'Crear Cuenta'
                }
              </CyberButton>
            </form>

            <div className="text-center space-y-0.5">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-[10px] text-neon-green hover:text-neon-blue transition-colors"
              >
                {isLogin
                  ? '¿No tienes cuenta? Regístrate'
                  : '¿Ya tienes cuenta? Inicia sesión'
                }
              </button>
              {isLogin && (
                <button
                  onClick={() => setIsForgotPasswordDialogOpen(true)}
                  className="block w-full text-neon-blue hover:text-neon-green transition-colors text-[9px]"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <ForgotPasswordDialog
        isOpen={isForgotPasswordDialogOpen}
        onClose={() => setIsForgotPasswordDialogOpen(false)}
      />
      
      <TestCredentials />
    </div>
  );
}
