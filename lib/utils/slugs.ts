export function createSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remover caracteres especiales
    .trim()
    .replace(/\s+/g, '-') // Reemplazar espacios con guiones
    .replace(/-+/g, '-'); // Remover guiones duplicados
}

export function getSlugFromName(name: string): string {
  const slugMap: { [key: string]: string } = {
    'Academia de Desarrollo Full Stack': 'academia-desarrollo-full-stack',
    'Escuela Molo': 'escuela-molo',
    'Fútbol Profesional': 'futbol-profesional'
  };
  
  return slugMap[name] || createSlug(name);
}

export function getNameFromSlug(slug: string): string {
  const nameMap: { [key: string]: string } = {
    'academia-desarrollo-full-stack': 'Academia de Desarrollo Full Stack',
    'escuela-molo': 'Escuela Molo',
    'futbol-profesional': 'Fútbol Profesional'
  };
  
  return nameMap[slug] || slug;
}