import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-noir text-cream mt-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-3xl font-light tracking-[0.2em] uppercase mb-4">
              Balisa
            </h3>
            <p className="font-sans text-sm text-cream/60 leading-relaxed max-w-xs">
              Ogni borsa è un pezzo unico, realizzato a mano con filati di qualità.
              From our hands to yours. 🤍
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-sans text-xs tracking-widest uppercase text-cream/40 mb-6">
              Esplora
            </h4>
            <ul className="space-y-3">
              {[
                { href: "/shop", label: "Shop" },
                { href: "/shop?category=tote", label: "Tote Bags" },
                { href: "/shop?category=mini", label: "Mini Bags" },
                { href: "/#about", label: "Chi siamo" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="font-sans text-sm text-cream/70 hover:text-cream transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-sans text-xs tracking-widest uppercase text-cream/40 mb-6">
              Contatti
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://instagram.com/yourbalisa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-sm text-cream/70 hover:text-cream transition-colors"
                >
                  @yourbalisa
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@yourbalisa.com"
                  className="font-sans text-sm text-cream/70 hover:text-cream transition-colors"
                >
                  info@yourbalisa.com
                </a>
              </li>
            </ul>
            <div className="mt-8">
              <p className="font-sans text-xs text-cream/30 leading-relaxed">
                Spedizioni in 3–5 giorni lavorativi.<br />
                Ogni borsa è fatta su ordinazione.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-cream/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-sans text-xs text-cream/30">
            © {new Date().getFullYear()} BALISA. Tutti i diritti riservati.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="font-sans text-xs text-cream/30 hover:text-cream/60 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/termini" className="font-sans text-xs text-cream/30 hover:text-cream/60 transition-colors">
              Termini
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
