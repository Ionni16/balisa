import { Product } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/stripe';
export default function ProductCard({product,index=0}:{product:Product;index?:number}){
  return <Link href={`/product/${product.slug}`} className="group block fade-up" style={{animationDelay:`${index*70}ms`}}>
    <div className="relative aspect-[4/5] bg-stone overflow-hidden rounded-[28px] border border-black/5 shadow-soft">
      {product.images?.[0]?<Image src={product.images[0]} alt={product.name} fill className="object-cover transition duration-700 group-hover:scale-105"/>:<div className="h-full grid place-items-center logo-word text-5xl text-black/12">OKKA</div>}
      {product.featured&&<span className="absolute left-4 top-4 bg-white/90 px-3 py-1 rounded-full text-[10px] uppercase tracking-[.16em]">Bestseller</span>}
      {product.stock===0&&<div className="absolute inset-0 bg-white/70 grid place-items-center text-xs uppercase tracking-[.2em]">Sold out</div>}
    </div>
    <div className="pt-4 flex justify-between gap-4"><div><h3 className="font-serif text-xl leading-tight">{product.name}</h3><p className="text-xs uppercase tracking-[.16em] text-ink/40 mt-1">{product.category}</p></div><p className="text-sm font-semibold">{formatPrice(product.price)}</p></div>
  </Link>
}
