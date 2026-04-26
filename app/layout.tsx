import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import { Toaster } from 'react-hot-toast';
export const metadata: Metadata = {
  title: { default: 'OKKA Boutique — Premium Handmade Bags', template: '%s | OKKA Boutique' },
  description: 'Premium handmade crochet bags with vivid colour, sculptural texture and international shipping.',
  openGraph: { title: 'OKKA Boutique', description: 'Premium handmade crochet bags.', siteName: 'OKKA Boutique', locale: 'en_US', type: 'website' }
};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><Toaster position="top-center" toastOptions={{style:{background:'#141414',color:'#FEFCF8',fontFamily:'var(--font-sans)',fontSize:'13px',borderRadius:'14px'}}}/><Navbar/><CartDrawer/>{children}<Footer/></body></html>}
