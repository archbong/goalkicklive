'use cache';

import { featured } from './mockFeatured';

export async function getFeatured() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return featured;
}
