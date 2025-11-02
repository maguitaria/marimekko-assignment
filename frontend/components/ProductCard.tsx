"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export function ProductCard({
  name,
  price,
  stock,
}: {
  name: string;
  price: number;
  stock: number;
}) {
  const isOutOfStock = stock === 0;

  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Card
        className={`relative overflow-hidden border-2 rounded-2xl transition-all duration-300
        ${isOutOfStock ? "border-red-200 bg-red-50" : "border-gray-100 hover:border-rose-400"}
      `}
      >
        <CardHeader>
          <CardTitle className="font-display text-lg font-semibold">
            {name}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-2">
          <p className="text-gray-700 text-sm">
            Price: <span className="font-semibold">€{price.toFixed(2)}</span>
          </p>

          {isOutOfStock ? (
            <Badge variant="destructive">Out of stock</Badge>
          ) : (
            <Badge className="bg-green-500 hover:bg-green-600 text-white">
              In stock: {stock}
            </Badge>
          )}
        </CardContent>

        {/* Decorative accent */}
        {!isOutOfStock && (
          <div className="absolute bottom-0 left-0 h-1 bg-rose-500 w-0 group-hover:w-full transition-all duration-500" />
        )}
      </Card>
    </motion.div>
  );
}
