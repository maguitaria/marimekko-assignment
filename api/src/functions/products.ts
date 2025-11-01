import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { verifyToken, getClientProfile, computeForClient } from "../util";

/**
 * Azure Function HTTP trigger for retrieving client-specific product catalog.
 * 
 * @remarks
 * This function handles GET requests to /products endpoint. It authenticates the client
 * using JWT tokens from the Authorization header, retrieves the client's profile,
 * and returns a customized product catalog with client-specific pricing and stock levels.
 * 
 * Authentication flow:
 * 1. Extracts JWT token from Authorization header
 * 2. Verifies and decodes the token to get client ID
 * 3. Retrieves client profile with pricing/stock rules
 * 4. Computes personalized catalog based on client rules
 * 
 * @param req - HTTP request object containing headers and query parameters
 * @param ctx - Azure Functions invocation context for logging
 * @returns HTTP response with JSON product catalog or error message
 */
app.http("products", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "products",
  handler: async (req: HttpRequest, ctx: InvocationContext): Promise<HttpResponseInit> => {
    try {
      // Extract authorization token from request headers
      const authz = req.headers.get("authorization") || undefined;
      
      // Verify JWT token and extract client ID
      const { clientId } = verifyToken(authz);

      // Retrieve client profile containing pricing and stock rules
      const profile = getClientProfile(clientId);
      if (!profile) return { status: 401, body: "Unknown client" };

      // Generate client-specific product catalog
      const products = computeForClient(profile);
      return json({ products }, 200, cors());
    } catch (e: any) {
      // Log authentication/authorization errors
      ctx.warn(e?.message || e);
      return { status: 401, body: "Unauthorized" };
    }
  }
});

/**
 * Creates a standardized JSON HTTP response with proper headers.
 * 
 * @param data - The data object to serialize as JSON in the response body
 * @param status - HTTP status code for the response (defaults to 200)
 * @param headers - Additional headers to include in the response
 * @returns HttpResponseInit object with JSON body and merged headers
 * 
 * @remarks
 * This utility function ensures consistent JSON response formatting across
 * all endpoints. It automatically sets the Content-Type header to application/json
 * and merges any additional headers provided.
 */
function json(data: any, status = 200, headers: Record<string, string> = {}) {
  return { status, jsonBody: data, headers: { "Content-Type": "application/json", ...headers } };
}

/**
 * Generates CORS (Cross-Origin Resource Sharing) headers for HTTP responses.
 * 
 * @returns Object containing CORS headers for cross-origin requests
 * 
 * @remarks
 * This function creates the necessary CORS headers to allow cross-origin requests
 * from web browsers. The allowed origin is configurable via the CORS_ALLOW_ORIGIN
 * environment variable and defaults to "*" (all origins) if not specified.
 * 
 * Headers included:
 * - Access-Control-Allow-Origin: Controls which origins can access the resource
 * - Access-Control-Allow-Headers: Specifies allowed request headers (Content-Type, Authorization)
 */
function cors() {
  const origin = process.env.CORS_ALLOW_ORIGIN || "*";
  return { "Access-Control-Allow-Origin": origin, "Access-Control-Allow-Headers": "Content-Type, Authorization" };
}
