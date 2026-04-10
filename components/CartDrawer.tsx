"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/stripe";
import Image from "next/image";
import Link from "next/link";

export default function CartDrawer() {
  const { isOpen, closeCart, items, updateQuantity, removeItem, total } = useCartStore();
  const cartTotal = total();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-noir/40 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-cream flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-6 border-b border-cream-dark">
              <h2 className="font-serif text-xl font-light tracking-wider">
                Il tuo carrello
              </h2>
              <button onClick={closeCart} className="p-1 hover:opacity-60 transition-opacity">
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <span className="text-4xl">🛍️</span>
                  <p className="font-serif text-xl text-noir/50 font-light">
                    Il tuo carrello è vuoto
                  </p>
                  <button
                    onClick={closeCart}
                    className="btn-outline mt-4"
                  >
                    Continua a fare shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={`${item.product.id}-${item.color}`} className="flex gap-4">
                    {/* Image */}
                    <div className="relative w-24 h-32 bg-cream-dark flex-shrink-0 overflow-hidden">
                      {item.product.images[0] && (
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-serif text-base font-light">
                          {item.product.name}
                        </h3>
                        <p className="font-sans text-xs text-noir/50 mt-0.5">
                          {item.color}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 border border-cream-dark">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.color, item.quantity - 1)}
                            className="p-1.5 hover:bg-cream-dark transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="font-sans text-sm w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.color, item.quantity + 1)}
                            className="p-1.5 hover:bg-cream-dark transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-sans text-sm font-medium">
                            {formatPrice(item.product.price * item.quantity)}
                          </span>
                          <button
                            onClick={() => removeItem(item.product.id, item.color)}
                            className="text-noir/30 hover:text-noir transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-6 border-t border-cream-dark space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-sans text-sm text-noir/60">Totale</span>
                  <span className="font-serif text-2xl font-light">
                    {formatPrice(cartTotal)}
                  </span>
                </div>
                <p className="font-sans text-xs text-noir/40 text-center">
                  Spedizione calcolata al checkout
                </p>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="btn-primary w-full text-center block"
                >
                  Procedi al checkout
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
