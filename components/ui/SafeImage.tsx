'use client';

import Image from 'next/image';
import { useState } from 'react';

interface SafeImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
}

export default function SafeImage({
  src,
  alt,
  width,
  height,
  fill,
  className,
  priority,
  sizes,
  quality
}: SafeImageProps) {
  const [error, setError] = useState(false);

  if (error) {
    return <div className={`bg-gray-200 ${className}`}>{alt}</div>;
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      fill={fill}
      className={className}
      priority={priority}
      sizes={sizes}
      quality={quality}
      onError={() => setError(true)}
    />
  );
}