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
  stock, }: ProductCardProps) {
  return (

  
  <div className="w-64 cursor-pointer overflow-hidden rounded-lg shadow-sm">
    <div className="w-64 rounded-lg p-4 shadow-sm">
      <Link href={`/products/${id}`}>
    <div className="relative mb-4 h-48 overflow-hidden rounded-md">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
       <p className="text-sm text-gray-500">{category}</p>
             <h2 className="mt-1 text-lg font-semibold">
        {name}
      </h2>
        <p className="mt-2 text-sm text-gray-600">
          {description}
        </p>

      <p className="mt-2 text-gray-600">
        ₹{price}
      </p>
         <p className="mt-1 text-sm text-gray-500">
          {stock} available
        </p>
      </div>
      </Link>
      <button className=" w-full rounded-md bg-black px-4 py-2 text-white">
        Add to cart
      </button>
    </div>
  </div>

  );
}