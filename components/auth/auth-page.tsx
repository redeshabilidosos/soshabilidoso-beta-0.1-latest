'use client';

import { useState, useEffect, lazy, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/providers';
import { CyberButton } from '@/components/ui/cyber-button';
import { Zap, Users, Trophy, Star, Eye, EyeOff, Building2, User } from 'lucide-react';
import { SimpleLogo } from '@/components/ui/simple-logo';
import { toast } from 'sonner'; // Importar toast para notificaciones

// Lazy loading del dialog pesado
const ForgotPasswordDialog = lazy(() => import('./forgot-password-dialog').then(m => ({ default: m.ForgotPasswordDialog })));

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
    accountType: 'user' as 'user' | 'enterprise', // Tipo de cuenta
    // Campos adicionales para empresas
    companyName: '',
    industry: '',
    website: '',
    companyDescription: '',
  });
  const [showPassword, setShowPassword] = useState(false); // Estado para la visibilidad de la contraseña
  const [isForgotPasswordDialogOpen, setIsForgotPasswordDialogOpen] = useState(false); // Estado para el modal de contraseña olvidada
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const { login, register, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/feed');
    }
  }, [user, router]);

  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    if (password.length < 8) {
      errors.push('Mínimo 8 caracteres');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Al menos una mayúscula');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Al menos una minúscula');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Al menos un número');
    }
    if (!/[!@#$%^&*]/.test(password)) {
      errors.push('Al menos un carácter especial (!@#$%^&*)');
    }
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      if (isLogin) {
        const success = await login({
          login: formData.email, // Ahora se llama login y puede ser email o username
          password: formData.password
        });
        if (success) {
          router.push('/feed');
        } else {
          setErrors({ auth: 'Verifique su correo o contraseña' });
        }
      } else {
        // Validaciones para el registro
        const newErrors: { [key: string]: string } = {};

        // Validar contraseña
        const passwordErrors = validatePassword(formData.password);
        if (passwordErrors.length > 0) {
          newErrors.password = passwordErrors.join(', ');
        }

        // Validar que las contraseñas coincidan
        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Las contraseñas no coinciden';
        }

        // Validar email
        if (!formData.email.includes('@')) {
          newErrors.email = 'Email inválido';
        }

        // Validar username
        if (formData.username.length < 3) {
          newErrors.username = 'El nombre de usuario debe tener al menos 3 caracteres';
        }

        if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors);
          setIsLoading(false);
          return;
        }

        const success = await register({
          email: formData.email,
          username: formData.username,
          display_name: formData.accountType === 'enterprise' ? formData.companyName : formData.displayName,
          password: formData.password,
          password_confirm: formData.confirmPassword,
          position: formData.position,
          team: formData.team,
          bio: formData.accountType === 'enterprise' ? formData.companyDescription : formData.interests,
          account_type: formData.accountType,
          // Campos de empresa
          company_name: formData.companyName,
          industry: formData.industry,
          website: formData.website,
        });

        if (success) {
          router.push('/feed');
        }
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      // Capturar errores del servidor
      if (error.response?.data?.email) {
        setErrors({ email: error.response.data.email[0] });
      } else if (error.response?.data?.username) {
        setErrors({ username: error.response.data.username[0] });
      } else if (error.response?.data?.error) {
        setErrors({ auth: error.response.data.error });
      } else {
        setErrors({ auth: 'Error en la autenticación. Intente de nuevo.' });
      }
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
    <div className="min-h-screen flex flex-col items-center justify-start lg:justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      <div className="relative z-10 w-full max-w-7xl">
        {/* Logo centrado como título - visible en desktop */}
        <div className="hidden lg:flex flex-col items-center justify-center mb-10">
          <SimpleLogo
            logoSrc="/logososbetav1.png"
            logoAlt="sos habilidoso logo beta"
            logoWidth={280}
            logoHeight={280}
          />
        </div>

        {/* Logo para móvil - arriba del formulario */}
        <div className="lg:hidden flex flex-col items-center justify-center mb-8 pt-6">
          <SimpleLogo
            logoSrc="/logososbetav1.png"
            logoAlt="sos habilidoso logo beta"
            logoWidth={220}
            logoHeight={220}
          />
        </div>

        {/* Contenedor principal con grid */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Columna izquierda - Descripción (en desktop) */}
          <div className="hidden lg:flex flex-col space-y-8 order-1">
            <p className="text-2xl text-gray-300 leading-relaxed">
              Conecta con personas de todo el mundo, comparte tus pasiones
              y descubre nuevos talentos en la plataforma más avanzada para entusiastas.
            </p>

            <div className="grid grid-cols-2 gap-5">
              <div className="glass-card p-5 space-y-3">
                <Users className="text-neon-green" size={36} />
                <h3 className="text-white font-semibold text-base">Comunidad Global</h3>
                <p className="text-gray-400 text-sm">Miles de personas conectadas</p>
              </div>

              <div className="glass-card p-5 space-y-3">
                <Trophy className="text-neon-blue" size={36} />
                <h3 className="text-white font-semibold text-base">Momentos Destacados</h3>
                <p className="text-gray-400 text-sm">Comparte tus mejores experiencias</p>
              </div>

              <div className="glass-card p-5 space-y-3">
                <Zap className="text-neon-green" size={36} />
                <h3 className="text-white font-semibold text-base">Tiempo Real</h3>
                <p className="text-gray-400 text-sm">Actualizaciones instantáneas</p>
              </div>

              <div className="glass-card p-5 space-y-3">
                <Star className="text-neon-blue" size={36} />
                <h3 className="text-white font-semibold text-base">Descubrimiento</h3>
                <p className="text-gray-400 text-sm">Encuentra nuevas pasiones</p>
              </div>
            </div>
          </div>

          {/* Columna derecha - Formulario (en desktop es derecha, en móvil es primero) */}
          <div className="glass-card p-8 lg:p-10 space-y-8 order-1 lg:order-2 shadow-2xl shadow-neon-green/10 border-2 border-white/20">
          <div className="space-y-3 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">
              {isLogin ? 'Bienvenido de vuelta' : 'Únete a la comunidad'}
            </h2>
            <p className="text-gray-400 text-lg">
              {isLogin
                ? 'Inicia sesión para continuar tu aventura'
                : 'Crea tu perfil y comienza a conectar'
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {errors.auth && (
              <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl">
                <p className="text-red-400 text-base font-medium">{errors.auth}</p>
              </div>
            )}

            {!isLogin && (
              <>
                {/* Selector de tipo de cuenta */}
                <div className="mb-6">
                  <label className="block text-base font-medium text-gray-300 mb-3">
                    Tipo de cuenta
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, accountType: 'user' }))}
                      className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                        formData.accountType === 'user'
                          ? 'border-neon-green bg-neon-green/10 text-white'
                          : 'border-white/20 bg-white/5 text-gray-400 hover:border-white/40'
                      }`}
                    >
                      <User size={28} className={formData.accountType === 'user' ? 'text-neon-green' : ''} />
                      <span className="font-medium">Usuario</span>
                      <span className="text-xs text-center opacity-70">Perfil personal</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, accountType: 'enterprise' }))}
                      className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                        formData.accountType === 'enterprise'
                          ? 'border-purple-500 bg-purple-500/10 text-white'
                          : 'border-white/20 bg-white/5 text-gray-400 hover:border-white/40'
                      }`}
                    >
                      <Building2 size={28} className={formData.accountType === 'enterprise' ? 'text-purple-500' : ''} />
                      <span className="font-medium">Empresa</span>
                      <span className="text-xs text-center opacity-70">Perfil empresarial</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-base font-medium text-gray-300 mb-3">
                    Nombre de usuario
                  </label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">@</span>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-5 py-4 text-lg bg-white/10 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${
                        errors.username ? 'border-red-500/50 focus:ring-red-500/50' : 'border-white/20 focus:ring-neon-green/50'
                      }`}
                      placeholder={formData.accountType === 'enterprise' ? 'miempresa' : 'usuarioHabilidoso'}
                      required
                    />
                  </div>
                  {errors.username && (
                    <p className="text-red-400 text-sm mt-2">{errors.username}</p>
                  )}
                </div>

                {/* Campos para Usuario */}
                {formData.accountType === 'user' && (
                  <div>
                    <label className="block text-base font-medium text-gray-300 mb-3">
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      name="displayName"
                      value={formData.displayName}
                      onChange={handleChange}
                      className="w-full px-5 py-4 text-lg bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-green/50"
                      placeholder="Tu nombre completo"
                      required
                    />
                  </div>
                )}

                {/* Campos para Empresa */}
                {formData.accountType === 'enterprise' && (
                  <>
                    <div>
                      <label className="block text-base font-medium text-gray-300 mb-3">
                        Nombre de la empresa
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        className="w-full px-5 py-4 text-lg bg-white/10 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        placeholder="Nombre de tu empresa"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-base font-medium text-gray-300 mb-3">
                          Industria
                        </label>
                        <input
                          type="text"
                          name="industry"
                          value={formData.industry}
                          onChange={handleChange}
                          className="w-full px-5 py-4 text-lg bg-white/10 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                          placeholder="Ej: Deportes, Tecnología"
                        />
                      </div>
                      <div>
                        <label className="block text-base font-medium text-gray-300 mb-3">
                          Sitio web
                        </label>
                        <input
                          type="url"
                          name="website"
                          value={formData.website}
                          onChange={handleChange}
                          className="w-full px-5 py-4 text-lg bg-white/10 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                          placeholder="https://tuempresa.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-base font-medium text-gray-300 mb-3">
                        Descripción de la empresa
                      </label>
                      <textarea
                        name="companyDescription"
                        value={formData.companyDescription}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-5 py-4 text-lg bg-white/10 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
                        placeholder="Describe brevemente tu empresa..."
                      />
                    </div>
                  </>
                )}
              </>
            )}

            <div>
              <label className="block text-base font-medium text-gray-300 mb-3">
                {isLogin ? 'Email o nombre de usuario' : 'Email'}
              </label>
              <input
                type={isLogin ? 'text' : 'email'}
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-5 py-4 text-lg bg-white/10 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${
                  errors.email ? 'border-red-500/50 focus:ring-red-500/50' : 'border-white/20 focus:ring-neon-green/50'
                }`}
                placeholder={isLogin ? 'tu@email.com o @usuario' : 'tu@email.com'}
                required
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-2">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-base font-medium text-gray-300 mb-3">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-5 py-4 text-lg bg-white/10 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${
                    errors.password ? 'border-red-500/50 focus:ring-red-500/50' : 'border-white/20 focus:ring-neon-green/50'
                  }`}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-sm mt-2">{errors.password}</p>
              )}
              {!isLogin && formData.password && !errors.password && (
                <p className="text-neon-green text-sm mt-2">✓ Contraseña válida</p>
              )}
            </div>

            {!isLogin && (
              <div>
                <label className="block text-base font-medium text-gray-300 mb-3">
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-5 py-4 text-lg bg-white/10 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${
                      errors.confirmPassword ? 'border-red-500/50 focus:ring-red-500/50' : 'border-white/20 focus:ring-neon-green/50'
                    }`}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-400 text-sm mt-2">{errors.confirmPassword}</p>
                )}
                {formData.confirmPassword && formData.password === formData.confirmPassword && !errors.confirmPassword && (
                  <p className="text-neon-green text-sm mt-2">✓ Las contraseñas coinciden</p>
                )}
              </div>
            )}

            {!isLogin && formData.accountType === 'user' && (
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-base font-medium text-gray-300 mb-3">
                    Habilidad (Opcional)
                  </label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    className="w-full px-5 py-4 text-lg bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-green/50"
                    placeholder="Ej: Delantero, Bailarín, Músico"
                  />
                </div>

                <div>
                  <label className="block text-base font-medium text-gray-300 mb-3">
                    Equipo/Grupo (Opcional)
                  </label>
                  <input
                    type="text"
                    name="team"
                    value={formData.team}
                    onChange={handleChange}
                    className="w-full px-5 py-4 text-lg bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-green/50"
                    placeholder="Ej: Los Habilidosos FC, Banda Sonora"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-base font-medium text-gray-300 mb-3">
                    Intereses (separados por comas)
                  </label>
                  <input
                    type="text"
                    name="interests"
                    value={formData.interests}
                    onChange={handleChange}
                    className="w-full px-5 py-4 text-lg bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-green/50"
                    placeholder="Ej: fútbol, música electrónica, arte digital, baile urbano"
                  />
                </div>
              </div>
            )}

            <CyberButton
              type="submit"
              size="lg"
              className={`w-full text-lg py-4 mt-4 ${formData.accountType === 'enterprise' && !isLogin ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
              disabled={isLoading}
            >
              {isLoading
                ? 'Procesando...'
                : isLogin
                  ? 'Iniciar Sesión'
                  : formData.accountType === 'enterprise'
                    ? 'Crear Cuenta Empresarial'
                    : 'Crear Cuenta'
              }
            </CyberButton>
          </form>

          <div className="text-center space-y-3 pt-2">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-neon-green hover:text-neon-blue transition-colors text-lg font-medium"
            >
              {isLogin
                ? '¿No tienes cuenta? Regístrate'
                : '¿Ya tienes cuenta? Inicia sesión'
              }
            </button>
            {isLogin && (
              <button
                onClick={() => setIsForgotPasswordDialogOpen(true)}
                className="block w-full text-neon-blue hover:text-neon-green transition-colors text-base mt-3"
              >
                ¿Olvidaste tu contraseña?
              </button>
            )}
          </div>
        </div>
        </div>

        {/* Sección descriptiva para móvil - aparece al final */}
        <div className="lg:hidden mt-10 space-y-8 pb-10">
          <p className="text-lg text-gray-300 leading-relaxed text-center">
            Conecta con personas de todo el mundo, comparte tus pasiones
            y descubre nuevos talentos en la plataforma más avanzada para entusiastas.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card p-4 space-y-2">
              <Users className="text-neon-green" size={28} />
              <h3 className="text-white font-semibold text-sm">Comunidad Global</h3>
              <p className="text-gray-400 text-xs">Miles de personas conectadas</p>
            </div>

            <div className="glass-card p-4 space-y-2">
              <Trophy className="text-neon-blue" size={28} />
              <h3 className="text-white font-semibold text-sm">Momentos Destacados</h3>
              <p className="text-gray-400 text-xs">Comparte tus mejores experiencias</p>
            </div>

            <div className="glass-card p-4 space-y-2">
              <Zap className="text-neon-green" size={28} />
              <h3 className="text-white font-semibold text-sm">Tiempo Real</h3>
              <p className="text-gray-400 text-xs">Actualizaciones instantáneas</p>
            </div>

            <div className="glass-card p-4 space-y-2">
              <Star className="text-neon-blue" size={28} />
              <h3 className="text-white font-semibold text-sm">Descubrimiento</h3>
              <p className="text-gray-400 text-xs">Encuentra nuevas pasiones</p>
            </div>
          </div>
        </div>
      </div>

      <Suspense fallback={null}>
        <ForgotPasswordDialog
          isOpen={isForgotPasswordDialogOpen}
          onClose={() => setIsForgotPasswordDialogOpen(false)}
        />
      </Suspense>
    </div>
  );
}