'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/providers/providers';
import { TutorialOverlay } from './tutorial-overlay';
import { TutorialHighlight } from './tutorial-highlight';

interface TutorialStep {
  id: string;
  target: string;
  title: string;
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  page: string;
  action?: () => void;
}

interface TutorialContextType {
  isActive: boolean;
  currentStep: number;
  totalSteps: 