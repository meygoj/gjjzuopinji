"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { ChevronUp, ChevronDown, Pause, Play } from "lucide-react"

interface ComparisonImage {
  src: string
  label: string
}

interface ComparisonGroup {
  id: string
  title: string
  originalImage: ComparisonImage
  designImages: ComparisonImage[]
}

interface ComparisonCarouselProps {
  groups: ComparisonGroup[]
  className?: string
  autoPlay?: boolean
  autoPlayInterval?: number
}

export function ComparisonCarousel({
  groups,
  className = "",
  autoPlay = true,
  autoPlayInterval = 3000
}: ComparisonCarouselProps) {
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null)

  const currentGroup = groups[currentGroupIndex]
  
  // 0 = 原图, 1-3 = 设计图
  const images = [
    currentGroup?.originalImage,
    ...(currentGroup?.designImages || [])
  ].filter(Boolean) as ComparisonImage[]

  // 自动播放逻辑
  useEffect(() => {
    if (!isPlaying || images.length <= 1) {
      if (autoPlayTimerRef.current) {
        clearTimeout(autoPlayTimerRef.current)
      }
      return
    }

    const playNext = () => {
      if (currentImageIndex < images.length - 1) {
        setCurrentImageIndex(prev => prev + 1)
      } else {
        // 切换到下一组
        if (currentGroupIndex < groups.length - 1) {
          setCurrentImageIndex(0)
          setCurrentGroupIndex(prev => prev + 1)
        } else {
          setCurrentImageIndex(0)
          setCurrentGroupIndex(0)
        }
      }
    }

    autoPlayTimerRef.current = setTimeout(playNext, autoPlayInterval)

    return () => {
      if (autoPlayTimerRef.current) {
        clearTimeout(autoPlayTimerRef.current)
      }
    }
  }, [isPlaying, currentImageIndex, currentGroupIndex, images.length, groups.length, autoPlayInterval])

  // 手动切换图片
  const goToImage = (index: number) => {
    if (isTransitioning || index === currentImageIndex) return
    setIsTransitioning(true)
    setCurrentImageIndex(index)
    setTimeout(() => setIsTransitioning(false), 300)
  }

  const goToPrevImage = () => {
    const newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : images.length - 1
    goToImage(newIndex)
  }

  const goToNextImage = () => {
    const newIndex = currentImageIndex < images.length - 1 ? currentImageIndex + 1 : 0
    goToImage(newIndex)
  }

  const goToPrevGroup = () => {
    const newIndex = currentGroupIndex > 0 ? currentGroupIndex - 1 : groups.length - 1
    setCurrentImageIndex(0)
    setCurrentGroupIndex(newIndex)
  }

  const goToNextGroup = () => {
    const newIndex = currentGroupIndex < groups.length - 1 ? currentGroupIndex + 1 : 0
    setCurrentImageIndex(0)
    setCurrentGroupIndex(newIndex)
  }

  if (groups.length === 0) return null

  return (
    <div className={`relative ${className}`}>
      {/* 标题与组切换 */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div>
          <h3 className="font-display text-xl text-pixel-coffee">
            {currentGroup.title}
          </h3>
          <p className="font-mono text-[10px] uppercase tracking-widest text-pixel-coffee/60 mt-1">
            作品 {currentGroupIndex + 1} / {groups.length}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={goToPrevGroup}
            className="flex items-center justify-center w-8 h-8 border-2 border-pixel-coffee bg-pixel-cream text-pixel-coffee hover:bg-pixel-amber transition-colors active:scale-95"
          >
            ←
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center justify-center w-8 h-8 border-2 border-pixel-coffee bg-pixel-coffee text-pixel-cream hover:bg-pixel-amber hover:text-pixel-coffee transition-colors active:scale-95"
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>
          <button
            onClick={goToNextGroup}
            className="flex items-center justify-center w-8 h-8 border-2 border-pixel-coffee bg-pixel-cream text-pixel-coffee hover:bg-pixel-amber transition-colors active:scale-95"
          >
            →
          </button>
        </div>
      </div>

      {/* 主轮播区域 */}
      <div 
        ref={containerRef}
        className="relative border-2 border-pixel-coffee bg-pixel-cream shadow-[6px_6px_0_0_rgba(92,48,38,0.25)] overflow-hidden"
        onMouseEnter={() => setIsPlaying(false)}
        onMouseLeave={() => setIsPlaying(autoPlay)}
      >
        {/* 轮播内容 */}
        <div className="flex flex-col h-[600px] md:h-[700px]">
          {/* 当前大图 */}
          <div className="relative flex-1 overflow-hidden border-b-2 border-pixel-coffee">
            {images.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  index === currentImageIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              >
                <Image
                  src={image.src}
                  alt={image.label}
                  fill
                  className="object-contain"
                  unoptimized={true}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-pixel-coffee/90 to-transparent p-4">
                  <span className="font-display text-lg text-pixel-cream">
                    {image.label}
                  </span>
                </div>
              </div>
            ))}

            {/* 上下导航按钮 */}
            <button
              onClick={goToPrevImage}
              className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center w-10 h-10 border-2 border-pixel-coffee bg-pixel-cream/90 text-pixel-coffee hover:bg-pixel-amber transition-all active:scale-90"
            >
              <ChevronUp size={20} />
            </button>
            
            <button
              onClick={goToNextImage}
              className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center w-10 h-10 border-2 border-pixel-coffee bg-pixel-cream/90 text-pixel-coffee hover:bg-pixel-amber transition-all active:scale-90"
            >
              <ChevronDown size={20} />
            </button>
          </div>

          {/* 缩略图预览 */}
          <div className="flex gap-2 p-4 bg-pixel-cream">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`relative flex-1 border-2 transition-all overflow-hidden
                  ${
                    index === currentImageIndex
                      ? 'border-pixel-amber bg-pixel-amber/20 scale-105 shadow-[4px_4px_0_0_rgba(92,48,38,0.3)]'
                      : 'border-pixel-coffee/40 hover:border-pixel-coffee hover:shadow-[3px_3px_0_0_rgba(92,48,38,0.2)]'
                  }
                `}
                style={{ aspectRatio: '4/3' }}
              >
                <Image
                  src={image.src}
                  alt={image.label}
                  fill
                  className="object-cover"
                  unoptimized={true}
                />
                <div className="absolute inset-0 flex items-end p-1">
                  <span className={`font-mono text-[9px] px-1 py-0.5
                    ${
                      index === currentImageIndex
                        ? 'bg-pixel-coffee text-pixel-cream'
                        : 'bg-pixel-cream/80 text-pixel-coffee'
                    }
                  `}>
                    {image.label}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 装饰像素角 */}
        <span className="absolute left-0 top-0 size-2 bg-pixel-amber" />
        <span className="absolute right-0 top-0 size-2 bg-pixel-amber" />
        <span className="absolute bottom-0 left-0 size-2 bg-pixel-amber" />
        <span className="absolute bottom-0 right-0 size-2 bg-pixel-amber" />
      </div>

      {/* 进度指示器 */}
      <div className="flex items-center justify-center gap-2 mt-4">
        {groups.map((_, groupIdx) => (
          <div key={groupIdx} className="flex items-center gap-1">
            {groupIdx > 0 && <div className="w-4 h-px bg-pixel-coffee/30" />}
            <div 
              className={`w-2 h-2 rounded-full transition-all
                ${groupIdx === currentGroupIndex ? 'bg-pixel-terracotta scale-125' : 'bg-pixel-coffee/30'}
              `}
            />
          </div>
        ))}
      </div>

      {/* 提示文字 */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-4 border-2 border-pixel-coffee bg-pixel-coffee px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-pixel-cream/90">
        <span className="inline-flex items-center gap-2">
          <span className="size-1.5 bg-pixel-amber" />
          鼠标悬停暂停自动播放
        </span>
        <span className="hidden h-3 w-px bg-pixel-cream/30 sm:inline-block" />
        <span className="inline-flex items-center gap-2">
          <span className="size-1.5 bg-pixel-orange" />
          点击缩略图或按钮切换
        </span>
      </div>
    </div>
  )
}
