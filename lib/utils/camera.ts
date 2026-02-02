/**
 * Utilidades para manejo de cámara con Capacitor
 * Compatible con web y móvil
 */

export async function takePicture(): Promise<string | null> {
  try {
    // Importación dinámica para evitar errores en SSR
    const { Camera, CameraResultType, CameraSource } = await import('@capacitor/camera');
    const { Capacitor } = await import('@capacitor/core');

    if (!Capacitor.isNativePlatform()) {
      // Fallback para web usando input file
      return await takePictureWeb();
    }

    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
      width: 1920,
      height: 1920,
    });

    return image.dataUrl || null;
  } catch (error) {
    console.error('Error taking picture:', error);
    return null;
  }
}

export async function pickImage(): Promise<string | null> {
  try {
    const { Camera, CameraResultType, CameraSource } = await import('@capacitor/camera');
    const { Capacitor } = await import('@capacitor/core');

    if (!Capacitor.isNativePlatform()) {
      // Fallback para web
      return await pickImageWeb();
    }

    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos,
      width: 1920,
      height: 1920,
    });

    return image.dataUrl || null;
  } catch (error) {
    console.error('Error picking image:', error);
    return null;
  }
}

export async function pickMultipleImages(): Promise<string[]> {
  try {
    const { Camera, CameraResultType, CameraSource } = await import('@capacitor/camera');
    const { Capacitor } = await import('@capacitor/core');

    if (!Capacitor.isNativePlatform()) {
      // Fallback para web
      return await pickMultipleImagesWeb();
    }

    // Capacitor no soporta múltiples imágenes nativamente
    // Usar plugin adicional o llamar múltiples veces
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos,
    });

    return image.dataUrl ? [image.dataUrl] : [];
  } catch (error) {
    console.error('Error picking multiple images:', error);
    return [];
  }
}

// Fallbacks para web
async function takePictureWeb(): Promise<string | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          resolve(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        resolve(null);
      }
    };
    
    input.click();
  });
}

async function pickImageWeb(): Promise<string | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          resolve(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        resolve(null);
      }
    };
    
    input.click();
  });
}

async function pickMultipleImagesWeb(): Promise<string[]> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    
    input.onchange = async (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || []);
      const images: string[] = [];
      
      for (const file of files) {
        const dataUrl = await new Promise<string>((res) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            res(event.target?.result as string);
          };
          reader.readAsDataURL(file);
        });
        images.push(dataUrl);
      }
      
      resolve(images);
    };
    
    input.click();
  });
}
