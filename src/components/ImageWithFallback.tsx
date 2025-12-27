'use client';

import { useState, useEffect } from 'react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fallbackText?: string;
}

export default function ImageWithFallback({ src, alt, className, fallbackText }: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState<string>('');
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const displayText = fallbackText || alt.slice(0, 25);
  const fallbackSrc = `https://placehold.co/600x400/1a1a2e/d4a574?text=${encodeURIComponent(displayText)}`;

  useEffect(() => {
    setImgSrc(src);
    setHasError(false);
    setIsLoading(true);
  }, [src]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  // If source is from wikimedia and starts with upload.wikimedia.org,
  // we'll use fallback since these often fail
  const shouldUseFallback = src.includes('upload.wikimedia.org') || src.includes('commons.wikimedia.org');

  return (
    <img
      src={shouldUseFallback ? fallbackSrc : (imgSrc || fallbackSrc)}
      alt={alt}
      className={className}
      onError={handleError}
      onLoad={handleLoad}
      referrerPolicy="no-referrer"
    />
  );
}
