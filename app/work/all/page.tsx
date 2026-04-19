import Link from "next/link"
import { PixelBackground } from "@/components/pixel-background"
import { ProfileHeader } from "@/components/profile-header"
import { IrregularWaterfall } from "@/components/irregular-waterfall"
import { waterfallItems } from "@/lib/waterfall-data"

export const metadata = {
  title: "全部作品 · 郭建军作品集",
  description: "瀑布流浏览全部营销、直播、AIGC 与自动化作品",
}

export default function AllWorksPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-pixel-cream">
      <PixelBackground variant="soft" className="fixed inset-0 z-0 opacity-50" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-10">
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
              多年实战经验沉淀，涵盖直播运营、品牌视觉、AIGC 与数据可视化等领域。
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

        <IrregularWaterfall 
          items={waterfallItems} 
          columns={4}
          gap={16}
          showTitle={true}
        />

        <div className="flex flex-wrap items-center justify-center gap-6 border-2 border-pixel-coffee bg-pixel-coffee px-5 py-3 font-mono text-[10px] uppercase tracking-widest text-pixel-cream/90">
          <span className="inline-flex items-center gap-2">
            <span className="size-1.5 bg-pixel-amber" />
            悬停预览详情
          </span>
          <span className="hidden h-3 w-px bg-pixel-cream/30 sm:inline-block" />
          <span className="inline-flex items-center gap-2">
            <span className="size-1.5 bg-pixel-orange" />
            滚动浏览全部
          </span>
          <span className="hidden h-3 w-px bg-pixel-cream/30 sm:inline-block" />
          <span className="inline-flex items-center gap-2">
            <span className="size-1.5 bg-pixel-terracotta" />
            点击进入详情
          </span>
        </div>
      </div>
    </main>
  )
}
