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
  title: 'HABILIDO-SOS | Red Social de Fútbol',
  description: 'La red social futurista para amantes del fútbol. Conecta, comparte y celebra tu pasión por el deporte rey.',
  keywords: 'fútbol, red social, deportes, habilidades, goles, highlights',
  icons: {
    icon: '/logo.png', // Establecer el favicon
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