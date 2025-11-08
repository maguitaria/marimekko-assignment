/**
 * ==========================================
 *  Products Catalog API Endpoint
 * ==========================================
 * 
 * Provides client-specific product catalogs with customized
 * pricing and stock levels based on individual client profiles.
 * This is the core business logic for the wholesale system.
 */

import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { cors, json } from "../util/http";
import { verifyToken } from "../util/auth";
import { getClientProfile } from "../util/clients";
import loadClientCatalog from "../util/catalog";

import { ProductsResponse, Product, RawCatalogItem, ClientProfile } from "../types/api";

/**
 * Normalizes raw catalog data into a standardized Product structure.
 * 
 * Raw catalog data often comes from CSV files or databases with
 * inconsistent field naming and string-based numeric values.
 * This function standardizes the data format and converts
 * string numbers to proper numeric types.
 * 
 * @param raw - Raw catalog item with string-based fields
 * @returns Normalized Product object with consistent structure
 */
function normalizeProduct(raw: RawCatalogItem): Product {
  return {
    id: raw["Product code"],                           // Unique product identifier
    code: raw["Product code"],                         // Display product code
    name: raw["Product Name"],                         // Product display name
    color: raw["Color"] ?? null,                       // Product color (nullable)
    price: Number(raw["Wholesale price"]),             // Base wholesale price (numeric)
    retailPrice: Number(raw["Retail price"]),          // Suggested retail price
    stock: Number(raw["Available stock"]),             // Available inventory count
  };
}

/**
 * Applies client-specific business rules to generate a customized product catalog.
 * 
 * This function transforms the base product catalog according to the client's
 * profile configuration, including pricing multipliers and stock adjustments.
 * Different clients may see different prices and stock levels for the same products.
 * 
 * Business Rules Applied:
 * - Price multipliers (discounts/markups based on client tier)
 * - Stock factors (inventory allocation based on client relationship)
 * - Rounding and precision handling for monetary values
 * 
 * @param profile - Client profile containing pricing and stock rules
 * @param baseCatalog - Raw product data from the catalog source
 * @returns Array of products customized for the specific client
 */
function getProductCatalog(profile: ClientProfile, baseCatalog: RawCatalogItem[]): Product[] {
  // Extract client-specific business rules with defaults
  const multiplier = profile.priceMultiplier ?? 1;    // Default: no price adjustment
  const stockFactor = profile.stockFactor ?? 1;       // Default: full stock access

  // Transform each product according to client rules
  return baseCatalog.map((raw) => {
    // First normalize the raw data to a consistent structure
    const product = normalizeProduct(raw);
    
    // Then apply client-specific transformations
    return {
      ...product,
      // Apply price multiplier and round to 2 decimal places for currency
      price: Number((product.price * multiplier).toFixed(2)),
      
      // Apply stock factor and round to whole numbers (can't sell partial items)
      stock: Math.round(product.stock * stockFactor),
    };
  });
}

/**
 * Products Catalog Endpoint
 * 
 * GET /api/products
 * 
 * Returns a client-specific product catalog with customized pricing
 * and stock levels based on the authenticated client's profile.
 * 
 * Authentication: Requires valid JWT token in Authorization header
 * 
 * Process Flow:
 * 1. Validate JWT token and extract client identity
 * 2. Load client profile with business rules
 * 3. Load base product catalog data
 * 4. Apply client-specific transformations (pricing, stock)
 * 5. Return customized product list
 * 
 * Response Format:
 * {
 *   "products": [
 *     {
 *       "id": "product-code",
 *       "name": "Product Name",
 *       "price": 99.99,
 *       "stock": 50,
 *       // ... other product fields
 *     }
 *   ],
 *   "clientName": "Client Display Name"
 * }
 */
app.http("products", {
  route: "products",
  methods: ["GET", "OPTIONS"],
  authLevel: "anonymous", // Authentication handled via JWT token
  handler: async (req: HttpRequest, ctx: InvocationContext): Promise<HttpResponseInit> => {
    // Handle CORS preflight requests
    if (req.method === "OPTIONS") return { status: 204, headers: cors() };

    try {
      // ==========================================
      //  AUTHENTICATION & AUTHORIZATION
      // ==========================================
      // Verify the JWT token and extract client identification
      const auth = verifyToken(req);
      if (!auth) return json({ error: "Unauthorized" }, 401, cors());

      // ==========================================
      // 2 CLIENT PROFILE LOADING
      // ==========================================
      // Load the client's business profile containing pricing and stock rules
      const profile = getClientProfile(auth.clientId);
      if (!profile) return json({ error: "Client not found" }, 404, cors());

      // ==========================================
      //  BASE CATALOG LOADING
      // ==========================================
      // Load the raw product catalog data for this client
      // Different clients may have access to different product sets
      const baseCatalog: RawCatalogItem[] = loadClientCatalog(auth.clientId);

      // ==========================================
      // CATALOG CUSTOMIZATION
      // ==========================================
      // Apply client-specific pricing and stock adjustments to create
      // a personalized product catalog
      const products = getProductCatalog(profile, baseCatalog);

      // ==========================================
      //  RESPONSE FORMATTING
      // ==========================================
      // Package the customized products with client information
      const response: ProductsResponse = {
        products,                    // Customized product array
        clientName: profile.name,    // Client display name for UI
      };

      return json(response, 200, cors());
    } catch (err) {
      // Log any unexpected errors and return generic error response
      ctx.error(err);
      return { status: 500, body: "Server error", headers: cors() };
    }
  },
});
