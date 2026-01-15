'use client';

import { memo } from 'react';

export const PageLoader = memo(function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-neon-green/20 border-t-neon-green rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 bg-neon-green/20 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
});
