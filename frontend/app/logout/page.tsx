"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/api";
import { auth } from "@/lib/auth";
import { LogOut } from "lucide-react";

export default function LogoutPage() {
  const [message, setMessage] = useState("Logging you out...");
  const router = useRouter();

  useEffect(() => {
    const { token } = auth.get();
    if (token) {
      logout(token)
        .then(() => setMessage("You have been logged out successfully."))
        .catch(() => setMessage("Logout failed or session expired."));
    } else {
      setMessage("No active session found.");
    }

    auth.clear();
    setTimeout(() => router.replace("/"), 1500);
  }, [router]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-rose-50 via-white to-pink-50 text-gray-800">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <LogOut className="mx-auto text-rose-500 w-12 h-12 mb-3" />
        <h1 className="text-2xl font-display font-semibold">{message}</h1>
        <p className="text-gray-500 mt-2">Redirecting to login page...</p>
      </motion.div>
    </main>
  );
}
