"use client";
import { useEffect, useState } from "react";
import { useAdmin } from "../layout";
import { Order } from "@/lib/types";
import { formatPrice } from "@/lib/stripe";
import { StatusBadge } from "../page";
import toast from "react-hot-toast";
import { ChevronDown, ChevronUp, Search } from "lucide-react";

const STATUSES: Order["status"][] = ["pending", "paid", "shipped", "delivered", "cancelled"];
const STATUS_LABELS: Record<Order["status"], string> = {
  pending: "In attesa",
  paid: "Pagato",
  shipped: "Spedito",
  delivered: "Consegnato",
  cancelled: "Annullato",
};

export default function AdminOrders() {
  const { adminKey } = useAdmin();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("");

  const headers = { "x-admin-key": adminKey, "Content-Type": "application/json" };

  async function loadOrders() {
    const r = await fetch("/api/orders", { headers: { "x-admin-key": adminKey } });
    const data = await r.json();
    setOrders(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => { loadOrders(); }, [adminKey]);

  async function updateStatus(id: string, status: Order["status"]) {
    const res = await fetch("/api/orders", {
      method: "PATCH",
      headers,
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      toast.success("Stato aggiornato");
      loadOrders();
    } else {
      toast.error("Errore aggiornamento");
    }
  }

  const filtered = orders.filter((o) => {
    const matchSearch =
      !search ||
      o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filterStatus || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

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
        <h1 className="font-serif text-4xl font-light">Ordini</h1>
        <p className="font-sans text-sm text-white/40 mt-1">{orders.length} ordini totali</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cerca per nome o email..."
            className="w-full bg-white/5 border border-white/10 text-white pl-9 pr-4 py-2.5 font-sans text-sm focus:outline-none focus:border-gold placeholder:text-white/20 transition-colors"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-white/5 border border-white/10 text-white px-4 py-2.5 font-sans text-sm focus:outline-none focus:border-gold"
        >
          <option value="" className="bg-[#1a1a1a]">Tutti gli stati</option>
          {STATUSES.map((s) => (
            <option key={s} value={s} className="bg-[#1a1a1a]">
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>

      {/* Orders table */}
      <div className="border border-white/10 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-white/5 border-b border-white/10">
              {["Cliente", "Prodotti", "Totale", "Stato", "Data", ""].map((h) => (
                <th key={h} className="px-4 py-3 text-left font-sans text-xs tracking-widest uppercase text-white/30">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => (
              <>
                <tr
                  key={order.id}
                  className="border-b border-white/5 hover:bg-white/3 transition-colors cursor-pointer"
                  onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                >
                  <td className="px-4 py-4">
                    <p className="font-sans text-sm">{order.customer_name}</p>
                    <p className="font-sans text-xs text-white/30">{order.customer_email}</p>
                  </td>
                  <td className="px-4 py-4 font-sans text-xs text-white/50">
                    {(order.items as any[]).length} {(order.items as any[]).length === 1 ? "articolo" : "articoli"}
                  </td>
                  <td className="px-4 py-4 font-sans text-sm text-gold font-medium">
                    {formatPrice(order.total)}
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-4 font-sans text-xs text-white/40">
                    {new Date(order.created_at).toLocaleDateString("it-IT")}
                  </td>
                  <td className="px-4 py-4 text-white/30">
                    {expanded === order.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </td>
                </tr>

                {/* Expanded detail */}
                {expanded === order.id && (
                  <tr key={`${order.id}-expanded`} className="bg-white/3 border-b border-white/10">
                    <td colSpan={6} className="px-6 py-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Order items */}
                        <div>
                          <p className="font-sans text-xs tracking-widest uppercase text-white/30 mb-4">
                            Articoli ordinati
                          </p>
                          <div className="space-y-3">
                            {(order.items as any[]).map((item, i) => (
                              <div key={i} className="flex justify-between items-center">
                                <div>
                                  <p className="font-sans text-sm">{item.product_name}</p>
                                  <p className="font-sans text-xs text-white/30">
                                    {item.color} × {item.quantity}
                                  </p>
                                </div>
                                <span className="font-sans text-sm text-gold">
                                  {formatPrice(item.price * item.quantity)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Shipping info + status update */}
                        <div>
                          <p className="font-sans text-xs tracking-widest uppercase text-white/30 mb-4">
                            Spedizione
                          </p>
                          <div className="font-sans text-sm text-white/60 space-y-1 mb-6">
                            <p>{(order.customer_address as any).line1}</p>
                            <p>
                              {(order.customer_address as any).postal_code}{" "}
                              {(order.customer_address as any).city}
                            </p>
                            <p>{(order.customer_address as any).country}</p>
                          </div>

                          <p className="font-sans text-xs tracking-widest uppercase text-white/30 mb-3">
                            Aggiorna stato
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {STATUSES.map((s) => (
                              <button
                                key={s}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateStatus(order.id, s);
                                }}
                                className={`px-3 py-1.5 font-sans text-xs uppercase tracking-wider border transition-colors ${
                                  order.status === s
                                    ? "border-gold text-gold bg-gold/10"
                                    : "border-white/20 text-white/40 hover:border-white/50 hover:text-white"
                                }`}
                              >
                                {STATUS_LABELS[s]}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-16 text-center font-sans text-sm text-white/30">
                  Nessun ordine trovato
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
