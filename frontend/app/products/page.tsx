"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShoppingBag, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { fetchProducts } from "@/lib/api";
import { auth } from "@/lib/auth";
import type { Product, ApiErrorResponse } from "@/types/types";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [clientName, setClientName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const { token, clientName } = auth.get();
    if (!token) {
      router.replace("/");
      return;
    }

    setClientName(clientName || "");

    fetchProducts(token)
      .then((res) => {
        if ("error" in res) throw new Error(res.error);
        setProducts(res);
      })
      .catch((err) => setError(err.message || "Failed to load products"))
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = () => {
    auth.clear();
    router.replace("/");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 p-6 md:p-10">
      {/* Header */}
      <motion.header
        className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 pb-4 border-b border-gray-200"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-3 mb-4 md:mb-0">
          <ShoppingBag className="text-rose-500 w-8 h-8" />
          <h1 className="text-3xl font-display font-bold text-gray-900">
            Marimekko Wholesale
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {clientName && (
            <span className="text-gray-600 text-sm italic">
              Signed in as{" "}
              <span className="font-semibold text-gray-800">{clientName}</span>
            </span>
          )}
          <Button
            variant="outline"
            onClick={handleLogout}
            className="flex items-center gap-2 hover:bg-rose-100"
          >
            <LogOut className="w-4 h-4" />
            Log out
          </Button>
        </div>
      </motion.header>

      {/* Error */}
      {error && (
        <motion.div
          className="text-red-700 bg-red-50 border border-red-200 px-4 py-2 rounded-xl mb-6 text-sm font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {error}
        </motion.div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <motion.div
            className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-rose-500 mb-3"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1 }}
          />
          <p className="text-sm font-medium">Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <motion.div
          className="text-center py-20 text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-lg font-medium">No products available</p>
          <p className="text-sm text-gray-400">
            Try again later or contact support.
          </p>
        </motion.div>
      ) : (
        <motion.section
          className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
        >
          {products.map((p, i) => (
            <motion.div
              key={p.id || p.code || i}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <ProductCard
                name={p.name}
                code={p.code}
                color={p.color}
                price={p.price}
                retailPrice={p.retailPrice}
                stock={p.stock}
              />
            </motion.div>
          ))}
        </motion.section>
      )}

      {/* Footer */}
      <footer className="text-center text-xs text-gray-400 mt-12">
        <p>
          © {new Date().getFullYear()} Marimekko Wholesale Portal • Built with
          Next.js & Azure Functions
        </p>
      </footer>
    </main>
  );
}
