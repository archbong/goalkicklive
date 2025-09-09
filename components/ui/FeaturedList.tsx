import Link from 'next/link';
import Image from 'next/image';
import { FeaturedItem } from '@/hooks/useFeatured';
import { cn } from '@/lib/utils';
import { Button } from './Button';

export default function FeaturedList({ data }: { data: FeaturedItem[] }) {
  if (!data || data.length === 0) {
    return <p className="text-gray-500">No featured content available.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {data.map((item) => (
        <div
          key={item.id}
          className={cn('bg-gray-50 rounded-lg shadow p-4 flex flex-col')}
        >
          <Image
            src={item.imageUrl}
            alt={item.title}
            width={400}
            height={200}
            className="rounded-lg object-cover mb-4"
          />
          <h3 className="font-semibold mb-2">{item.title}</h3>
          <p className="text-sm text-gray-600 mb-4">{item.description}</p>
          <Button variant="secondary" size="sm">
            <Link href={item.link} target="_blank">View</Link>
          </Button>
        </div>
      ))}
    </div>
  );
}
