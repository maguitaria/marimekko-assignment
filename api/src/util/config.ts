/**
 * ==========================================
 *  Configuration Management Utilities
 * ==========================================
 * 
 * This module provides utilities for reading and managing configuration
 * files, particularly client-specific catalog configurations.
 * It serves as a backup/alternative to the main catalog loading system.
 */

import fs from "fs";
import path from "path";

/**
 * Reads and parses a client-specific catalog configuration file.
 * 
 * This function provides a safe way to load client catalog data
 * with built-in error handling. If the configuration file doesn't
 * exist, it returns an empty array instead of throwing an error.
 * 
 * This is typically used as a fallback or alternative method for
 * loading client catalogs when more robust error handling is needed.
 * 
 * @param clientId - The unique identifier for the client (e.g., "clientA", "clientB")
 * @returns Array of catalog items if file exists and is valid, empty array otherwise
 * 
 * @example
 * ```typescript
 * const catalog = readClientCatalog("clientA");
 * if (catalog.length > 0) {
 *   console.log(`Found ${catalog.length} products for client`);
 * } else {
 *   console.log("No catalog found or catalog is empty");
 * }
 * ```
 */
export function readClientCatalog(clientId: string) {
  // Construct the path to the client's configuration file
  const p = path.join(__dirname, `../../config/${clientId}.json`);
  
  // Check if the configuration file exists
  // Return empty array if file doesn't exist (graceful fallback)
  if (!fs.existsSync(p)) return [];
  
  // Parse and return the JSON configuration data
  // Note: This may throw if the JSON is malformed - consider adding try/catch for production
  return JSON.parse(fs.readFileSync(p, "utf8"));
}
