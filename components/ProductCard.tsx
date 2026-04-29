import { Product } from '@/lib/types';
import Link from 'next/link';
import { formatPrice } from '@/lib/stripe';
import SmartImage from '@/components/SmartImage';

const colorMap: Record<string, string> = {
  navy: '#073763',
  blue: '#073763',
  black: '#000000',
  grey: '#5d5d5d',
  gray: '#5d5d5d',
  brown: '#6b4b38',
  burgundy: '#8b2638',
  red: '#d51f28',
  beige: '#efe8de',
  cream: '#efe8de',
  white: '#f7f3ed',
  pink: '#f3b8c1',
  orange: '#ef5b18',
  yellow: '#f2d13b',
  green: '#1f6b3a',
  purple: '#7c5cff',
  lilac: '#c8a2ff',
  fuchsia: '#d63384',
  natural: '#e8dfd1',
};

function colourValue(color: string) {
  const value = color.toLowerCase().trim();
  return colorMap[value] || value;
}

function productColors(product: Product) {
  return Array.isArray(product.colors)
    ? product.colors.map((color) => String(color).trim()).filter(Boolean).slice(0, 7)
    : [];
}

export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const colors = productColors(product);

  return (
    <Link href={`/product/${product.id}`} className="group block fade-up" style={{ animationDelay: `${index * 45}ms` }}>
      <div className="relative aspect-square product-bg overflow-hidden">
        <SmartImage src={product.images?.[0]} alt={product.name} contain imgClassName="p-0 scale-[1.34] transition duration-500 group-hover:scale-[1.40]" />
        {product.stock === 0 && (
          <div className="absolute inset-0 grid place-items-center bg-white/75 text-xs uppercase tracking-[.2em]">Sold out</div>
        )}
      </div>

      {colors.length > 0 ? (
        <div className="pt-3 flex gap-2">
          {colors.map((color, index) => (
            <span
              key={`${color}-${index}`}
              className="color-dot"
              style={{ background: colourValue(color) }}
              title={color}
            />
          ))}
        </div>
      ) : null}

      <div className="pt-6">
        <h3 className="text-[15px] leading-tight font-normal tracking-[.02em]">{product.name}</h3>
        <p className="mt-2 price-text">{formatPrice(product.price)} EUR</p>
      </div>
    </Link>
  );
}
