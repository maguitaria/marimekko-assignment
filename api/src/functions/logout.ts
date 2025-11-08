/**
 * ==========================================
 *  Logout & Token Revocation API Endpoint
 * ==========================================
 * 
 * Handles user logout and JWT token revocation to ensure
 * secure session termination. Maintains a blacklist of
 * revoked tokens to prevent unauthorized access.
 */

import { app } from "@azure/functions";
import { cors, json } from "../util/http";
import { verifyToken } from "../util/auth";

/**
 * In-memory store for revoked JWT tokens.
 * 
 * NOTE: This is a simplified implementation for demonstration.
 * In production, consider using:
 * - Redis cache for distributed token blacklisting
 * - Database storage for persistent revocation
 * - Token expiration cleanup to prevent memory leaks
 */
const revokedTokens = new Set<string>(); // temporary in-memory store

/**
 * User Logout Endpoint
 * 
 * POST /api/logout
 * 
 * Logout flow:
 * 1. Extract JWT token from Authorization header
 * 2. Validate the token is legitimate and not expired
 * 3. Add token to revocation blacklist
 * 4. Log the logout event for audit purposes
 * 5. Return success confirmation
 * 
 * Headers Required:
 * Authorization: Bearer <jwt-token>
 * 
 * Response:
 * {
 *   "message": "Logout successful"
 * }
 * 
 * Security Notes:
 * - Revoked tokens cannot be used for future API calls
 * - Client should clear local token storage after logout
 * - Token remains revoked until server restart (in-memory limitation)
 */
app.http("logout", {
  route: "logout",
  methods: ["POST", "OPTIONS"],
  authLevel: "anonymous", // Public endpoint but requires valid token
  handler: async (req, ctx) => {
    // Handle CORS preflight requests
    if (req.method === "OPTIONS") return { status: 204, headers: cors() };

    // ==========================================
    //  TOKEN EXTRACTION
    // ==========================================
    // Extract the Bearer token from the Authorization header
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return json({ error: "Missing token" }, 400, cors());

    // ==========================================
    //  TOKEN VALIDATION
    // ==========================================
    // Verify the token is valid and not tampered with
    const auth = verifyToken(req);
    if (!auth) return json({ error: "Invalid token" }, 401, cors());

    // ==========================================
    // TOKEN REVOCATION
    // ==========================================
    // Add the token to the blacklist to prevent future use
    revokedTokens.add(token);
    
    // Log the logout event for security auditing
    ctx.log(`Token revoked for ${auth.clientId}`);

    // ==========================================
    //  SUCCESS RESPONSE
    // ==========================================
    return json({ message: "Logout successful" }, 200, cors());
  },
});

/**
 * Utility function to check if a JWT token has been revoked.
 * 
 * This function is used by other API endpoints to verify that
 * incoming tokens haven't been blacklisted through the logout process.
 * 
 * @param token - The JWT token string to check
 * @returns true if the token has been revoked, false otherwise
 * 
 * @example
 * ```typescript
 * if (isTokenRevoked(userToken)) {
 *   return json({ error: "Token has been revoked" }, 401, cors());
 * }
 * ```
 */
export function isTokenRevoked(token: string) {
  return revokedTokens.has(token);
}
