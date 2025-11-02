"use client";

import { useState } from "react";
import { loginByCode } from "../lib/api";
import { auth } from "../lib/auth";
import { useRouter } from "next/navigation";

export default function Page() {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const { token, clientName } = await loginByCode(code.trim());
      auth.set(token, clientName);
      router.push("/products");
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-brand-white to-brand-pink text-brand-black p-6">
      <h1 className="font-display text-4xl tracking-wider uppercase mb-2">Marimekko Wholesale</h1>
      <p className="text-brand-black/70 mb-8 text-sm">Distributor Portal Login</p>

      <form
        onSubmit={onSubmit}
        className="bg-white/80 backdrop-blur-md shadow-lg rounded-2xl p-8 w-full max-w-sm flex flex-col gap-4 border border-brand-black/10"
      >
        <label className="flex flex-col gap-1 text-sm font-semibold">
          Client Code
          <input
            className="border border-brand-black/20 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-brand-red"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="e.g. 1234"
          />
        </label>

        <button
          type="submit"
          className="bg-brand-red hover:bg-brand-black text-white rounded-lg py-2 font-semibold transition"
        >
          Log in
        </button>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        <p className="text-xs text-brand-black/60 text-center">
          Use your assigned access code to log in.
        </p>
      </form>

      <div className="absolute bottom-0 w-full h-20 bg-repeat-x opacity-10"
           style={{ backgroundImage: "repeating-linear-gradient(90deg, #000 0, #000 25px, #fff 25px, #fff 50px)" }}
      />
    </main>
  );
}
