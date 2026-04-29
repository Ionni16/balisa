"use client";
import {useState} from 'react';
import {Product} from '@/lib/types';
import {useCartStore} from '@/lib/store';
import toast from 'react-hot-toast';
import {Minus,Plus} from 'lucide-react';

export default function ProductActions({product}:{product:Product}){
  const [quantity,setQuantity]=useState(1);
  const [color,setColor]=useState(product.colors?.[0]||'As shown');
  const addItem=useCartStore(s=>s.addItem);
  const soldOut=product.stock===0;

  function add(){
    if(soldOut)return;
    addItem(product,quantity,color);
    toast.success('Added to cart');
  }

  return <div className="mt-8">
    {product.colors?.length>0&&<label className="block mb-5">
      <span className="block text-[13px] text-black/60 mb-2">Color</span>
      <select value={color} onChange={e=>setColor(e.target.value)} className="input-field max-w-[260px]">
        {product.colors.map(c=><option key={c} value={c}>{c}</option>)}
      </select>
    </label>}

    <div className="mb-7">
      <span className="block text-[13px] text-black/60 mb-2">Quantity</span>
      <div className="qty-box">
        <button onClick={()=>setQuantity(q=>Math.max(1,q-1))} aria-label="Decrease"><Minus size={14}/></button>
        <span>{quantity}</span>
        <button onClick={()=>setQuantity(q=>q+1)} aria-label="Increase"><Plus size={14}/></button>
      </div>
    </div>

    <button onClick={add} disabled={soldOut} className="btn-keylon w-full max-w-[430px] disabled:opacity-50 disabled:cursor-not-allowed">
      {soldOut?'Sold out':'Add to cart'}
    </button>
  </div>
}
