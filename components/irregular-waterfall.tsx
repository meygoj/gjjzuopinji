"use client"

import { useState, useMemo, useRef, useEffect, useCallback } from "react"
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
  autoScroll?: boolean
  autoScrollSpeed?: number
  autoScrollDirection?: 'up' | 'down'
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
  showTitle = true,
  autoScroll = false,
  autoScrollSpeed = 1,
  autoScrollDirection = 'up'
}: IrregularWaterfallProps) {
  const [selectedItem, setSelectedItem] = useState<WaterfallItem | null>(null)
  const [comparisonPreview, setComparisonPreview] = useState<ComparisonPreview | null>(null)
  const [videoLoaded, setVideoLoaded] = useState<{ [key: string]: boolean }>({})
  const [touchStates, setTouchStates] = useState<{ [key: string]: { isPressed: boolean; scale: number } }>({})
  const [isPaused, setIsPaused] = useState(false)
  const touchTimerRef = useRef<{ [key: string]: NodeJS.Timeout }>({})
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number>()
  const scrollPositionRef = useRef(0)

  const mainItems = useMemo(() => items.filter(item => item.src), [items])
  const comparisonItems = useMemo(() => items.filter(item => 
    item.originalSrc && item.originalSrc !== '' && 
    item.compareSrc && item.compareSrc.length > 0
  ), [items])

  const handleClose = () => {
    setSelectedItem(null)
    setComparisonPreview(null)
  }

  // 自动滚动逻辑
  useEffect(() => {
    if (!autoScroll || !scrollContainerRef.current) {
      return
    }

    const container = scrollContainerRef.current
    
    // 初始化滚动位置
    scrollPositionRef.current = container.scrollTop

    const animateScroll = () => {
      if (!container || isPaused) {
        animationFrameRef.current = requestAnimationFrame(animateScroll)
        return
      }

      // 每次动画时获取最新的高度
      const scrollHeight = container.scrollHeight
      const clientHeight = container.clientHeight
      
      if (autoScrollDirection === 'up') {
        scrollPositionRef.current -= autoScrollSpeed
        if (scrollPositionRef.current <= 0) {
          scrollPositionRef.current = scrollHeight - clientHeight
        }
      } else {
        scrollPositionRef.current += autoScrollSpeed
        if (scrollPositionRef.current >= scrollHeight - clientHeight) {
          scrollPositionRef.current = 0
        }
      }

      container.scrollTop = scrollPositionRef.current
      animationFrameRef.current = requestAnimationFrame(animateScroll)
    }

    animationFrameRef.current = requestAnimationFrame(animateScroll)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [autoScroll, autoScrollSpeed, autoScrollDirection, isPaused])

  // 触摸开始
  const handleTouchStart = (id: string) => {
    setTouchStates(prev => ({ ...prev, [id]: { isPressed: true, scale: 0.95 } }))
    
    // 长按效果
    touchTimerRef.current[id] = setTimeout(() => {
      setTouchStates(prev => ({ ...prev, [id]: { isPressed: true, scale: 1.05 } }))
      // 添加轻微振动反馈
      if (navigator.vibrate) {
        navigator.vibrate(10)
      }
    }, 200)
  }

  // 触摸结束
  const handleTouchEnd = (id: string) => {
    if (touchTimerRef.current[id]) {
      clearTimeout(touchTimerRef.current[id])
    }
    setTouchStates(prev => ({ ...prev, [id]: { isPressed: false, scale: 1 } }))
    
    // 快速释放振动
    if (navigator.vibrate) {
      navigator.vibrate(5)
    }
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
      {autoScroll && (
        <div className="flex items-center justify-between mb-4 px-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-pixel-coffee/70">
              自动滚动
            </span>
            <button
              onClick={() => setIsPaused(!isPaused)}
              className={`flex items-center gap-1 border-2 border-pixel-coffee px-3 py-1 font-mono text-[10px] transition-all
                ${isPaused ? 'bg-pixel-cream text-pixel-coffee' : 'bg-pixel-coffee text-pixel-cream'}
                hover:bg-pixel-amber hover:text-pixel-coffee active:scale-95
              `}
            >
              {isPaused ? '▶ 继续' : '⏸ 暂停'}
            </button>
          </div>
        </div>
      )}

      {comparisonItems.map(item => renderComparisonView(item))}

      <div
        ref={scrollContainerRef}
        className={`relative w-full ${className}`}
        style={{ maxHeight: '80vh', overflowY: 'auto' }}
        onMouseEnter={() => autoScroll && setIsPaused(true)}
        onMouseLeave={() => autoScroll && setIsPaused(false)}
        onTouchStart={() => autoScroll && setIsPaused(true)}
        onTouchEnd={() => {
          if (autoScroll) {
            setTimeout(() => setIsPaused(false), 3000)
          }
        }}
      >
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
                    .map((item) => {
                      const touchState = touchStates[item.id] || { isPressed: false, scale: 1 }
                      return (
                      <div
                        key={item.id}
                        onClick={(e) => {
                          // 如果点击的是视频或视频控件，不打开预览
                          const target = e.target as HTMLElement
                          if (target.closest('video') || target.closest('button')) {
                            return
                          }
                          setSelectedItem(item)
                        }}
                        onMouseDown={() => handleTouchStart(item.id)}
                        onMouseUp={() => handleTouchEnd(item.id)}
                        onMouseLeave={() => handleTouchEnd(item.id)}
                        onTouchStart={() => {
                          handleTouchStart(item.id)
                        }}
                        onTouchEnd={() => {
                          handleTouchEnd(item.id)
                        }}
                        style={{
                          transform: `scale(${touchState.scale})`,
                          transition: 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.15s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                        className={`group relative overflow-hidden border-2 border-pixel-coffee bg-pixel-cream cursor-pointer
                          ${touchState.isPressed ? 'z-20' : 'z-10'}
                          ${touchState.scale > 1 ? 'shadow-[10px_10px_0_0_rgba(92,48,38,0.4)]' : 'shadow-[6px_6px_0_0_rgba(92,48,38,0.25)]'}
                        `}
                      >
                        {item.isVideo ? (
                          <div className="relative" style={{ aspectRatio: item.aspectRatio || 'auto' }}>
                            <video
                              src={encodeURI(item.src)}
                              alt={item.alt}
                              className="w-full h-full object-cover"
                              controls
                              playsInline
                              preload="auto"
                              onClick={(e) => e.stopPropagation()}
                              onPlay={(e) => e.stopPropagation()}
                              onPause={(e) => e.stopPropagation()}
                              onLoadedMetadata={() => {
                                setVideoLoaded(prev => ({ ...prev, [item.id]: true }))
                              }}
                              onError={(e) => {
                                console.error('视频加载失败:', item.src)
                                setVideoLoaded(prev => ({ ...prev, [item.id]: 'error' }))
                              }}
                            />
                            {videoLoaded[item.id] === undefined && (
                              <div className="absolute inset-0 flex items-center justify-center bg-pixel-coffee/20">
                                <div className="text-pixel-cream text-sm">加载中...</div>
                              </div>
                            )}
                            {videoLoaded[item.id] === 'error' && (
                              <div className="absolute inset-0 flex items-center justify-center bg-pixel-coffee/40">
                                <div className="text-pixel-cream text-sm text-center p-2">
                                  <div>视频加载失败</div>
                                  <div className="text-xs mt-1">请检查文件路径</div>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="relative" style={{ aspectRatio: item.aspectRatio || 'auto' }}>
                            <Image
                              src={item.src}
                              alt={item.alt}
                              fill
                              className="object-cover"
                              unoptimized={true}
                            />
                          </div>
                        )}

                      {item.category && (
                        <span className="absolute right-2 top-2 border border-pixel-coffee bg-pixel-cream/95 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-pixel-coffee">
                          {item.category}
                        </span>
                      )}

                      {showTitle && item.title && (
                        <div className={`absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-pixel-coffee/95 via-pixel-coffee/70 to-transparent p-3 transition-all duration-300
                          ${touchState.isPressed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'}
                        `}>
                          <p className="font-display text-base leading-tight text-pixel-cream">
                            {item.title}
                          </p>
                          {/* 手机端提示 */}
                          <p className="mt-1 font-mono text-[10px] text-pixel-amber/80 sm:hidden">
                            点击查看详情 →
                          </p>
                        </div>
                      )}

                      {/* 触摸装饰效果 */}
                      {touchState.isPressed && (
                        <>
                          <div className="absolute inset-0 border-4 border-pixel-amber/60 pointer-events-none animate-pulse" />
                          <div className="absolute inset-0 bg-pixel-amber/10 pointer-events-none" />
                        </>
                      )}

                      <span className="absolute left-0 top-0 size-1.5 bg-pixel-amber" />
                      <span className="absolute right-0 top-0 size-1.5 bg-pixel-amber" />
                      <span className="absolute bottom-0 left-0 size-1.5 bg-pixel-amber" />
                      <span className="absolute bottom-0 right-0 size-1.5 bg-pixel-amber" />
                    </div>
                  )})}
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
                src={encodeURI(selectedItem.src)}
                controls
                autoPlay
                playsInline
                className="max-w-[90vw] max-h-[90vh] rounded-lg object-contain"
                onClick={(e) => e.stopPropagation()}
                onError={(e) => {
                  console.error('预览视频加载失败:', selectedItem.src)
                }}
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
