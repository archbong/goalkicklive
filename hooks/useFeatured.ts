import { getFeatured } from '@/lib/getFeatured';
import { use, useState } from 'react';

export interface FeaturedItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
}

export function useFeatured() {
  const [data, setData] = useState<FeaturedItem[]>([]);
  const [loading, setLoading] = useState(true);

  use(
    (async () => {
      const result = await getFeatured();
      setData(result);
      setLoading(false);
    })()
  );

  return { data, loading };
}
