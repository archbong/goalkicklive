interface SkeletonGridProps {
  count?: number;
}

export default function SkeletonGrid({ count = 6 }: SkeletonGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-gray-200 animate-pulse rounded-lg h-48 w-full"
        />
      ))}
    </div>
  );
}
