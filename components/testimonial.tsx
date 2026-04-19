import Image from "next/image"

export function Testimonial() {
  return (
    <section>
      <div className="relative border-2 border-pixel-coffee bg-pixel-orange p-6 text-pixel-coffee shadow-[6px_6px_0_0_rgba(92,48,38,0.18)] md:p-8">
        {/* 标签 */}
        <div className="mb-4 inline-flex items-center gap-2 border border-pixel-coffee bg-pixel-amber px-2.5 py-0.5 font-mono text-[11px] tracking-widest md:text-xs">
          <span className="size-1.5 bg-pixel-coffee" />
          专业 · 有创意 · 技术精湛
        </div>

        <p className="font-sans text-base leading-relaxed md:text-lg">
          &ldquo;郭建军将 AIGC 能力扎实落地到业务闭环中,我们的 GMV、内容产能与复购率都因此实现了跃升。
          每一处细节都经过精心打磨,兼顾了技术的严谨与审美的温度 ——
          他是极少数能把两者真正打通的新媒体操盘手。&rdquo;
        </p>

        <div className="mt-5 flex items-center gap-3 border-t-2 border-pixel-coffee/30 pt-4">
          <div className="relative size-10 overflow-hidden border-2 border-pixel-coffee">
            <Image
              src="/images/client-avatar.jpg"
              alt="客户头像"
              fill
              sizes="40px"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-display text-base">李明轩</span>
            <span className="font-mono text-[11px] tracking-widest text-pixel-coffee/70">
              创新科技公司 · 首席营销官
            </span>
          </div>
        </div>

        {/* 像素装饰 */}
        <span
          aria-hidden
          className="absolute -left-1 -top-1 size-2 bg-pixel-coffee"
        />
        <span
          aria-hidden
          className="absolute -right-1 -top-1 size-2 bg-pixel-coffee"
        />
        <span
          aria-hidden
          className="absolute -bottom-1 -left-1 size-2 bg-pixel-coffee"
        />
        <span
          aria-hidden
          className="absolute -bottom-1 -right-1 size-2 bg-pixel-coffee"
        />
      </div>
    </section>
  )
}
