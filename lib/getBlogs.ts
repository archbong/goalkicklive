// lib/getBlogs.ts
'use cache';

import { blogs } from '@/lib/mockData';

export async function getBlogs() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return blogs;
}
