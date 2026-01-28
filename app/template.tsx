'use client';

import { memo } from 'react';

// Sin animaciones para navegación instantánea
export default memo(function Template({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
});
