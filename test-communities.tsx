'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/providers';
import { Sidebar } from '@/components/navigation/sidebar';
import { MobileNav } from '@/components/navigation/mobile-nav';

export default function CommunitiesPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="min-h-screen">
      <Sidebar />
      
      <main className="pb-20 lg:ml-64 lg:pb-0">
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">
              Comunidades
            </h1>
            <p className="text-gray-400">
              Descubre y únete a comunidades que comparten tus intereses
            </p>
          </div>
          
          <div className="glass-card p-6">
            <h2 className="text-xl text-white mb-4">Próximamente</h2>
            <p className="text-gray-400">
              La funcionalidad de comunidades estará disponible pronto.
            </p>
          </div>
        </div>
      </main>

      <MobileNav />
    </div>
  );
}