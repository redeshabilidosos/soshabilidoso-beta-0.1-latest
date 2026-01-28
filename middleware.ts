import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rutas que siempre deben estar disponibles sin autenticación
const PUBLIC_PATHS = [
  '/login',
  '/auth',
  '/register',
  '/_next',
  '/api',
  '/static',
  '/favicon.ico',
  '/manifest.json',
  '/sw.js',
  '/apple-touch-icon.png',
  '/robots.txt',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Permitir rutas públicas
  if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Para todas las demás rutas, permitir acceso
  // La autenticación se maneja en el cliente con el AuthProvider
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
