import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.soshabilidoso.app',
  appName: 'SOS Habilidoso',
  webDir: 'public', // Modo Híbrido: usar public como placeholder
  server: {
    // ========================================
    // CONFIGURACIÓN DE SERVIDOR
    // ========================================
    
    // MODO USB - Funciona con cualquier WiFi (ACTUAL)
    // Usa túnel USB: adb reverse tcp:4000 tcp:4000
    url: 'http://localhost:4000',
    cleartext: true,
    
    // MODO WIFI - Solo si PC y móvil en la misma red
    // url: 'http://10.87.23.237:4000',
    // cleartext: true,
    
    // PRODUCCIÓN - Servidor remoto
    // url: 'https://tu-dominio.com',
    // cleartext: false,
    // androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#000000",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#00ff88",
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#000000',
    },
    Camera: {
      // Configuración de cámara
    },
    Geolocation: {
      // Configuración de geolocalización
    },
  },
};

export default config;
