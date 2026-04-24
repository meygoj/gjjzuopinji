'use client'

import Link from 'next/link'
import { PixelBackground } from '@/components/pixel-background'
import { ProfileHeader } from '@/components/profile-header'
import { ComparisonCarousel } from '@/components/comparison-carousel'
import { IrregularWaterfall } from '@/components/irregular-waterfall'
import { waterfallItems } from '@/lib/waterfall-data'
import { worksBySlug } from '@/lib/works-data'

// 处理对比图数据
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

export default function AllWorksPage() {
  // 动态获取所有分类，过滤掉不需要的分类
  const categories = [...new Set([
    ...Object.values(worksBySlug).map(work => work.category),
    ...waterfallItems.map(item => item.category)
  ].filter(category => category && !['个人品牌', '摄影'].includes(category)))] as string[]
  
  const getCategoryItems = (category: string) => {
    // 对于AIGC分类，过滤掉src为空的对比图组项目
    if (category === 'AIGC · 设计') {
      return waterfallItems.filter(item => item.category === category && item.src !== '')
    }
    return waterfallItems.filter(item => item.category === category)
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-pixel-cream">
      <PixelBackground variant="soft" className="fixed inset-0 z-0 opacity-50" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-4 py-6 sm:px-6 sm:py-10">
        <ProfileHeader />

        <header className="flex flex-col gap-3 border-2 border-pixel-coffee bg-pixel-cream/90 p-5 shadow-[5px_5px_0_0_rgba(92,48,38,0.2)] backdrop-blur-sm sm:flex-row sm:items-end sm:justify-between sm:p-6">
          <div className="flex flex-col gap-2">
            <div className="inline-flex w-fit items-center gap-2 border border-pixel-coffee/60 bg-pixel-amber/30 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-pixel-coffee">
              <span className="size-1.5 animate-pulse bg-pixel-terracotta" />
              作品集
            </div>
            <h1 className="font-display text-3xl leading-tight text-pixel-coffee sm:text-4xl">
              全部作品
            </h1>
            <p className="font-sans text-sm text-pixel-coffee/70">
              多年实战经验沉淀，涵盖直播运营、品牌视觉、AIGC 与自动化工作流。
            </p>
          </div>
          <Link
            href="/work"
            className="group inline-flex w-fit items-center gap-2 border-2 border-pixel-coffee bg-pixel-cream px-4 py-2 font-display text-sm text-pixel-coffee shadow-[3px_3px_0_0_rgba(92,48,38,0.25)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
          >
            <span className="transition-transform group-hover:-translate-x-1">←</span>
            返回主页
          </Link>
        </header>

        {/* 各分类作品展示 */}
        {categories.map((category) => {
          const items = getCategoryItems(category)
          
          // AIGC · 设计分类：显示对比图轮播 + 瀑布流作品
          if (category === 'AIGC · 设计') {
            return (
              <section key={category} className="border-2 border-pixel-coffee bg-pixel-cream p-6 shadow-[5px_5px_0_0_rgba(92,48,38,0.2)]">
                <div className="flex items-center gap-3 mb-6">
                  <span className="inline-flex items-center gap-2 border-2 border-pixel-coffee bg-pixel-amber px-3 py-1 font-display text-base text-pixel-coffee">
                    <span className="size-2 bg-pixel-coffee" />
                    {category}
                  </span>
                  <span className="h-0.5 flex-1 bg-pixel-coffee/30" />
                </div>
                <ComparisonCarousel 
                  groups={comparisonGroups} 
                  autoPlay={true}
                  autoPlayInterval={4000}
                />
                {items.length > 0 && (
                  <div className="mt-8">
                    <IrregularWaterfall 
                      items={items} 
                      columns={4}
                      gap={16}
                      showTitle={true}
                      autoScroll={true}
                      autoScrollSpeed={0.8}
                      autoScrollDirection="up"
                    />
                  </div>
                )}
              </section>
            )
          }
          
          // 其他分类：显示自动滚动瀑布流
          if (items.length === 0) return null
          
          return (
            <section key={category} className="border-2 border-pixel-coffee bg-pixel-cream p-6 shadow-[5px_5px_0_0_rgba(92,48,38,0.2)]">
              <div className="flex items-center gap-3 mb-6">
                <span className="inline-flex items-center gap-2 border-2 border-pixel-coffee bg-pixel-amber px-3 py-1 font-display text-base text-pixel-coffee">
                  <span className="size-2 bg-pixel-coffee" />
                  {category}
                </span>
                <span className="h-0.5 flex-1 bg-pixel-coffee/30" />
              </div>
              <IrregularWaterfall 
                items={items} 
                columns={4}
                gap={16}
                showTitle={true}
                autoScroll={true}
                autoScrollSpeed={0.8}
                autoScrollDirection="up"
              />
            </section>
          )
        })}
      </div>
    </main>
  )
}
