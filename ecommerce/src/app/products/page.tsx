import ProductCard from "@/components/ProductCard";
import prisma from "@/lib/prisma";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-[#f6f3ee] px-6 py-10 text-[#1c1917]">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="mb-2 text-sm tracking-widest text-[#5c5449]">
              CATALOG
            </p>

            <h1 className="font-serif text-4xl font-medium">
              All products
            </h1>
          </div>

          <div>
            <label className="flex flex-col gap-2 text-sm font-medium">
              Sort by

              <select className="h-11 rounded-lg border border-[#e0d9cf] bg-white px-3 text-sm outline-none focus:border-[#0f5c5a]">
                <option>Newest</option>
                <option>Price: low to high</option>
                <option>Price: high to low</option>
              </select>
            </label>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-10 lg:flex-row">
          {/* Filters */}
          <aside className="w-full shrink-0 lg:w-56">
            <div className="flex flex-col gap-6">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Search
                </label>

                <input
                  type="search"
                  placeholder="Search products"
                  className="h-11 w-full rounded-lg border border-[#e0d9cf] bg-white px-3 text-sm outline-none focus:border-[#0f5c5a]"
                />
              </div>

              <div>
                <p className="mb-2 text-sm font-medium">
                  Category
                </p>

                <div className="flex flex-col gap-1">
                  <button className="rounded-lg bg-[#e6efed] px-3 py-2 text-left text-sm font-medium">
                    All
                  </button>

                  <button className="rounded-lg px-3 py-2 text-left text-sm hover:bg-[#e6efed]">
                    Clothing
                  </button>

                  <button className="rounded-lg px-3 py-2 text-left text-sm hover:bg-[#e6efed]">
                    Shoes
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Max price
                </label>

                <input
                  type="number"
                  min="0"
                  placeholder="₹"
                  className="h-11 w-full rounded-lg border border-[#e0d9cf] bg-white px-3 text-sm outline-none focus:border-[#0f5c5a]"
                />
              </div>

              <label className="flex min-h-11 items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="h-4 w-4"
                />

                In stock only
              </label>
            </div>
          </aside>

          {/* Products */}
          <section className="min-w-0 flex-1">
            {products.length === 0 ? (
              <p className="text-sm text-[#5c5449]">
                No products available.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
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
            )}
          </section>
        </div>
      </div>
    </main>
  );
}