import Image from "next/image";
import prisma from "@/lib/prisma";

type ProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!product) {
    return <p>Product not found.</p>;
  }

  return (
    <main className="p-8">
      <div className="mx-auto max-w-4xl">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="relative h-96 overflow-hidden rounded-lg">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>

          <div>
            <p className="text-sm text-gray-500">
              {product.category}
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              {product.name}
            </h1>

            <p className="mt-4 text-gray-600">
              {product.description}
            </p>

            <p className="mt-6 text-2xl font-bold">
              ₹{product.price}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              {product.stock} available
            </p>

            <button className="mt-6 rounded-md bg-black px-6 py-3 text-white">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}