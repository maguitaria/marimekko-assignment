/**
 * === Common Base Types ===
 */

// Represents a wholesale client configuration file (e.g., config/clientA.json)
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
export interface LogoutRequest {
  // Only header Authorization: Bearer <token> required
}

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
 * === /api/products ===
 */
export interface Product {
  id: string;
  code: string;
  name: string;
  color: string | null;
  price: number;
  retailPrice: number;
  stock: number;
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
}
/** Represents one raw catalog row from CSV or JSON */
export interface RawCatalogItem {
  "Product code": string;
  "Product Name": string;
  "Color"?: string | null;
  "Wholesale price": string | number;
  "Retail price": string | number;
  "Available stock": string | number;
}

