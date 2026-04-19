"use client"

import { Github, Mail, Phone } from "lucide-react"
import Link from "next/link"

export function StatusBar() {
  return (
    <div className="-mt-8 border-2 border-pixel-coffee bg-pixel-coffee text-pixel-cream shadow-[6px_6px_0_0_rgba(92,48,38,0.18)]">
      <div className="flex items-center justify-between gap-4 px-4 py-2 md:px-6">
        <span className="inline-flex items-center gap-2 font-mono text-[11px] tracking-widest md:text-xs">
          <span className="inline-block size-2 animate-pulse bg-emerald-400" />
          可工作 · 接受邀约
        </span>

        <div className="flex items-center gap-2">
          <SocialIcon
            href="tel:17664066212"
            label="拨打电话"
            icon={<Phone className="size-3.5" strokeWidth={2.5} />}
          />
          <SocialIcon
            href="mailto:meygoj4@gmail.com"
            label="发送邮件"
            icon={<Mail className="size-3.5" strokeWidth={2.5} />}
          />
          <SocialIcon
            href="https://meygoj.github.io/automatic-waffle"
            label="访问作品库"
            icon={<Github className="size-3.5" strokeWidth={2.5} />}
          />
        </div>
      </div>
    </div>
  )
}

function SocialIcon({
  href,
  label,
  icon,
}: {
  href: string
  label: string
  icon: React.ReactNode
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noopener noreferrer"
      className="grid size-7 place-items-center border border-pixel-amber/60 bg-pixel-amber/20 text-pixel-amber transition-colors hover:bg-pixel-amber hover:text-pixel-coffee"
    >
      {icon}
    </Link>
  )
}
