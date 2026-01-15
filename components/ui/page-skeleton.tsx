/**
 * Skeleton ligero para páginas mientras cargan
 * Diseñado para ser lo más rápido posible
 */
'use client';

import { memo } from 'react';

export const PageSkeleton = memo(function PageSkeleton() {
  return (
    <div className="min-h-screen bg-black">
      {/* Sidebar skeleton */}
      <div className="fixed left-0 top-0 h-screen w-64 bg-gray-900/50 border-r border-gray-800 p-4 hidden lg:block">
        <div className="h-16 bg-gray-800/50 rounded-lg mb-6 animate-pulse" />
        <div className="space-y-2">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-800/30 rounded-lg animate-pulse" style={{ animationDelay: `${i * 50}ms` }} />
          ))}
        </div>
      </div>
      
      {/* Main content skeleton */}
      <div className="xl:ml-64 p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="h-32 bg-gray-800/30 rounded-xl animate-pulse" />
          <div className="h-64 bg-gray-800/30 rounded-xl animate-pulse" style={{ animationDelay: '100ms' }} />
          <div className="h-48 bg-gray-800/30 rounded-xl animate-pulse" style={{ animationDelay: '200ms' }} />
        </div>
      </div>
    </div>
  );
});

export const ContentSkeleton = memo(function ContentSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 bg-gray-800/50 rounded w-1/3" />
      <div className="h-4 bg-gray-800/30 rounded w-2/3" />
      <div className="h-32 bg-gray-800/30 rounded-xl" />
    </div>
  );
});
