import ProductCard from "@/components/ProductCard";
import prisma from "@/lib/prisma";

const products = await prisma.product.findMany();


export default async function ProductsPage() {
  return (
    <main className="p-8">
      <h1 className="mb-6 text-3xl font-bold">
        Products
      </h1>

      <div className="flex gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            description={product.description}
            price={product.price}
            image={product.image}
            category={product.category}
            stock={product.stock}
          />
        ))}
      </div>
    </main>
  );
}