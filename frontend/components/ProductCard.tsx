export function ProductCard({ name, price, stock }: { name: string; price: number; stock: number }) {
  return (
    <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 16 }}>
      <div style={{ fontWeight: 600 }}>{name}</div>
      <div style={{ marginTop: 6 }}>Price: €{price.toFixed(2)}</div>
      <div style={{ marginTop: 6, color: stock > 0 ? "green" : "crimson" }}>
        Stock: {stock > 0 ? stock : "Out of stock"}
      </div>
    </div>
  );
}
