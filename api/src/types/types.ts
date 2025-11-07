export type CatalogItem = { id: string; name: string; basePrice: number; baseStock: number };
export type ClientPricing =
  | { type: "multiplier"; value: number }   // e.g. 0.9 => 10% discount
  | { type: "override"; map: Record<string, number> }; // per SKU absolute price
export type ClientStock =
  | { type: "cap"; value: number }          // max stock shown to client
  | { type: "override"; map: Record<string, number> }; // per SKU absolute stock

export type ClientProfile = {
  name: string;
  pricing: ClientPricing;
  stock: ClientStock;
};

export type ClientMap = {
  // client profiles
  [clientId: string]: ClientProfile | string;
};
