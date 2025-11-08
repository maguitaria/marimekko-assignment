/**
 * ==========================================
 *  Utility Functions for Product Catalog Management
 * ==========================================
 * 
 * This module provides utility functions for processing and transforming
 * product catalogs based on client-specific configurations and business rules.
 */

import { ClientProfile, CatalogItem } from "./types/types";

/**
 * Generates a customized product catalog for a specific client profile.
 * 
 * This function takes a base product catalog and applies client-specific
 * pricing and stock modifications based on the client's profile configuration.
 * 
 * @param profile - The client profile containing pricing and stock rules
 * @param baseCatalog - The base product catalog with default pricing and stock levels
 * @returns An array of products with client-specific pricing and stock adjustments
 * 
 * @example
 * ```typescript
 * const clientProfile = {
 *   pricing: { type: "multiplier", value: 0.8 },
 *   stock: { type: "cap", value: 100 }
 * };
 * const products = getProductCatalog(clientProfile, baseCatalog);
 * ```
 */
export function getProductCatalog(profile: ClientProfile, baseCatalog: CatalogItem[]) {
  // Transform each product in the base catalog according to client rules
  return baseCatalog.map((p) => {
    
    // ==========================================
    //  PRICING LOGIC
    // ==========================================
    // Apply client-specific pricing rules to determine final product price
    
    let price = p.basePrice; // Start with the base price
    
    // Multiplier pricing: Apply a percentage discount/markup to base price
    // Example: multiplier of 0.8 gives 20% discount, 1.2 gives 20% markup
    if (profile.pricing.type === "multiplier") {
      price = p.basePrice * profile.pricing.value;
    } 
    // Override pricing: Use custom price for specific products
    // Allows setting individual prices for specific product IDs
    else if (profile.pricing.type === "override" && profile.pricing.map[p.id] !== undefined) {
      price = profile.pricing.map[p.id];
    }

    // ==========================================
    //  STOCK LOGIC
    // ==========================================
    // Apply client-specific stock availability rules
    
    let stock = p.baseStock; // Start with the base stock level
    
    // Cap stock: Limit maximum available stock to a specific value
    // Useful for limiting large orders or managing inventory allocation
    if (profile.stock.type === "cap") {
      stock = Math.min(p.baseStock, profile.stock.value);
    } 
    // Override stock: Set custom stock levels for specific products
    // Allows fine-grained control over product availability per client
    else if (profile.stock.type === "override" && profile.stock.map[p.id] !== undefined) {
      stock = profile.stock.map[p.id];
    }

    // ==========================================
    //  PRODUCT CONSTRUCTION
    // ==========================================
    // Return the transformed product with client-specific adjustments
    return {
      id: p.id,           // Unique product identifier
      name: p.name,       // Product display name
      price,              // Client-specific price (after pricing rules)
      stock               // Client-specific stock level (after stock rules)
    };
  });
}
