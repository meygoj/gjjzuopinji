"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react"
import { useMemo, useState, useEffect } from "react"
import { ProfileHeader } from "./profile-header"
import { StatusBar } from "./status-bar"
import { SiteFooter } from "./site-footer"
import { IrregularWaterfall } from "./irregular-waterfall"
import { ComparisonCarousel } from "./comparison-carousel"
import { type WorkDetailData } from "./works-admin-panel"
import { waterfallItems } from "@/lib/waterfall-data"

interface WorkDetailProps {
  slug: string
}

// 对比图数据
const comparisonGroups = [
  {
    id: 'group1',
    title: 'AIGC设计对比组1',
    originalImage: {
      src: '/uploads/1776590821262_SP01.jpg',
      label: '原图'
    },
    designImages: [
      {
        src: '/uploads/1776590828966_SP25.png',
        label: '设计图1'
      },
      {
        src: '/uploads/1776590834155_SP26.png',
        label: '设计图2'
      }
    ]
  },
  {
    id: 'group2',
    title: 'AIGC设计对比组2',
    originalImage: {
      src: '/uploads/1776590753927_SP05.jpg',
      label: '原图'
    },
    designImages: [
      {
        src: '/uploads/1776590761710_SP16.png',
        label: '设计图1'
      },
      {
        src: '/uploads/1776590768932_SP15.png',
        label: '设计图2'
      }
    ]
  },
  {
    id: 'group3',
    title: 'AIGC设计对比组3',
    originalImage: {
      src: '/uploads/1776601301605_SP03.jpg',
      label: '原图'
    },
    designImages: [
      {
        src: '/uploads/1776601308159_SP13.png',
        label: '设计图1'
      },
      {
        src: '/uploads/1776601317676_SP11.png',
        label: '设计图2'
      }
    ]
  },
  {
    id: 'group4',
    title: 'AIGC设计对比组4',
    originalImage: {
      src: '/uploads/1776603971353_SP07.jpg',
      label: '原图'
    },
    designImages: [
      {
        src: '/uploads/1776601650315_SP21.png',
        label: '设计图1'
      },
      {
        src: '/uploads/1776601662401_SP20.png',
        label: '设计图2'
      }
    ]
  },
  {
    id: 'group5',
    title: 'AIGC设计对比组5',
    originalImage: {
      src: '/uploads/1776604012431_SP06.jpg',
      label: '原图'
    },
    designImages: [
      {
        src: '/uploads/1776602618602_SP17.png',
        label: '设计图1'
      },
      {
        src: '/uploads/1776602632060_SP19.png',
        label: '设计图2'
      }
    ]
  },
  {
    id: 'group6',
    title: 'AIGC设计对比组6',
    originalImage: {
      src: '/uploads/1776603641853_SP10.jpg',
      label: '原图'
    },
    designImages: [
      {
        src: '/uploads/1776603677249_SP27.png',
        label: '设计图1'
      }
    ]
  },
  {
    id: 'group7',
    title: 'AIGC设计对比组7',
    originalImage: {
      src: '/uploads/1776604061324_SP08.jpg',
      label: '原图'
    },
    designImages: [
      {
        src: '/uploads/1776604066479_SP23.png',
        label: '设计图1'
      },
      {
        src: '/uploads/1776604070948_SP24.png',
        label: '设计图2'
      }
    ]
  }
]

export function WorkDetail({ slug }: WorkDetailProps) {
  const [works, setWorks] = useState<Record<string, WorkDetailData>>({})
  const [work, setWork] = useState<WorkDetailData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadWorks = async () => {
      try {
        setIsLoading(true)
        const res = await fetch("/api/works")
        if (!res.ok) throw new Error("加载失败")
        const data = await res.json()
        if (data.works) {
          setWorks(data.works)
          setWork(data.works[slug])
        }
      } catch (error) {
        console.error("加载作品数据失败:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadWorks()
  }, [slug])

  const allWorks = useMemo(() => Object.values(works), [works])
  const next = work?.nextSlug ? works[work.nextSlug] : null

  const filteredWaterfallItems = useMemo(() =>
    work ? waterfallItems.filter(item => item.category === work.category) : [],
    [work]
  )

  // 渲染作品展示区
  const renderWorkShowcase = () => {
    if (!work) return null
    
    // 过滤掉对比图组项目（src为空的）
    const filteredItems = work.category === 'AIGC · 设计' 
      ? filteredWaterfallItems.filter(item => item.src !== '')
      : filteredWaterfallItems
    
    if (work.category === 'AIGC · 设计') {
      // AIGC 设计板块：对比图轮播 + 瀑布流作品
      return (
        <>
          <section className="my-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-0.5 flex-1 bg-pixel-coffee/30" />
              <span className="font-mono text-[11px] tracking-[0.3em] text-pixel-coffee/70 md:text-xs">
                {work.category} · 对比图展示
              </span>
              <span className="h-0.5 flex-1 bg-pixel-coffee/30" />
            </div>
            <ComparisonCarousel 
              groups={comparisonGroups} 
              autoPlay={true}
              autoPlayInterval={4000}
            />
          </section>
          
          {filteredItems.length > 0 && (
            <section className="my-12">
              <div className="flex items-center gap-3 mb-6">
                <span className="h-0.5 flex-1 bg-pixel-coffee/30" />
                <span className="font-mono text-[11px] tracking-[0.3em] text-pixel-coffee/70 md:text-xs">
                  {work.category} · 作品展示
                </span>
                <span className="h-0.5 flex-1 bg-pixel-coffee/30" />
              </div>
              <IrregularWaterfall 
                items={filteredItems} 
                columns={4}
                gap={16}
                showTitle={true}
                autoScroll={true}
                autoScrollSpeed={0.8}
                autoScrollDirection="up"
              />
            </section>
          )}
        </>
      )
    } else {
      // 其他板块：自动滚动瀑布流
      return (
        <section className="my-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-0.5 flex-1 bg-pixel-coffee/30" />
            <span className="font-mono text-[11px] tracking-[0.3em] text-pixel-coffee/70 md:text-xs">
              {work.category} · 作品展示
            </span>
            <span className="h-0.5 flex-1 bg-pixel-coffee/30" />
          </div>
          <IrregularWaterfall 
            items={filteredItems} 
            columns={4}
            gap={16}
            showTitle={true}
            autoScroll={true}
            autoScrollSpeed={0.8}
            autoScrollDirection="up"
          />
        </section>
      )
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto flex max-w-6xl min-h-screen flex-col items-center justify-center gap-10 px-4 py-6 md:gap-14 md:px-6 md:py-10">
        <ProfileHeader />
        <StatusBar />
        <div className="flex items-center gap-2">
          <Loader2 className="size-8 animate-spin text-pixel-coffee" />
          <span className="font-mono text-pixel-coffee">加载中...</span>
        </div>
      </div>
    )
  }

  if (!work) {
    return (
      <div className="mx-auto flex max-w-6xl min-h-screen flex-col items-center justify-center gap-10 px-4 py-6 md:gap-14 md:px-6 md:py-10">
        <ProfileHeader />
        <StatusBar />
        <div className="flex flex-col items-center gap-4">
          <p className="font-display text-xl text-pixel-coffee">作品不存在</p>
          <Link href="/work" className="inline-flex items-center gap-2 border-2 border-pixel-coffee bg-pixel-amber px-4 py-2 font-display text-sm text-pixel-coffee hover:bg-pixel-amber/80">
            <ArrowLeft className="size-4" />
            返回作品列表
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-6 md:gap-14 md:px-6 md:py-10">
      <ProfileHeader />
      <StatusBar />

      <div>
        <Link
          href="/work"
          className="inline-flex items-center gap-2 font-mono text-xs tracking-widest text-pixel-coffee/80 transition-colors hover:text-pixel-terracotta"
        >
          <ArrowLeft className="size-3.5 strokeWidth={2.5}" />
          返回作品列表
        </Link>
      </div>

      <header className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 border-2 border-pixel-coffee bg-pixel-amber px-3 py-1 font-mono text-[11px] tracking-widest text-pixel-coffee">
            <span className="size-1.5 bg-pixel-coffee" />
            {work.category}
          </span>
        </div>

        <h1 className="font-display text-5xl leading-[1.05] text-pixel-coffee md:text-6xl">
          {work.title}
        </h1>

        <p className="max-w-2xl font-sans text-lg leading-relaxed text-pixel-coffee/85">
          {work.subtitle}
        </p>
      </header>

      <div className="relative border-2 border-pixel-coffee shadow-[6px_6px_0_0_rgba(92,48,38,0.2)]">
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <Image
            src={work.cover}
            alt={work.title}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            priority
            className="object-cover"
            unoptimized
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 mix-blend-multiply opacity-25"
            style={{
              backgroundImage:
                "radial-gradient(rgba(60,28,20,0.6) 1px, transparent 1.5px)",
              backgroundSize: "4px 4px",
            }}
          />
        </div>
      </div>

      {/* 作品展示区 */}
      {renderWorkShowcase()}

      <section className="grid grid-cols-3 gap-3 md:gap-4">
        {work.highlights.map((h) => (
          <div
            key={h.label}
            className="flex flex-col items-center justify-center border-2 border-pixel-coffee bg-pixel-cream p-4 text-center shadow-[3px_3px_0_0_rgba(92,48,38,0.15)] transition-all duration-300 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_rgba(92,48,38,0.25)] hover:bg-pixel-amber/20 active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0_0_rgba(92,48,38,0.35)] cursor-pointer"
          >
            <span className="font-display text-2xl leading-none text-pixel-terracotta md:text-3xl transition-transform duration-300 hover:scale-110 active:scale-95">
              {h.num}
            </span>
            <span className="mt-2 font-mono text-[11px] tracking-widest text-pixel-coffee/70 md:text-xs transition-all duration-300 hover:text-pixel-coffee hover:font-semibold active:text-pixel-terracotta">
              {h.label}
            </span>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-2 gap-4 border-y-2 border-pixel-coffee/30 py-6 md:grid-cols-4">
        {work.meta.map((m) => (
          <div key={m.label} className="flex flex-col gap-1">
            <span className="font-mono text-[11px] tracking-widest uppercase text-pixel-coffee/60">
              {m.label}
            </span>
            <span className="font-display text-base text-pixel-coffee">
              {m.value}
            </span>
          </div>
        ))}
      </section>

      <section className="border-2 border-pixel-coffee bg-pixel-orange p-5 text-pixel-coffee shadow-[5px_5px_0_0_rgba(92,48,38,0.18)] md:p-7">
        <h2 className="mb-3 font-display text-2xl md:text-3xl">项目概述</h2>
        <p className="font-sans text-base leading-relaxed md:text-lg">
          {work.summary}
        </p>
      </section>

      <section className="flex flex-col gap-6">
        {work.sections.map((section, i) => (
          <div
            key={section.title}
            className="flex flex-col gap-3 border-2 border-pixel-coffee bg-pixel-cream p-5 shadow-[4px_4px_0_0_rgba(92,48,38,0.15)] md:p-6"
          >
            <div className="flex items-center gap-3">
              <span className="grid size-8 place-items-center border-2 border-pixel-coffee bg-pixel-amber font-mono text-sm text-pixel-coffee">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display text-xl text-pixel-coffee md:text-2xl">
                {section.title}
              </h3>
            </div>
            <div className="flex flex-col gap-3 pl-11 font-sans text-base leading-relaxed text-pixel-coffee/85">
              {section.body.map((p, pi) => (
                <p key={pi}>{p}</p>
              ))}
            </div>
          </div>
        ))}
      </section>

      {next && (
        <Link
          href={`/work/${next.slug}`}
          className="group flex items-center justify-between gap-4 border-2 border-pixel-coffee bg-pixel-coffee p-5 text-pixel-cream shadow-[6px_6px_0_0_rgba(92,48,38,0.22)] transition-transform hover:-translate-x-1 hover:-translate-y-1 active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0_0_rgba(92,48,38,0.35)] md:p-6"
        >
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[11px] tracking-widest text-pixel-amber">
              下一个作品
            </span>
            <span className="font-display text-2xl md:text-3xl">
              {next.title}
            </span>
          </div>
          <ArrowRight
            className="size-6 text-pixel-amber transition-transform group-hover:translate-x-1 group-active:translate-x-0"
            strokeWidth={2.5}
          />
        </Link>
      )}

      <SiteFooter />
    </div>
  )
}
