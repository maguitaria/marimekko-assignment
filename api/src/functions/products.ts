import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { cors, json } from "../util/http";
import { verifyToken } from "../util/auth";
import { getClientProfile } from "../util/clients";
import loadClientCatalog from "../util/catalog";


/**
 * Applies client-specific stock/pricing rules 
 * to the general base catalog.
 */
function getProductCatalog(profile: any, baseCatalog: any[]) {
  return baseCatalog.map((item) => {
    const override = profile.products[item["Product code"]] ?? {};

    return {
      name: item["Product Name"],
      code: item["Product code"],
      color: item["Color"] ?? null,
      price: override.price ?? item["Wholesale price"],
      stock: override.stock ?? item["Available stock"],
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
      // Validate JWT
      const auth = verifyToken(req);
      if (!auth) return { status: 401, body: "Unauthorized", headers: cors() };

      // Lookup client profile
      const profile = getClientProfile(auth.clientId);
      if (!profile) return { status: 404, body: "Client not found", headers: cors() };

      // Load shared base catalog
      const baseCatalog = loadClientCatalog(auth.clientId); // -> returns array of all core products

      // Apply client specific overrides
      const finalProducts = getProductCatalog(profile, baseCatalog);

      // Return to client
      return json({ products: finalProducts, clientName: profile.name });
    } catch (err: any) {
      ctx.error(err);
      return { status: 500, body: "Server error", headers: cors() };
    }
  },
});
