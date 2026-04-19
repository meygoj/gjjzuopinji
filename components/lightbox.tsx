"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react"

interface LightboxProps {
  item: {
    src: string
    alt: string
    title?: string
    category?: string
    isVideo?: boolean
  } | null
  items?: Array<{
    src: string
    alt: string
    title?: string
    category?: string
    isVideo?: boolean
  }>
  currentIndex?: number
  onClose: () => void
  onNext?: () => void
  onPrev?: () => void
}

export function Lightbox({ item, items = [], currentIndex = 0, onClose, onNext, onPrev }: LightboxProps) {
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowRight" && onNext) onNext()
      if (e.key === "ArrowLeft" && onPrev) onPrev()
    }

    document.addEventListener("keydown", handleKeyDown)
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "auto"
    }
  }, [onClose, onNext, onPrev])

  if (!item) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm">
      <div className="absolute inset-0 z-0" onClick={onClose} />

      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white transition-all hover:bg-white/20 hover:scale-110 active:scale-95"
      >
        <X className="size-6" />
      </button>

      {onPrev && (
        <button
          onClick={onPrev}
          className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-all hover:bg-white/20 hover:scale-110 active:scale-95"
        >
          <ChevronLeft className="size-8" />
        </button>
      )}

      {onNext && (
        <button
          onClick={onNext}
          className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-all hover:bg-white/20 hover:scale-110 active:scale-95"
        >
          <ChevronRight className="size-8" />
        </button>
      )}

      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-4 rounded-full bg-white/10 px-4 py-2 text-white backdrop-blur-sm">
        <button
          onClick={() => setScale(Math.max(0.5, scale - 0.25))}
          className="rounded-full p-1 transition-all hover:bg-white/20 active:scale-95"
        >
          <ZoomOut className="size-5" />
        </button>
        <span className="font-mono text-sm">{Math.round(scale * 100)}%</span>
        <button
          onClick={() => setScale(Math.min(3, scale + 0.25))}
          className="rounded-full p-1 transition-all hover:bg-white/20 active:scale-95"
        >
          <ZoomIn className="size-5" />
        </button>
        <span className="mx-2 h-4 w-px bg-white/30" />
        <span className="font-mono text-xs">
          {currentIndex + 1} / {items.length}
        </span>
      </div>

      <div
        className="relative z-10 max-h-[85vh] max-w-[90vw] transition-transform duration-200"
        style={{
          transform: `scale(${scale})`,
        }}
      >
        {item.isVideo ? (
          <video
            src={item.src}
            controls
            autoPlay
            className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain"
          />
        ) : (
          <Image
            src={item.src}
            alt={item.alt}
            width={1920}
            height={1080}
            className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain"
            style={{
              transform: `scale(${scale})`,
              transition: "transform 0.2s ease",
            }}
          />
        )}

        {(item.title || item.category) && (
          <div className="absolute bottom-0 left-0 right-0 rounded-b-lg bg-gradient-to-t from-black/80 to-transparent p-6 pt-12">
            {item.category && (
              <span className="mb-2 inline-block rounded-full bg-white/20 px-3 py-1 font-mono text-xs text-white">
                {item.category}
              </span>
            )}
            {item.title && (
              <h3 className="font-display text-xl text-white">{item.title}</h3>
            )}
            {item.alt && (
              <p className="mt-1 text-sm text-white/70">{item.alt}</p>
            )}
          </div>
        )}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent" />
    </div>
  )
}
