"use client"

import { useEffect, useRef, useState } from "react"
import type { PortfolioWork, UploadedItem } from "./work-grid"
import { MasonryCard } from "./masonry-card"
import { HEIGHT_PRESETS, RANDOM_ASPECTS } from "@/lib/masonry-constants"

interface AutoScrollMasonryHomeProps {
  works: PortfolioWork[]
  uploaded: UploadedItem[]
}

export function AutoScrollMasonryHome({ works, uploaded }: AutoScrollMasonryHomeProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const [paused, setPaused] = useState(false)
  const userActiveUntil = useRef(0)

  const allWorks = [...works, ...uploaded.map(item => ({
    slug: item.id,
    title: item.caption || "上传作品",
    category: item.type === "video" ? "视频" : "图片",
    blurb: item.caption || "上传的作品",
    cover: item.url,
    tone: "light" as const,
    type: item.type
  }))]

  const doubled = [...allWorks, ...allWorks]

  useEffect(() => {
    const el = scrollRef.current
    const inner = innerRef.current
    if (!el || !inner) return

    let rafId = 0
    const speed = 0.25

    const tick = () => {
      const now = performance.now()
      const halfHeight = inner.scrollHeight / 2

      if (el.scrollTop >= halfHeight) {
        el.scrollTop = el.scrollTop - halfHeight
      }

      const isUserActive = now < userActiveUntil.current
      if (!paused && !isUserActive) {
        el.scrollTop += speed
      }

      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    const handleWheel = () => {
      userActiveUntil.current = performance.now() + 2500
    }
    const handleTouchMove = () => {
      userActiveUntil.current = performance.now() + 2500
    }
    el.addEventListener("wheel", handleWheel, { passive: true })
    el.addEventListener("touchmove", handleTouchMove, { passive: true })

    return () => {
      cancelAnimationFrame(rafId)
      el.removeEventListener("wheel", handleWheel)
      el.removeEventListener("touchmove", handleTouchMove)
    }
  }, [paused, allWorks])

  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-20 h-12 bg-gradient-to-b from-pixel-cream to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-12 bg-gradient-to-t from-pixel-cream to-transparent"
      />

      <div
        ref={scrollRef}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="masonry-scroll h-[60vh] min-h-[480px] overflow-y-auto border-2 border-pixel-coffee bg-pixel-cream/70 p-4 shadow-[5px_5px_0_0_rgba(92,48,38,0.2)] backdrop-blur-sm sm:p-6"
      >
        <div
          ref={innerRef}
          className="columns-2 gap-4 [column-fill:_balance] md:columns-3"
        >
          {doubled.map((work, idx) => (
            <MasonryCard
              key={`${work.slug}-${idx}`}
              work={work}
              aspectClass={HEIGHT_PRESETS[work.slug as string] ?? RANDOM_ASPECTS[idx % RANDOM_ASPECTS.length]}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 border-2 border-pixel-coffee bg-pixel-coffee px-5 py-3 font-mono text-[10px] uppercase tracking-widest text-pixel-cream/90 mt-4">
        <span className="inline-flex items-center gap-2">
          <span className="size-1.5 bg-pixel-amber" />
          自动滚动 · 鼠标悬停暂停
        </span>
        <span className="hidden h-3 w-px bg-pixel-cream/30 sm:inline-block" />
        <span className="inline-flex items-center gap-2">
          <span className="size-1.5 bg-pixel-orange" />
          滚轮可自主浏览
        </span>
        <span className="hidden h-3 w-px bg-pixel-cream/30 sm:inline-block" />
        <span className="inline-flex items-center gap-2">
          <span className="size-1.5 bg-pixel-terracotta" />
          支持横屏和竖屏作品
        </span>
      </div>
    </div>
  )
}
