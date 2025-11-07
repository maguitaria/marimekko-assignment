"use client";

import { motion } from "framer-motion";
import { Users, TrendingUp, PackageCheck, Info } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/auth";
import type { ClientProfile } from "@/types/types";

export default function ClientsPage() {
  const [clients, setClients] = useState<ClientProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = auth.get().token;

    fetch(`${process.env.NEXT_PUBLIC_API_BASE}/clients`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setClients(data.clients || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <main className="flex flex-col items-center justify-center min-h-screen text-gray-500">
        <Users className="w-10 h-10 animate-pulse text-rose-400 mb-4" />
        <p className="text-sm">Loading registered clients...</p>
      </main>
    );

  if (error)
    return (
      <p className="text-red-600 text-center mt-10 font-medium">
        Failed to load clients: {error}
      </p>
    );

  return (
    <section className="p-6 max-w-6xl mx-auto">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="text-rose-500 w-7 h-7" />
          <h1 className="text-3xl font-display font-bold text-gray-900">
            Registered Clients
          </h1>
        </div>

        <button
          onClick={() => router.push("/")}
          className="text-sm text-gray-600 hover:text-rose-500 transition"
        >
          ← Back to Login
        </button>
      </header>

      {clients.length === 0 ? (
        <p className="text-gray-500 text-sm mt-8">No clients found.</p>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {clients.map((c, index) => (
            <motion.li
              key={c.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.03 }}
              className="group cursor-pointer relative border border-gray-200 rounded-2xl shadow-sm bg-white hover:shadow-lg hover:border-rose-300 transition-all duration-300 overflow-hidden"
              onClick={() => router.push(`/profile/${c.id}`)}
            >
              {/* Decorative gradient bar */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-400 to-pink-500 opacity-70" />

              <div className="p-5 space-y-2">
                <h2 className="text-lg font-semibold text-gray-900">
                  {c.name}
                </h2>
                <p className="text-xs uppercase text-gray-400 tracking-wide">
                  ID: {c.id}
                </p>

                <div className="flex items-center gap-2 text-sm text-gray-700 mt-2">
                  <TrendingUp className="w-4 h-4 text-rose-500" />
                  <span>
                    <span className="font-medium">Price Multiplier:</span>{" "}
                    <span className="text-gray-900">{c.priceMultiplier}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <PackageCheck className="w-4 h-4 text-rose-500" />
                  <span>
                    <span className="font-medium">Stock Factor:</span>{" "}
                    <span className="text-gray-900">{c.stockFactor}</span>
                  </span>
                </div>

                {c.summary && (
                  <p className="text-sm text-gray-600 italic border-t pt-3 mt-3">
                    {c.summary}
                  </p>
                )}
              </div>

              {/* Hover overlay accent */}
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 0.1 }}
                className="absolute inset-0 bg-gradient-to-br from-rose-100 to-transparent pointer-events-none"
              />
            </motion.li>
          ))}
        </ul>
      )}

      {/* Footer */}
      <footer className="text-center text-xs text-gray-400 mt-10">
        <div className="flex items-center justify-center gap-1">
          <Info className="w-3 h-3" />
          <span>
            Powered by Azure Functions • Deployed via GitHub Actions
          </span>
        </div>
      </footer>
    </section>
  );
}
