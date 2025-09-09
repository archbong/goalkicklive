// components/SkeletonList.tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonListProps {
  count?: number;
  className?: string;
}

export default function SkeletonList({ count = 3, className }: SkeletonListProps) {
  return (
    <div className={cn('grid gap-4', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-md bg-gray-200 h-32 w-full"
        />
      ))}
    </div>
  );
}
