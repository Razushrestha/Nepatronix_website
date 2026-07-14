'use client'

import Image from 'next/image'
import { isLocalImageUrl } from '@/lib/content-image'

type SafeImageProps = {
  src: string
  alt: string
  fill?: boolean
  className?: string
  priority?: boolean
  sizes?: string
}

/** Use next/image for local paths; plain img for external URLs (Sanity CDN, etc.). */
export default function SafeImage({
  src,
  alt,
  fill,
  className,
  priority,
  sizes,
}: SafeImageProps) {
  if (!src) return null

  if (isLocalImageUrl(src)) {
    return (
      <Image
        src={src}
        alt={alt}
        fill={fill}
        className={className}
        priority={priority}
        sizes={sizes}
      />
    )
  }

  if (fill) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={className}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
      />
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={className} />
  )
}
