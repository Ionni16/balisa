"use client";

import { useState } from "react";
import { Product } from "@/lib/types";
import { useCartStore } from "@/lib/store";
import toast from "react-hot-toast";
import { Minus, Plus } from "lucide-react";

export default function ProductActions({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [color, setColor] = useState(product.colors?.[0] || "As shown");
  const addItem = useCartStore((state) => state.addItem);
  const soldOut = product.stock === 0;

  function add() {
    if (soldOut) return;

    // The cart store expects: addItem(product, color)
    // To support quantity, call it once per selected item.
    for (let i = 0; i < quantity; i += 1) {
      addItem(product, color);
    }

    toast.success(quantity > 1 ? `${quantity} items added to cart` : "Added to cart");
  }

  return (
    <div className="mt-8">
      {product.colors?.length > 0 && (
        <label className="block mb-5">
          <span className="block text-[13px] text-black/60 mb-2">Color</span>
          <select
            value={color}
            onChange={(event) => setColor(event.target.value)}
            className="input-field max-w-[260px]"
          >
            {product.colors.map((itemColor) => (
              <option key={itemColor} value={itemColor}>
                {itemColor}
              </option>
            ))}
          </select>
        </label>
      )}

      <div className="mb-7">
        <span className="block text-[13px] text-black/60 mb-2">Quantity</span>
        <div className="qty-box">
          <button
            type="button"
            onClick={() => setQuantity((current) => Math.max(1, current - 1))}
            aria-label="Decrease quantity"
          >
            <Minus size={14} />
          </button>
          <span>{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((current) => current + 1)}
            aria-label="Increase quantity"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={add}
        disabled={soldOut}
        className="btn-keylon w-full max-w-[430px] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {soldOut ? "Sold out" : "Add to cart"}
      </button>
    </div>
  );
}
