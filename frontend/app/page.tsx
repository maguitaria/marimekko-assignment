"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { loginByCode } from "@/lib/api";
import { auth } from "@/lib/auth";
import { LogIn } from "lucide-react";

export default function LoginPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Auto-redirect if already logged in
  useEffect(() => {
    const { token } = auth.get();
    if (token && auth.isAuthenticated()) {
      router.replace("/dashboard");
    }
  }, [router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { token, clientName, clientId } = await loginByCode(code.trim());
      auth.set(token, clientName, clientId);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-rose-50 via-white to-pink-50 text-gray-900 relative overflow-hidden">
      <motion.div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, #f87171 0%, transparent 40%), radial-gradient(circle at 80% 80%, #fb7185 0%, transparent 40%)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 1.5 }}
      />

      <motion.div
        className="text-center mb-8 z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-wide text-gray-900 mb-2">
          Marimekko Wholesale Portal
        </h1>
        <p className="text-gray-500 text-sm uppercase tracking-wide">
          Distributor Access
        </p>
      </motion.div>

      <motion.form
        onSubmit={handleLogin}
        className="bg-white/80 backdrop-blur-md shadow-xl rounded-2xl p-8 w-full max-w-sm flex flex-col gap-4 border border-gray-200 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <label className="flex flex-col gap-2 text-sm font-semibold text-gray-700">
          Access Code
          <input
            className="border border-gray-300 rounded-lg px-3 py-2 text-gray-800 outline-none focus:ring-2 focus:ring-rose-400 transition"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter your client code"
            autoFocus
          />
        </label>

        <button
          type="submit"
          disabled={!code || loading}
          className={`flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg py-2 font-semibold transition-all shadow-md ${
            loading ? "opacity-70 cursor-wait" : ""
          }`}
        >
          {loading ? (
            <motion.div
              className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1 }}
            />
          ) : (
            <LogIn className="w-5 h-5" />
          )}
          {loading ? "Logging in..." : "Log In"}
        </button>

        {error && (
          <motion.p
            className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-md p-2 mt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.p>
        )}

        <p className="text-xs text-gray-500 text-center mt-2">
          Use your assigned client code to access your dashboard.
        </p>
      </motion.form>
    </main>
  );
}
