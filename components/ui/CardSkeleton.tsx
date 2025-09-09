import Skeleton from "./Skeleton";

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <Skeleton className="h-5 w-3/4 mb-3" /> {/* Title */}
      <Skeleton className="h-40 w-full mb-3" /> {/* Image/Video */}
      <Skeleton className="h-4 w-1/2" /> {/* Subtitle/extra */}
    </div>
  );
}
