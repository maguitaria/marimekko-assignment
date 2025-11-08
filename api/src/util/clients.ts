/**
 * ==========================================
 *  Client Profile & Configuration Management
 * ==========================================
 * 
 * This module handles client profile loading and authentication code
 * resolution for the wholesale system. Each client has their own
 * configuration file with custom pricing and stock rules.
 */

import fs from "fs";
import path from "path";

/**
 * Loads and returns the complete client profile configuration.
 * 
 * Client profiles contain:
 * - Display name and identification information
 * - Pricing rules (multipliers, overrides, discounts)
 * - Stock availability rules and restrictions
 * - Business-specific configurations
 * 
 * Profiles are stored as JSON files in the config/ directory,
 * following the naming pattern: clientA.json, clientB.json, etc.
 * 
 * @param clientId - The unique identifier for the client (e.g., "clientA", "clientB")
 * @returns The parsed client profile object, or null if not found
 * 
 * @example
 * ```typescript
 * const profile = getClientProfile("clientA");
 * if (profile) {
 *   console.log(`Client: ${profile.name}`);
 *   console.log(`Price multiplier: ${profile.priceMultiplier}`);
 * }
 * ```
 */
export function getClientProfile(clientId: string) {
  // Construct the path to the client's configuration file
  const filePath = path.join(__dirname, `../../config/${clientId}.json`);

  // Check if the configuration file exists
  if (!fs.existsSync(filePath)) {
    console.error("Client config not found:", filePath);
    return null; // Client configuration doesn't exist
  }

  // Load and parse the JSON configuration file
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

/**
 * Resolves a login code to a client ID for authentication.
 * 
 * This function provides a secure mapping between client login codes
 * (used by clients to authenticate) and internal client IDs (used by
 * the system for configuration lookup). The codes are stored as
 * environment variables for security.
 * 
 * Security considerations:
 * - Login codes should be complex and unique per client
 * - Codes are stored in environment variables, not in code
 * - Failed lookups return null to prevent enumeration attacks
 * 
 * @param code - The login code provided by the client
 * @returns The corresponding client ID if valid, null if invalid
 * 
 * @example
 * ```typescript
 * const clientId = resolveClientIdFromCode("ABC123XYZ");
 * if (clientId) {
 *   // Valid login code, proceed with authentication
 *   const profile = getClientProfile(clientId);
 * }
 * ```
 */
export function resolveClientIdFromCode(code: string): string | null {
  // Create a secure mapping of login codes to client IDs
  // Codes are retrieved from environment variables for security
  const map: Record<string, string> = {
    [process.env.CLIENT_A_CODE || ""]: "clientA",  // Client A's login code
    [process.env.CLIENT_B_CODE || ""]: "clientB",  // Client B's login code
    // Additional clients can be added here as needed
  };

  // Look up the client ID for the provided code
  // Returns null if code is not found (invalid login attempt)
  return map[code] || null;
}
