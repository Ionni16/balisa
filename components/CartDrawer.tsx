"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, ArrowRight } from "lucide-react";
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
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-[420px] bg-cream flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 lg:px-6 py-5 border-b border-cream-dark">
              <div>
                <h2 className="font-serif text-xl font-light">
                  Il tuo carrello
                </h2>
                {items.length > 0 && (
                  <p className="font-sans text-[10px] tracking-wider uppercase text-noir/40 mt-0.5">
                    {items.reduce((s, i) => s + i.quantity, 0)} articoli
                  </p>
                )}
              </div>
              <button
                onClick={closeCart}
                className="p-2 -mr-2 hover:opacity-60 transition-opacity"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 lg:px-6 py-5">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-4">
                  <div className="w-16 h-16 border border-cream-dark rounded-full flex items-center justify-center">
                    <span className="text-2xl">🛍️</span>
                  </div>
                  <p className="font-serif text-xl text-noir/40 font-light">
                    Il carrello è vuoto
                  </p>
                  <p className="font-sans text-xs text-noir/30">
                    Add something special
                  </p>
                  <button onClick={closeCart} className="btn-outline mt-2 text-xs px-6 py-2.5">
                    Continue shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  {items.map((item, i) => (
                    <motion.div
                      key={`${item.product.id}-${item.color}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex gap-4"
                    >
                      {/* Image */}
                      <div className="relative w-20 h-24 lg:w-24 lg:h-28 bg-cream-dark flex-shrink-0 overflow-hidden">
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
                      <div className="flex-1 flex flex-col justify-between py-0.5">
                        <div>
                          <h3 className="font-serif text-sm lg:text-base font-light leading-tight">
                            {item.product.name}
                          </h3>
                          <p className="font-sans text-[10px] text-noir/40 uppercase tracking-wider mt-0.5">
                            {item.color}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center border border-cream-dark">
                            <button
                              onClick={() =>
                                updateQuantity(item.product.id, item.color, item.quantity - 1)
                              }
                              className="p-1.5 hover:bg-cream-dark transition-colors"
                            >
                              <Minus size={11} />
                            </button>
                            <span className="font-sans text-xs w-7 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.product.id, item.color, item.quantity + 1)
                              }
                              className="p-1.5 hover:bg-cream-dark transition-colors"
                            >
                              <Plus size={11} />
                            </button>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <span className="font-sans text-sm font-medium">
                              {formatPrice(item.product.price * item.quantity)}
                            </span>
                            <button
                              onClick={() => removeItem(item.product.id, item.color)}
                              className="text-noir/25 hover:text-red-400 transition-colors p-1"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-5 lg:px-6 py-5 border-t border-cream-dark space-y-4 bg-cream">
                <div className="flex justify-between items-baseline">
                  <span className="font-sans text-xs text-noir/50 uppercase tracking-wider">
                    Subtotale
                  </span>
                  <span className="font-serif text-2xl font-light">
                    {formatPrice(cartTotal)}
                  </span>
                </div>
                <p className="font-sans text-[10px] text-noir/35 text-center">
                  Spedizione calcolata al checkout
                </p>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="btn-primary w-full text-center flex items-center justify-center gap-2"
                >
                  Purchase <ArrowRight size={13} />
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
