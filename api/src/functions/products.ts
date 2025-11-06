import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { cors, json } from "../util/http";
import { verifyToken } from "../util/auth";
import { getClientProfile } from "../util/clients";
import loadClientCatalog from "../util/catalog";


/**
 * Applies client-specific stock/pricing rules 
 * to the general base catalog.
 */
/**
 * Applies client-specific rules (computed, not from overrides)
 * to the shared base catalog.
 */
function getProductCatalog(profile: any, baseCatalog: any[]) {
  const multiplier = profile.priceMultiplier ?? 1;
  const stockFactor = profile.stockFactor ?? 1;

  return baseCatalog.map((item) => {
    const basePrice = parseFloat(item["Wholesale price"]);
    const adjustedPrice = Number((basePrice * multiplier).toFixed(2));
    const adjustedStock = Math.round(item["Available stock"] * stockFactor);

    return {
      name: item["Product Name"],
      code: item["Product code"],
      color: item["Color"] ?? null,
      price: adjustedPrice,
      stock: adjustedStock,
    };
  });
}

app.http("products", {
  route: "products",
  methods: ["GET", "OPTIONS"],
  authLevel: "anonymous",
  handler: async (req: HttpRequest, ctx: InvocationContext): Promise<HttpResponseInit> => {
    // CORS preflight
    if (req.method === "OPTIONS") return { status: 204, headers: cors() };

    try {
     // 2️⃣ Verify token
      const auth = verifyToken(req);
      if (!auth) return { status: 401, body: "Unauthorized", headers: cors() };

      // 3️⃣ Load client data
      const profile = getClientProfile(auth.clientId);
      if (!profile) return { status: 404, body: "Client not found", headers: cors() };

      const baseCatalog = loadClientCatalog(auth.clientId);
      const finalProducts = getProductCatalog(profile, baseCatalog);

      // 4️⃣ Return with CORS headers
      return json({ products: finalProducts, clientName: profile.name }, 200, cors());
    } catch (err: any) {
      ctx.error(err);
      return { status: 500, body: "Server error", headers: cors() };
    }
  },
});
