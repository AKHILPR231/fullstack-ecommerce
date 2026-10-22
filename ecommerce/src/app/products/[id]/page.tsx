import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import AddToCartButton from "@/components/AddToCartButton";

type ProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { id } = await params;

  const productId = Number(id);

  if (Number.isNaN(productId)) {
    notFound();
  }

  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f6f3ee] px-6 py-10 text-[#1c1917]">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/products"
          className="inline-flex items-center text-sm text-[#5c5449] hover:text-[#0f5c5a]"
        >
           Back to shop
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:items-start">
          {/* Product image */}
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#e3dccf]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              className="object-cover"
            />
          </div>

          {/* Product information */}
          <div className="flex flex-col justify-center lg:px-8">
            <p className="text-sm tracking-widest text-[#5c5449]">
              {product.category.toUpperCase()}
            </p>

            <h1 className="mt-3 font-serif text-4xl font-medium sm:text-5xl">
              {product.name}
            </h1>

            <p className="mt-5 text-2xl font-medium">
              ₹{product.price}
            </p>

            <div className="my-8 border-t border-[#e0d9cf]" />

            <p className="text-base leading-7 text-[#5c5449]">
              {product.description}
            </p>

            <div className="mt-8 rounded-xl bg-white p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#5c5449]">
                  Availability
                </span>

                <span className="text-sm font-medium">
                  {product.stock > 0
                    ? `${product.stock} in stock`
                    : "Sold out"}
                </span>
              </div>
            </div>

            <AddToCartButton
              productId={product.id}
              stock={product.stock}/>

            <p className="mt-4 text-center text-sm text-[#5c5449]">
              Free delivery on orders over ₹1,000
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}