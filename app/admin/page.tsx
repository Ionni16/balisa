"use client";
import { useEffect, useState } from "react";
import { useAdmin } from "./AdminContext";
import { Order, Product } from "@/lib/types";
import { formatPrice } from "@/lib/stripe";
import { StatusBadge } from "./StatusBadge";
import { Package, ShoppingBag, TrendingUp, Clock } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const { adminKey } = useAdmin();
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!adminKey) return;
    Promise.all([
      fetch("/api/orders", { headers: { "x-admin-key": adminKey } }).then((r) =>
        r.json()
      ),
      fetch("/api/products", { headers: { "x-admin-key": adminKey } }).then(
        (r) => r.json()
      ),
    ]).then(([ordersData, productsData]) => {
      setOrders(Array.isArray(ordersData) ? ordersData : []);
      setProducts(Array.isArray(productsData) ? productsData : []);
      setLoading(false);
    });
  }, [adminKey]);

  const totalRevenue = orders
    .filter(
      (o) =>
        o.status === "paid" ||
        o.status === "shipped" ||
        o.status === "delivered"
    )
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrders = orders.filter((o) => o.status === "paid").length;
  const lowStock = products.filter((p) => p.stock <= 2 && p.stock > 0).length;
  const outOfStock = products.filter((p) => p.stock === 0).length;

  const stats = [
    { label: "Fatturato", value: formatPrice(totalRevenue), icon: TrendingUp, color: "text-gold" },
    { label: "Orders", value: orders.length.toString(), icon: ShoppingBag, color: "text-rose" },
    { label: "Da spedire", value: pendingOrders.toString(), icon: Clock, color: "text-sage" },
    { label: "Products", value: products.length.toString(), icon: Package, color: "text-gold" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 lg:mb-10">
        <h1 className="font-serif text-3xl lg:text-4xl font-light">Dashboard</h1>
        <p className="font-sans text-xs text-white/35 mt-1">
          Welcome to the OKKA admin panel
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-8 lg:mb-10">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="bg-white/[0.04] border border-white/[0.08] p-4 lg:p-6"
          >
            <Icon
              size={18}
              strokeWidth={1.5}
              className={`${color} mb-3 lg:mb-4`}
            />
            <p className="font-serif text-2xl lg:text-3xl font-light">
              {value}
            </p>
            <p className="font-sans text-[10px] text-white/35 mt-1 uppercase tracking-wider">
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Alerts */}
      {(lowStock > 0 || outOfStock > 0) && (
        <div className="mb-6 lg:mb-8 space-y-2">
          {outOfStock > 0 && (
            <div className="bg-red-900/20 border border-red-500/20 px-4 py-3 flex items-center justify-between rounded-sm">
              <p className="font-sans text-xs text-red-300">
                {outOfStock}{" "}
                {outOfStock === 1 ? "prodotto esaurito" : "prodotti esauriti"}
              </p>
              <Link
                href="/admin/products"
                className="font-sans text-[10px] text-red-300 underline"
              >
                Gestisci
              </Link>
            </div>
          )}
          {lowStock > 0 && (
            <div className="bg-yellow-900/20 border border-yellow-500/20 px-4 py-3 flex items-center justify-between rounded-sm">
              <p className="font-sans text-xs text-yellow-300">
                {lowStock} {lowStock === 1 ? "prodotto" : "prodotti"} con
                stock basso
              </p>
              <Link
                href="/admin/products"
                className="font-sans text-[10px] text-yellow-300 underline"
              >
                Gestisci
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Recent orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl font-light">Ultimi ordini</h2>
          <Link
            href="/admin/orders"
            className="font-sans text-[10px] text-white/35 hover:text-white transition-colors uppercase tracking-wider"
          >
            Vedi tutti →
          </Link>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block border border-white/[0.08] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.08] bg-white/[0.03]">
                {["Cliente", "Totale", "Stato", "Data"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left font-sans text-[10px] tracking-[0.15em] uppercase text-white/25"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-4 py-3">
                    <p className="font-sans text-sm">{order.customer_name}</p>
                    <p className="font-sans text-[10px] text-white/25">
                      {order.customer_email}
                    </p>
                  </td>
                  <td className="px-4 py-3 font-sans text-sm text-gold">
                    {formatPrice(order.total)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-3 font-sans text-[11px] text-white/35">
                    {new Date(order.created_at).toLocaleDateString("it-IT")}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-10 text-center font-sans text-sm text-white/25"
                  >
                    Nessun ordine ancora
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-3">
          {orders.slice(0, 5).map((order) => (
            <div
              key={order.id}
              className="bg-white/[0.04] border border-white/[0.08] p-4"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-sans text-sm">{order.customer_name}</p>
                  <p className="font-sans text-[10px] text-white/25">
                    {order.customer_email}
                  </p>
                </div>
                <StatusBadge status={order.status} />
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.06]">
                <span className="font-sans text-sm text-gold font-medium">
                  {formatPrice(order.total)}
                </span>
                <span className="font-sans text-[10px] text-white/30">
                  {new Date(order.created_at).toLocaleDateString("it-IT")}
                </span>
              </div>
            </div>
          ))}
          {orders.length === 0 && (
            <p className="text-center font-sans text-sm text-white/25 py-10">
              Nessun ordine ancora
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
