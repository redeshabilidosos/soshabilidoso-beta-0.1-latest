'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/providers';
import { Sidebar } from '@/components/navigation/sidebar';
import { MobileNav } from '@/components/navigation/mobile-nav';
import { CyberButton } from '@/components/ui/cyber-button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { UserPlus, Trophy, CalendarDays, MapPin, Mail, Phone, GraduationCap, ShieldCheck, Upload, CircleDot } from 'lucide-react'; // Importar iconos de género
import { cn } from '@/lib/utils';
import Image from 'next/image'; // Importar el componente Image
import { RegistrationStatusDialog } from '@/components/ui/registration-status-dialog'; // Importar el nuevo componente

// Opciones para selectores
const positions = [
  'Portero', 'Defensa Central', 'Lateral Derecho', 'Lateral Izquierdo',
  'Mediocampista Defensivo', 'Mediocampista Central', 'Mediocampista Ofensivo',
  'Extremo Derecho', 'Extremo Izquierdo', 'Delantero Centro', 'Segundo Delantero'
];

const documentTypes = ['Cédula de Ciudadanía', 'Tarjeta de Identidad', 'Registro Civil', 'Pasaporte', 'Cédula de Extranjería'];
const bloodTypes = ['A', 'B', 'AB', 'O'];
const rhTypes = ['+', '-'];
const subregions = ['Urabá', 'Suroeste', 'Oriente', 'Occidente', 'Norte', 'Nordeste', 'Magdalena Medio', 'Bajo Cauca', 'Valle de Aburrá'];
const educationLevels = ['Primaria', 'Secundaria', 'Técnico', 'Tecnólogo', 'Universitario', 'Posgrado', 'Ninguno'];

const epsSisbenOptions = [
  'ALIANSALUD ENTIDAD PROMOTORA DE SALUD S.A.',
  'ANASWAYUU',
  'ASOCIACIÓN INDÍGENA DEL CAUCA',
  'ASOCIACION MUTUAL SER EMPRESA SOLIDARIA DE SALUD EPS',
  'CAPITAL SALUD',
  'CAPRESOCA EPS',
  'COMFENALCO VALLE E.P.S.',
  'COMPENSAR E.P.S.',
  'COOPERATIVA DE SALUD Y DESARROLLO INTEGRAL ZONA SUR ORIENTAL DE CARTAGENA',
  'E.P.S. FAMISANAR LTDA.',
  'E.P.S. SANITAS S.A.',
  'EPS CONVIDA',
  'EPS SERVICIO OCCIDENTAL DE SALUD S.A.',
  'EPS Y MEDICINA PREPAGADA SURAMERICANA S.A',
  'FUNDACIÓN SALUD MIA EPS',
  'MALLAMAS',
  'NUEVA EPS S.A.',
  'SALUD TOTAL S.A. E.P.S.',
  'SALUDVIDA S.A. E.P.S.',
  'SAVIA SALUD EPS',
  'SISBEN'
];

const municipiosPorSubregion = {
  "Valle de Aburrá": [
    "Medellín", "Bello", "Itagüí", "Envigado", "Sabaneta", "La Estrella", "Copacabana", "Girardota", "Barbosa", "Caldas"
  ],
  "Oriente": [
    "Rionegro", "La Ceja", "El Carmen de Viboral", "Marinilla", "Guarne", "El Retiro", "San Vicente", "Sonsón", "San Carlos", "San Rafael", "Granada", "Cocorná", "Abejorral", "Alejandría", "Argelia", "Concepción", "El Peñol", "El Santuario", "Guatapé", "La Unión", "Nariño", "San Francisco", "San Luis", "San Vicente Ferrer"
  ],
  "Suroeste": [
    "Andes", "Jardín", "Jericó", "Amagá", "Fredonia", "Ciudad Bolívar", "Urrao", "Támesis", "Salgar", "Venecia", "La Pintada", "Angelópolis", "Betania", "Betulia", "Caramanta", "Concordia", "Hispania", "Montebello", "Pueblorrico", "Santa Bárbara", "Tarso", "Titiribí", "Valparaíso"
  ],
  "Occidente": [
    "Abriaquí", "Anzá", "Armenia", "Santa Fe de Antioquia", "Sopetrán", "Cañasgordas", "Frontino", "Dabeiba", "Liborina", "San Jerónimo", "Uramita", "Buriticá", "Caicedo", "Ebéjico", "Giraldo", "Heliconia", "Olaya", "Peque", "Sabanalarga"
  ],
  "Bajo Cauca": [
    "Caucasia", "El Bagre", "Nechí", "Tarazá", "Cáceres", "Zaragoza"
  ],
  "Magdalena Medio": [
    "Puerto Berrío", "Puerto Nare", "Puerto Triunfo", "Caracolí", "Maceo", "Yondó"
  ],
  "Norte": [
    "Santa Rosa de Osos", "Yarumal", "Donmatías", "San Pedro de los Milagros", "Entrerríos", "Campamento", "Angostura", "Guadalupe", "Ituango", "Toledo", "Briceño", "San Andrés de Cuerquia", "Valdivia"
  ],
  "Nordeste": [
    "Amalfi", "Segovia", "Remedios", "Yolombó", "Cisneros", "Vegachí", "Santo Domingo", "Anorí", "San Roque", "Yalí"
  ],
  "Urabá": [
    "Apartadó", "Turbo", "Chigorodó", "Carepa", "Necoclí", "Arboletes", "San Juan de Urabá", "San Pedro de Urabá", "Mutatá", "Murindó"
  ]
};

export default function RegisterHabilidososPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    names: '',
    lastnames: '',
    gender: '', // Nuevo campo para género
    playingPosition: '',
    documentType: '',
    documentNumber: '',
    birthDate: '',
    bloodType: '',
    rh: '',
    epsSisben: '', // Nuevo campo
    epsCertificate: '', // Nuevo campo para el certificado
    subregion: '',
    municipality: '', // Campo para el municipio del deportista
    contactNumber: '',
    email: '',
    confirmEmail: '',
    educationLevel: '',
    institutionName: '',
    guardianName: '',
    guardianDocumentType: '',
    guardianDocumentNumber: '',
    guardianContactNumber: '', // Nuevo campo para el teléfono del acudiente
    guardianEmail: '', // Nuevo campo para el email del acudiente
    residenceMunicipality: '', // Campo para el municipio de residencia del acudiente
    acceptSensitiveData: false,
    acceptHabeasData: false,
    avatarPhoto: '', // Foto de perfil para el reality
  });
  const [isLoading, setIsLoading] = useState(false);
  const [calculatedAge, setCalculatedAge] = useState<number | null>(null);
  const [ageEligibilityMessage, setAgeEligibilityMessage] = useState<string | null>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false); // Estado para el modal de estado
  const [registrationSuccess, setRegistrationSuccess] = useState(false); // Estado para el éxito del registro
  const [registrationMessage, setRegistrationMessage] = useState(''); // Mensaje para el modal
  const [epsCertificateFile, setEpsCertificateFile] = useState<File | null>(null); // Estado para el archivo
  const [avatarPhotoFile, setAvatarPhotoFile] = useState<File | null>(null); // Estado para la foto de perfil
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null); // Preview de la foto

  const calculateAge = (birthDateString: string): number | null => {
    if (!birthDateString) return null;
    const birthDate = new Date(birthDateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'birthDate') {
      const age = calculateAge(value);
      setCalculatedAge(age);
      if (age === null) {
        setAgeEligibilityMessage(null);
      } else if (age >= 13 && age <= 19) {
        setAgeEligibilityMessage(`Edad: ${age} años. ¡Aplicas por tu edad!`);
      } else {
        setAgeEligibilityMessage('Ups, no aplicas por tu edad. Solo pueden participar edades entre los 13 a 19 años.');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      const file = files[0];
      
      if (name === 'avatarPhoto') {
        // Validar que sea una imagen
        if (!file.type.startsWith('image/')) {
          toast.error('Por favor selecciona una imagen válida (JPG, PNG, etc.)');
          return;
        }
        // Validar tamaño (máximo 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error('La imagen no debe superar los 5MB');
          return;
        }
        setAvatarPhotoFile(file);
        // Crear preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setAvatarPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        setFormData(prev => ({ ...prev, [name]: file.name }));
        toast.success(`Foto de perfil "${file.name}" seleccionada.`);
      } else {
        // Para otros archivos (certificado EPS)
        setEpsCertificateFile(file);
        setFormData(prev => ({ ...prev, [name]: file.name }));
        toast.success(`Archivo "${file.name}" seleccionado.`);
      }
    } else {
      if (name === 'avatarPhoto') {
        setAvatarPhotoFile(null);
        setAvatarPreview(null);
      } else {
        setEpsCertificateFile(null);
      }
      setFormData(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => {
      const newState = { ...prev, [name]: value };
      // Si cambia la subregión, resetear el municipio
      if (name === 'subregion') {
        newState.municipality = '';
      }
      return newState;
    });
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleStatusDialogClose = () => {
    setIsStatusDialogOpen(false);
    if (registrationSuccess) {
      router.push('/feed'); // Redirigir solo si el registro fue exitoso
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!user) {
      toast.error('Debes iniciar sesión para registrarte en el programa.');
      setIsLoading(false);
      return;
    }

    if (formData.email !== formData.confirmEmail) {
      toast.error('El correo electrónico y su confirmación no coinciden.');
      setIsLoading(false);
      return;
    }

    if (!formData.acceptSensitiveData || !formData.acceptHabeasData) {
      toast.error('Debes aceptar las autorizaciones de datos personales para continuar.');
      setIsLoading(false);
      return;
    }

    if (calculatedAge === null || calculatedAge < 13 || calculatedAge > 19) {
      toast.error('Debes tener entre 13 y 19 años para participar en el programa.');
      setIsLoading(false);
      return;
    }

    try {
      // Crear FormData para enviar archivo
      const formDataToSend = new FormData();
      formDataToSend.append('names', formData.names);
      formDataToSend.append('lastnames', formData.lastnames);
      formDataToSend.append('gender', formData.gender);
      formDataToSend.append('playingPosition', formData.playingPosition);
      formDataToSend.append('documentType', formData.documentType);
      formDataToSend.append('documentNumber', formData.documentNumber);
      formDataToSend.append('birthDate', formData.birthDate);
      formDataToSend.append('bloodType', formData.bloodType);
      formDataToSend.append('rh', formData.rh);
      formDataToSend.append('epsSisben', formData.epsSisben);
      
      // Agregar archivo de certificado EPS si existe
      if (epsCertificateFile) {
        formDataToSend.append('epsCertificate', epsCertificateFile);
      }
      
      // Agregar foto de perfil si existe
      if (avatarPhotoFile) {
        formDataToSend.append('avatarPhoto', avatarPhotoFile);
      }
      
      formDataToSend.append('subregion', formData.subregion);
      formDataToSend.append('municipality', formData.municipality);
      formDataToSend.append('contactNumber', formData.contactNumber);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('confirmEmail', formData.confirmEmail);
      formDataToSend.append('educationLevel', formData.educationLevel);
      formDataToSend.append('institutionName', formData.institutionName);
      formDataToSend.append('guardianName', formData.guardianName);
      formDataToSend.append('guardianDocumentType', formData.guardianDocumentType);
      formDataToSend.append('guardianDocumentNumber', formData.guardianDocumentNumber);
      formDataToSend.append('guardianContactNumber', formData.guardianContactNumber);
      formDataToSend.append('guardianEmail', formData.guardianEmail);
      formDataToSend.append('residenceMunicipality', formData.residenceMunicipality);
      formDataToSend.append('acceptSensitiveData', String(formData.acceptSensitiveData));
      formDataToSend.append('acceptHabeasData', String(formData.acceptHabeasData));

      // Enviar datos al nuevo endpoint 2026 (guarda en participantes_2026_1)
      const response = await fetch('http://localhost:8000/api/reality/register-2026/', {
        method: 'POST',
        // No establecer Content-Type, el navegador lo hará automáticamente con el boundary correcto
        body: formDataToSend,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        console.log('Registro exitoso:', result);
        setRegistrationSuccess(true);
        setRegistrationMessage(`¡Tu registro ha sido enviado exitosamente! Código: ${result.data.codigo}`);
        setIsStatusDialogOpen(true);
      } else {
        console.error('Error en el registro:', result);
        setRegistrationSuccess(false);
        
        // Manejar error de documento duplicado (409 Conflict)
        if (response.status === 409) {
          setRegistrationMessage(
            `⚠️ Ya estás registrado\n\n${result.detail || 'Tu documento ya se encuentra registrado en el programa. Si crees que esto es un error, por favor contacta con el administrador.'}`
          );
        } else {
          const errorMessage = result.errors 
            ? Object.values(result.errors).flat().join(', ')
            : result.message || 'Error desconocido';
          setRegistrationMessage(`Error: ${errorMessage}`);
        }
        
        setIsStatusDialogOpen(true);
      }
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      setRegistrationSuccess(false);
      setRegistrationMessage('Ups, hubo un problema con tu registro. Verifica tu conexión e inténtalo de nuevo.');
      setIsStatusDialogOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const availableMunicipalities = formData.subregion ? municipiosPorSubregion[formData.subregion as keyof typeof municipiosPorSubregion] : [];

  return (
    <div className="min-h-screen">
      <Sidebar />
      
      <main className="pb-24 xl:ml-64 xl:pb-0">
        <div className="max-w-4xl mx-auto p-4 space-y-6">
          {/* Header */}
          <div className="glass-card p-6">
            <h1 className="text-2xl font-bold text-white flex items-center space-x-2 mb-2">
              <Trophy className="text-neon-green" />
              <span>Un Golazo a tus Sueños</span>
            </h1>
            <p className="text-gray-400">Formulario de Inscripción para el programa de la Fundación Habilidosos.</p>
            {/* Logo de la empresa con efecto dinámico y partículas */}
            <div className="mt-6 flex justify-center relative">
              <div className="relative inline-block">
                {/* Partículas flotantes */}
                <div className="absolute inset-0 pointer-events-none" style={{ width: '350px', height: '350px' }}>
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 rounded-full animate-pulse"
                      style={{
                        background: i % 3 === 0 ? '#00ff88' : i % 3 === 1 ? '#00ffff' : '#ff00ff',
                        left: `${10 + (i * 7)}%`,
                        top: `${20 + (i % 4) * 20}%`,
                        boxShadow: `0 0 10px ${i % 3 === 0 ? '#00ff88' : i % 3 === 1 ? '#00ffff' : '#ff00ff'}`,
                        animation: `float ${2 + (i * 0.3)}s ease-in-out infinite`,
                        animationDelay: `${i * 0.2}s`,
                      }}
                    />
                  ))}
                </div>
                
                {/* Logo con efecto de levitación */}
                <div className="animate-bounce-slow cursor-pointer hover:scale-110 transition-transform duration-300">
                  <Image
                    src="/Loggo.png"
                    alt="Logo SOS-HABILIDOSO"
                    width={350}
                    height={350}
                    className="object-contain relative z-10"
                    style={{
                      filter: 'drop-shadow(0 0 3px rgba(0, 255, 136, 0.6))'
                    }}
                    priority
                  />
                </div>
              </div>
            </div>
            
            {/* Estilos para animaciones */}
            <style jsx>{`
              @keyframes float {
                0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
                50% { transform: translateY(-20px) translateX(10px); opacity: 1; }
              }
              .animate-bounce-slow {
                animation: bounce-slow 3s ease-in-out infinite;
              }
              @keyframes bounce-slow {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-15px); }
              }
            `}</style>
          </div>

          <form onSubmit={handleSubmit} className="glass-card p-6 space-y-6">
            <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
              <UserPlus size={20} className="text-neon-blue" />
              <span>Datos Personales del Deportista</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="names" className="text-gray-300">Nombres</Label>
                <Input
                  id="names"
                  name="names"
                  value={formData.names}
                  onChange={handleChange}
                  placeholder="Tus nombres"
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastnames" className="text-gray-300">Apellidos</Label>
                <Input
                  id="lastnames"
                  name="lastnames"
                  value={formData.lastnames}
                  onChange={handleChange}
                  placeholder="Tus apellidos"
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                  required
                />
              </div>
              <div>
                <Label htmlFor="gender" className="text-gray-300 flex items-center space-x-2">
                  <CircleDot size={16} className="text-gray-400" />
                  <span>Género</span>
                </Label>
                <Select onValueChange={(value) => handleSelectChange('gender', value)} value={formData.gender} required>
                  <SelectTrigger className="w-full bg-white/10 border-white/20 text-white focus:ring-neon-green/50">
                    <SelectValue placeholder="Selecciona tu género" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover text-popover-foreground border-border">
                    <SelectItem value="femenino">Femenino</SelectItem>
                    <SelectItem value="masculino">Masculino</SelectItem>
                    <SelectItem value="otros">Otros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="playingPosition" className="text-gray-300">Posición de juego</Label>
                <Select onValueChange={(value) => handleSelectChange('playingPosition', value)} value={formData.playingPosition} required>
                  <SelectTrigger className="w-full bg-white/10 border-white/20 text-white focus:ring-neon-green/50">
                    <SelectValue placeholder="Selecciona tu posición" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover text-popover-foreground border-border">
                    {positions.map(pos => (
                      <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="documentType" className="text-gray-300">Tipo de documento</Label>
                <Select onValueChange={(value) => handleSelectChange('documentType', value)} value={formData.documentType} required>
                  <SelectTrigger className="w-full bg-white/10 border-white/20 text-white focus:ring-neon-green/50">
                    <SelectValue placeholder="Selecciona tipo de documento" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover text-popover-foreground border-border">
                    {documentTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="documentNumber" className="text-gray-300">Número de documento</Label>
                <Input
                  id="documentNumber"
                  name="documentNumber"
                  value={formData.documentNumber}
                  onChange={handleChange}
                  placeholder="Número de documento"
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                  required
                />
              </div>
              <div>
                <Label htmlFor="birthDate" className="text-gray-300 flex items-center space-x-2">
                  <CalendarDays size={16} className="text-gray-400" />
                  <span>Fecha de nacimiento</span>
                </Label>
                <Input
                  id="birthDate"
                  name="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                  required
                />
                {ageEligibilityMessage && (
                  <p className={cn("text-sm mt-1", calculatedAge !== null && calculatedAge >= 13 && calculatedAge <= 19 ? "text-neon-green" : "text-red-400")}>
                    {ageEligibilityMessage}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="bloodType" className="text-gray-300">Tipo de sangre</Label>
                <Select onValueChange={(value) => handleSelectChange('bloodType', value)} value={formData.bloodType} required>
                  <SelectTrigger className="w-full bg-white/10 border-white/20 text-white focus:ring-neon-green/50">
                    <SelectValue placeholder="Selecciona tipo de sangre" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover text-popover-foreground border-border">
                    {bloodTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="rh" className="text-gray-300">RH</Label>
                <Select onValueChange={(value) => handleSelectChange('rh', value)} value={formData.rh} required>
                  <SelectTrigger className="w-full bg-white/10 border-white/20 text-white focus:ring-neon-green/50">
                    <SelectValue placeholder="Selecciona RH" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover text-popover-foreground border-border">
                    {rhTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="epsSisben" className="text-gray-300">EPS / SISBEN</Label> {/* Nuevo campo */}
                <Select onValueChange={(value) => handleSelectChange('epsSisben', value)} value={formData.epsSisben} required>
                  <SelectTrigger className="w-full bg-white/10 border-white/20 text-white focus:ring-neon-green/50">
                    <SelectValue placeholder="Selecciona tu EPS o SISBEN" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover text-popover-foreground border-border">
                    {epsSisbenOptions.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="epsCertificate" className="text-gray-300 flex items-center space-x-2">
                  <Upload size={16} className="text-gray-400" />
                  <span>Certificado de EPS (PDF/Imagen)</span>
                </Label>
                <Input
                  id="epsCertificate"
                  name="epsCertificate"
                  type="file"
                  accept=".pdf,image/*"
                  onChange={handleFileChange}
                  className="bg-white/10 border-white/20 text-white file:text-neon-green file:bg-white/10 file:border-0 file:rounded-md file:px-3 file:py-1 file:mr-2"
                  required
                />
                {formData.epsCertificate && (
                  <p className="text-gray-400 text-sm mt-1">Archivo seleccionado: {formData.epsCertificate}</p>
                )}
              </div>
              
              {/* Campo de Foto de Perfil para el Reality */}
              <div className="md:col-span-2">
                <Label htmlFor="avatarPhoto" className="text-gray-300 flex items-center space-x-2">
                  <Upload size={16} className="text-neon-green" />
                  <span>📸 Foto de Perfil para el Reality</span>
                </Label>
                <div className="mt-2 p-4 border-2 border-dashed border-neon-green/30 rounded-lg bg-neon-green/5 hover:bg-neon-green/10 transition-colors">
                  <div className="flex flex-col md:flex-row items-center gap-4">
                    {/* Preview de la foto */}
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-white/10 flex items-center justify-center border-2 border-neon-green/50">
                      {avatarPreview ? (
                        <img 
                          src={avatarPreview} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center text-gray-400">
                          <Upload size={24} className="mx-auto mb-1" />
                          <span className="text-xs">Sin foto</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 text-center md:text-left">
                      <Input
                        id="avatarPhoto"
                        name="avatarPhoto"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="bg-white/10 border-white/20 text-white file:text-neon-green file:bg-neon-green/20 file:border-0 file:rounded-md file:px-3 file:py-1 file:mr-2 file:font-semibold"
                      />
                      <p className="text-xs text-gray-400 mt-2">
                        💡 <span className="text-neon-green font-semibold">Una buena foto aumenta tu probabilidad de ser identificado</span> por los scouts y evaluadores del reality.
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Recomendación: Foto clara de tu rostro, buena iluminación, fondo neutro. Máximo 5MB.
                      </p>
                    </div>
                  </div>
                </div>
                {formData.avatarPhoto && (
                  <p className="text-neon-green text-sm mt-2">✅ Foto seleccionada: {formData.avatarPhoto}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="subregion" className="text-gray-300 flex items-center space-x-2">
                  <MapPin size={16} className="text-gray-400" />
                  <span>Subregión donde vives</span>
                </Label>
                <Select onValueChange={(value) => handleSelectChange('subregion', value)} value={formData.subregion} required>
                  <SelectTrigger className="w-full bg-white/10 border-white/20 text-white focus:ring-neon-green/50">
                    <SelectValue placeholder="Selecciona tu subregión" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover text-popover-foreground border-border">
                    {subregions.map(region => (
                      <SelectItem key={region} value={region}>{region}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {formData.subregion && (
                <div>
                  <Label htmlFor="municipality" className="text-gray-300 flex items-center space-x-2">
                    <MapPin size={16} className="text-gray-400" />
                    <span>Municipio de residencia</span>
                  </Label>
                  <Select onValueChange={(value) => handleSelectChange('municipality', value)} value={formData.municipality} required>
                    <SelectTrigger className="w-full bg-white/10 border-white/20 text-white focus:ring-neon-green/50">
                      <SelectValue placeholder="Selecciona tu municipio" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover text-popover-foreground border-border">
                      {availableMunicipalities.map(municipio => (
                        <SelectItem key={municipio} value={municipio}>{municipio}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div>
                <Label htmlFor="contactNumber" className="text-gray-300 flex items-center space-x-2">
                  <Phone size={16} className="text-gray-400" />
                  <span>Número de contacto</span>
                </Label>
                <Input
                  id="contactNumber"
                  name="contactNumber"
                  type="tel"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  placeholder="Tu número de teléfono"
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-gray-300 flex items-center space-x-2">
                  <Mail size={16} className="text-gray-400" />
                  <span>Correo electrónico</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="tu@email.com"
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                  required
                />
              </div>
              <div>
                <Label htmlFor="confirmEmail" className="text-gray-300">Confirme su correo electrónico</Label>
                <Input
                  id="confirmEmail"
                  name="confirmEmail"
                  type="email"
                  value={formData.confirmEmail}
                  onChange={handleChange}
                  placeholder="Confirma tu correo electrónico"
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                  required
                />
              </div>
              <div>
                <Label htmlFor="educationLevel" className="text-gray-300 flex items-center space-x-2">
                  <GraduationCap size={16} className="text-gray-400" />
                  <span>Nivel de escolaridad actual</span>
                </Label>
                <Select onValueChange={(value) => handleSelectChange('educationLevel', value)} value={formData.educationLevel} required>
                  <SelectTrigger className="w-full bg-white/10 border-white/20 text-white focus:ring-neon-green/50">
                    <SelectValue placeholder="Selecciona tu nivel de escolaridad" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover text-popover-foreground border-border">
                    {educationLevels.map(level => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="institutionName" className="text-gray-300">Nombre de tu escuela, colegio o institución donde estudias</Label>
                <Input
                  id="institutionName"
                  name="institutionName"
                  value={formData.institutionName}
                  onChange={handleChange}
                  placeholder="Nombre de la institución"
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                  required
                />
              </div>
            </div>

            <h2 className="text-xl font-semibold text-white flex items-center space-x-2 mt-8">
              <ShieldCheck size={20} className="text-neon-green" />
              <span>Datos del Acudiente Responsable</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="guardianName" className="text-gray-300">Nombre del acudiente responsable</Label>
                <Input
                  id="guardianName"
                  name="guardianName"
                  value={formData.guardianName}
                  onChange={handleChange}
                  placeholder="Nombre del acudiente"
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                  required
                />
              </div>
              <div>
                <Label htmlFor="guardianDocumentType" className="text-gray-300">Tipo de documento del acudiente responsable</Label>
                <Select onValueChange={(value) => handleSelectChange('guardianDocumentType', value)} value={formData.guardianDocumentType} required>
                  <SelectTrigger className="w-full bg-white/10 border-white/20 text-white focus:ring-neon-green/50">
                    <SelectValue placeholder="Selecciona tipo de documento" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover text-popover-foreground border-border">
                    {documentTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="guardianDocumentNumber" className="text-gray-300">Número de documento del acudiente responsable</Label>
                <Input
                  id="guardianDocumentNumber"
                  name="guardianDocumentNumber"
                  value={formData.guardianDocumentNumber}
                  onChange={handleChange}
                  placeholder="Número de documento del acudiente"
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                  required
                />
              </div>
              <div>
                <Label htmlFor="guardianContactNumber" className="text-gray-300 flex items-center space-x-2">
                  <Phone size={16} className="text-gray-400" />
                  <span>Teléfono de Contacto</span>
                </Label>
                <Input
                  id="guardianContactNumber"
                  name="guardianContactNumber"
                  type="tel"
                  value={formData.guardianContactNumber}
                  onChange={handleChange}
                  placeholder="Teléfono del acudiente"
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                  required
                />
              </div>
              <div>
                <Label htmlFor="guardianEmail" className="text-gray-300 flex items-center space-x-2">
                  <Mail size={16} className="text-gray-400" />
                  <span>Email</span>
                </Label>
                <Input
                  id="guardianEmail"
                  name="guardianEmail"
                  type="email"
                  value={formData.guardianEmail}
                  onChange={handleChange}
                  placeholder="Email del acudiente"
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                  required
                />
              </div>
              <div>
                <Label htmlFor="residenceMunicipality" className="text-gray-300">Municipio de residencia</Label>
                <Input
                  id="residenceMunicipality"
                  name="residenceMunicipality"
                  value={formData.residenceMunicipality}
                  onChange={handleChange}
                  placeholder="Municipio de residencia"
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                  required
                />
              </div>
            </div>

            <h2 className="text-xl font-semibold text-white flex items-center space-x-2 mt-8">
              <ShieldCheck size={20} className="text-neon-green" />
              <span>Autorizaciones Legales</span>
            </h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="acceptSensitiveData"
                  checked={formData.acceptSensitiveData}
                  onCheckedChange={(checked) => handleCheckboxChange('acceptSensitiveData', checked as boolean)}
                  className="mt-1"
                />
                <Label htmlFor="acceptSensitiveData" className="text-gray-300 text-sm leading-relaxed cursor-pointer">
                  <span className="font-bold text-white">PRIMERO. Autorización Especial de Datos Personales Sensibles.</span>
                  <br />
                  FUNDACIÓN HABILIDOSOS. informará, a través de los diversos medios de obtención de la autorización, a todos sus titulares
                  que, en virtud de la Ley 1581 de 2012 y sus normas reglamentarias, no están obligados a otorgar autorización para el
                  tratamiento de datos sensibles, como la utilización de imágenes y videos.
                  En caso de realizar tratamiento de datos relacionados con el deporte, la Fundación Habilidosos F.C. implementará las medidas
                  necesarias para proteger la confidencialidad de la información.
                  Los datos sensibles biométricos tratados tienen como finalidad la identificación de las personas, la seguridad, el cumplimiento
                  de obligaciones legales y la adecuada utilización de los mismos.
                </Label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="acceptHabeasData"
                  checked={formData.acceptHabeasData}
                  onCheckedChange={(checked) => handleCheckboxChange('acceptHabeasData', checked as boolean)}
                  className="mt-1"
                />
                <Label htmlFor="acceptHabeasData" className="text-gray-300 text-sm leading-relaxed cursor-pointer">
                  <span className="font-bold text-white">SEGUNDO. Autorización para el Manejo de Habeas Data de los Deportistas.</span>
                  <br />
                  Aviso de Privacidad:
                  Los datos personales suministrados serán tratados conforme a lo establecido en la Ley 1581 de 2012, de manera confidencial
                  y exclusivamente para fines relacionados con la difusión de conocimientos, experiencias, actualidad, reflexiones,
                  capacitaciones, eventos y servicios vinculados al fútbol.
                  Estos contenidos podrán ser coordinados directamente por FUNDACIÓN HABILIDOSOS o en alianza con terceros.
                  Sus datos personales no serán cedidos a terceros sin su consentimiento previo.
                  Para cualquier consulta relacionada con sus datos personales, puede comunicarse a través de nuestro portal web:
                  “La Fundación no realizará tratamiento alguno sin la debida autorización del representante legal del menor, en cumplimiento
                  del artículo 12 del Decreto 1377 de 2013.”
                </Label>
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <CyberButton type="submit" size="lg" disabled={isLoading || calculatedAge === null || calculatedAge < 13 || calculatedAge > 19}>
                {isLoading ? 'Enviando Inscripción...' : 'Enviar Inscripción'}
              </CyberButton>
            </div>
          </form>
        </div>
      </main>

      <MobileNav />

      <RegistrationStatusDialog
        isOpen={isStatusDialogOpen}
        onClose={handleStatusDialogClose}
        isSuccess={registrationSuccess}
        message={registrationMessage}
      />
    </div>
  );
}