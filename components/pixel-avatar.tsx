"use client"

import Image from "next/image"

interface PixelAvatarProps {
  src: string
  alt: string
  size?: number
  className?: string
}

export function PixelAvatar({ 
  src, 
  alt, 
  size = 56, 
  className = "" 
}: PixelAvatarProps) {
  return (
    <div 
      className={`relative overflow-hidden border-2 border-pixel-coffee pixel-avatar-frame ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={`${size}px`}
        className="object-cover pixel-avatar"
      />
      {/* 像素网格叠加 */}
      <div className="absolute inset-0 pointer-events-none pixel-art-effect" />
      {/* 像素角落装饰 */}
      <span className="absolute left-0 top-0 size-1.5 bg-pixel-amber z-10" />
      <span className="absolute right-0 top-0 size-1.5 bg-pixel-amber z-10" />
      <span className="absolute left-0 bottom-0 size-1.5 bg-pixel-amber z-10" />
      <span className="absolute right-0 bottom-0 size-1.5 bg-pixel-amber z-10" />
    </div>
  )
}