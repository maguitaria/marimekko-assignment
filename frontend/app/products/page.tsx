"use client";

import { useEffect, useState } from "react";
import { fetchProducts } from "@/lib/api";
import { auth } from "@/lib/auth";
import { ProductCard } from "@/components/ProductCard";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function ProductsPage() {
  const [{ products, clientName, error }, setState] = useState({
    products: [] as any[],
    clientName: "",
    error: "",
  });
console.log(clientName);
  const router = useRouter();

  useEffect(() => {
    const { token, clientName } = auth.get();
    if (!token) {
      router.replace("/");
      return;
    }

    fetchProducts(token)
      .then((data) => setState({ products: data.products, clientName: clientName || undefined, error: "" }))
      .catch((err) => setState({ products: [], clientName: clientName || "", error: err.message }));
  }, [router]);

  const logout = () => {
    auth.clear();
    router.replace("/");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-rose-50 to-white p-8">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-900">
          Marimekko Wholesale
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-500 text-sm">
            {`Signed in as ${clientName}` }
          </span>
          <Button variant="outline" onClick={logout}>
            Log out
          </Button>
        </div>
      </header>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map(p => <ProductCard key={p.id} name={p.name} price={p.price} stock={p.stock} />)}
      </div>
    </main>
  );
}
