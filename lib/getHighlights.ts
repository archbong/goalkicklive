// lib/getHighlights.ts
'use cache';

import { highlights } from '@/lib/mockData';

export async function getHighlights() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return highlights;
}
