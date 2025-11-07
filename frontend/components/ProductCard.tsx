"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export function ProductCard({
  name,
  code,
  color,
  price,
  retailPrice,
  stock,
}: {
  name: string;
  code: string;
  color?: string | null;
  price: number;
  retailPrice: number;
  stock: number;
}) {
  const isOutOfStock = stock <= 0;
  const discount =
    retailPrice && price
      ? Math.round(((retailPrice - price) / retailPrice) * 100)
      : 0;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group"
    >
      <Card
        className={`relative overflow-hidden border-2 rounded-2xl shadow-sm transition-all duration-300
        ${
          isOutOfStock
            ? "border-red-200 bg-red-50"
            : "border-gray-100 hover:border-rose-400 hover:shadow-md"
        }`}
      >
        <CardHeader className="flex flex-col items-start gap-1">
          <CardTitle className="font-display text-lg font-semibold text-gray-800">
            {name}
          </CardTitle>
          <p className="text-sm text-gray-500">Code: {code}</p>
          {color && (
            <Badge
              variant="secondary"
              className="bg-gray-100 text-gray-700 mt-1"
            >
              Color: {color}
            </Badge>
          )}
        </CardHeader>

        <CardContent className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Wholesale:</span>
            <span className="font-semibold text-gray-800">
              €{price.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Retail:</span>
            <span className="font-semibold text-gray-800">
              €{retailPrice.toFixed(2)}
            </span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Discount:</span>
              <Badge
                variant="outline"
                className="text-rose-600 border-rose-300 bg-rose-50"
              >
                {discount}% off
              </Badge>
            </div>
          )}

          {isOutOfStock ? (
            <Badge
              variant="destructive"
              className="mt-2 px-3 py-1 rounded-md text-sm"
            >
              Out of stock
            </Badge>
          ) : (
            <Badge
              className="mt-2 px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-md"
            >
              In stock: {stock}
            </Badge>
          )}
        </CardContent>

        {/* Decorative accent line */}
        {!isOutOfStock && (
          <div className="absolute bottom-0 left-0 h-1 bg-rose-500 w-0 group-hover:w-full transition-all duration-500" />
        )}
      </Card>
    </motion.div>
  );
}
