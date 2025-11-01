export const API_BASE = process.env.NEXT_PUBLIC_API_BASE!;

export async function loginByCode(code: string) {
  const res = await fetch(`${API_BASE}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code })
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<{ token: string; clientId: string; clientName: string }>;
}

export async function fetchProducts(token: string) {
  const res = await fetch(`${API_BASE}/api/products`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<{ products: Array<{ id: string; name: string; price: number; stock: number }> }>;
}
