import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: {
    default: "BALISA — Handmade Bags",
    template: "%s | BALISA",
  },
  description: "Borse artigianali uniche, fatte a mano con amore. From our hands to yours.",
  openGraph: {
    title: "BALISA — Handmade Bags",
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
              fontSize: "13px",
              letterSpacing: "0.05em",
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
