"use client";

import { useEffect, useState } from "react";
import { fetchHealth } from "@/lib/api";
import { motion } from "framer-motion";
import { Server } from "lucide-react";

export default function HealthPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchHealth().then(setData).catch(console.error);
  }, []);

  if (!data)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading API health...
      </div>
    );

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 p-10">
      <motion.div
        className="max-w-lg mx-auto bg-white/70 backdrop-blur-md border border-gray-200 rounded-2xl shadow-md p-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Server className="text-rose-500" />
          <h1 className="text-2xl font-display font-bold text-gray-800">
            API Health Status
          </h1>
        </div>

        <ul className="text-gray-700 space-y-2">
          <li>
            <strong>Status:</strong>{" "}
            <span className="text-green-600 font-semibold">
              {data.status.toUpperCase()}
            </span>
          </li>
          <li>
            <strong>Version:</strong> {data.version}
          </li>
          <li>
            <strong>Uptime:</strong> {data.uptime}s
          </li>
          <li>
            <strong>Last Checked:</strong>{" "}
            {new Date(data.timestamp).toLocaleString()}
          </li>
        </ul>
      </motion.div>
    </main>
  );
}
