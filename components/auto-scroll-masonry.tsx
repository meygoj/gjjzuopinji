"use client"

import { useEffect, useRef, useState } from "react"
import type { WorkDetailData } from "@/lib/works-data"
import { MasonryCard } from "./masonry-card"
import { HEIGHT_PRESETS, RANDOM_ASPECTS } from "@/lib/masonry-constants"

interface AutoScrollMasonryProps {
  works: WorkDetailData[]
}

export function AutoScrollMasonry({ works }: AutoScrollMasonryProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [visibleCards, setVisibleCards] = useState<Set<string>>(new Set())

  const doubled = [...works, ...works]

  useEffect(() => {
    const timeout = setTimeout(() => {
      setVisibleCards((prev) => {
        const newSet = new Set(prev)
        doubled.forEach((work, idx) => {
          const key = `${work.slug}-${idx}`
          newSet.add(key)
        })
        return newSet
      })
    }, 300)

    return () => clearTimeout(timeout)
  }, [doubled])

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="columns-2 gap-4 [column-fill:_balance] md:columns-3 lg:columns-4">
        {doubled.map((work, idx) => (
          <MasonryCard
            key={`${work.slug}-${idx}`}
            work={work}
            aspectClass={HEIGHT_PRESETS[work.slug] ?? RANDOM_ASPECTS[idx % RANDOM_ASPECTS.length]}
            isVisible={visibleCards.has(`${work.slug}-${idx}`) || idx < 4}
          />
        ))}
      </div>
    </div>
  )
}
