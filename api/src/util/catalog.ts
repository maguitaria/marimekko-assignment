/**
 * ==========================================
 *  Product Catalog Loading & Management
 * ==========================================
 * 
 * This module handles loading of client-specific product catalogs
 * from JSON configuration files. Each client may have access to
 * different product sets or variations.
 */

import fs from "fs";
import path from "path";

/**
 * Loads the product catalog configuration for a specific client.
 * 
 * The catalog contains raw product data that will be processed and
 * transformed according to the client's pricing and stock rules.
 * Different clients may have access to different product sets.
 * 
 * Catalog files are stored in the config/ directory and contain:
 * - Product codes and identifiers
 * - Base product names and descriptions
 * - Wholesale and retail pricing information
 * - Available stock quantities
 * - Product colors and variations
 * 
 * @param clientId - The unique identifier for the client
 * @returns The parsed catalog data containing raw product information
 * @throws {Error} If the catalog file doesn't exist for the specified client
 * 
 * @example
 * ```typescript
 * try {
 *   const catalog = loadClientCatalog("clientA");
 *   console.log(`Loaded ${catalog.length} products for client`);
 * } catch (error) {
 *   console.error("Failed to load catalog:", error.message);
 * }
 * ```
 */
export default function loadClientCatalog(clientId: string) {
  // Determine which catalog file to load based on client ID
  // Default to clientA.json if client ID doesn't match known clients
  const file = clientId === "clientB" ? "clientB.json" : "clientA.json";
  
  // Construct the full path to the catalog configuration file
  const fullPath = path.join(__dirname, "../../config", file);

  // Verify the catalog file exists before attempting to load it
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Catalog file missing: ${fullPath}`);
  }
  
  // Load and parse the JSON catalog data
  // This returns the raw catalog data that will be processed by other utilities
  return JSON.parse(fs.readFileSync(fullPath, "utf8"));
}

