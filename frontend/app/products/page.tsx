"use client";

import { useEffect, useState } from "react";
import { fetchProducts } from "../../lib/api";
import { auth } from "../../lib/auth";
import { ProductCard } from "../../components/ProductCard";
import { useRouter } from "next/navigation";

export default function ProductsPage() {
  const [{ products, clientName, error }, setState] = useState<{products: any[]; clientName?: string; error?: string}>({ products: [] });
  const router = useRouter();

  useEffect(() => {
    const { token, clientName } = auth.get();
    if (!token) {
      router.replace("/");
      return;
    }
    fetchProducts(token)
      .then((data) => setState({ products: data.products, clientName: clientName || undefined }))
      .catch((err) => setState({ products: [], error: err.message }));
  }, [router]);

  function logout() {
    auth.clear();
    router.replace("/");
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <h2 style={{ margin: 0 }}>Products</h2>
        <div>
          <span style={{ marginRight: 12, color: "#666" }}>{clientName ? `Signed in as ${clientName}` : ""}</span>
          <button onClick={logout} style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #ddd" }}>Log out</button>
        </div>
      </div>
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
        {products.map(p => <ProductCard key={p.id} name={p.name} price={p.price} stock={p.stock} />)}
      </div>
    </div>
  );
}
