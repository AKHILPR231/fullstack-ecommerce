"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();

  const handleSignup = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Signup failed");
        return;
      }

      setSuccess(data.message);
      router.push("/login");
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-65px)] bg-[#f6f3ee] px-6 py-12 text-[#1c1917]">
      <div className="mx-auto max-w-md">
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <div className="mb-8">
            <p className="mb-2 text-sm tracking-widest text-[#5c5449]">
              ACCOUNT
            </p>

            <h1 className="font-serif text-4xl font-medium">
              Create account
            </h1>

            <p className="mt-3 text-sm text-[#5c5449]">
              Create an account to save your cart and track orders.
            </p>
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              handleSignup();
            }}
            className="space-y-5"
          >
            {/* Name */}
            <label className="block text-sm font-medium">
              Name

              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                className="mt-2 h-12 w-full rounded-lg border border-[#e0d9cf] bg-[#fdfcf9] px-3 outline-none transition focus:border-[#0f5c5a]"
                placeholder="Your name"
              />
            </label>

            {/* Email */}
            <label className="block text-sm font-medium">
              Email

              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="mt-2 h-12 w-full rounded-lg border border-[#e0d9cf] bg-[#fdfcf9] px-3 outline-none transition focus:border-[#0f5c5a]"
                placeholder="you@example.com"
              />
            </label>

            {/* Password */}
            <label className="block text-sm font-medium">
              Password

              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="mt-2 h-12 w-full rounded-lg border border-[#e0d9cf] bg-[#fdfcf9] px-3 outline-none transition focus:border-[#0f5c5a]"
                placeholder="Minimum 8 characters"
              />
            </label>

            {/* Error */}
            {error && (
              <p
                className="rounded-lg bg-[#f8e8e5] p-3 text-sm text-[#9a2b1c]"
                role="alert"
              >
                {error}
              </p>
            )}

            {/* Success */}
            {success && (
              <p className="rounded-lg bg-[#e6efed] p-3 text-sm text-[#0f5c5a]">
                {success}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-[#0f5c5a] py-3 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <div className="mt-6 border-t border-[#e0d9cf] pt-6 text-center text-sm text-[#5c5449]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-[#0f5c5a] hover:underline"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}