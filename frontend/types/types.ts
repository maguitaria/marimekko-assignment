/**
 * ==========================================
 * 📘 Global API Types for Client Store Backend
 * ==========================================
 * Shared between backend (Azure Functions) and frontend (Next.js).
 * These describe all endpoint request & response shapes.
 */

/**
 * === Common ===
 */

export interface ApiErrorResponse {
  error: string;
  code?: number;
}

/**
 * === /api/index ===
 */
export interface IndexResponse {
  title: string;
  message: string;
  endpoints: string[];
  environment?: string;
  version?: string;
}

/**
 * === Client Config / Profile Shared Type ===
 */
export interface ClientProfile {
  id: string;
  name: string;
  priceMultiplier: number;
  stockFactor: number;
  description: string;
  summary?: string;
}

/**
 * === /api/login ===
 */
export interface LoginRequest {
  code: string;
}

export interface LoginResponse {
  token: string;
  clientId: string;
  clientName: string;
}

/**
 * === /api/logout ===
 */
export interface LogoutResponse {
  message: string;
}

/**
 * === /api/profile ===
 */
export interface ProfileResponse {
  clientId: string;
  clientName: string;
  priceMultiplier: number;
  stockFactor: number;
  description: string;
  summary: string;
}

/**
 * === /api/clients ===
 */
export interface ClientsResponse {
  clients: ClientProfile[];
}

/**
 * === Product Catalog ===
 */
export interface Product {
  id: string;
  code: string;
  name: string;
  color: string | null;
  price: number;
  retailPrice: number;
  stock: number;
  discount?: number; // derived from priceMultiplier
}

export interface ProductsResponse {
  products: Product[];
  clientName: string;
}

/**
 * === /api/health ===
 */
export interface HealthResponse {
  status: "ok" | "error";
  version: string;
  timestamp: string;
  uptime: string;
  region?: string;
  env?: "development" | "production" | "staging";
}

/**
 * === Admin / Meta Routes (optional future use) ===
 */
export interface AdminClientSummary {
  totalClients: number;
  activeSessions: number;
  totalProducts: number;
}

export interface AdminSummaryResponse {
  stats: AdminClientSummary;
  generatedAt: string;
}
export interface ApiErrorResponse {
  error: string;
  code?: number;
}
/**
 * === Utility: Generic API Response Wrapper ===
 * Use this for typed frontend fetch calls:
 * Example: ApiResponse<ProductsResponse>
 */
export type ApiResponse<T> = T | ApiErrorResponse;

