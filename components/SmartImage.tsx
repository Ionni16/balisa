"use client";

import { useEffect, useMemo, useState } from "react";

type SmartImageProps = {
  src?: string | null;
  alt: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  contain?: boolean;
};

export default function SmartImage({
  src,
  alt,
  className = "",
  imgClassName = "",
  contain = false,
}: SmartImageProps) {
  const safeSrc = useMemo(() => {
    const value = typeof src === "string" ? src.trim() : "";
    if (!value) return "";
    try {
      return encodeURI(value);
    } catch {
      return value;
    }
  }, [src]);

  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [safeSrc]);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {safeSrc && !failed ? (
        <img
          src={safeSrc}
          alt={alt}
          loading="eager"
          decoding="async"
          onError={() => setFailed(true)}
          className={`h-full w-full ${contain ? "object-contain" : "object-cover"} ${imgClassName}`}
        />
      ) : (
        <div className="h-full w-full bg-[var(--product-card-bg)]" aria-label={alt} />
      )}
    </div>
  );
}
