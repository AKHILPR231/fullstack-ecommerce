
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PlaceOrderButton({
  disabled = false,
}: {
  disabled?: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function placeOrder() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Unable to place your order.");
        return;
      }

      router.push(
        `/orders/success?orderId=${data.order.id}`
      );
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-5">
      <button
        type="button"
        onClick={placeOrder}
        disabled={disabled || loading}
        className="w-full rounded-full bg-[#0f5c5a] px-6 py-3 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading
          ? "Placing order..."
          : "Place order"}
      </button>

      {error && (
        <p role="alert" className="mt-3 text-sm text-[#9a2b1c]">
          {error}
        </p>
      )}

      <p className="mt-3 text-center text-xs leading-5 text-[#5c5449]">
        Test checkout only. No payment will be collected.
      </p>
    </div>
  );
}