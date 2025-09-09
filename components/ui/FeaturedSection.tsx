import { useFeatured } from "@/hooks/useFeatured";
import FeaturedList from "./FeaturedList";
import SkeletonGrid from "./SkeletonGrid";

export default function FeaturedSection() {
  const { data: featured, loading } = useFeatured();

  if (loading) {
    return <SkeletonGrid count={3} />;
  }

  return <FeaturedList data={featured} />;
}
