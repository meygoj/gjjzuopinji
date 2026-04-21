"use client"

import Image from "next/image"
import Link from "next/link"
import { Video, ImageIcon } from "lucide-react"
import { useState, useRef } from "react"

interface MasonryCardProps {
  work: {
    slug: string
    title: string
    category: string
    cover: string
    subtitle?: string
    blurb?: string
    highlights?: Array<{ num: string; label: string }>
    type?: "image" | "video"
  }
  aspectClass: string
  isVisible?: boolean
}

export function MasonryCard({ work, aspectClass, isVisible = true }: MasonryCardProps) {
  const isUploaded = work.type !== undefined
  const [isPressed, setIsPressed] = useState(false)
  const longPressTimer = useRef<NodeJS.Timeout | null>(null)

  const handleTouchStart = () => {
    setIsPressed(true)
    longPressTimer.current = setTimeout(() => {
      if (navigator.vibrate) {
        navigator.vibrate([10, 50, 10])
      }
    }, 300)
  }

  const handleTouchEnd = () => {
    setIsPressed(false)
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
    }
    if (navigator.vibrate) {
      navigator.vibrate(10)
    }
  }

  return (
    <Link
      href={isUploaded ? "#" : `/work/${work.slug}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleTouchEnd}
      style={{
        transform: isPressed ? 'translateX(2px) translateY(2px) scale(0.98)' : 'translateX(0) translateY(0)',
        boxShadow: isPressed 
          ? '0 0 0 0 rgba(92,48,38,0)' 
          : '4px 4px 0 0 rgba(92,48,38,0.25)',
        transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
      className={`group mb-4 block break-inside-avoid border-2 border-pixel-coffee bg-pixel-cream shadow-[4px_4px_0_0_rgba(92,48,38,0.25)] transition-all duration-500 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_rgba(92,48,38,0.35)] focus:outline-none focus-visible:ring-2 focus-visible:ring-pixel-orange ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      onClick={(e) => isUploaded && e.preventDefault()}
    >
      <div className={`relative w-full overflow-hidden ${aspectClass}`}>
        {work.type === "video" ? (
          <video
            src={encodeURI(work.cover)}
            playsInline
            controls
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onClick={(e) => e.stopPropagation()}
            onPlay={(e) => e.stopPropagation()}
            onPause={(e) => e.stopPropagation()}
            onError={(e) => {
              console.error('视频加载失败:', work.cover)
            }}
          />
        ) : (
          <Image
            src={work.cover || "/placeholder.svg"}
            alt={work.title}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 240px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized={isUploaded}
          />
        )}

        <span className="absolute right-2 top-2 border border-pixel-coffee bg-pixel-cream/95 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-pixel-coffee">
          {work.category}
        </span>

        {isUploaded && (
          <div className="absolute left-2 top-2 inline-flex items-center gap-1 border border-pixel-coffee bg-pixel-cream/90 px-2 py-0.5 font-mono text-[10px] text-pixel-coffee">
            {work.type === "video" ? (
              <Video className="size-3" />
            ) : (
              <ImageIcon className="size-3" />
            )}
            {work.type === "video" ? "视频" : "图片"}
          </div>
        )}

        <div className={`absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-pixel-coffee/95 via-pixel-coffee/70 to-transparent p-3 transition-all duration-300
          ${isPressed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'}
        `}>
          <p className="font-display text-base leading-tight text-pixel-cream">
            {work.title}
          </p>
          <p className="mt-1 line-clamp-2 font-sans text-[11px] leading-snug text-pixel-cream/85">
            {work.subtitle || work.blurb}
          </p>
          {work.highlights && work.highlights.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {work.highlights.slice(0, 2).map((h) => (
                <span
                  key={h.label}
                  className="border border-pixel-amber/70 bg-pixel-amber/20 px-1.5 py-0.5 font-mono text-[9px] text-pixel-cream"
                >
                  <span className="text-pixel-amber">{h.num}</span>{" "}
                  <span className="text-pixel-cream/80">{h.label}</span>
                </span>
              ))}
            </div>
          )}
          {!isUploaded && (
            <div className="mt-2 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-pixel-amber">
              查看详情
              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </div>
          )}
          {/* 手机端提示 */}
          <p className="mt-1 font-mono text-[8px] text-pixel-amber/60 sm:hidden">
            点击查看详情 →
          </p>
        </div>

        {/* 触摸装饰效果 */}
        {isPressed && (
          <>
            <div className="absolute inset-0 border-4 border-pixel-amber/60 pointer-events-none animate-pulse" />
            <div className="absolute inset-0 bg-pixel-amber/15 pointer-events-none" />
          </>
        )}

        <span className="absolute left-0 top-0 size-1.5 bg-pixel-amber" />
        <span className="absolute right-0 top-0 size-1.5 bg-pixel-amber" />
        <span className="absolute bottom-0 left-0 size-1.5 bg-pixel-amber" />
        <span className="absolute bottom-0 right-0 size-1.5 bg-pixel-amber" />
      </div>

      <div className="flex items-center justify-between gap-2 border-t-2 border-pixel-coffee/30 bg-pixel-cream px-3 py-2 transition-opacity group-hover:opacity-70">
        <span className="truncate font-display text-sm text-pixel-cream">
          {work.title}
        </span>
        {!isUploaded && (
          <span className="font-mono text-[9px] uppercase tracking-widest text-pixel-coffee/60">
            ↗
          </span>
        )}
      </div>
    </Link>
  )
}
