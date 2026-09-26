"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * A real product photo from `public/`, with a fallback (usually the drawn
 * bike) shown when the file is missing or fails to load.
 */
export default function BikePhoto({
  src,
  alt,
  className = "",
  fallback,
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  fallback: ReactNode;
  priority?: boolean;
}) {
  const img = useRef<HTMLImageElement>(null);
  const [failed, setFailed] = useState(false);

  // The image may have already errored before hydration attached onError.
  useEffect(() => {
    const el = img.current;
    if (el && el.complete && el.naturalWidth === 0) setFailed(true);
  }, []);

  if (failed) return <>{fallback}</>;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={img}
      src={src}
      alt={alt}
      className={className}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}
