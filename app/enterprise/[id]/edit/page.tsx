'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/components/providers/providers';
import { Sidebar } from '@/components/navigation/sidebar';
import { MobileNav } from '@/components/navigation/mobile-nav';
import { CyberButton } from '@/components/ui/cyber-button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { enterprisesService, Enterprise } from '@/lib/services/enterprises.service';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Building2,
  Save,
  Loader2,
  Info,
  Users,
  Rocket,
  Phone,
  Globe,
  Mail,
  MapPin,
  Briefcase,
  Calendar,
  Plus,
  Trash2,
  Camera,
  Image as ImageIcon,
} from 'lucide-react';

const CATEGORIES = [
  { value: 'deportes', label: 'Deportes' },
  { value: 'fitness', label: 'Fitness' },
  { value: 'nutricion', label: 'Nutrición' },
  { value: 'tecnologia', label: 'Tecnología' },
  { value: 'salud', label: 'Salud' },
  { value: 'educacion', label: 'Educación' },
  { value: 'entretenimiento', label: 'Entretenimiento' },
  { value: 'moda', label: 'Moda' },
  { value: 'alimentos', label: 'Alimentos' },
  { value: 'servicios', label: 'Servicios' },
  { value: 'otro', label: 'Otro' },
];

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
}

export default function EditEnterprisePage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('info');
  
  // Estados del formulario
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    tagline: '',
    description: '',
    category: '',
    industry: '',
    location: '',
    website: '',
    email: '',
    phone: '',
    founded_year: '',
    employees_count: '',
  });

  const [team, setTeam] = useState<TeamMember[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [socialLinks, setSocialLinks] = useState<{ platform: string; url: string }[]>([]);
  const [achievements, setAchievements] = useState<string[]>([]);

  // Cargar datos de la empresa
  useEffect(() => {
    const loadEnterprise = async () => {
      const id = params.id as string;
      if (!id || !user) return;

      try {
        const enterprise = await enterprisesService.getEnterprise(id);
        
        // Verificar que el usuario es el propietario
        if (!enterprise.is_owner) {
          toast.error('No tienes permiso para editar esta empresa');
          router.push(`/enterprise/${id}`);
          return;
        }

        setFormData({
          name: enterprise.name || '',
          username: enterprise.username || '',
          tagline: enterprise.tagline || '',
          description: enterprise.description || '',
          category: enterprise.category || '',
          industry: enterprise.industry || '',
          location: enterprise.location || '',
          website: enterprise.website || '',
          email: enterprise.email || '',
          phone: enterprise.phone || '',
          founded_year: enterprise.founded_year?.toString() || '',
          employees_count: enterprise.employees_count || '',
        });

      } catch (error) {
        console.error('Error loading enterprise:', error);
        toast.error('Error al cargar la empresa');
        router.push('/settings');
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && user) {
      loadEnterprise();
    }
  }, [params.id, user, authLoading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await enterprisesService.updateEnterprise(params.id as string, {
        name: formData.name,
        tagline: formData.tagline,
        description: formData.description,
        category: formData.category,
        industry: formData.industry,
        location: formData.location,
        website: formData.website,
        email: formData.email,
        phone: formData.phone,
        founded_year: formData.founded_year ? parseInt(formData.founded_year) : undefined,
        employees_count: formData.employees_count,
      });
      toast.success('Empresa actualizada correctamente');
    } catch (error: any) {
      console.error('Error updating enterprise:', error);
      toast.error(error.response?.data?.error || 'Error al actualizar la empresa');
    } finally {
      setSaving(false);
    }
  };

  // Funciones para equipo
  const addTeamMember = () => {
    setTeam([...team, { id: Date.now().toString(), name: '', role: '', avatar: '' }]);
  };

  const updateTeamMember = (id: string, field: string, value: string) => {
    setTeam(team.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const removeTeamMember = (id: string) => {
    setTeam(team.filter(m => m.id !== id));
  };

  // Funciones para proyectos
  const addProject = () => {
    setProjects([...projects, { id: Date.now().toString(), name: '', description: '', status: 'Activo' }]);
  };

  const updateProject = (id: string, field: string, value: string) => {
    setProjects(projects.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const removeProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  // Funciones para logros
  const addAchievement = () => {
    setAchievements([...achievements, '']);
  };

  const updateAchievement = (index: number, value: string) => {
    const newAchievements = [...achievements];
    newAchievements[index] = value;
    setAchievements(newAchievements);
  };

  const removeAchievement = (index: number) => {
    setAchievements(achievements.filter((_, i) => i !== index));
  };

  // Funciones para redes sociales
  const addSocialLink = () => {
    setSocialLinks([...socialLinks, { platform: '', url: '' }]);
  };

  const updateSocialLink = (index: number, field: string, value: string) => {
    const newLinks = [...socialLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setSocialLinks(newLinks);
  };

  const removeSocialLink = (index: number) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="pb-24 xl:ml-64 xl:pb-0">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Building2 className="text-purple-400" />
                  Editar Empresa
                </h1>
                <p className="text-gray-400 text-sm">{formData.name}</p>
              </div>
            </div>
            <CyberButton
              onClick={handleSave}
              disabled={saving}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Cambios
                </>
              )}
            </CyberButton>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="info" className="flex items-center gap-2">
                <Info className="w-4 h-4" />
                <span className="hidden sm:inline">Información</span>
              </TabsTrigger>
              <TabsTrigger value="team" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Equipo</span>
              </TabsTrigger>
              <TabsTrigger value="projects" className="flex items-center gap-2">
                <Rocket className="w-4 h-4" />
                <span className="hidden sm:inline">Proyectos</span>
              </TabsTrigger>
              <TabsTrigger value="contact" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span className="hidden sm:inline">Contacto</span>
              </TabsTrigger>
            </TabsList>

            {/* Tab: Información */}
            <TabsContent value="info">
              <Card className="glass-card border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Info className="w-5 h-5 text-purple-400" />
                    Información General
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Nombre y Username */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Nombre de la empresa *
                      </label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Usuario
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">@</span>
                        <Input
                          name="username"
                          value={formData.username}
                          disabled
                          className="pl-8 bg-white/5 border-white/10 text-gray-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Eslogan */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Eslogan
                    </label>
                    <Input
                      name="tagline"
                      value={formData.tagline}
                      onChange={handleChange}
                      placeholder="Una frase que defina tu empresa"
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>

                  {/* Descripción */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Descripción
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Describe tu empresa, qué hacen, su misión..."
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 resize-none focus:border-purple-500/50 focus:outline-none"
                    />
                  </div>

                  {/* Categoría e Industria */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <Briefcase className="w-4 h-4 inline mr-1" />
                        Categoría
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full bg-gray-900 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-purple-500/50 focus:outline-none"
                      >
                        <option value="">Seleccionar</option>
                        {CATEGORIES.map(cat => (
                          <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Industria
                      </label>
                      <Input
                        name="industry"
                        value={formData.industry}
                        onChange={handleChange}
                        placeholder="Ej: Equipamiento deportivo"
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                  </div>

                  {/* Ubicación y Año */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <MapPin className="w-4 h-4 inline mr-1" />
                        Ubicación
                      </label>
                      <Input
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="Ciudad, País"
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        Año de fundación
                      </label>
                      <Input
                        name="founded_year"
                        type="number"
                        value={formData.founded_year}
                        onChange={handleChange}
                        placeholder="2024"
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                  </div>

                  {/* Empleados */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Users className="w-4 h-4 inline mr-1" />
                      Número de empleados
                    </label>
                    <select
                      name="employees_count"
                      value={formData.employees_count}
                      onChange={handleChange}
                      className="w-full bg-gray-900 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-purple-500/50 focus:outline-none"
                    >
                      <option value="">Seleccionar</option>
                      <option value="1-10">1-10</option>
                      <option value="11-50">11-50</option>
                      <option value="51-200">51-200</option>
                      <option value="201-500">201-500</option>
                      <option value="500+">500+</option>
                    </select>
                  </div>

                  {/* Logros */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium text-gray-300">
                        Logros y Reconocimientos
                      </label>
                      <button
                        type="button"
                        onClick={addAchievement}
                        className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1"
                      >
                        <Plus className="w-4 h-4" />
                        Agregar
                      </button>
                    </div>
                    <div className="space-y-2">
                      {achievements.map((achievement, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={achievement}
                            onChange={(e) => updateAchievement(index, e.target.value)}
                            placeholder="Ej: Premio Innovación 2024"
                            className="bg-white/5 border-white/10 text-white flex-1"
                          />
                          <button
                            type="button"
                            onClick={() => removeAchievement(index)}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      {achievements.length === 0 && (
                        <p className="text-gray-500 text-sm">No hay logros agregados</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>


            {/* Tab: Equipo */}
            <TabsContent value="team">
              <Card className="glass-card border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-purple-400" />
                      Equipo
                    </span>
                    <button
                      type="button"
                      onClick={addTeamMember}
                      className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1 font-normal"
                    >
                      <Plus className="w-4 h-4" />
                      Agregar miembro
                    </button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {team.length === 0 ? (
                    <div className="text-center py-8 bg-white/5 rounded-xl border-2 border-dashed border-white/20">
                      <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-400 mb-3">No hay miembros en el equipo</p>
                      <button
                        type="button"
                        onClick={addTeamMember}
                        className="text-purple-400 hover:text-purple-300 text-sm"
                      >
                        + Agregar primer miembro
                      </button>
                    </div>
                  ) : (
                    team.map((member) => (
                      <div key={member.id} className="p-4 bg-white/5 rounded-xl border border-white/10">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                            {member.avatar ? (
                              <img src={member.avatar} alt={member.name} className="w-full h-full rounded-xl object-cover" />
                            ) : (
                              <Camera className="w-6 h-6 text-purple-400" />
                            )}
                          </div>
                          <div className="flex-1 space-y-3">
                            <div className="grid md:grid-cols-2 gap-3">
                              <Input
                                value={member.name}
                                onChange={(e) => updateTeamMember(member.id, 'name', e.target.value)}
                                placeholder="Nombre completo"
                                className="bg-white/5 border-white/10 text-white"
                              />
                              <Input
                                value={member.role}
                                onChange={(e) => updateTeamMember(member.id, 'role', e.target.value)}
                                placeholder="Cargo (Ej: CEO, CTO)"
                                className="bg-white/5 border-white/10 text-white"
                              />
                            </div>
                            <Input
                              value={member.avatar}
                              onChange={(e) => updateTeamMember(member.id, 'avatar', e.target.value)}
                              placeholder="URL de la foto (opcional)"
                              className="bg-white/5 border-white/10 text-white text-sm"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeTeamMember(member.id)}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: Proyectos */}
            <TabsContent value="projects">
              <Card className="glass-card border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Rocket className="w-5 h-5 text-purple-400" />
                      Proyectos
                    </span>
                    <button
                      type="button"
                      onClick={addProject}
                      className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1 font-normal"
                    >
                      <Plus className="w-4 h-4" />
                      Agregar proyecto
                    </button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {projects.length === 0 ? (
                    <div className="text-center py-8 bg-white/5 rounded-xl border-2 border-dashed border-white/20">
                      <Rocket className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-400 mb-3">No hay proyectos agregados</p>
                      <button
                        type="button"
                        onClick={addProject}
                        className="text-purple-400 hover:text-purple-300 text-sm"
                      >
                        + Agregar primer proyecto
                      </button>
                    </div>
                  ) : (
                    projects.map((project) => (
                      <div key={project.id} className="p-4 bg-white/5 rounded-xl border border-white/10">
                        <div className="flex items-start gap-4">
                          <div className="flex-1 space-y-3">
                            <div className="grid md:grid-cols-2 gap-3">
                              <Input
                                value={project.name}
                                onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                                placeholder="Nombre del proyecto"
                                className="bg-white/5 border-white/10 text-white"
                              />
                              <select
                                value={project.status}
                                onChange={(e) => updateProject(project.id, 'status', e.target.value)}
                                className="bg-gray-900 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-purple-500/50 focus:outline-none"
                              >
                                <option value="Activo">Activo</option>
                                <option value="En desarrollo">En desarrollo</option>
                                <option value="Completado">Completado</option>
                                <option value="Pausado">Pausado</option>
                              </select>
                            </div>
                            <textarea
                              value={project.description}
                              onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                              placeholder="Descripción del proyecto"
                              rows={2}
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 resize-none focus:border-purple-500/50 focus:outline-none"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeProject(project.id)}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>


            {/* Tab: Contacto */}
            <TabsContent value="contact">
              <Card className="glass-card border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Phone className="w-5 h-5 text-purple-400" />
                    Información de Contacto
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Email y Teléfono */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <Mail className="w-4 h-4 inline mr-1" />
                        Email de contacto
                      </label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="contacto@empresa.com"
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <Phone className="w-4 h-4 inline mr-1" />
                        Teléfono
                      </label>
                      <Input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+57 300 123 4567"
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                  </div>

                  {/* Website */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Globe className="w-4 h-4 inline mr-1" />
                      Sitio web
                    </label>
                    <Input
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="https://tuempresa.com"
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>

                  {/* Redes Sociales */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium text-gray-300">
                        Redes Sociales
                      </label>
                      <button
                        type="button"
                        onClick={addSocialLink}
                        className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1"
                      >
                        <Plus className="w-4 h-4" />
                        Agregar
                      </button>
                    </div>
                    <div className="space-y-3">
                      {socialLinks.map((link, index) => (
                        <div key={index} className="flex gap-2">
                          <select
                            value={link.platform}
                            onChange={(e) => updateSocialLink(index, 'platform', e.target.value)}
                            className="bg-gray-900 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-purple-500/50 focus:outline-none w-40"
                          >
                            <option value="">Plataforma</option>
                            <option value="linkedin">LinkedIn</option>
                            <option value="instagram">Instagram</option>
                            <option value="twitter">Twitter/X</option>
                            <option value="facebook">Facebook</option>
                            <option value="youtube">YouTube</option>
                            <option value="tiktok">TikTok</option>
                          </select>
                          <Input
                            value={link.url}
                            onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                            placeholder="URL del perfil"
                            className="bg-white/5 border-white/10 text-white flex-1"
                          />
                          <button
                            type="button"
                            onClick={() => removeSocialLink(index)}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      {socialLinks.length === 0 && (
                        <p className="text-gray-500 text-sm">No hay redes sociales agregadas</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Botón guardar fijo en móvil */}
          <div className="fixed bottom-20 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent xl:hidden">
            <CyberButton
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Cambios
                </>
              )}
            </CyberButton>
          </div>
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
