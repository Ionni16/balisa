"use client";
import { useState, useEffect, createContext, useContext } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingBag, LogOut, Eye } from "lucide-react";

// Simple admin auth context using localStorage
const AdminContext = createContext<{
  adminKey: string;
  setAdminKey: (k: string) => void;
  logout: () => void;
}>({ adminKey: "", setAdminKey: () => {}, logout: () => {} });

export function useAdmin() {
  return useContext(AdminContext);
}

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Prodotti", icon: Package },
  { href: "/admin/orders", label: "Ordini", icon: ShoppingBag },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [adminKey, setAdminKeyState] = useState("");
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    const stored = localStorage.getItem("balisa_admin_key");
    if (stored) setAdminKeyState(stored);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // Quick check: try to fetch orders with this key
    const res = await fetch("/api/orders", {
      headers: { "x-admin-key": input },
    });
    if (res.ok) {
      localStorage.setItem("balisa_admin_key", input);
      setAdminKeyState(input);
      setError("");
    } else {
      setError("Chiave admin non valida");
    }
  };

  const logout = () => {
    localStorage.removeItem("balisa_admin_key");
    setAdminKeyState("");
  };

  // Login screen
  if (!adminKey) {
    return (
      <div className="min-h-screen bg-noir flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <h1 className="font-serif text-4xl font-light text-cream mb-2 text-center">
            Balisa
          </h1>
          <p className="font-sans text-xs tracking-widest uppercase text-cream/30 text-center mb-10">
            Admin Panel
          </p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="font-sans text-xs tracking-wider uppercase text-cream/40 block mb-2">
                Chiave Admin
              </label>
              <input
                type="password"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full bg-white/10 border border-white/20 text-cream px-4 py-3 font-sans text-sm focus:outline-none focus:border-gold placeholder:text-white/20"
                placeholder="••••••••"
                autoFocus
              />
            </div>
            {error && (
              <p className="font-sans text-xs text-red-400">{error}</p>
            )}
            <button type="submit" className="w-full bg-gold text-noir py-3 font-sans text-sm tracking-widest uppercase hover:bg-gold/90 transition-colors">
              Accedi
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <AdminContext.Provider value={{ adminKey, setAdminKey: setAdminKeyState, logout }}>
      <div className="min-h-screen bg-[#111] flex">
        {/* Sidebar */}
        <aside className="w-64 bg-noir border-r border-white/10 flex flex-col fixed h-full">
          <div className="p-6 border-b border-white/10">
            <h1 className="font-serif text-2xl font-light text-cream tracking-widest">
              BALISA
            </h1>
            <p className="font-sans text-xs text-cream/30 mt-0.5">Admin Panel</p>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {NAV.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-3 font-sans text-sm transition-all rounded-sm ${
                  pathname === href
                    ? "bg-gold/20 text-gold"
                    : "text-cream/50 hover:text-cream hover:bg-white/5"
                }`}
              >
                <Icon size={16} strokeWidth={1.5} />
                {label}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-white/10 space-y-1">
            <a
              href="/"
              target="_blank"
              className="flex items-center gap-3 px-4 py-3 font-sans text-sm text-cream/40 hover:text-cream transition-colors"
            >
              <Eye size={16} strokeWidth={1.5} />
              Vedi sito
            </a>
            <button
              onClick={logout}
              className="flex items-center gap-3 px-4 py-3 font-sans text-sm text-cream/40 hover:text-red-400 transition-colors w-full text-left"
            >
              <LogOut size={16} strokeWidth={1.5} />
              Logout
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="ml-64 flex-1 p-8 text-cream min-h-screen">
          {children}
        </main>
      </div>
    </AdminContext.Provider>
  );
}
