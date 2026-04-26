"use client";
import { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { Product } from '@/lib/types';
import toast from 'react-hot-toast';
export default function ProductActions({product}:{product:Product}){const [color,setColor]=useState(product.colors?.[0]||'As shown'); const {addItem}=useCartStore(); const add=()=>{if(!color){toast.error('Select a colour');return} addItem(product,color); toast.success(`${product.name} added to cart`)}; return <div className="grid gap-4">{product.colors?.length>1&&<div><p className="text-xs uppercase tracking-[.18em] text-ink/40 mb-3">Colour — <span className="text-ink">{color}</span></p><div className="flex flex-wrap gap-2">{product.colors.map(c=><button key={c} onClick={()=>setColor(c)} className={`px-5 py-3 rounded-full border text-xs uppercase tracking-[.14em] ${color===c?'bg-ink text-white border-ink':'border-black/12'}`}>{c}</button>)}</div></div>}<button onClick={add} disabled={product.stock===0} className="btn-dark w-full disabled:opacity-35 disabled:pointer-events-none"><ShoppingBag size={16}/>{product.stock===0?'Sold out':'Add to cart'}</button><a href="https://instagram.com/okka.boutique" target="_blank" className="btn-light w-full">Ask for custom order</a></div>}
