"use client"

import { useState, useMemo } from "react"
import Image from "next/image"

// 像素风格瀑布流

interface WaterfallItem {
  id: string
  src: string
  alt: string
  title?: string
  category?: string
  aspectRatio: number
  isVideo?: boolean
  originalSrc?: string
  compareSrc?: string[]
}

interface IrregularWaterfallProps {
  items: WaterfallItem[]
  className?: string
  columns?: number
  gap?: number
  showTitle?: boolean
}

interface ComparisonPreview {
  src: string
  alt: string
}

export function IrregularWaterfall({
  items,
  className = "",
  columns = 4,
  gap = 16,
  showTitle = true
}: IrregularWaterfallProps) {
  const [selectedItem, setSelectedItem] = useState<WaterfallItem | null>(null)
  const [comparisonPreview, setComparisonPreview] = useState<ComparisonPreview | null>(null)

  const mainItems = useMemo(() => items.filter(item => item.src), [items])
  const comparisonItems = useMemo(() => items.filter(item => 
    item.originalSrc && item.originalSrc !== '' && 
    item.compareSrc && item.compareSrc.length > 0
  ), [items])

  const handleClose = () => {
    setSelectedItem(null)
    setComparisonPreview(null)
  }

  const renderComparisonView = (item: WaterfallItem) => {
    if (!item.originalSrc || item.originalSrc === '' || !item.compareSrc || item.compareSrc.length === 0) {
      return null
    }

    return (
      <div key={`compare-${item.id}`} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="border-2 border-pixel-coffee bg-pixel-cream p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-[10px] uppercase tracking-widest text-pixel-coffee/70">原图</span>
          </div>
          <div 
            className="relative overflow-hidden border border-pixel-coffee/30 cursor-pointer group" 
            style={{ aspectRatio: '4/3' }}
            onClick={() => setComparisonPreview({ src: item.originalSrc!, alt: `${item.title} - 原图` })}
          >
            <Image
              src={item.originalSrc}
              alt={`${item.title} - 原图`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-pixel-coffee/0 group-hover:bg-pixel-coffee/20 transition-colors duration-300 flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 font-mono text-xs text-pixel-cream bg-pixel-coffee/80 px-3 py-1">
                点击放大
              </span>
            </div>
          </div>
        </div>
        {item.compareSrc[0] && item.compareSrc[0] !== '' && (
          <div className="border-2 border-pixel-coffee bg-pixel-cream p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-[10px] uppercase tracking-widest text-pixel-coffee/70">设计图 1</span>
            </div>
            <div 
              className="relative overflow-hidden border border-pixel-coffee/30 cursor-pointer group" 
              style={{ aspectRatio: '4/3' }}
              onClick={() => setComparisonPreview({ src: item.compareSrc[0], alt: `${item.title} - 设计图 1` })}
            >
              <Image
                src={item.compareSrc[0]}
                alt={`${item.title} - 设计图 1`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-pixel-coffee/0 group-hover:bg-pixel-coffee/20 transition-colors duration-300 flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 font-mono text-xs text-pixel-cream bg-pixel-coffee/80 px-3 py-1">
                  点击放大
                </span>
              </div>
            </div>
          </div>
        )}
        {item.compareSrc[1] && item.compareSrc[1] !== '' && (
          <div className="border-2 border-pixel-coffee bg-pixel-cream p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-[10px] uppercase tracking-widest text-pixel-coffee/70">设计图 2</span>
            </div>
            <div 
              className="relative overflow-hidden border border-pixel-coffee/30 cursor-pointer group" 
              style={{ aspectRatio: '4/3' }}
              onClick={() => setComparisonPreview({ src: item.compareSrc[1], alt: `${item.title} - 设计图 2` })}
            >
              <Image
                src={item.compareSrc[1]}
                alt={`${item.title} - 设计图 2`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-pixel-coffee/0 group-hover:bg-pixel-coffee/20 transition-colors duration-300 flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 font-mono text-xs text-pixel-cream bg-pixel-coffee/80 px-3 py-1">
                  点击放大
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="relative">
      {comparisonItems.map(item => renderComparisonView(item))}

      <div className={`relative w-full ${className}`} style={{ maxHeight: '80vh', overflowY: 'auto' }}>
        <div className="p-4">
          <div className="flex" style={{ gap: `${gap}px` }}>
            {Array.from({ length: columns }).map((_, columnIndex) => (
              <div
                key={columnIndex}
                className="flex flex-col"
                style={{ flex: 1, minWidth: 0, gap: `${gap}px` }}
              >
                {mainItems
                  .filter((_, index) => index % columns === columnIndex)
                  .map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className="group relative overflow-hidden border-2 border-pixel-coffee bg-pixel-cream shadow-[4px_4px_0_0_rgba(92,48,38,0.25)] cursor-pointer"
                    >
                      {item.isVideo ? (
                        <video
                          src={item.src}
                          alt={item.alt}
                          className="w-full object-cover"
                          muted
                          loop
                          playsInline
                        />
                      ) : (
                        <div className="relative" style={{ aspectRatio: item.aspectRatio || 'auto' }}>
                          <Image
                            src={item.src}
                            alt={item.alt}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}

                      {item.category && (
                        <span className="absolute right-2 top-2 border border-pixel-coffee bg-pixel-cream/95 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-pixel-coffee">
                          {item.category}
                        </span>
                      )}

                      {showTitle && item.title && (
                        <div className="absolute inset-0 flex translate-y-2 flex-col justify-end bg-gradient-to-t from-pixel-coffee/95 via-pixel-coffee/70 to-transparent p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                          <p className="font-display text-base leading-tight text-pixel-cream">
                            {item.title}
                          </p>
                        </div>
                      )}

                      <span className="absolute left-0 top-0 size-1.5 bg-pixel-amber" />
                      <span className="absolute right-0 top-0 size-1.5 bg-pixel-amber" />
                      <span className="absolute bottom-0 left-0 size-1.5 bg-pixel-amber" />
                      <span className="absolute bottom-0 right-0 size-1.5 bg-pixel-amber" />
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {(selectedItem || comparisonPreview) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={handleClose}
        >
          <div className="relative max-w-[90vw] max-h-[90vh]">
            {selectedItem?.isVideo ? (
              <video
                src={selectedItem.src}
                controls
                autoPlay
                className="max-w-[90vw] max-h-[90vh] rounded-lg object-contain"
              />
            ) : selectedItem ? (
              <Image
                src={selectedItem.src}
                alt={selectedItem.alt}
                width={1920}
                height={1080}
                className="max-w-[90vw] max-h-[90vh] rounded-lg object-contain"
              />
            ) : comparisonPreview ? (
              <Image
                src={comparisonPreview.src}
                alt={comparisonPreview.alt}
                width={1920}
                height={1080}
                className="max-w-[90vw] max-h-[90vh] rounded-lg object-contain"
              />
            ) : null}

            <button
              onClick={(e) => {
                e.stopPropagation()
                handleClose()
              }}
              className="absolute top-4 right-4 rounded-full bg-white/20 p-2 text-white transition-all hover:bg-white/30"
            >
              <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
