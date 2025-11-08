/**
 * ==========================================
 *  Clients List API Endpoint
 * ==========================================
 * 
 * Provides a list of all available wholesale clients and their
 * basic configuration information. Used for administrative
 * purposes and client management interfaces.
 */

import { app } from "@azure/functions";
import { cors, json } from "../util/http";
import fs from "fs";
import path from "path";
import { ClientsResponse } from "../types/api";

/**
 * Clients List Endpoint
 * 
 * GET /api/clients
 * 
 * Returns a list of all configured wholesale clients with their:
 * - Client ID and display name
 * - Price multiplier settings
 * - Stock factor configurations
 * - Client descriptions
 * 
 * This endpoint is publicly accessible and provides metadata
 * about available clients without exposing sensitive information
 * like login codes or detailed pricing rules.
 */
app.http("clients", {
  route: "clients",
  methods: ["GET", "OPTIONS"],
  authLevel: "anonymous", // Public endpoint for client discovery
  handler: async (req, ctx) => {
    // Handle CORS preflight requests
    if (req.method === "OPTIONS") return { status: 204, headers: cors() };

    try {
      // Locate the configuration directory containing client files
      const dir = path.join(__dirname, "../../config");

      // Discover all client configuration files (*.json)
      // Each JSON file represents a different wholesale client
      const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));

      // Transform each configuration file into client metadata
      const clients = files.map((file) => {
        // Extract client ID from filename (remove .json extension)
        const id = file.replace(".json", "");
        
        // Load and parse the client configuration data
        const data = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
        if (!data) throw new Error(`Invalid client config: ${file}`);
        
        // Generate user-friendly display name based on client ID
        // Provides readable names for known clients, falls back to config data
        let displayName: string;
        if (id === "clientA") displayName = "Client A";
        else if (id === "clientB") displayName = "Client B";
        else displayName = data.name || "Unknown Client";
        
        // Return standardized client information
        return {
          id,                                                    // Unique client identifier
          name: displayName,                                     // Human-readable client name
          priceMultiplier: data.priceMultiplier ?? 1,           // Pricing adjustment factor
          stockFactor: data.stockFactor ?? 1,                   // Stock availability factor
          description:                                          // Client description for UI
            data.description ||
            "Wholesale client configuration for product pricing and stock adjustments.",
        };
      });

      // Sort clients alphabetically by ID for consistent API responses
      clients.sort((a, b) => a.id.localeCompare(b.id));
      
      // Package the response according to the API schema
      const response: ClientsResponse = { clients };
      return json(response, 200, cors());
    } catch (err: any) {
      // Log the error for debugging and return a generic error response
      ctx.error("Failed to list clients:", err);
      return json({ error: "Server error" }, 500, cors());
    }
  },
});
