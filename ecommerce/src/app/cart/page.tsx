"use client";

import PlaceOrderButton from "@/components/PlaceOrderButton";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  stock: number;
};

type CartItem = {
  id: number;
  quantity: number;
  product: Product;
};

type Cart = {
  id: number;
  items: CartItem[];
};

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);


  
async function updateQuantity(itemId: number, quantity: number) {
  const response = await fetch("/api/cart", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ itemId, quantity }),
  });

  const data = await response.json();

  if (!response.ok) {
    alert(data.error || "Could not update cart");
    return;
  }

  // Fetch the latest cart data from the server.
  const cartResponse = await fetch("/api/cart");
  const cartData = await cartResponse.json();
  setCart(cartData.cart);
}




async function removeItem(itemId: number) {
  const response = await fetch("/api/cart", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ itemId }),
  });

  const data = await response.json();

  if (!response.ok) {
    alert(data.error || "Could not remove item");
    return;
  }

  const cartResponse = await fetch("/api/cart");
  const cartData = await cartResponse.json();
  setCart(cartData.cart);
}

  useEffect(() => {
    async function getCart() {
      try {
        const response = await fetch("/api/cart");

        if (!response.ok) {
          setCart(null);
          return;
        }

        const data = await response.json();
        setCart(data.cart);
      } catch {
        setCart(null);
      } finally {
        setLoading(false);
      }
    }

    getCart();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f6f3ee] px-6 py-10 text-[#1c1917]">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm text-[#5c5449]">
            Loading cart...
          </p>
        </div>
      </main>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <main className="min-h-screen bg-[#f6f3ee] px-6 py-10 text-[#1c1917]">
        <div className="mx-auto max-w-5xl">
          <p className="mb-2 text-sm tracking-widest text-[#5c5449]">
            CART
          </p>

          <h1 className="font-serif text-4xl font-medium">
            Your cart is empty
          </h1>

          <p className="mt-3 text-[#5c5449]">
            Add something from the shop and it will appear here.
          </p>

          <Link
            href="/products"
            className="mt-6 inline-block rounded-full bg-[#0f5c5a] px-5 py-3 text-sm font-medium text-white"
          >
            Continue shopping
          </Link>
        </div>
      </main>
    );
  }

  const total = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <main className="min-h-screen bg-[#f6f3ee] px-6 py-10 text-[#1c1917]">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10">
          <p className="mb-2 text-sm tracking-widest text-[#5c5449]">
            CART
          </p>

          <h1 className="font-serif text-4xl font-medium">
            Your cart
          </h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <section className="space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.id}
                className="flex gap-5 rounded-2xl bg-white p-4 shadow-sm"
              >
                <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-[#e3dccf]">
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-lg font-medium">
                    {item.product.name}
                  </p>

                  <p className="mt-1 text-sm text-[#5c5449]">
                    ₹{item.product.price}
                  </p>
                
                  <div className="mt-3 flex items-center gap-3">
                    <button
                      type="button"
                      disabled={item.quantity <= 1}
                      onClick={() =>
                        updateQuantity(item.id, item.quantity - 1)
                      }
                      className="h-8 w-8 rounded-full border border-[#e0d9cf] disabled:opacity-40"
                    >
                      −
                    </button>

                    <span className="min-w-5 text-center text-sm">
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      disabled={item.quantity >= item.product.stock}
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                      className="h-8 w-8 rounded-full border border-[#e0d9cf] disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="mt-3 text-sm text-[#9a2b1c] underline underline-offset-4 hover:opacity-70"
                  >
                    Remove
                  </button>
                </div>

                <p className="text-lg font-medium">
                  ₹{item.product.price * item.quantity}
                </p>
              </div>
            ))}
          </section>

          <aside className="h-fit rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="font-serif text-2xl font-medium">
              Summary
            </h2>

            <div className="my-5 border-t border-[#e0d9cf]" />

            <div className="flex items-center justify-between">
              <span className="text-[#5c5449]">
                Subtotal
              </span>

              <span className="font-medium">
                ₹{total}
              </span>
            </div>

            <PlaceOrderButton disabled={cart.items.length === 0} />
            <button
              type="button"
              className="mt-6 w-full rounded-full bg-[#0f5c5a] py-3 font-medium text-white transition hover:opacity-90"
            >
              Checkout
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
}