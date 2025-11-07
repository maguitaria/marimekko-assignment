import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { cors, json } from "../util/http";
import { verifyToken } from "../util/auth";
import { getClientProfile } from "../util/clients";
import loadClientCatalog from "../util/catalog";

import { ProductsResponse, Product, RawCatalogItem, ClientProfile } from "../types/api";

/**
 * Normalize raw catalog item (string fields → numbers, consistent structure)
 */
function normalizeProduct(raw: RawCatalogItem): Product {
  return {
    id: raw["Product code"],
    code: raw["Product code"],
    name: raw["Product Name"],
    color: raw["Color"] ?? null,
    price: Number(raw["Wholesale price"]),
    retailPrice: Number(raw["Retail price"]),
    stock: Number(raw["Available stock"]),
  };
}

/**
 * Apply client-specific price & stock rules to normalized products
 */
function getProductCatalog(profile: ClientProfile, baseCatalog: RawCatalogItem[]): Product[] {
  const multiplier = profile.priceMultiplier ?? 1;
  const stockFactor = profile.stockFactor ?? 1;

  return baseCatalog.map((raw) => {
    const product = normalizeProduct(raw);
    return {
      ...product,
      price: Number((product.price * multiplier).toFixed(2)),
      stock: Math.round(product.stock * stockFactor),
    };
  });
}

app.http("products", {
  route: "products",
  methods: ["GET", "OPTIONS"],
  authLevel: "anonymous",
  handler: async (req: HttpRequest, ctx: InvocationContext): Promise<HttpResponseInit> => {
    if (req.method === "OPTIONS") return { status: 204, headers: cors() };

    try {
      const auth = verifyToken(req);
      if (!auth) return json({ error: "Unauthorized" }, 401, cors());

      const profile = getClientProfile(auth.clientId);
      if (!profile) return json({ error: "Client not found" }, 404, cors());

      // Load base catalog for this client (raw)
      const baseCatalog: RawCatalogItem[] = loadClientCatalog(auth.clientId);

      // Apply price & stock adjustments
      const products = getProductCatalog(profile, baseCatalog);

      const response: ProductsResponse = {
        products,
        clientName: profile.name,
      };

      return json(response, 200, cors());
    } catch (err) {
      ctx.error(err);
      return { status: 500, body: "Server error", headers: cors() };
    }
  },
});
