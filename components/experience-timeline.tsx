import { Rocket, Sparkles, Leaf } from "lucide-react"

const timeline = [
  {
    range: "2023 年至今",
    title: "创新科技",
    role: "新媒体操盘手 · 高级营销",
    icon: Rocket,
    tone: "primary",
  },
  {
    range: "2021 — 2023",
    title: "愿景 Sol",
    role: "AIGC 内容主理人",
    icon: Sparkles,
    tone: "accent",
  },
  {
    range: "2019 — 2021",
    title: "下一代 · 内容实验室",
    role: "初级内容运营",
    icon: Leaf,
    tone: "muted",
  },
]

export function ExperienceTimeline() {
  return (
    <section>
      <h2 className="mb-6 text-center font-display text-5xl text-pixel-coffee md:text-6xl">
        经历
      </h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {timeline.map(({ range, title, role, icon: Icon, tone }) => {
          const tones =
            tone === "primary"
              ? "bg-pixel-cream"
              : tone === "accent"
                ? "bg-pixel-orange"
                : "bg-pixel-sand"
          return (
            <div
              key={title}
              className={`relative flex flex-col gap-3 border-2 border-pixel-coffee p-5 text-pixel-coffee shadow-[4px_4px_0_0_rgba(92,48,38,0.15)] ${tones}`}
            >
              <span className="inline-flex w-fit items-center gap-1 border border-pixel-coffee/60 bg-pixel-cream/70 px-2 py-0.5 font-mono text-[10px] tracking-widest">
                {range}
              </span>

              <div className="inline-flex size-10 items-center justify-center border-2 border-pixel-coffee bg-pixel-amber">
                <Icon className="size-5" strokeWidth={2.5} />
              </div>

              <div className="flex flex-col leading-tight">
                <span className="font-display text-lg">{title}</span>
                <span className="font-sans text-sm text-pixel-coffee/80">
                  {role}
                </span>
              </div>

              <span
                aria-hidden
                className="absolute -left-1 -top-1 size-1.5 bg-pixel-coffee"
              />
              <span
                aria-hidden
                className="absolute -right-1 -top-1 size-1.5 bg-pixel-coffee"
              />
              <span
                aria-hidden
                className="absolute -bottom-1 -left-1 size-1.5 bg-pixel-coffee"
              />
              <span
                aria-hidden
                className="absolute -bottom-1 -right-1 size-1.5 bg-pixel-coffee"
              />
            </div>
          )
        })}
      </div>
    </section>
  )
}
