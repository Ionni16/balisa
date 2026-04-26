"use client";
import { useState, useEffect } from "react";
import { AdminContext } from "./AdminContext";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Settings,
  LogOut,
  Eye,
  Menu,
  X,
} from "lucide-react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/settings", label: "Website", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [adminKey, setAdminKeyState] = useState("");
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const stored = localStorage.getItem("okka_admin_key");
    if (stored) setAdminKeyState(stored);
  }, []);

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/orders", {
      headers: { "x-admin-key": input },
    });
    if (res.ok) {
      localStorage.setItem("okka_admin_key", input);
      setAdminKeyState(input);
      setError("");
    } else {
      setError("Invalid admin key");
    }
  };

  const logout = () => {
    localStorage.removeItem("okka_admin_key");
    setAdminKeyState("");
  };

  /* ── Login Screen ── */
  if (!adminKey) {
    return (
      <div className="min-h-[100svh] bg-noir flex items-center justify-center px-5">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <Image
            src="/logo_balisa_Senza.png"
            alt="OKKA"
            width={150}
            height={44}
            className="h-8 w-auto object-contain"
            unoptimized
          />
          <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-cream/25 text-center mb-10">
            Administration Panel
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="admin-label">Admin Key</label>
              <input
                type="password"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="admin-input"
                placeholder="••••••••"
                autoFocus
              />
            </div>
            {error && (
              <p className="font-sans text-xs text-red-400">{error}</p>
            )}
            <button
              type="submit"
              className="w-full bg-gold text-noir py-3.5 font-sans text-sm tracking-[0.15em] uppercase hover:bg-gold/90 transition-colors"
            >
              Log in
            </button>
          </form>

          <p className="font-sans text-[10px] text-cream/15 text-center mt-8">
            © {new Date().getFullYear()} OKKA
          </p>
        </div>
      </div>
    );
  }

  /* ── Main Admin Layout ── */
  return (
    <AdminContext.Provider
      value={{ adminKey, setAdminKey: setAdminKeyState, logout }}
    >
      <div className="min-h-[100svh] bg-[#111] flex">
        {/* ── Mobile top bar ── */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-noir border-b border-white/10 flex items-center justify-between px-4 h-14">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 text-cream/60"
          >
            <Menu size={20} />
          </button>
          <Link href="/admin" className="inline-flex items-center">
            <Image
              src="/logo_balisa_Senza.png"
              alt="OKKA"
              width={150}
              height={44}
              className="h-8 w-auto object-contain"
              unoptimized
            />
          </Link>
          <a href="/" target="_blank" className="p-2 -mr-2 text-cream/40">
            <Eye size={18} />
          </a>
        </div>

        {/* ── Mobile sidebar overlay ── */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ── Sidebar ── */}
        <aside
          className={`
            fixed z-50 h-full bg-noir border-r border-white/10 flex flex-col
            transition-transform duration-300 ease-out
            w-64
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            lg:translate-x-0 lg:z-auto
          `}
        >
          {/* Sidebar header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <div>
              <Image
                src="/logo_balisa_Senza.png"
                alt="OKKA"
                width={150}
                height={44}
                className="h-8 w-auto object-contain"
                unoptimized
              />
              <p className="font-sans text-[9px] text-cream/20 mt-1 tracking-wider">
                Admin Panel
              </p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 text-cream/40 hover:text-cream"
            >
              <X size={18} />
            </button>
          </div>

          {/* Nav items */}
          <nav className="flex-1 p-3 space-y-0.5">
            {NAV.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-3 font-sans text-sm transition-all rounded-sm ${
                  pathname === href
                    ? "bg-gold/15 text-gold"
                    : "text-cream/45 hover:text-cream hover:bg-white/5"
                }`}
              >
                <Icon size={16} strokeWidth={1.5} />
                {label}
              </Link>
            ))}
          </nav>

          {/* Sidebar footer */}
          <div className="p-3 border-t border-white/10 space-y-0.5">
            <a
              href="/"
              target="_blank"
              className="flex items-center gap-3 px-4 py-3 font-sans text-sm text-cream/35 hover:text-cream transition-colors"
            >
              <Eye size={16} strokeWidth={1.5} />
              View site
            </a>
            <button
              onClick={logout}
              className="flex items-center gap-3 px-4 py-3 font-sans text-sm text-cream/35 hover:text-red-400 transition-colors w-full text-left"
            >
              <LogOut size={16} strokeWidth={1.5} />
              Logout
            </button>
          </div>
        </aside>

        {/* ── Mobile bottom nav ── */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-noir border-t border-white/10 flex items-center justify-around py-2 px-2 safe-bottom">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 py-1.5 px-4 rounded transition-colors ${
                pathname === href ? "text-gold" : "text-cream/35"
              }`}
            >
              <Icon size={18} strokeWidth={1.5} />
              <span className="text-[9px] tracking-wider uppercase">
                {label}
              </span>
            </Link>
          ))}
        </div>

        {/* ── Main content ── */}
        <main className="lg:ml-64 flex-1 min-h-[100svh] text-cream pt-14 pb-20 lg:pt-0 lg:pb-0">
          <div className="p-5 lg:p-8">{children}</div>
        </main>
      </div>

      <style jsx global>{`
        .safe-bottom {
          padding-bottom: max(0.5rem, env(safe-area-inset-bottom));
        }
      `}</style>
    </AdminContext.Provider>
  );
}
