"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Product } from "./types";

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: Product, color: string) => void;
  removeItem: (productId: string, color: string) => void;
  updateQuantity: (productId: string, color: string, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      addItem: (product, color) => {
        const existing = get().items.find(
          (i) => i.product.id === product.id && i.color === color
        );
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.product.id === product.id && i.color === color
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          });
        } else {
          set({ items: [...get().items, { product, quantity: 1, color }] });
        }
        set({ isOpen: true });
      },
      removeItem: (productId, color) => {
        set({
          items: get().items.filter(
            (i) => !(i.product.id === productId && i.color === color)
          ),
        });
      },
      updateQuantity: (productId, color, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, color);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.product.id === productId && i.color === color
              ? { ...i, quantity }
              : i
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      total: () =>
        get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
      itemCount: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: "balisa-cart" }
  )
);
