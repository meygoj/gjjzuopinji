import { Radio, Sparkles, Cpu, BarChart3, Palette, Users } from "lucide-react"
import Link from "next/link"

const services = [
  { label: "爆款直播", icon: Radio },
  { label: "AIGC 内容", icon: Sparkles },
  { label: "自动化流水线", icon: Cpu },
  { label: "数据驱动", icon: BarChart3 },
  { label: "品牌视觉", icon: Palette },
  { label: "全域运营", icon: Users },
]

export function ServiceBadges() {
  return (
    <div className="border-2 border-pixel-coffee bg-pixel-coffee p-5 text-pixel-cream shadow-[6px_6px_0_0_rgba(92,48,38,0.18)] md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <span className="font-mono text-[11px] tracking-[0.3em] text-pixel-amber md:text-xs">
          SERVICES · 核心能力
        </span>
        <span className="hidden font-mono text-[10px] tracking-widest text-pixel-cream/50 md:inline">
          06 / SKILLS
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {services.map(({ label, icon: Icon }) => (
          <div
            key={label}
            className="flex items-center gap-2 border border-pixel-amber/40 bg-pixel-coffee/60 px-3 py-2.5 font-sans text-sm text-pixel-cream"
          >
            <Icon className="size-4 text-pixel-amber" strokeWidth={2.5} />
            <span>{label}</span>
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-end">
        <Link
          href="mailto:meygoj4@gmail.com"
          className="group inline-flex items-center gap-2 border-2 border-pixel-amber bg-pixel-amber px-4 py-2 font-display text-sm text-pixel-coffee shadow-[3px_3px_0_0_rgba(255,179,71,0.3)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
        >
          预约通话
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </div>
    </div>
  )
}
