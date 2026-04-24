"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { worksBySlug, type WorkDetailData } from "@/lib/works-data"

export interface PortfolioWork {
  slug: string
  title: string
  category: string
  blurb: string
  cover: string
  tone: "light" | "dark" | "warm"
  position: string
  rotation: string
}

const portfolioLayout: Record<string, { tone: "light" | "dark" | "warm"; position: string; rotation: string }> = {
  "livestream-engine": {
    tone: "dark",
    position: "md:col-span-5 md:row-span-2",
    rotation: "transform rotate-[-1deg]",
  },
  "brand-visual": {
    tone: "light",
    position: "md:col-span-7 md:row-span-1",
    rotation: "transform rotate-[0.5deg]",
  },
  "content-assembly": {
    tone: "warm",
    position: "md:col-span-6 md:row-span-1",
    rotation: "transform rotate-[-0.8deg]",
  },
  "commerce-dashboard": {
    tone: "dark",
    position: "md:col-span-6 md:row-span-1",
    rotation: "transform rotate-[1deg]",
  },
}

const getWorks = (): PortfolioWork[] => {
  const works = Object.values(worksBySlug)
  return works.map(work => {
    const layout = portfolioLayout[work.slug] || {
      tone: "dark",
      position: "md:col-span-6 md:row-span-1",
      rotation: "transform rotate-[0deg]",
    }
    return {
      slug: work.slug,
      title: work.title,
      category: work.category,
      blurb: work.summary,
      cover: work.cover,
      tone: layout.tone,
      position: layout.position,
      rotation: layout.rotation,
    }
  })
}

export function WorkGrid() {
  const works = getWorks()
  return (
    <section id="work" className="scroll-mt-20 flex flex-col gap-6 md:gap-8">
      <h2 className="font-display text-6xl leading-none text-pixel-coffee md:text-8xl">
        作品
      </h2>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-12 md:grid-rows-2">
        {works.map(work => (
          <WorkCard key={work.slug} work={work} />
        ))}
      </div>

      <div className="flex flex-col items-center gap-4 pt-4">
        <p className="font-sans text-sm text-pixel-coffee/70">
          想看看更多设计的实际应用吗?
        </p>
        <Link
          href="/work/all"
          className="group relative inline-flex items-center gap-2 border-2 border-pixel-coffee bg-pixel-orange px-6 py-3 font-display text-base text-pixel-coffee shadow-[5px_5px_0_0_rgba(92,48,38,0.25)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
        >
          查看我的所有作品
          <span className="transition-transform group-hover:translate-x-1">→</span>
          <span className="absolute -left-1 -top-1 size-2 bg-pixel-amber" />
          <span className="absolute -right-1 -top-1 size-2 bg-pixel-amber" />
          <span className="absolute -bottom-1 -left-1 size-2 bg-pixel-amber" />
          <span className="absolute -bottom-1 -right-1 size-2 bg-pixel-amber" />
        </Link>
      </div>
    </section>
  )
}

function WorkCard({ work }: { work: PortfolioWork }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
  }

  const toneBg =
    work.tone === "dark"
      ? "bg-pixel-coffee text-pixel-cream"
      : work.tone === "warm"
        ? "bg-pixel-orange text-pixel-coffee"
        : "bg-pixel-cream text-pixel-coffee"

  return (
    <Link
      href={`/work/${work.slug}`}
      className={`group relative flex flex-col min-h-[200px] border-2 border-pixel-coffee ${toneBg} shadow-[6px_6px_0_0_rgba(92,48,38,0.18)] transition-all duration-300 hover:shadow-[8px_8px_0_0_rgba(92,48,38,0.28)] ${work.position} ${work.rotation} hover:scale-[1.02] hover:rotate-0`}
      onMouseMove={handleMouseMove}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <span className="font-display text-lg leading-none md:text-xl">
          {work.title}
        </span>
        <span
          className={`border px-2 py-0.5 font-mono text-[10px] tracking-widest md:text-[11px] ${
            work.tone === "dark"
              ? "border-pixel-cream/40 text-pixel-cream/80"
              : "border-pixel-coffee/60 text-pixel-coffee"
          }`}
        >
          {work.category}
        </span>
      </div>

      <div className="relative flex-1 overflow-hidden border-t-2 border-pixel-coffee">
        {work.cover.startsWith('data:') || work.cover.startsWith('http') ? (
          <img
            src={work.cover}
            alt={work.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <Image
            src={work.cover}
            alt={work.title}
            fill
            sizes="(max-width: 768px) 100vw, 600px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 mix-blend-multiply opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(rgba(60,28,20,0.55) 1px, transparent 1.5px)",
            backgroundSize: "4px 4px",
          }}
        />
      </div>

      <CursorBadge label="查看项目" mousePosition={mousePosition} />
    </Link>
  )
}

function CursorBadge({ label, mousePosition }: { label: string; mousePosition: { x: number; y: number } }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute z-10 scale-75 opacity-0 transition-all duration-200 group-hover:scale-100 group-hover:opacity-100"
      style={{
        left: `${mousePosition.x}px`,
        top: `${mousePosition.y}px`,
        transform: 'translate(-50%, -50%)'
      }}
    >
      <span className="relative inline-flex items-center gap-2 border-2 border-pixel-coffee bg-pixel-amber px-4 py-2 font-display text-sm text-pixel-coffee shadow-[4px_4px_0_0_rgba(60,28,20,0.4)]">
        {label}
        <span>→</span>
        <span className="absolute -left-1 -top-1 size-1.5 bg-pixel-coffee" />
        <span className="absolute -right-1 -top-1 size-1.5 bg-pixel-coffee" />
        <span className="absolute -bottom-1 -left-1 size-1.5 bg-pixel-coffee" />
        <span className="absolute -bottom-1 -right-1 size-1.5 bg-pixel-coffee" />
      </span>
    </div>
  )
}
