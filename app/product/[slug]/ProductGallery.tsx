"use client";

import { useMemo, useState } from 'react';
import SmartImage from '@/components/SmartImage';

export default function ProductGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const gallery = useMemo(() => {
    const seen = new Set<string>();
    return images
      .filter(Boolean)
      .map((image) => image.trim())
      .filter((image) => {
        if (seen.has(image)) return false;
        seen.add(image);
        return true;
      });
  }, [images]);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = gallery[activeIndex] || gallery[0] || '';

  return (
    <div>
      <div className="relative aspect-square product-bg overflow-hidden rounded-[2px]">
        <SmartImage src={activeImage} alt={name} contain imgClassName="p-0 scale-100" />
      </div>

      {gallery.length > 1 ? (
        <div className="product-gallery-strip mt-4 md:mt-5" aria-label="Product image gallery">
          {gallery.map((img, index) => {
            const active = index === activeIndex;
            return (
              <button
                key={`${img}-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`product-gallery-thumb ${active ? 'product-gallery-thumb-active' : ''}`}
                aria-label={`Show image ${index + 1}`}
                aria-pressed={active}
              >
                <SmartImage src={img} alt={`${name} ${index + 1}`} contain imgClassName="p-0 scale-100" />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
