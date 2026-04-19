"use client"

import Image from "next/image"
import { Menu } from "lucide-react"
import { useState } from "react"
import { NavMenu } from "./nav-menu"

export function ProfileHeader() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="border-2 border-pixel-coffee bg-pixel-cream shadow-[6px_6px_0_0_rgba(92,48,38,0.18)]">
        <div className="flex items-center justify-between gap-4 px-4 py-3 md:px-6 md:py-4">
          <div className="flex items-center gap-4">
            <div className="relative size-12 overflow-hidden border-2 border-pixel-coffee md:size-14 pixel-avatar-frame">
              <Image
                src="/images/avatar.jpg"
                alt="郭建军头像"
                fill
                sizes="56px"
                className="object-cover pixel-avatar"
              />
              <div className="absolute inset-0 pointer-events-none pixel-art-effect" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-display text-lg text-pixel-coffee md:text-xl">
                郭建军
              </span>
              <span className="font-mono text-[11px] tracking-widest text-pixel-coffee/70 md:text-xs">
                新媒体操盘手 · 创意营销人
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="打开菜单"
            className="grid size-10 place-items-center border-2 border-pixel-coffee bg-pixel-cream text-pixel-coffee transition-colors hover:bg-pixel-amber/30 md:size-11"
          >
            <Menu className="size-5" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <NavMenu open={open} onClose={() => setOpen(false)} />
    </>
  )
}
