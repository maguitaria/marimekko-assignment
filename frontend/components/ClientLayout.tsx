// components/ClientLayout.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { auth } from "@/lib/auth";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(auth.isAuthenticated());
  }, [pathname]);

  const hideNavbar = pathname === "/" || !isAuthenticated;

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-pink-50 text-gray-900">
      {!hideNavbar && (
        <nav className="flex items-center justify-center gap-8 p-4 border-b border-gray-200 bg-white/80 backdrop-blur-md text-gray-700 font-medium shadow-sm">
          <Link href="/dashboard" className="hover:text-rose-500 transition-colors">Dashboard</Link>
          <Link href="/profile" className="hover:text-rose-500 transition-colors">Profile</Link>
          <Link href="/clients" className="hover:text-rose-500 transition-colors">Clients</Link>
          <Link href="/health" className="hover:text-rose-500 transition-colors">Health</Link>
          <Link href="/logout" className="hover:text-rose-500 transition-colors">Logout</Link>
        </nav>
      )}
      <main className="min-h-screen">{children}</main>
    </div>
  );
}
