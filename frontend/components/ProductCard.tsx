import React from "react";

interface ProductCardProps {
  name: string;
  price: number;
  stock: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ name, price, stock }) => {
  const outOfStock = stock === 0;

  return (
    <div
      className="border rounded-xl shadow-sm p-4 flex flex-col justify-between hover:shadow-lg transition"
      style={{
        backgroundColor: outOfStock ? "#fff5f5" : "white",
        opacity: outOfStock ? 0.8 : 1,
      }}
    >
      <h3 className="font-semibold text-lg mb-1">{name}</h3>

      <p className="text-gray-600 text-sm mb-2">
        Price: <span className="font-medium text-blue-600">€{price.toFixed(2)}</span>
      </p>

      <p
        className={`text-sm ${
          outOfStock ? "text-red-600 font-semibold" : "text-green-600"
        }`}
      >
        {outOfStock ? "Out of stock" : `Stock: ${stock}`}
      </p>
    </div>
  );
};
