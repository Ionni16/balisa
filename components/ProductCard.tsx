import {Product} from '@/lib/types';
import Link from 'next/link';
import {formatPrice} from '@/lib/stripe';
import SmartImage from '@/components/SmartImage';

const colorMap:Record<string,string>={
  navy:'#073763',blue:'#073763',black:'#000',grey:'#5d5d5d',gray:'#5d5d5d',
  brown:'#6b4b38',burgundy:'#8b2638',red:'#d51f28',beige:'#efe8de',
  cream:'#efe8de',white:'#f7f3ed',pink:'#f3b8c1',orange:'#ef5b18',
  yellow:'#f2d13b',green:'#1f6b3a'
};

function colourValue(c:string){
  const k=c.toLowerCase().trim();
  return colorMap[k] || k;
}

export default function ProductCard({product,index=0}:{product:Product;index?:number}){
  const colors=(product.colors&&product.colors.length?product.colors:['blue','black','grey','brown','burgundy','red','beige']).slice(0,7);

  return <Link href={`/product/${product.id}`} className="group block fade-up" style={{animationDelay:`${index*45}ms`}}>
    <div className="relative aspect-square product-bg overflow-hidden">
      <SmartImage src={product.images?.[0]} alt={product.name} contain imgClassName="p-0 scale-[1.34] transition duration-500 group-hover:scale-[1.40]"/>
      {product.stock===0&&<div className="absolute inset-0 bg-white/75 grid place-items-center text-xs uppercase tracking-[.2em]">Sold out</div>}
    </div>

    <div className="pt-3 flex gap-2">
      {colors.map((c,i)=><span key={`${c}-${i}`} className="color-dot" style={{background:colourValue(c)}} />)}
    </div>

    <div className="pt-6">
      <h3 className="text-[15px] leading-tight font-normal tracking-[.02em]">{product.name}</h3>
      <p className="mt-2 price-text">{formatPrice(product.price)} EUR</p>
    </div>
  </Link>
}
