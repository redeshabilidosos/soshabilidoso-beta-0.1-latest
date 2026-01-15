'use client';

import { memo } from 'react';

// Transición ultra-rápida sin framer-motion para mejor rendimiento
export default memo(function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-fade-in-fast">
      {children}
    </div>
  );
});
