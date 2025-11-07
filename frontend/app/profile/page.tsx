"use client";

import { useEffect, useState } from "react";
import { fetchProfile } from "@/lib/api";
import { auth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const { token } = auth.get();
    if (!token) {
      router.replace("/");
      return;
    }

    fetchProfile(token)
      .then(setProfile)
      .catch((err) => setError(err.message || "Failed to load profile"));
  }, [router]);

  if (error)
    return (
      <p className="text-red-600 text-center mt-8">
        {error} — <Button onClick={() => router.back()}>Go Back</Button>
      </p>
    );

  if (!profile)
    return (
      <div className="flex items-center justify-center py-20 text-gray-500">
        Loading profile...
      </div>
    );

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 p-10">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto"
      >
        <Card className="shadow-md border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-display text-gray-800">
              <User className="text-rose-500" /> Client Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-gray-700">
            <p>
              <strong>ID:</strong> {profile.clientId}
            </p>
            <p>
              <strong>Name:</strong> {profile.clientName}
            </p>
            <p>
              <strong>Price Multiplier:</strong> {profile.priceMultiplier}
            </p>
            <p>
              <strong>Stock Factor:</strong> {profile.stockFactor}
            </p>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </motion.div>
    </main>
  );
}
