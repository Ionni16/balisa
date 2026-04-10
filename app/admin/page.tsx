"use client";
import { useEffect, useState } from "react";
import { useAdmin } from "./AdminContext";
import { Order, Product } from "@/lib/types";
import { formatPrice } from "@/lib/stripe";
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
      fetch("/api/orders", { headers: { "x-admin-key": adminKey } }).then((r) => r.json()),
      fetch("/api/products", { headers: { "x-admin-key": adminKey } }).then((r) => r.json()),
    ]).then(([ordersData, productsData]) => {
      setOrders(Array.isArray(ordersData) ? ordersData : []);
      setProducts(Array.isArray(productsData) ? productsData : []);
      setLoading(false);
    });
  }, [adminKey]);

  const totalRevenue = orders
    .filter((o) => o.status === "paid" || o.status === "shipped" || o.status === "delivered")
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrders = orders.filter((o) => o.status === "paid").length;
  const lowStock = products.filter((p) => p.stock <= 2 && p.stock > 0).length;
  const outOfStock = products.filter((p) => p.stock === 0).length;

  const stats = [
    {
      label: "Fatturato totale",
      value: formatPrice(totalRevenue),
      icon: TrendingUp,
      color: "text-gold",
    },
    {
      label: "Ordini totali",
      value: orders.length.toString(),
      icon: ShoppingBag,
      color: "text-blush",
    },
    {
      label: "Da spedire",
      value: pendingOrders.toString(),
      icon: Clock,
      color: "text-sage",
    },
    {
      label: "Prodotti",
      value: products.length.toString(),
      icon: Package,
      color: "text-gold-light",
    },
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
      <div className="mb-10">
        <h1 className="font-serif text-4xl font-light">Dashboard</h1>
        <p className="font-sans text-sm text-white/40 mt-1">
          Benvenuta nel pannello di controllo BALISA
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white/5 border border-white/10 p-6">
            <Icon size={20} strokeWidth={1.5} className={`${color} mb-4`} />
            <p className="font-serif text-3xl font-light">{value}</p>
            <p className="font-sans text-xs text-white/40 mt-1 uppercase tracking-wider">{label}</p>
          </div>
        ))}
      </div>

      {/* Alerts */}
      {(lowStock > 0 || outOfStock > 0) && (
        <div className="mb-8 space-y-2">
          {outOfStock > 0 && (
            <div className="bg-red-900/30 border border-red-500/30 px-4 py-3 flex items-center justify-between">
              <p className="font-sans text-sm text-red-300">
                ⚠️ {outOfStock} {outOfStock === 1 ? "prodotto esaurito" : "prodotti esauriti"}
              </p>
              <Link href="/admin/products" className="font-sans text-xs text-red-300 underline">
                Gestisci
              </Link>
            </div>
          )}
          {lowStock > 0 && (
            <div className="bg-yellow-900/30 border border-yellow-500/30 px-4 py-3 flex items-center justify-between">
              <p className="font-sans text-sm text-yellow-300">
                📦 {lowStock} {lowStock === 1 ? "prodotto" : "prodotti"} con stock basso (≤2)
              </p>
              <Link href="/admin/products" className="font-sans text-xs text-yellow-300 underline">
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
          <Link href="/admin/orders" className="font-sans text-xs text-white/40 hover:text-white transition-colors uppercase tracking-wider">
            Vedi tutti →
          </Link>
        </div>
        <div className="border border-white/10 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                {["Cliente", "Totale", "Stato", "Data"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-sans text-xs tracking-widest uppercase text-white/30">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-sans text-sm">{order.customer_name}</p>
                    <p className="font-sans text-xs text-white/30">{order.customer_email}</p>
                  </td>
                  <td className="px-4 py-3 font-sans text-sm text-gold">
                    {formatPrice(order.total)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-3 font-sans text-xs text-white/40">
                    {new Date(order.created_at).toLocaleDateString("it-IT")}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center font-sans text-sm text-white/30">
                    Nessun ordine ancora
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Order["status"] }) {
  const styles: Record<string, string> = {
    pending: "bg-white/10 text-white/50",
    paid: "bg-blue-900/50 text-blue-300",
    shipped: "bg-yellow-900/50 text-yellow-300",
    delivered: "bg-green-900/50 text-green-300",
    cancelled: "bg-red-900/50 text-red-300",
  };
  const labels: Record<string, string> = {
    pending: "In attesa",
    paid: "Pagato",
    shipped: "Spedito",
    delivered: "Consegnato",
    cancelled: "Annullato",
  };
  return (
    <span className={`font-sans text-xs px-2.5 py-1 uppercase tracking-wider ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}
