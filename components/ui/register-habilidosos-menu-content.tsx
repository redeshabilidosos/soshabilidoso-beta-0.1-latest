'use client';

import React from 'react';
import Link from 'next/link';
import { CyberButton } from './cyber-button';
import { FileText, HelpCircle, Mail, ShieldCheck, ListChecks, Instagram, Youtube, Globe, Facebook } from 'lucide-react'; // Importar iconos de redes sociales

interface RegisterHabilidososMenuContentProps {
  onClose: () => void;
}

export function RegisterHabilidososMenuContent({ onClose }: RegisterHabilidososMenuContentProps) {
  const menuItems = [
    { name: 'Ver Requisitos', href: '/register-habilidosos#requisitos', icon: ListChecks, target: '_self' },
    { name: 'Preguntas Frecuentes', href: '/settings#help', icon: HelpCircle, target: '_self' },
    { name: 'Contactar Fundación', href: 'mailto:info@fundahabilidosos.com', icon: Mail, target: '_blank' },
    { name: 'Política de Privacidad', href: '/settings#privacy', icon: ShieldCheck, target: '_self' },
    { name: 'Términos y Condiciones', href: '/settings#terms', icon: FileText, target: '_self' },
  ];

  const socialLinks = [
    { name: 'Página Web', url: 'https://fundahabilidosos.com/', icon: Globe, color: 'text-neon-green' },
    { name: 'Instagram', url: 'https://www.instagram.com/fundahabilidosos', icon: Instagram, color: 'text-pink-500' },
    { name: 'YouTube', url: 'https://youtube.com/@Fundahabilidosos', icon: Youtube, color: 'text-red-500' },
    { name: 'TikTok', url: 'https://tiktok.com/@Fundahabilidosos', icon: Globe, color: 'text-white' }, // Usar Globe como fallback
  ];

  return (
    <div className="p-2 space-y-1 w-[200px]"> {/* Aumentado el ancho a w-[200px] */}
      <h4 className="text-sm font-semibold text-white mb-1">Opciones de Registro</h4>
      <div className="grid grid-cols-1 gap-0.5">
        {menuItems.map((item) => (
          <Link key={item.name} href={item.href} target={item.target} rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}>
            <CyberButton variant="ghost" size="sm" className="w-full justify-start"> {/* Cambiado size="xs" a size="sm" */}
              <item.icon size={16} className={`mr-1 text-neon-green`} />
              <span className="text-sm">{item.name}</span> {/* Revertido a text-sm */}
            </CyberButton>
          </Link>
        ))}
      </div>

      <div className="border-t border-white/10 pt-1 mt-1 space-y-0.5">
        <h4 className="text-sm font-semibold text-white mb-1">Nuestras Redes Sociales</h4>
        {socialLinks.map((link) => (
          <Link key={link.name} href={link.url} target="_blank" rel="noopener noreferrer">
            <CyberButton variant="ghost" size="sm" className="w-full justify-start"> {/* Cambiado size="xs" a size="sm" */}
              <link.icon size={16} className={`mr-1 ${link.color}`} />
              <span className="text-sm">{link.name}</span> {/* Revertido a text-sm */}
            </CyberButton>
          </Link>
        ))}
      </div>

      <CyberButton variant="outline" size="sm" onClick={onClose} className="w-full mt-2"> {/* Cambiado size="xs" a size="sm" */}
        Cerrar
      </CyberButton>
    </div>
  );
}