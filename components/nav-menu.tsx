"use client"

import { Home, Info, FolderOpen, Phone, X, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useToast } from "./pixel-toast"
import { PixelChat } from "./pixel-chat"

interface NavMenuProps {
  open: boolean
  onClose: () => void
}

const links = [
  { icon: Home, label: "首页", href: "/" },
  { icon: Info, label: "关于我", href: "/work#hero" },
  { icon: FolderOpen, label: "作品", href: "/work#work" },
  { icon: Phone, label: "联系我", href: "/work#contact" },
]

export function NavMenu({ open, onClose }: NavMenuProps) {
  const { showToast } = useToast()
  const [chatOpen, setChatOpen] = useState(false)
  
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (chatOpen) {
          setChatOpen(false)
        } else {
          onClose()
        }
      }
    }
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [open, onClose, chatOpen])

  const handleCopyWechat = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText("17664066212")
        showToast("微信号已复制！手机号就是微信号")
      } else {
        showToast("微信号：17664066212")
      }
    } catch {
      showToast("微信号：17664066212")
    }
  }

  const handleOpenChat = (e: React.MouseEvent) => {
    e.preventDefault()
    setChatOpen(true)
  }

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8"
    >
      {/* 背景遮罩 */}
      <button
        type="button"
        aria-label="关闭菜单"
        onClick={onClose}
        className="absolute inset-0 bg-pixel-coffee/60 backdrop-blur-sm"
      />

      <div className="relative w-full max-w-2xl border-2 border-pixel-coffee bg-pixel-cream shadow-[10px_10px_0_0_rgba(92,48,38,0.35)]">
        {/* 顶部头像区 */}
        <div className="flex items-center justify-between gap-4 border-b-2 border-pixel-coffee bg-pixel-cream px-5 py-5 md:px-7 md:py-6">
          <div className="flex items-center gap-4">
            <div className="relative size-14 overflow-hidden border-2 border-pixel-coffee md:size-16 pixel-avatar-frame">
              <Image
                src="/images/avatar.jpg"
                alt="郭建军"
                fill
                sizes="64px"
                className="object-cover pixel-avatar"
              />
              <div className="absolute inset-0 pointer-events-none pixel-art-effect" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-display text-xl text-pixel-coffee md:text-2xl">
                郭建军
              </span>
              <span className="font-mono text-xs tracking-widest text-pixel-coffee/70">
                新媒体操盘手 · 创意营销人
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="关闭"
            className="grid size-10 place-items-center text-pixel-coffee transition-transform hover:rotate-90"
          >
            <X className="size-6" strokeWidth={2.5} />
          </button>
        </div>

        {/* 菜单链接 */}
        <nav className="bg-pixel-orange p-4 md:p-6">
          <ul className="flex flex-col">
            {links.map((link, i) => (
              <li
                key={link.label}
                className={i > 0 ? "border-t-2 border-pixel-coffee/30" : ""}
              >
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="flex items-center gap-4 px-2 py-4 font-display text-xl text-pixel-coffee transition-transform hover:translate-x-1"
                >
                  <span className="grid size-9 place-items-center border-2 border-pixel-coffee bg-pixel-cream/40">
                    <link.icon className="size-4" strokeWidth={2.5} />
                  </span>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* 底部 CTA */}
        <div className="flex items-center justify-between gap-4 border-t-2 border-pixel-coffee bg-pixel-coffee px-5 py-4 text-pixel-cream md:px-7">
          <div className="flex items-center gap-3 font-mono text-xs">
            <SocialDot 
              label="微" 
              onClick={handleCopyWechat}
              title="点击复制微信号"
            />
            <SocialDot 
              label="邮" 
              onClick={() => window.location.href = "mailto:meygoj4@gmail.com?subject=工作机会"}
              title="点击发邮件"
            />
            <SocialDot 
              label="电" 
              onClick={() => window.location.href = "tel:17664066212"}
              title="点击拨打电话"
            />
          </div>
          <button
            type="button"
            onClick={handleOpenChat}
            className="group inline-flex items-center gap-2 font-display text-base text-pixel-amber transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
          >
            我们来谈谈吧
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
      
      {/* 聊天框 */}
      <PixelChat 
        isOpen={chatOpen} 
        onClose={() => setChatOpen(false)} 
      />
    </div>
  )
}

function SocialDot({ 
  label, 
  onClick, 
  title 
}: { 
  label: string 
  onClick?: () => void
  title?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="grid size-7 place-items-center border-2 border-pixel-amber bg-pixel-amber/20 font-display text-xs text-pixel-amber transition-all hover:bg-pixel-amber hover:text-pixel-coffee cursor-pointer"
    >
      {label}
    </button>
  )
}
