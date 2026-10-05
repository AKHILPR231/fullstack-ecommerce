import Image from "next/image";
import Link from "next/link";

type ProductCardProps = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
};

export default function ProductCard({
  id,
  name,
  description,
  price,
  image,
  category,
  stock,
}: ProductCardProps) {
  return (
    <div className="group">
      <Link href={`/products/${id}`}>
        <div className="relative h-64 overflow-hidden rounded-2xl bg-[#e3dccf] max-w-[400px]">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        </div>
      </Link>

      <div className="px-1 pt-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-[#5c5449]">{category}</p>

            <Link href={`/products/${id}`}>
              <h2 className="mt-1 text-lg font-medium text-[#1c1917] hover:text-[#0f5c5a]">
                {name}
              </h2>
            </Link>
          </div>

          <p className="text-lg font-medium text-[#1c1917]">
            ₹{price}
          </p>
        </div>

        <p className="mt-2 text-sm text-[#5c5449] line-clamp-2">
          {description}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <p className="text-sm text-[#5c5449]">
            {stock > 0 ? `${stock} in stock` : "Sold out"}
          </p>

          <button
            type="button"
            disabled={stock === 0}
            className="rounded-full bg-[#0f5c5a] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}