/**
 * ==========================================
 *  Authentication & Login API Endpoint
 * ==========================================
 * 
 * Handls client authentication using secure login codes and
 * issues JWT tokens for subsequent API access. This is the
 * primary authentication mechanism for wholesale clients. please refer to docs of JWT.
 */

import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import jwt from "jsonwebtoken";
import { resolveClientIdFromCode, getClientProfile } from "../util/clients";
import { cors, json } from "../util/http";

/**
 * Client Login Endpoint
 * 
 * POST /api/login
 * 
 * Authentication flow:
 * 1. Client provides a login code (unique per client)
 * 2. System validates the code and resolves to client ID
 * 3. Client profile is loaded with business rules
 * 4. JWT token is generated with 2-hour expiration
 * 5. Token and client info returned for session management
 * 
 * Request Body:
 * {
 *   "code": "client-specific-login-code"
 * }
 * 
 * Response:
 * {
 *   "token": "jwt-token-for-api-access",
 *   "clientId": "internal-client-identifier", 
 *   "clientName": "Human-readable client name"
 * }
 */
app.http("login", {
  methods: ["OPTIONS", "POST"],
  authLevel: "anonymous", // Public endpoint for authentication
  route: "login",
  handler: async (req: HttpRequest, ctx: InvocationContext): Promise<HttpResponseInit> => {
    // Handle CORS preflight requests for browser compatibility
    if (req.method === "OPTIONS") return { status: 204, headers: cors() };
    
    try {
      // Parse the login request body to extract the authentication code
      const { code } = (await req.json()) as { code?: string };

      // ==========================================
      // 1️⃣ INPUT VALIDATION
      // ==========================================
      // Ensure a login code was provided in the request
      if (!code)
        return { status: 400, body: "Missing code", headers: cors() };

      // ==========================================
      // 2️⃣ CLIENT RESOLUTION
      // ==========================================
      // Convert the provided login code to an internal client ID
      // This mapping is stored securely in environment variables
      const clientId = resolveClientIdFromCode(code);
      if (!clientId)
        return { status: 401, body: "Invalid code", headers: cors() };

      // ==========================================
      // 3️⃣ PROFILE LOADING & DISPLAY NAME SETUP
      // ==========================================
      // Load the complete client profile containing pricing and stock rules
      const profile = getClientProfile(clientId);
      console.log('profile: ', profile);
      
      // Set user-friendly display names for known clients
      // This provides better UX in the frontend application
      if (clientId === 'clientA') {
        console.log('clientA logged in');
        profile.displayName = "Client A";
      } else if (clientId === 'clientB') {
        console.log('clientB logged in');
        profile.displayName = "Client B";
      } else {
        console.log('Unknown client logged in');
        profile.displayName = "Unknown Client";
      }
      
      // Ensure the client profile was successfully loaded
      if (!profile)
        return { status: 500, body: "Client profile not found", headers: cors() };

      // ==========================================
      // 4️⃣ JWT SECRET VALIDATION
      // ==========================================
      // Verify that the JWT signing secret is properly configured
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        ctx.error("JWT_SECRET not configured in environment variables.");
        return { status: 500, body: "Server misconfiguration", headers: cors() };
      }

      // ==========================================
      // 5️⃣ TOKEN GENERATION
      // ==========================================
      // Create a signed JWT token with client identification and expiration
      const token = jwt.sign(
        { clientId },                    // Payload: client identifier
        secret,                          // Signing secret from environment
        {
          algorithm: "HS256",            // Use HMAC SHA256 for security
          expiresIn: "2h",              // Token expires in 2 hours
        }
      );

      // ==========================================
      // 6️⃣ SUCCESS RESPONSE
      // ==========================================
      // Return the authentication token and client information
      return json(
        {
          token,                         // JWT token for API authentication
          clientId,                      // Internal client identifier
          clientName: profile.displayName, // Human-readable client name
        },
        200,           // HTTP 200 OK
        cors()         // Include CORS headers
      );
    } catch (e: any) {
      // Log any unexpected errors and return a generic error response
      ctx.error("Login error:", e);
      return json({ error: "Server error" }, 500, cors());
    }
  }
});
