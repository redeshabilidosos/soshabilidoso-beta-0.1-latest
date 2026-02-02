/**
 * Utilidades para compartir contenido con Capacitor
 * Compatible con web y móvil
 */

interface ShareOptions {
  title: string;
  text: string;
  url?: string;
  files?: string[];
}

export async function shareContent(options: ShareOptions): Promise<boolean> {
  try {
    const { Share } = await import('@capacitor/share');
    const { Capacitor } = await import('@capacitor/core');

    if (!Capacitor.isNativePlatform()) {
      // Fallback para web
      return await shareContentWeb(options);
    }

    await Share.share({
      title: options.title,
      text: options.text,
      url: options.url,
      dialogTitle: 'Compartir en',
    });

    return true;
  } catch (error) {
    console.error('Error sharing:', error);
    return false;
  }
}

export async function sharePost(postId: string, postTitle: string, postUrl: string): Promise<boolean> {
  return shareContent({
    title: postTitle,
    text: `Mira esta publicación en SOS Habilidoso: ${postTitle}`,
    url: postUrl,
  });
}

export async function shareProfile(username: string, displayName: string): Promise<boolean> {
  return shareContent({
    title: `Perfil de ${displayName}`,
    text: `Mira el perfil de ${displayName} en SOS Habilidoso`,
    url: `${window.location.origin}/profile/${username}`,
  });
}

export async function shareCommunity(communityId: string, communityName: string): Promise<boolean> {
  return shareContent({
    title: communityName,
    text: `Únete a la comunidad ${communityName} en SOS Habilidoso`,
    url: `${window.location.origin}/communities/${communityId}`,
  });
}

export async function shareStream(streamId: string, streamTitle: string): Promise<boolean> {
  return shareContent({
    title: streamTitle,
    text: `Mira esta transmisión en vivo: ${streamTitle}`,
    url: `${window.location.origin}/live/stream/${streamId}`,
  });
}

// Fallback para web
async function shareContentWeb(options: ShareOptions): Promise<boolean> {
  if (navigator.share) {
    try {
      await navigator.share({
        title: options.title,
        text: options.text,
        url: options.url,
      });
      return true;
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Error sharing:', error);
      }
      return false;
    }
  } else {
    // Fallback: copiar al portapapeles
    const textToCopy = `${options.title}\n${options.text}${options.url ? `\n${options.url}` : ''}`;
    
    try {
      await navigator.clipboard.writeText(textToCopy);
      alert('Enlace copiado al portapapeles');
      return true;
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      return false;
    }
  }
}
