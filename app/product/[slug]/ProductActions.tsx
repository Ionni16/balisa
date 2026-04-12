"use client";
import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { Product } from "@/lib/types";
import toast from "react-hot-toast";

export default function ProductActions({ product }: { product: Product }) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || "");
  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    if (!selectedColor) {
      toast.error("Seleziona un colore");
      return;
    }
    addItem(product, selectedColor);
    toast.success(`${product.name} aggiunta al carrello`);
  };

  return (
    <div className="space-y-4">
      {/* Color selection */}
      {product.colors.length > 1 && (
        <div>
          <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-noir/35 mb-3">
            Colore — <span className="text-noir/70">{selectedColor}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`px-4 py-2.5 font-sans text-xs tracking-wider border transition-all ${
                  selectedColor === color
                    ? "bg-noir text-cream border-noir"
                    : "border-cream-dark text-noir/50 hover:border-noir"
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Add to cart */}
      <button
        onClick={handleAddToCart}
        disabled={product.stock === 0}
        className="btn-primary w-full flex items-center justify-center gap-3 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-noir disabled:hover:text-cream"
      >
        <ShoppingBag size={16} strokeWidth={1.5} />
        {product.stock === 0 ? "Esaurito" : "Aggiungi al carrello"}
      </button>

      {/* Custom order */}
      <a
        href="https://instagram.com/yourbalisa"
        target="_blank"
        rel="noopener noreferrer"
        className="btn-outline w-full flex items-center justify-center gap-2"
      >
        Custom order — scrivici
      </a>
    </div>
  );
}
