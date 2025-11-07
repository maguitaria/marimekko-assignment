"use client";
import { HealthResponse, Product, ProfileResponse } from "@/types/types";
import { auth } from "@/lib/auth";
import { ApiResponse } from "@/types/types";
// ---------- Config ----------
export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE;

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

export async function fetchProducts(token: string): Promise<ApiResponse<ProductsResponse>> {
  const res = await fetch(`${API_BASE}/products`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Fetch products failed (${res.status})`);
  return res.json();
}

export async function fetchProfile(token: string): Promise<ApiResponse<ProfileResponse>> {
  const res = await fetch(`${API_BASE}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Fetch profile failed (${res.status})`);
  return res.json();
}

export async function fetchHealth(): Promise<ApiResponse<HealthResponse>> {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error(`Fetch health failed (${res.status})`);
  return res.json();
}

export async function logout(token: string) : Promise<ApiResponse<{ message: string }>> {
  const res = await fetch(`${API_BASE}/logout`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Logout failed (${res.status})`);
  return res.json();
}