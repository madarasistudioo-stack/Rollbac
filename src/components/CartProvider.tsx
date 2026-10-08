"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { track } from "@/components/Tracker";

export type CartItem = {
  slug: string;
  name: string;
  kind: string;
  price: number;
  color: string;
  size?: string;
  pageCount?: string;
  photos?: string[];
  // Page-by-page placement from the book editor: which photo goes in which box.
  pages?: { page: number; slot: number; url: string }[];
  captions?: { page: number; text: string }[];
  personalisation?: string;
  quantity: number;
};

// Two bag lines are the same item only if every chosen option matches —
// a Small and a Large of the same photobook are separate lines with separate prices.
export function lineKey(item: CartItem): string {
  return [item.slug, item.color, item.size, item.pageCount, item.personalisation, (item.photos ?? []).join(",")].join("|");
}

type CartContextValue = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clear: () => void;
  subtotal: number;
  count: number;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "rollbac-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore malformed storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = (item: CartItem) => {
    track("add_to_cart", `/product/${item.slug}`, item.name);
    setItems((prev) => {
      const key = lineKey(item);
      if (prev.some((i) => lineKey(i) === key)) {
        return prev.map((i) => (lineKey(i) === key ? { ...i, quantity: i.quantity + item.quantity } : i));
      }
      return [...prev, item];
    });
  };

  const removeItem = (key: string) => {
    setItems((prev) => prev.filter((i) => lineKey(i) !== key));
  };

  const updateQuantity = (key: string, quantity: number) => {
    setItems((prev) => prev.map((i) => (lineKey(i) === key ? { ...i, quantity: Math.max(1, quantity) } : i)));
  };

  const clear = () => setItems([]);

  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.price * i.quantity, 0), [items]);
  const count = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clear, subtotal, count }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
