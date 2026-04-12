import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-noir text-cream mt-32">
      <div className="max-w-7xl mx-auto px-5 lg:px-12 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16">
          {/* Brand */}
          <div className="md:col-span-5">
            <Image
              src="/logo_balisa_Senza.png"
              alt="Balisa"
              width={120}
              height={48}
              className="h-10 w-auto object-contain brightness-[10] invert mb-5"
            />
            <p className="font-sans text-sm text-cream/50 leading-relaxed max-w-xs">
              Ogni borsa è un pezzo unico, realizzato a mano con filati di qualità.
              From our hands to yours.
            </p>
            <div className="flex gap-4 mt-6">
              <a
                href="https://instagram.com/yourbalisa"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 border border-cream/15 flex items-center justify-center text-cream/40 hover:text-cream hover:border-cream/40 transition-all text-xs"
              >
                IG
              </a>
              <a
                href="mailto:info@yourbalisa.com"
                className="w-9 h-9 border border-cream/15 flex items-center justify-center text-cream/40 hover:text-cream hover:border-cream/40 transition-all text-xs"
              >
                @
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="md:col-span-3">
            <h4 className="font-sans text-[10px] tracking-[0.2em] uppercase text-cream/30 mb-5">
              Esplora
            </h4>
            <ul className="space-y-3">
              {[
                { href: "/shop", label: "Shop" },
                { href: "/shop?category=tote", label: "Tote Bags" },
                { href: "/shop?category=mini", label: "Mini Bags" },
                { href: "/shop?category=clutch", label: "Clutch" },
                { href: "/#about", label: "Chi siamo" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="font-sans text-sm text-cream/50 hover:text-cream transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div className="md:col-span-4">
            <h4 className="font-sans text-[10px] tracking-[0.2em] uppercase text-cream/30 mb-5">
              Informazioni
            </h4>
            <div className="space-y-4 font-sans text-sm text-cream/50">
              <p>Spedizioni in 3–5 giorni lavorativi.</p>
              <p>Ogni borsa è fatta su ordinazione.</p>
              <p>Pagamenti sicuri con Stripe.</p>
            </div>
            <div className="mt-6 pt-6 border-t border-cream/10">
              <a
                href="mailto:info@yourbalisa.com"
                className="font-sans text-sm text-cream/50 hover:text-cream transition-colors"
              >
                info@yourbalisa.com
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-6 border-t border-cream/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-sans text-[11px] text-cream/25">
            © {new Date().getFullYear()} BALISA. Tutti i diritti riservati.
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="font-sans text-[11px] text-cream/25 hover:text-cream/50 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/termini"
              className="font-sans text-[11px] text-cream/25 hover:text-cream/50 transition-colors"
            >
              Termini
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
