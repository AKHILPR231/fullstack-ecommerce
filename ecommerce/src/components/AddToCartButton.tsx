"use client";

import { useState } from "react";

type AddToCartButtonProps = {
  productId: number;
  stock: number;
};

export default function AddToCartButton({
  productId,
  stock,
}: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleAddToCart() {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          quantity: 1,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Could not add to cart");
        return;
      }

      setMessage("Added to cart");
    } catch {
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={stock === 0 || loading}
        className="w-full rounded-full bg-[#0f5c5a] py-3.5 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {loading
          ? "Adding..."
          : stock > 0
            ? "Add to cart"
            : "Sold out"}
      </button>

      {message && (
        <p className="mt-3 text-center text-sm text-[#5c5449]">
          {message}
        </p>
      )}
    </div>
  );
}