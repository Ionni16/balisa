"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/stripe";
import { useState } from "react";

interface Props {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: Props) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/product/${product.slug}`} className="group block">
        {/* Image container */}
        <div
          className="relative overflow-hidden bg-cream-dark aspect-[3/4]"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {product.images[0] && (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={`object-cover transition-transform duration-700 ${
                hovered ? "scale-105" : "scale-100"
              }`}
            />
          )}
          {product.images[1] && (
            <Image
              src={product.images[1]}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className={`object-cover absolute inset-0 transition-opacity duration-500 ${
                hovered ? "opacity-100" : "opacity-0"
              }`}
            />
          )}

          {/* Out of stock overlay */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-cream/80 flex items-center justify-center">
              <span className="font-sans text-xs tracking-widest uppercase text-noir/50">
                Esaurito
              </span>
            </div>
          )}

          {/* Featured tag */}
          {product.featured && (
            <div className="absolute top-4 left-4 bg-noir text-cream px-3 py-1">
              <span className="font-sans text-[10px] tracking-widest uppercase">
                Bestseller
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="mt-4 flex items-start justify-between">
          <div>
            <h3 className="font-serif text-lg font-light leading-tight">
              {product.name}
            </h3>
            <div className="mt-1 flex gap-2 flex-wrap">
              {product.colors.map((c) => (
                <span
                  key={c}
                  className="font-sans text-[11px] text-noir/50 uppercase tracking-wider"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
          <span className="font-sans text-sm font-medium ml-4 flex-shrink-0">
            {formatPrice(product.price)}
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
