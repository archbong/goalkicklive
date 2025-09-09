import Image from "next/image";
import Link from "next/link";

interface CardProps {
  title: string;
  image: string;
  href?: string;
  description?: string;
}

export function Card({ title, image, href = "#", description }: CardProps) {
  return (
    <Link href={href} className="block bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition">
      <div className="relative w-full h-48">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        {description && <p className="text-gray-600 text-sm mt-2">{description}</p>}
      </div>
    </Link>
  );
}
