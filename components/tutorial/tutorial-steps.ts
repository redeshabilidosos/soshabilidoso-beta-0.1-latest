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
    content: 'La red social futurista donde compartes tu pasión por los deportes, la cultura y tus habilidades.\n\nDéjanos mostrarte cómo funciona todo en solo 2 minutos.',
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

  // PASO 8: PERFIL (desde sidebar)
  {
    id: 'sidebar-perfil',
    target: '[href="/profile"]',
    title: 'PERFIL - Tu identidad digital 👤',
    content: 'Aquí personalizas tu perfil:\n📸 Foto y portada\n📝 Biografía\n⚽ Posición y equipo\n📊 Estadísticas\n\n¡Haz que tu perfil destaque!',
    placement: 'right',
    route: '/feed',
    highlightPadding: 20,
  },

  // PASO 9: COMUNIDADES (desde sidebar)
  {
    id: 'sidebar-comunidades',
    target: '[href="/communities"]',
    title: 'COMUNIDADES - Encuentra tu tribu 🌍',
    content: 'Únete a comunidades de:\n🏆 Deportes\n🎨 Arte y cultura\n🎵 Música\n📚 Educación\n\n¡Crea o únete a comunidades!',
    placement: 'right',
    route: '/feed',
    highlightPadding: 20,
  },

  // PASO 10: CLASIFICADOS (desde sidebar)
  {
    id: 'sidebar-clasificados',
    target: '[href="/classifieds"]',
    title: 'CLASIFICADOS - Compra y vende 🛒',
    content: 'Marketplace local:\n🛍️ Productos\n💼 Servicios\n👔 Empleos\n🏢 Empresas\n\n¡Encuentra lo que necesitas!',
    placement: 'right',
    route: '/feed',
    highlightPadding: 20,
  },

  // PASO 11: MENSAJES (desde sidebar)
  {
    id: 'sidebar-mensajes',
    target: '[href="/messages"]',
    title: 'MENSAJES - Chatea en privado 💬',
    content: 'Conversaciones privadas:\n💬 Chat en tiempo real\n🎨 Burbujas personalizadas\n✨ Fondos animados\n❤️ Reacciones\n\n¡Mantente conectado!',
    placement: 'right',
    route: '/feed',
    highlightPadding: 20,
  },

  // PASO 12: EN VIVO (desde sidebar)
  {
    id: 'sidebar-envivo',
    target: '[href="/streaming"]',
    title: 'EN VIVO - Transmite en directo 📡',
    content: 'Transmisiones en vivo:\n🎥 Comparte momentos en tiempo real\n👥 Interactúa con tu audiencia\n💬 Chat en vivo\n🎁 Recibe donaciones\n\n¡Conéctate con tu comunidad!',
    placement: 'right',
    route: '/feed',
    highlightPadding: 20,
  },

  // PASO 13: CLIPS (desde sidebar)
  {
    id: 'sidebar-clips',
    target: '[href="/clips"]',
    title: 'CLIPS - Videos cortos 🎬',
    content: 'Contenido viral:\n👆 Desliza para ver más\n❤️ Dale like\n💬 Comenta\n📤 Comparte\n\n¡Entretenimiento sin fin!',
    placement: 'right',
    route: '/feed',
    highlightPadding: 20,
  },

  // PASO 14: CONFIGURACIÓN (desde sidebar)
  {
    id: 'sidebar-configuracion',
    target: '[href="/settings"]',
    title: 'CONFIGURACIÓN - Personaliza todo ⚙️',
    content: 'Ajusta tu experiencia:\n👤 Edita perfil\n🔒 Privacidad\n🎨 Apariencia\n🔔 Notificaciones\n\n¡Haz que sea tuyo!',
    placement: 'right',
    route: '/feed',
    highlightPadding: 20,
  },

  // PASO 15: FINALIZACIÓN
  {
    id: 'completion',
    target: 'body',
    title: '¡FELICIDADES! 🎊',
    content: '¡Has completado el tutorial!\n\nAhora es tu turno:\n✅ Completa tu perfil\n✅ Sigue a usuarios\n✅ Únete a comunidades\n✅ Crea tu primera publicación\n\n¿Listo para comenzar? 🚀',
    placement: 'center',
    route: '/feed',
    showProgress: false,
  },
];
