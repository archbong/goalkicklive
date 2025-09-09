'use client';
import { use } from 'react';
import { getBlogs } from '@/lib/getBlogs';

export function useBlogs() {
  const blogs = use(getBlogs());
  return blogs;
}
