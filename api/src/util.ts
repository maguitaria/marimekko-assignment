import { ClientProfile, CatalogItem } from "./types";


export function getProductCatalog(profile: ClientProfile, baseCatalog: CatalogItem[]) {
  return baseCatalog.map((p) => {
    // --- Pricing Logic ---
    let price = p.basePrice;
    if (profile.pricing.type === "multiplier") {
      price = p.basePrice * profile.pricing.value;
    } else if (profile.pricing.type === "override" && profile.pricing.map[p.id] !== undefined) {
      price = profile.pricing.map[p.id];
    }

    // --- Stock Logic ---
    let stock = p.baseStock;
    if (profile.stock.type === "cap") {
      stock = Math.min(p.baseStock, profile.stock.value);
    } else if (profile.stock.type === "override" && profile.stock.map[p.id] !== undefined) {
      stock = profile.stock.map[p.id];
    }

    return {
      id: p.id,
      name: p.name,
      price,
      stock
    };
  });
}
