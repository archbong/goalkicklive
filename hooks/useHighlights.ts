'use client';
import { use } from 'react';
import { getHighlights } from '@/lib/getHighlights';

export function useHighlights() {
  const highlights = use(getHighlights());
  return highlights;
}
