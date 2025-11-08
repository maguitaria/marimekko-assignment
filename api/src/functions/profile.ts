/**
 * ==========================================
 * 👤 Client Profile API Endpoint
 * ==========================================
 * 
 * Provides detailed client profile information including
 * business rules, pricing configurations, and account status.
 * Used by frontend applications for user dashboard displays.
 */

import { app } from "@azure/functions";
import { cors, json } from "../util/http";
import { verifyToken } from "../util/auth";
import { getClientProfile } from "../util/clients";
import { ProfileResponse } from "../types/api";

/**
 * Client Profile Endpoint
 * 
 * GET /api/profile
 * 
 * Returns comprehensive client profile information including:
 * - Client identification and display name
 * - Pricing multipliers and business rules  
 * - Stock allocation factors
 * - Account descriptions and summaries
 * 
 * Authentication: Requires valid JWT token in Authorization header
 * 
 * Response Format:
 * {
 *   "clientId": "internal-client-id",
 *   "clientName": "Human Readable Name",
 *   "priceMultiplier": 0.85,
 *   "stockFactor": 1.0,
 *   "description": "Client configuration details",
 *   "summary": "Account status and tier information"
 * }
 * 
 * Use Cases:
 * - User dashboard displays
 * - Account information pages
 * - Business rule transparency
 * - Customer service interfaces
 */
app.http("profile", {
  route: "profile", 
  methods: ["GET", "OPTIONS"],
  authLevel: "anonymous", // Authentication handled via JWT token
  handler: async (req, ctx) => {
    // Handle CORS preflight requests
    if (req.method === "OPTIONS") return { status: 204, headers: cors() };

    try {
      // ==========================================
      //  AUTHENTICATION & AUTHORIZATION
      // ==========================================
      // Verify JWT token and extract client identity
      const auth = verifyToken(req);
      if (!auth) return json({ error: "Unauthorized" }, 401, cors());

      // ==========================================
      //  PROFILE LOADING
      // ==========================================
      // Load the complete client profile configuration
      const profile = getClientProfile(auth.clientId);
      if (!profile) return json({ error: "Profile not found" }, 404, cors());

      // ==========================================
      //  DISPLAY NAME RESOLUTION
      // ==========================================
      // Generate user-friendly display names for known clients
      // This provides consistent naming across the application
      let displayName: string;
      if (auth.clientId === "clientA") displayName = "Client A";
      else if (auth.clientId === "clientB") displayName = "Client B";
      else displayName = profile.name || "Unknown Client";

      // ==========================================
      //  RESPONSE CONSTRUCTION
      // ==========================================
      // Build a comprehensive profile response with all client information
      const response: ProfileResponse = {
        clientId: auth.clientId,                       // Internal client identifier
        
        // Client display name (consistent with login response)
        clientName:
          auth.clientId === "clientA"
            ? "Client A"
            : auth.clientId === "clientB"
            ? "Client B"
            : profile.name || "Unknown Client",
            
        priceMultiplier: profile.priceMultiplier ?? 1, // Pricing adjustment factor (default: no adjustment)
        stockFactor: profile.stockFactor ?? 1,         // Stock allocation factor (default: full access)
        
        // Profile description for account information displays
        description:
          profile.description ||
          "Client profile loaded successfully with applicable modifiers.",
          
        // Client tier and status summary for dashboard displays
        summary:
          auth.clientId === "clientA"
            ? "Premium wholesale partner with priority pricing."
            : auth.clientId === "clientB"
            ? "Standard wholesale partner."
            : "Registered wholesale client.",
      };

      return json(response, 200, cors());
    } catch (err: any) {
      // Log any unexpected errors for debugging
      ctx.error("Error in /api/profile:", err);
      return json({ error: "Server error" }, 500, cors());
    }
  },
});
