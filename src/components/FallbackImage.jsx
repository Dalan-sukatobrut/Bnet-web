import React, { useState } from "react";

/**
 * FallbackImage - Komponen gambar dengan fallback otomatis
 *
 * Features:
 * - Automatic fallback ke gambar default jika gambar utama gagal load
 * - Multiple fallback attempts dengan graceful degradation
 * - SVG placeholder inline jika SEMUA gambar gagal
 * - Proper state management untuk menghindari infinite loops
 *
 * Usage:
 * <FallbackImage
 *   src="/images/primary.png"
 *   fallback="/images/fallback.png"
 *   alt="Description"
 * />
 */

// SVG Placeholder - ditampilkan jika SEMUA gambar gagal
const PLACEHOLDER_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpolyline points='21 15 16 10 5 21'/%3E%3C/svg%3E`;

// Default fallback image
const DEFAULT_FALLBACK = "/images/clients/beranda.png";

export default function FallbackImage({
  src,
  fallback = DEFAULT_FALLBACK,
  alt = "",
  show = true,
  maxRetries = 2,
  ...props
}) {
  const [currentSrc, setCurrentSrc] = useState(() => src || fallback);
  const [errorCount, setErrorCount] = useState(0);

  // Jika show=false, jangan render
  if (show === false) {
    return null;
  }

  // Jika src kosong, gunakan fallback langsung
  if (!src) {
    return (
      <img
        src={fallback}
        alt={alt}
        loading="lazy"
        {...props}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = PLACEHOLDER_SVG;
        }}
      />
    );
  }

  const handleError = () => {
    console.log(
      `[FallbackImage] Error loading: ${currentSrc}, attempt: ${errorCount + 1}`,
    );

    // Prevent infinite loop - max retries reached
    if (errorCount >= maxRetries) {
      console.log(`[FallbackImage] Max retries reached, using placeholder`);
      setCurrentSrc(PLACEHOLDER_SVG);
      return;
    }

    // Increment error count
    const newCount = errorCount + 1;
    setErrorCount(newCount);

    // Jika belum mencoba fallback, coba sekarang
    if (newCount === 1 && fallback) {
      console.log(`[FallbackImage] Trying fallback: ${fallback}`);
      setCurrentSrc(fallback);
    } else if (newCount === 2) {
      // Fallback also failed, try default
      console.log(
        `[FallbackImage] Fallback failed, trying default: ${DEFAULT_FALLBACK}`,
      );
      setCurrentSrc(DEFAULT_FALLBACK);
    }
  };

  return (
    <img
      src={currentSrc}
      alt={alt}
      onError={handleError}
      loading="lazy"
      {...props}
    />
  );
}
