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
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <Link href={`/product/${product.slug}`} className="group block">
        {/* Image container */}
        <div
          className="relative overflow-hidden bg-cream-dark aspect-[3/4]"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {!imageLoaded && <div className="absolute inset-0 skeleton" />}

          {product.images[0] && (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={`object-cover transition-transform duration-700 ease-out ${
                hovered ? "scale-105" : "scale-100"
              }`}
              onLoad={() => setImageLoaded(true)}
            />
          )}

          {/* Second image on hover */}
          {product.images[1] && (
            <Image
              src={product.images[1]}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={`object-cover absolute inset-0 transition-opacity duration-500 ${
                hovered ? "opacity-100" : "opacity-0"
              }`}
            />
          )}

          {/* Out of stock */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-cream/80 backdrop-blur-[2px] flex items-center justify-center">
              <span className="font-sans text-[10px] tracking-[0.25em] uppercase text-noir/50">
                Esaurito
              </span>
            </div>
          )}

          {/* Featured tag */}
          {product.featured && product.stock > 0 && (
            <div className="absolute top-3 left-3 bg-noir text-cream px-2.5 py-1">
              <span className="font-sans text-[9px] tracking-[0.2em] uppercase">
                Bestseller
              </span>
            </div>
          )}

          {/* Quick-view indicator on hover */}
          <div
            className={`absolute bottom-0 left-0 right-0 bg-noir/80 backdrop-blur-sm py-2.5 text-center transition-all duration-300 ${
              hovered && product.stock > 0 ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
            }`}
          >
            <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-cream">
              Scopri di più
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="mt-3.5 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-serif text-base lg:text-lg font-light leading-tight truncate">
              {product.name}
            </h3>
            {product.colors.length > 0 && (
              <p className="font-sans text-[10px] text-noir/40 uppercase tracking-wider mt-1 truncate">
                {product.colors.join(" · ")}
              </p>
            )}
          </div>
          <span className="font-sans text-sm font-medium flex-shrink-0 mt-0.5">
            {formatPrice(product.price)}
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
