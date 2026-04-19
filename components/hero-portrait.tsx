import Image from "next/image"
import Link from "next/link"

export function HeroPortrait() {
  return (
    <section id="hero" className="scroll-mt-20">
      <div className="border-2 border-pixel-coffee bg-pixel-cream shadow-[6px_6px_0_0_rgba(92,48,38,0.18)]">
        {/* 肖像图 */}
        <div className="relative aspect-[4/5] w-full overflow-hidden border-b-2 border-pixel-coffee bg-pixel-sand md:aspect-[5/4]">
          <Image
            src="/images/portrait-hero.jpg"
            alt="郭建军 · 新媒体操盘手"
            fill
            sizes="(max-width: 768px) 100vw, 720px"
            priority
            className="object-cover object-top pixel-avatar"
          />

          {/* 半调图层叠加加强像素感 */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 mix-blend-multiply opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(rgba(60,28,20,0.6) 1px, transparent 1.5px)",
              backgroundSize: "4px 4px",
            }}
          />

          {/* 署名卡 */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 border-2 border-pixel-coffee bg-pixel-cream/95 px-4 py-2 font-mono text-[11px] tracking-widest text-pixel-coffee md:text-xs">
            <span>&ldquo;用作品说话 · 让数据证明&rdquo;</span>
            <span className="hidden sm:inline text-pixel-terracotta">2026</span>
          </div>
        </div>

        {/* 文字简介 */}
        <div className="flex flex-col gap-5 p-5 md:p-7">
          <p className="font-sans text-base leading-relaxed text-pixel-coffee md:text-lg">
            我是 <span className="font-display text-pixel-terracotta">郭建军</span>
            ,一名新媒体操盘手与创意营销人,专注于将 AIGC 能力转化为可量化的商业增长。
            过去几年我主导过{" "}
            <span className="bg-pixel-amber/50 px-1 font-medium">
              单场 50 万+ GMV
            </span>
            的无人直播闭环,并用 Midjourney 与 ComfyUI 搭建出完整的{" "}
            <span className="bg-pixel-orange/40 px-1 font-medium">内容工业化流水线</span>
            。
          </p>
          <p className="font-sans text-base leading-relaxed text-pixel-coffee/85 md:text-lg">
            浏览下方作品,看看我如何将技术、审美与业务闭环打通。欢迎联系,一起打造下一个增长故事。
          </p>

          <div className="mt-2 flex flex-col gap-3 border-t-2 border-pixel-coffee/20 pt-4 text-pixel-coffee sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1 font-mono text-xs tracking-wider">
              <span className="text-pixel-coffee/60">联系方式</span>
              <span>17664066212 · meygoj4@gmail.com</span>
            </div>
            <Link
              href="mailto:meygoj4@gmail.com"
              className="group inline-flex items-center gap-2 self-start border-2 border-pixel-coffee bg-pixel-orange px-4 py-2 font-display text-sm text-pixel-coffee transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
            >
              发送邮件
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
