import './globals.css';
import type { Metadata } from 'next';
import { RootLayoutClient } from './RootLayoutClient';
import { Poppins } from 'next/font/google'; // Importar Poppins

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins', // Definir como variable CSS
});

export const metadata: Metadata = {
  title: 'SOS Habilidoso | Red Social de Fútbol',
  description: 'La red social futurista para amantes del fútbol. Conecta, comparte y celebra tu pasión por el deporte rey.',
  keywords: 'fútbol, red social, deportes, habilidades, goles, highlights',
  applicationName: 'SOS Habilidoso',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'SOS Habilidoso',
  },
  formatDetection: {
    telephone: false,
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/logo sos@logo.png', type: 'image/png' },
      { url: '/logo-favicon.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon512_rounded.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/logo sos@logo.png',
  },
  openGraph: {
    type: 'website',
    siteName: 'SOS Habilidoso',
    title: 'SOS Habilidoso | Red Social de Fútbol',
    description: 'La red social futurista para amantes del fútbol',
  },
  twitter: {
    card: 'summary',
    title: 'SOS Habilidoso | Red Social de Fútbol',
    description: 'La red social futurista para amantes del fútbol',
  },
  themeColor: '#000000ff',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es"> {/* Eliminada la clase 'dark' */}
      <body className={`${poppins.variable} font-poppins`}> {/* Aplicar la variable de fuente */}
        <RootLayoutClient>
          {children}
        </RootLayoutClient>
      </body>
    </html>
  );
}