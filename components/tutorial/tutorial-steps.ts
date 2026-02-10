export interface TutorialStep {
  id: string;
  target: string;
  title: string;
  content: string;
  placement: 'top' | 'bottom' | 'left' | 'right' | 'center';
  route?: string; // Ruta donde debe estar el usuario
  action?: () => void; // Acción opcional antes de mostrar el paso
  highlightPadding?: number;
  showProgress?: boolean;
}

export const tutorialSteps: TutorialStep[] = [
  // PASO 0: BIENVENIDA
  {
    id: 'welcome',
    target: 'body',
    title: '¡Bienvenido a SOS Habilidoso! 🚀',
    content: 'La red social futurista donde compartes tu pasión por el deporte, la cultura y tus habilidades.\n\nDéjanos mostrarte cómo funciona todo en solo 2 minutos.',
    placement: 'center',
    showProgress: false,
  },

  // PASO 1: FEED PRINCIPAL
  {
    id: 'feed-header',
    target: '#feed-header',
    title: 'Este es tu FEED 📰',
    content: 'Aquí verás todas las publicaciones de las personas que sigues y las comunidades a las que perteneces.\n\nLas publicaciones se actualizan en tiempo real. ¡Nunca te perderás nada importante!',
    placement: 'bottom',
    route: '/feed',
    highlightPadding: 20,
  },

  // PASO 2: STORIES
  {
    id: 'stories-slider',
    target: '#stories-slider',
    title: 'STORIES - Momentos que duran 24h ⏰',
    content: 'Comparte fotos y videos que desaparecen después de un día.\n\n👆 Toca el círculo con "+" para crear tu primera historia.\n👉 Desliza para ver las historias de tus amigos.',
    placement: 'bottom',
    route: '/feed',
    highlightPadding: 15,
  },

  // PASO 3: CREAR PUBLICACIÓN
  {
    id: 'new-post-button',
    target: '#new-post-button',
    title: 'CREA TU PRIMERA PUBLICACIÓN 🎨',
    content: 'Comparte lo que quieras:\n📝 Texto\n📷 Fotos y videos\n🎙️ Podcasts\n📡 Transmisiones en vivo\n\n¡Exprésate sin límites!',
    placement: 'bottom',
    route: '/feed',
    highlightPadding: 10,
  },

  // PASO 4: REACCIONES
  {
    id: 'post-reactions',
    target: '.post-reactions-bar',
    title: 'REACCIONA A LAS PUBLICACIONES 🎭',
    content: 'No solo "me gusta", tenemos 5 tipos de reacciones:\n\n❤️ Like - Me gusta\n🎉 Celebration - ¡Increíble!\n⚽ Golazo - ¡Qué jugada!\n😂 Laugh - Me hace reír\n👎 Dislike - No me gusta\n\n¡Elige la que mejor exprese lo que sientes!',
    placement: 'top',
    route: '/feed',
    highlightPadding: 10,
  },

  // PASO 5: COMENTARIOS
  {
    id: 'post-comments',
    target: '.post-comments-section',
    title: 'COMENTA Y CONVERSA 💭',
    content: 'Participa en las conversaciones:\n• Deja tu opinión\n• Responde a otros comentarios\n• Menciona a tus amigos con @\n\n¡La comunidad te está esperando!',
    placement: 'top',
    route: '/feed',
    highlightPadding: 10,
  },

  // PASO 6: SIDEBAR DERECHO (solo desktop)
  {
    id: 'suggestions-sidebar',
    target: '#suggestions-sidebar',
    title: 'DESCUBRE NUEVAS CONEXIONES 🌟',
    content: 'Aquí encontrarás:\n👤 Usuarios sugeridos para seguir\n🏘️ Comunidades que podrían interesarte\n\n¡Expande tu red y haz nuevos amigos!',
    placement: 'left',
    route: '/feed',
    highlightPadding: 20,
  },

  // PASO 7: NAVEGACIÓN SIDEBAR
  {
    id: 'main-sidebar',
    target: '#main-sidebar',
    title: 'EXPLORA LA APLICACIÓN 🗺️',
    content: 'Desde aquí puedes acceder a:\n\n🏠 Feed - Tu página principal\n👤 Perfil - Tu información personal\n🔍 Buscar - Encuentra usuarios\n🔔 Notificaciones - Mantente al día\n🎬 Clips - Videos cortos\n🏘️ Comunidades - Únete a grupos\n💬 Mensajes - Chats privados\n⚙️ Configuración - Personaliza tu experiencia',
    placement: 'right',
    route: '/feed',
    highlightPadding: 20,
  },

  // PASO 8: PERFIL
  {
    id: 'profile-section',
    target: '#profile-section',
    title: 'TU PERFIL PERSONAL 🎭',
    content: 'Personaliza tu perfil:\n📸 Foto de perfil y portada\n📝 Biografía y descripción\n⚽ Posición y equipo\n📊 Estadísticas y logros\n\n¡Haz que tu perfil destaque!',
    placement: 'bottom',
    route: '/profile',
    highlightPadding: 20,
  },

  // PASO 9: COMUNIDADES
  {
    id: 'communities-page',
    target: '#communities-search',
    title: 'ÚNETE A COMUNIDADES 🌍',
    content: 'Encuentra tu tribu:\n🏆 Deportes\n🎨 Arte y cultura\n🎵 Música\n🍳 Gastronomía\n📚 Educación\n...y mucho más!\n\nCrea tu propia comunidad o únete a una existente.',
    placement: 'bottom',
    route: '/communities',
    highlightPadding: 15,
  },

  // PASO 10: CLIPS
  {
    id: 'clips-viewer',
    target: '#clips-viewer',
    title: 'CLIPS - Videos Cortos 📹',
    content: 'Descubre contenido viral:\n👆 Desliza hacia arriba para el siguiente\n❤️ Dale like a tus favoritos\n💬 Comenta y comparte\n👤 Sigue a los creadores\n\n¡Entretenimiento sin fin!',
    placement: 'center',
    route: '/clips',
    highlightPadding: 0,
  },

  // PASO 11: MENSAJES
  {
    id: 'messages-page',
    target: '#messages-chat-list',
    title: 'MENSAJES PRIVADOS 📨',
    content: 'Chatea con tus amigos:\n💬 Conversaciones en tiempo real\n🎨 Personaliza tus burbujas\n✨ Fondos animados\n❤️ Reacciona a mensajes\n\n¡Mantente conectado!',
    placement: 'right',
    route: '/messages',
    highlightPadding: 20,
  },

  // PASO 12: NOTIFICACIONES
  {
    id: 'notifications-page',
    target: '#notifications-header',
    title: 'NOTIFICACIONES 🔔',
    content: 'Mantente al día con:\n❤️ Likes y reacciones\n💬 Comentarios\n👤 Nuevos seguidores\n🤝 Solicitudes de amistad\n🏘️ Actividad en comunidades\n\n¡Nunca te pierdas nada!',
    placement: 'bottom',
    route: '/notifications',
    highlightPadding: 20,
  },

  // PASO 13: CONFIGURACIÓN
  {
    id: 'settings-page',
    target: '#settings-tabs',
    title: 'PERSONALIZA TU EXPERIENCIA ⚙️',
    content: 'Ajusta todo a tu gusto:\n👤 Edita tu perfil\n🔒 Privacidad y seguridad\n🎨 Apariencia (colores de fondo)\n🔔 Notificaciones\n🏢 Gestiona tu empresa\n\n¡Haz que SOS Habilidoso sea tuyo!',
    placement: 'right',
    route: '/settings',
    highlightPadding: 20,
  },

  // PASO 14: BOTÓN CREAR (móvil)
  {
    id: 'mobile-create-button',
    target: '#mobile-nav-bar',
    title: 'CREA CONTENIDO RÁPIDO ⚡',
    content: 'El botón "+" te permite crear:\n📝 Publicación\n📸 Story\n🎬 Reel/Clip\n📡 Transmisión en vivo\n\n¡Todo desde un solo lugar!',
    placement: 'top',
    route: '/feed',
    highlightPadding: 15,
  },

  // PASO 15: FINALIZACIÓN
  {
    id: 'completion',
    target: 'body',
    title: '¡FELICIDADES! 🎊',
    content: 'Ya conoces lo básico de SOS Habilidoso.\n\nAhora es tu turno:\n✅ Completa tu perfil\n✅ Sigue a usuarios interesantes\n✅ Únete a comunidades\n✅ Crea tu primera publicación\n\n¿Listo para comenzar tu aventura?',
    placement: 'center',
    route: '/feed',
    showProgress: false,
  },
];
