
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type OrderItem = {
  id: number;
  productName: string;
  price: number;
  quantity: number;
};

type Order = {
  id: number;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  items: OrderItem[];
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrders() {
      try {
        const response = await fetch("/api/orders");
        const data = await response.json();

        if (!response.ok) {
          setError(data.error ?? "Unable to load orders.");
          return;
        }

        setOrders(data.orders ?? []);
      } catch {
        setError("Something went wrong while loading orders.");
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f6f3ee] px-6 py-16 text-[#1c1917]">
        Loading your orders...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f3ee] px-6 py-12 text-[#1c1917]">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="text-sm text-[#5c5449] hover:text-[#0f5c5a]"
        >
          ← Continue shopping
        </Link>

        <h1 className="mt-6 text-3xl font-semibold">My Orders</h1>
        <p className="mt-2 text-[#5c5449]">
          View your order history and details.
        </p>

        {error ? (
          <div
            role="alert"
            className="mt-8 rounded-xl border border-[#e0d9cf] bg-white p-5 text-[#9a2b1c]"
          >
            {error}
          </div>
        ) : orders.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-[#e0d9cf] bg-white p-8">
            <h2 className="text-xl font-medium">No orders yet</h2>
            <p className="mt-2 text-[#5c5449]">
              Your completed test orders will appear here.
            </p>
            <Link
              href="/products"
              className="mt-5 inline-block rounded-full bg-[#0f5c5a] px-6 py-3 text-white"
            >
              Browse products
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            {orders.map((order) => (
              <section
                key={order.id}
                className="rounded-2xl border border-[#e0d9cf] bg-white p-6"
              >
                <div className="flex flex-wrap justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold">
                      Order #{order.id}
                    </h2>
                    <p className="mt-1 text-sm text-[#5c5449]">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="text-sm">
                    <p>
                      Status: <strong>{order.status}</strong>
                    </p>
                    <p className="mt-1">
                      Payment: <strong>{order.paymentStatus}</strong>
                    </p>
                  </div>
                </div>

                <div className="mt-5 divide-y divide-[#e0d9cf]">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between gap-4 py-3"
                    >
                      <div>
                        <p className="font-medium">{item.productName}</p>
                        <p className="mt-1 text-sm text-[#5c5449]">
                          ₹{item.price} × {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium">
                        ₹{item.price * item.quantity}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex justify-between border-t border-[#e0d9cf] pt-4 text-lg font-semibold">
                  <span>Total</span>
                  <span>₹{order.totalAmount}</span>
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}