
import ProductCard from "@/components/ProductCard";
import prisma from "@/lib/prisma";
import Link from "next/link";

type ProductsPageProps = {
  searchParams: Promise<{
    search?: string;
    category?: string;
    maxPrice?: string;
    inStock?: string;
    sort?: string;
  }>;
};

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams;

  const search = params.search?.trim() ?? "";
  const category = params.category ?? "";
  const maxPriceValue = Number(params.maxPrice);
  const hasMaxPrice =
    params.maxPrice !== undefined &&
    params.maxPrice.trim() !== "" &&
    Number.isFinite(maxPriceValue) &&
    maxPriceValue >= 0;

  const sort = params.sort ?? "newest";

  const where = {
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            {
              description: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {}),
    ...(category ? { category } : {}),
    ...(hasMaxPrice ? { price: { lte: maxPriceValue } } : {}),
    ...(params.inStock === "true" ? { stock: { gt: 0 } } : {}),
  };

  const orderBy =
    sort === "price-asc"
      ? { price: "asc" as const }
      : sort === "price-desc"
        ? { price: "desc" as const }
        : { createdAt: "desc" as const };

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
    }),
    prisma.product.findMany({
      select: { category: true },
      distinct: ["category"],
      orderBy: { category: "asc" },
    }),
  ]);

  return (
    <main className="min-h-screen bg-[#f6f3ee] px-6 py-10 text-[#1c1917]">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="mb-2 text-sm tracking-widest text-[#5c5449]">
              CATALOG
            </p>
            <h1 className="font-serif text-4xl font-medium">
              All products
            </h1>
            <p className="mt-2 text-sm text-[#5c5449]">
              {products.length} product{products.length === 1 ? "" : "s"} found
            </p>
          </div>

          <form action="/products" method="GET" className="flex flex-wrap items-end gap-3">
            <input
              type="hidden"
              name="search"
              value={search}
            />
            <input
              type="hidden"
              name="category"
              value={category}
            />
            <input
              type="hidden"
              name="maxPrice"
              value={params.maxPrice ?? ""}
            />
            {params.inStock === "true" && (
              <input type="hidden" name="inStock" value="true" />
            )}

            <label className="flex flex-col gap-2 text-sm font-medium">
              Sort by
              <select
                name="sort"
                defaultValue={sort}
                className="h-11 rounded-lg border border-[#e0d9cf] bg-white px-3 text-sm outline-none focus:border-[#0f5c5a]"
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
              </select>
            </label>
            <button
              type="submit"
              className="h-11 rounded-full bg-[#0f5c5a] px-5 text-sm font-medium text-white hover:opacity-90"
            >
              Sort
            </button>
          </form>
        </div>

        <div className="flex flex-col gap-10 lg:flex-row">
          <aside className="w-full shrink-0 lg:w-56">
            <form
              action="/products"
              method="GET"
              className="flex flex-col gap-6"
            >
              <input type="hidden" name="sort" value={sort} />

              <div>
                <label
                  htmlFor="search"
                  className="mb-2 block text-sm font-medium"
                >
                  Search
                </label>
                <input
                  id="search"
                  name="search"
                  type="search"
                  defaultValue={search}
                  placeholder="Search products"
                  className="h-11 w-full rounded-lg border border-[#e0d9cf] bg-white px-3 text-sm outline-none focus:border-[#0f5c5a]"
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="mb-2 block text-sm font-medium"
                >
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  defaultValue={category}
                  className="h-11 w-full rounded-lg border border-[#e0d9cf] bg-white px-3 text-sm outline-none focus:border-[#0f5c5a]"
                >
                  <option value="">All categories</option>
                  {categories.map((item) => (
                    <option key={item.category} value={item.category}>
                      {item.category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="maxPrice"
                  className="mb-2 block text-sm font-medium"
                >
                  Maximum price (₹)
                </label>
                <input
                  id="maxPrice"
                  name="maxPrice"
                  type="number"
                  min="0"
                  step="1"
                  defaultValue={params.maxPrice ?? ""}
                  placeholder="Any price"
                  className="h-11 w-full rounded-lg border border-[#e0d9cf] bg-white px-3 text-sm outline-none focus:border-[#0f5c5a]"
                />
              </div>

              <label className="flex min-h-11 items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="inStock"
                  value="true"
                  defaultChecked={params.inStock === "true"}
                  className="h-4 w-4 accent-[#0f5c5a]"
                />
                In stock only
              </label>

              <button
                type="submit"
                className="rounded-full bg-[#0f5c5a] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
              >
                Apply filters
              </button>

              <Link
                href="/products"
                className="text-center text-sm text-[#5c5449] underline underline-offset-4 hover:text-[#0f5c5a]"
              >
                Clear all filters
              </Link>
            </form>
          </aside>

          <section className="min-w-0 flex-1">
            {products.length === 0 ? (
              <div className="rounded-2xl border border-[#e0d9cf] bg-white p-8">
                <h2 className="font-serif text-2xl font-medium">
                  No products found
                </h2>
                <p className="mt-2 text-sm text-[#5c5449]">
                  Try changing your search or filters.
                </p>
              </div>
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