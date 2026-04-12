import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: {
    default: "BALISA — Borse Artigianali",
    template: "%s | BALISA",
  },
  description:
    "Borse artigianali uniche, fatte a mano con amore. From our hands to yours.",
  openGraph: {
    title: "BALISA — Borse Artigianali",
    description: "Borse artigianali uniche, fatte a mano con amore.",
    url: "https://yourbalisa.com",
    siteName: "BALISA",
    locale: "it_IT",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#1A1A1A",
              color: "#FAF7F0",
              fontFamily: "var(--font-dm-sans)",
              fontSize: "12px",
              letterSpacing: "0.05em",
              borderRadius: "2px",
            },
          }}
        />
        <Navbar />
        <CartDrawer />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
