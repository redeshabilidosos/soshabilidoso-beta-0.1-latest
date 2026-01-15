// Placeholder images para evitar dependencias externas
export const placeholderImages = {
  // Avatares de usuarios
  avatars: [
    '/api/placeholder/100/100?text=U1',
    '/api/placeholder/100/100?text=U2',
    '/api/placeholder/100/100?text=U3',
    '/api/placeholder/100/100?text=U4',
    '/api/placeholder/100/100?text=U5',
  ],
  
  // Thumbnails para videos
  videoThumbnails: [
    '/api/placeholder/400/600?text=Video1',
    '/api/placeholder/400/600?text=Video2',
    '/api/placeholder/400/600?text=Video3',
    '/api/placeholder/400/600?text=Video4',
    '/api/placeholder/400/600?text=Video5',
  ],
  
  // Imágenes para posts
  postImages: [
    '/api/placeholder/800/600?text=Post1',
    '/api/placeholder/800/600?text=Post2',
    '/api/placeholder/800/600?text=Post3',
    '/api/placeholder/800/600?text=Post4',
  ],
  
  // Imágenes para clasificados
  classifiedImages: [
    '/api/placeholder/600/400?text=Classified1',
    '/api/placeholder/600/400?text=Classified2',
    '/api/placeholder/600/400?text=Classified3',
  ]
};

// Función para obtener una imagen aleatoria de una categoría
export function getRandomImage(category: keyof typeof placeholderImages): string {
  const images = placeholderImages[category];
  return images[Math.floor(Math.random() * images.length)];
}

// Función para generar URL de placeholder con texto personalizado
export function generatePlaceholder(width: number, height: number, text?: string): string {
  const baseUrl = '/api/placeholder';
  const textParam = text ? `?text=${encodeURIComponent(text)}` : '';
  return `${baseUrl}/${width}/${height}${textParam}`;
}

// Colores para placeholders
export const placeholderColors = {
  primary: '#00ff9d', // neon-green
  secondary: '#00d4ff', // neon-blue
  accent: '#ff006e', // neon-pink
  neutral: '#6b7280', // gray
};

// Función para crear placeholder con color específico
export function createColoredPlaceholder(
  width: number, 
  height: number, 
  color: string = placeholderColors.primary,
  text?: string
): string {
  const params = new URLSearchParams();
  if (text) params.set('text', text);
  params.set('bg', color.replace('#', ''));
  
  return `/api/placeholder/${width}/${height}?${params.toString()}`;
}