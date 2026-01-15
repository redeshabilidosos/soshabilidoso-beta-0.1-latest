'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/providers';
import { CyberButton } from '@/components/ui/cyber-button';
import { Zap, Users, Trophy, Star, Eye, EyeOff } from 'lucide-react';
import { TruncatedIcosahedron } from '@/components/ui/truncated-icosahedron';
import { toast } from 'sonner'; // Importar toast para notificaciones
import { ForgotPasswordDialog } from '@/components/auth/forgot-password-dialog'; // Ruta de importación corregida
import { TestCredentials } from '@/components/auth/test-credentials';

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
    confirmPassword: '', // Nuevo campo para confirmar contraseña
  });
  const [showPassword, setShowPassword] = useState(false); // Estado para la visibilidad de la contraseña
  const [isForgotPasswordDialogOpen, setIsForgotPasswordDialogOpen] = useState(false); // Estado para el modal de contraseña olvidada

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
          login: formData.email, // Ahora se llama login y puede ser email o username
          password: formData.password
        });
        if (success) {
          router.push('/feed');
        }
      } else {
        // Validaciones para el registro
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
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="relative z-10 w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center mb-4 relative h-[300px] w-[350px] mx-auto">
              <TruncatedIcosahedron
                logoSrc="/logo.png"
                logoAlt="SOS-HABILIDOSO Logo"
                logoWidth={250}
                logoHeight={250}
              />
            </div>

            <p className="text-xl text-gray-300 leading-relaxed">
              Conecta con personas de todo el mundo, comparte tus pasiones
              y descubre nuevos talentos en la plataforma más avanzada para entusiastas.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="glass-card p-4 space-y-2">
              <Users className="text-neon-green" size={32} />
              <h3 className="text-white font-semibold">Comunidad Global</h3>
              <p className="text-gray-400 text-sm">Miles de personas conectadas</p>
            </div>

            <div className="glass-card p-4 space-y-2">
              <Trophy className="text-neon-blue" size={32} />
              <h3 className="text-white font-semibold">Momentos Destacados</h3>
              <p className="text-gray-400 text-sm">Comparte tus mejores experiencias</p>
            </div>

            <div className="glass-card p-4 space-y-2">
              <Zap className="text-neon-green" size={32} />
              <h3 className="text-white font-semibold">Tiempo Real</h3>
              <p className="text-gray-400 text-sm">Actualizaciones instantáneas</p>
            </div>

            <div className="glass-card p-4 space-y-2">
              <Star className="text-neon-blue" size={32} />
              <h3 className="text-white font-semibold">Descubrimiento</h3>
              <p className="text-gray-400 text-sm">Encuentra nuevas pasiones</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-8 space-y-6">
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-bold text-white">
              {isLogin ? 'Bienvenido de vuelta' : 'Únete a la comunidad'}
            </h2>
            <p className="text-gray-400">
              {isLogin
                ? 'Inicia sesión para continuar tu aventura'
                : 'Crea tu perfil y comienza a conectar'
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nombre de usuario
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">@</span>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full pl-8 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-green/50"
                      placeholder="usuarioHabilidoso"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-green/50"
                    placeholder="Tu nombre completo"
                    required
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {isLogin ? 'Email o nombre de usuario' : 'Email'}
              </label>
              <input
                type={isLogin ? 'text' : 'email'}
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-green/50"
                placeholder={isLogin ? 'tu@email.com o @usuario' : 'tu@email.com'}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-green/50"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-green/50"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            )}

            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Habilidad (Opcional)
                  </label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-green/50"
                    placeholder="Ej: Delantero, Bailarín, Músico"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Equipo/Grupo (Opcional)
                  </label>
                  <input
                    type="text"
                    name="team"
                    value={formData.team}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-green/50"
                    placeholder="Ej: Los Habilidosos FC, Banda Sonora"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Intereses (separados por comas)
                  </label>
                  <input
                    type="text"
                    name="interests"
                    value={formData.interests}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-green/50"
                    placeholder="Ej: fútbol, música electrónica, arte digital, baile urbano"
                  />
                </div>
              </div>
            )}

            <CyberButton
              type="submit"
              size="lg"
              className="w-full"
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

          <div className="text-center space-y-2">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-neon-green hover:text-neon-blue transition-colors"
            >
              {isLogin
                ? '¿No tienes cuenta? Regístrate'
                : '¿Ya tienes cuenta? Inicia sesión'
              }
            </button>
            {isLogin && (
              <button
                onClick={() => setIsForgotPasswordDialogOpen(true)}
                className="block w-full text-neon-blue hover:text-neon-green transition-colors text-sm mt-2"
              >
                ¿Olvidaste tu contraseña?
              </button>
            )}
          </div>
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