"use client";

import { useState } from "react";
import { loginByCode } from "../lib/api";
import { auth } from "../lib/auth";
import { useRouter } from "next/navigation";

export default function Page() {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const { token, clientName } = await loginByCode(code.trim());
      auth.set(token, clientName);
      router.push("/products");
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ display: "grid", gap: 12, maxWidth: 360 }}>
      <label>
        Client code
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="e.g. 1234"
          style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
        />
      </label>
      <button
        type="submit"
        style={{ padding: "10px 14px", borderRadius: 10, border: "none", background: "black", color: "white" }}
      >
        Log in
      </button>
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      <p style={{ color: "#666" }}>Use one of the example codes from the README.</p>
    </form>
  );
}
