const stats = [
  { num: "50万+", label: "单场直播 GMV", rotation: "-1.5deg" },
  { num: "15K / 日", label: "带货峰值", rotation: "0.8deg" },
  { num: "50%↑", label: "流程人效", rotation: "-0.5deg" },
  { num: "98%", label: "客户满意度", rotation: "1.2deg" },
]

export function StatsBlock() {
  return (
    <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {stats.map((s, i) => (
        <div
          key={s.num}
          className="group relative flex flex-col items-center justify-center border-2 border-pixel-coffee bg-pixel-cream p-5 text-center shadow-[4px_4px_0_0_rgba(92,48,38,0.15)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_rgba(92,48,38,0.25)] hover:scale-105"
          style={{ transform: `rotate(${s.rotation})` }}
        >
          <span className="font-display text-3xl leading-none text-pixel-terracotta md:text-4xl transition-transform duration-300 group-hover:scale-110">
            {s.num}
          </span>
          <span className="mt-2 font-mono text-[11px] tracking-widest text-pixel-coffee/80 md:text-xs transition-all duration-300 group-hover:text-pixel-coffee group-hover:tracking-wider">
            {s.label}
          </span>
          <span
            aria-hidden
            className="absolute left-1 top-1 size-1.5 bg-pixel-orange transition-all duration-300 group-hover:scale-150 group-hover:bg-pixel-terracotta"
          />
          <span
            aria-hidden
            className="absolute right-1 top-1 size-1.5 bg-pixel-orange transition-all duration-300 group-hover:scale-150 group-hover:bg-pixel-terracotta"
          />
          <span
            aria-hidden
            className="absolute bottom-1 left-1 size-1.5 bg-pixel-orange transition-all duration-300 group-hover:scale-150"
            style={{ opacity: i % 2 === 0 ? 1 : 0.5 }}
          />
          <span
            aria-hidden
            className="absolute bottom-1 right-1 size-1.5 bg-pixel-orange transition-all duration-300 group-hover:scale-150 group-hover:bg-pixel-terracotta"
          />
        </div>
      ))}
    </section>
  )
}
