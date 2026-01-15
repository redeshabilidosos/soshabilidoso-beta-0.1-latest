'use client';

import React from 'react';
import Link from 'next/link';
import { Globe, Instagram, Facebook, Youtube } from 'lucide-react'; // Eliminado TikTok
import { CyberButton } from './cyber-button';

interface SocialLinksPopoverContentProps {
  onClose: () => void;
}

export function SocialLinksPopoverContent({ onClose }: SocialLinksPopoverContentProps) {
  const socialLinks = [
    { name: 'Página Web', url: 'https://fundahabilidosos.com/', icon: Globe, color: 'text-neon-green' },
    { name: 'Instagram', url: 'https://www.instagram.com/fundahabilidosos', icon: Instagram, color: 'text-pink-500' },
    { name: 'Facebook', url: 'https://www.facebook.com/fundahabilidosos', icon: Facebook, color: 'text-blue-500' },
    { name: 'YouTube', url: 'https://youtube.com/@Fundahabilidosos', icon: Youtube, color: 'text-red-500' },
    { name: 'TikTok', url: 'https://tiktok.com/@Fundahabilidosos', icon: Globe, color: 'text-white' }, // Usar Globe como fallback
  ];

  return (
    <div className="p-4 space-y-3">
      <h4 className="text-lg font-semibold text-white mb-2">Nuestras Redes Sociales</h4>
      <div className="grid grid-cols-1 gap-2">
        {socialLinks.map((link) => (
          <Link key={link.name} href={link.url} target="_blank" rel="noopener noreferrer">
            <CyberButton variant="ghost" className="w-full justify-start">
              <link.icon size={20} className={`mr-3 ${link.color}`} />
              <span>{link.name}</span>
            </CyberButton>
          </Link>
        ))}
      </div>
      <CyberButton variant="outline" onClick={onClose} className="w-full mt-4">
        Cerrar
      </CyberButton>
    </div>
  );
}