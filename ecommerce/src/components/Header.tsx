"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export default function Header() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    async function getUser() {
      try {
        const response = await fetch("/api/auth/me");

        if (!response.ok) {
          setUser(null);
          return;
        }

        const data = await response.json();
        setUser(data.user);
      } catch {
        setUser(null);
      }
    }



    
async function getCartCount() {
  try {
    const response = await fetch("/api/cart");

    if (!response.ok) {
      setCartCount(0);
      return;
    }

    const data = await response.json();

    const count = (data.cart?.items ?? []).reduce(
      (total: number, item: { quantity: number }) =>
        total + item.quantity,
      0
    );

    setCartCount(count);
  } catch {
    setCartCount(0);
  }
}

    getUser();
    getCartCount();
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    setUser(null);
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="border-b border-[#e0d9cf] bg-[#f6f3ee]">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-8 gap-y-3 px-6 py-3">
        <Link
          href="/"
          className="font-serif text-2xl font-semibold text-[#1c1917]"
        >
          [Store]
        </Link>

        <nav className="flex flex-1 flex-wrap items-center gap-6">
          <Link
            href="/products"
            className="py-2 text-sm hover:text-[#0f5c5a]"
          >
            Shop
          </Link>

        {user && (
          <Link
            href="/orders"
            className="text-sm text-[#5c5449] transition hover:text-[#0f5c5a]"
          >
            My Orders
          </Link>
        )}
        </nav>

        <Link
          href="/cart"
          className="rounded-full bg-[#0f5c5a] px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
        >
          Cart · {cartCount}
        </Link>

        {user ? (
          <>
            <span className="text-sm text-[#5c5449]">
              Hi, {user.name}
            </span>

            <button
              type="button"
              onClick={handleLogout}
              className="py-2 text-sm hover:text-[#0f5c5a]"
            >
              Log out
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="py-2 text-sm hover:text-[#0f5c5a]"
          >
            Log in
          </Link>
        )}
      </div>
    </header>
  );
}