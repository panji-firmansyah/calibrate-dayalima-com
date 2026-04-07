"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/admin";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login gagal");
        return;
      }

      router.push(redirect);
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-dvh flex items-center justify-center px-4">
      <div
        className="w-full max-w-sm rounded-lg border border-border bg-bg-card p-8"
        style={{ boxShadow: "var(--shadow-md)" }}
      >
        <div className="mb-6 text-center">
          <p className="text-xs font-semibold tracking-widest uppercase text-text-muted">
            Daya Lima
          </p>
          <h1 className="mt-1 text-2xl font-bold text-text-primary">
            Calibrate
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Masuk untuk mengakses dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-text-secondary mb-1.5"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              className="w-full h-11 rounded-md border border-border bg-white px-4 text-sm text-text-primary placeholder:text-text-placeholder focus:border-brand focus:ring-[3px] focus:ring-brand/15 focus:outline-none transition-colors"
              placeholder="Username"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-text-secondary mb-1.5"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full h-11 rounded-md border border-border bg-white px-4 text-sm text-text-primary placeholder:text-text-placeholder focus:border-brand focus:ring-[3px] focus:ring-brand/15 focus:outline-none transition-colors"
              placeholder="Password"
            />
          </div>

          {error && (
            <p className="text-sm text-brand">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-md bg-brand text-white text-sm font-medium hover:bg-brand-hover disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed disabled:shadow-none transition-colors cursor-pointer"
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
