"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/auth";
import { fetchProducts, fetchProfile, fetchHealth, logout } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { User, LogOut, Server, TrendingUp, PackageCheck, Info } from "lucide-react";
import type { Product, ProfileResponse, HealthResponse } from "@/types/types";

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const { token } = auth.get();
    if (!token) {
      router.replace("/");
      return;
    }

    Promise.all([fetchProducts(token), fetchProfile(token), fetchHealth()])
      .then(([productData, profileData, healthData]) => {
        // Check if responses contain error
        if ('error' in productData) {
          throw new Error(productData.error);
        }
        if ('error' in profileData) {
          throw new Error(profileData.error);
        }
        if ('error' in healthData) {
          throw new Error(healthData.error);
        }

        // Set the data - productData is ProductsResponse with products array
        setProducts(productData.products || []);
        setProfile(profileData);
        setHealth(healthData);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || "Failed to load dashboard");
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = async () => {
    const { token } = auth.get();
    if (token) {
      try {
        await logout(token);
      } catch (error) {
        console.error("Logout error:", error);
        // Continue with logout even if API call fails
      }
    }
    auth.clear();
    router.replace("/");
  };

  const hasProducts = products && products.length > 0;

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 p-6 md:p-10">
      {/* === Header === */}
      <motion.header
        className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 border-b border-gray-200 pb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">
            Marimekko Wholesale Dashboard
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            View catalog, stock, and pricing for your client profile.
          </p>
        </div>

        {profile && (
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <div className="flex items-center gap-2 text-gray-700 text-sm font-medium">
              <User className="w-4 h-4 text-rose-500" />
              <span>
                {profile.clientName} <span className="text-gray-400">({profile.clientId})</span>
              </span>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center gap-2 hover:bg-rose-100"
            >
              <LogOut className="w-4 h-4" />
              Log out
            </Button>
          </div>
        )}
      </motion.header>

      {/* === System Status Bar === */}
      {health && (
        <motion.div
          className="mb-8 bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 flex items-center justify-between shadow-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="flex items-center gap-2 text-gray-700">
            <Server className="w-5 h-5 text-rose-500" />
            <span className="font-semibold">API Status:</span>
            <span
              className={`font-medium ${
                health.status === "ok" ? "text-green-600" : "text-red-600"
              }`}
            >
              {health.status.toUpperCase()}
            </span>
          </div>
          <span className="text-sm text-gray-500">
            v{health.version} • {new Date(health.timestamp).toLocaleString()}
          </span>
        </motion.div>
      )}

      {/* === Profile Overview === */}
      {profile && (
        <motion.div
          className="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6 grid gap-4 sm:grid-cols-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-rose-500" />
            <div>
              <p className="text-sm text-gray-500">Price Multiplier</p>
              <p className="text-lg font-semibold text-gray-900">
                ×{profile.priceMultiplier}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <PackageCheck className="w-5 h-5 text-rose-500" />
            <div>
              <p className="text-sm text-gray-500">Stock Factor</p>
              <p className="text-lg font-semibold text-gray-900">
                ×{profile.stockFactor}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Info className="w-5 h-5 text-rose-500" />
            <div>
              <p className="text-sm text-gray-500">Summary</p>
              <p className="text-gray-700 text-sm leading-tight">
                {profile.summary || "Standard client configuration."}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* === Error === */}
      {error && (
        <motion.p
          className="text-red-600 bg-red-50 border border-red-200 px-4 py-2 rounded-xl mb-6 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {error}
        </motion.p>
      )}

      {/* === Products Grid === */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-500">
          <motion.div
            className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-rose-500 mr-3"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1 }}
          />
          Loading dashboard...
        </div>
      ) : hasProducts ? (
        <motion.div
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
              key={p.id || i}
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
        </motion.div>
      ) : (
        <motion.div
          className="text-center text-gray-500 italic py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          No products available for your client profile.
        </motion.div>
      )}

      {/* === Footer === */}
      <footer className="text-center text-xs text-gray-400 mt-12">
        <p>© {new Date().getFullYear()} Client Store • Powered by Azure Functions</p>
      </footer>
    </main>
  );
}
