'use client';

import { useEffect, useState } from 'react';

// Tipos para evitar errores si Capacitor no está instalado aún
type Platform = 'web' | 'ios' | 'android';

export function useCapacitor() {
  const [isNative, setIsNative] = useState(false);
  const [platform, setPlatform] = useState<Platform>('web');
  const [isOnline, setIsOnline] = useState(true);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initializeCapacitor = async () => {
      try {
        // Importación dinámica para evitar errores en SSR
        const { Capacitor } = await import('@capacitor/core');
        const { App } = await import('@capacitor/app');
        const { StatusBar, Style } = await import('@capacitor/status-bar');
        const { SplashScreen } = await import('@capacitor/splash-screen');
        const { Keyboard } = await import('@capacitor/keyboard');
        const { Network } = await import('@capacitor/network');

        const native = Capacitor.isNativePlatform();
        const plat = Capacitor.getPlatform() as Platform;
        
        setIsNative(native);
        setPlatform(plat);

        if (native) {
          // Configurar StatusBar
          try {
            await StatusBar.setStyle({ style: Style.Dark });
            await StatusBar.setBackgroundColor({ color: '#000000' });
          } catch (error) {
            console.warn('StatusBar not available:', error);
          }

          // Ocultar SplashScreen
          try {
            await SplashScreen.hide();
          } catch (error) {
            console.warn('SplashScreen not available:', error);
          }

          // Configurar teclado
          try {
            await Keyboard.setAccessoryBarVisible({ isVisible: true });
          } catch (error) {
            console.warn('Keyboard not available:', error);
          }

          // Monitorear conexión
          try {
            const status = await Network.getStatus();
            setIsOnline(status.connected);

            Network.addListener('networkStatusChange', status => {
              setIsOnline(status.connected);
            });
          } catch (error) {
            console.warn('Network not available:', error);
          }

          // Manejar botón back de Android
          try {
            App.addListener('backButton', ({ canGoBack }) => {
              if (!canGoBack) {
                App.exitApp();
              } else {
                window.history.back();
              }
            });
          } catch (error) {
            console.warn('App listeners not available:', error);
          }

          // Manejar cuando la app vuelve al foreground
          try {
            App.addListener('appStateChange', ({ isActive }) => {
              if (isActive) {
                console.log('App is active');
                // Aquí puedes refrescar datos si es necesario
              }
            });
          } catch (error) {
            console.warn('App state listener not available:', error);
          }
        }

        setIsReady(true);
      } catch (error) {
        console.warn('Capacitor not available, running in web mode:', error);
        setIsReady(true);
      }
    };

    initializeCapacitor();
  }, []);

  return {
    isNative,
    platform,
    isOnline,
    isReady,
  };
}
