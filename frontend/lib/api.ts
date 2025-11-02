"use client";

import { Product } from "@/types/product";
import { auth } from "@/lib/auth";

// ---------- Config ----------
export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, "") || "http://localhost:7071";

// Generic response shape for backend errors
interface ApiError {
  message: string;
  status?: number;
}

// ---------- Types ----------
export interface LoginResponse {
  token: string;
  clientId: string;
  clientName: string;
}

export interface ProductsResponse {
  products: Product[];
}

// ---------- Helpers ----------
async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    const message = text || res.statusText || "Unknown error";
    throw { message, status: res.status } as ApiError;
  }
  return res.json();
}

async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${path}`;
  try {
    const res = await fetch(url, {
      ...options,
      mode: "cors",
    });
    return await handleResponse<T>(res);
  } catch (err: any) {
    console.error("API error:", err);
    throw new Error(err.message || "Network error");
  }
}

// ---------- Login ----------
/**
 * Login using a client-specific code.
 * Returns a token + client details.
 */
export async function loginByCode(code: string): Promise<LoginResponse> {
  return apiFetch<LoginResponse>("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });
}

// ---------- Fetch Products ----------
/**
 * Fetches products for the given client using a valid JWT token.
 * Automatically clears local auth and throws on 401.
 */
export async function fetchProducts(
  token?: string,
  clientId?: string
): Promise<ProductsResponse> {
  if (!token) throw new Error("Missing token. Please log in again.");

  const url = clientId ? `/products?clientId=${clientId}` : `/products`;

  try {
    return await apiFetch<ProductsResponse>(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  } catch (err: any) {
    if (err.status === 401) {
      console.warn("Token expired or unauthorized. Clearing auth...");
      auth.clear();
      throw new Error("Session expired. Please log in again.");
    }
    throw err;
  }
}
