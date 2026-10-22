
import Link from "next/link";

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f6f3ee] px-5 py-12 text-[#1c1917]">
      <section className="w-full max-w-lg rounded-3xl border border-[#e0d9cf] bg-white p-8 text-center sm:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e6efed] text-3xl text-[#0f5c5a]">
          ✓
        </div>

        <p className="mt-6 text-sm uppercase tracking-[0.2em] text-[#5c5449]">
          Order confirmation
        </p>

        <h1 className="mt-3 text-3xl font-semibold">
          Thank you for your order!
        </h1>

        <p className="mt-4 leading-7 text-[#5c5449]">
          Your order has been placed. This is a test checkout;
          no payment has been collected.
        </p>

        {orderId && (
          <p className="mt-4 rounded-xl bg-[#f6f3ee] p-3 font-medium">
            Order number: #{orderId}
          </p>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/orders"
            className="rounded-full bg-[#0f5c5a] px-6 py-3 font-medium text-white hover:opacity-90"
          >
            View my orders
          </Link>

          <Link
            href="/products"
            className="rounded-full border border-[#e0d9cf] px-6 py-3 font-medium hover:bg-[#f6f3ee]"
          >
            Continue shopping
          </Link>
        </div>
      </section>
    </main>
  );
}