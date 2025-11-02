type ClientProfile = {
  name: string;
  pricing: { type: "multiplier"; value: number };
  stock: { type: "cap"; value: number };
};

const clients = JSON.parse(process.env.CLIENT_MAP_JSON || "{}");
const baseCatalog = JSON.parse(process.env.BASE_CATALOG_JSON || "[]");


export function getProductCatalog(profile: ClientProfile) {
  return baseCatalog.map((p: any) => ({
    ...p,
    price: p.basePrice * profile.pricing.value,
    stock: Math.min(p.baseStock, profile.stock.value)
  }));
}
