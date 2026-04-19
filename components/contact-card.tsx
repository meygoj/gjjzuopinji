"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useToast } from "./pixel-toast"
import { PixelChat } from "./pixel-chat"

export function ContactCard() {
  const { showToast } = useToast()
  const [chatOpen, setChatOpen] = useState(false)
  
  const copyToClipboard = async (text: string, message: string) => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text)
        showToast(message)
      } else {
        showToast(text)
      }
    } catch (err) {
      showToast(text)
    }
  }

  return (
    <section id="contact" className="scroll-mt-20">
      <div className="relative grid grid-cols-1 border-2 border-pixel-coffee shadow-[6px_6px_0_0_rgba(92,48,38,0.18)] md:grid-cols-2">
        {/* 左侧:头像 + 邮箱 */}
        <div className="relative aspect-[4/3] overflow-hidden border-b-2 border-pixel-coffee md:aspect-auto md:border-b-0 md:border-r-2">
          <Image
            src="/images/portrait-hero.jpg"
            alt="郭建军"
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover object-top pixel-avatar"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 mix-blend-multiply opacity-25"
            style={{
              backgroundImage:
                "radial-gradient(rgba(60,28,20,0.6) 1px, transparent 1.5px)",
              backgroundSize: "4px 4px",
            }}
          />
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 border-2 border-pixel-coffee bg-pixel-orange px-3 py-1.5 font-mono text-[11px] tracking-widest text-pixel-coffee">
            <button 
              type="button"
              onClick={() => copyToClipboard("17664066212", "手机号已复制到剪贴板！微信号同手机号")}
              className="hover:underline cursor-pointer"
            >
              17664066212
            </button>
            <button 
              type="button"
              onClick={() => copyToClipboard("meygoj4@gmail.com", "邮箱已复制到剪贴板！")}
              className="hidden sm:inline hover:underline cursor-pointer"
            >
              · meygoj4@gmail.com
            </button>
          </div>
        </div>

        {/* 右侧:CTA + 链接 */}
        <div className="flex flex-col bg-pixel-coffee p-6 text-pixel-cream md:p-8">
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => setChatOpen(true)}
              className="group relative inline-flex items-center justify-center gap-2 border-2 border-pixel-amber bg-pixel-coffee px-5 py-3 font-display text-lg text-pixel-amber shadow-[4px_4px_0_0_rgba(255,179,71,0.25)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
            >
              在线聊天
              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </button>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => copyToClipboard("17664066212", "微信号已复制！手机号就是微信号：17664066212")}
                className="flex-1 border-2 border-pixel-amber/50 bg-pixel-coffee/60 px-4 py-2 font-display text-sm text-pixel-amber hover:bg-pixel-amber hover:text-pixel-coffee transition-all"
              >
                复制微信号
              </button>
              <button
                type="button"
                onClick={() => copyToClipboard("meygoj4@gmail.com", "邮箱已复制到剪贴板！")}
                className="flex-1 border-2 border-pixel-amber/50 bg-pixel-coffee/60 px-4 py-2 font-display text-sm text-pixel-amber hover:bg-pixel-amber hover:text-pixel-coffee transition-all"
              >
                复制邮箱
              </button>
            </div>
          </div>

          <ul className="mt-6 flex flex-col gap-3 font-sans text-base">
            <li>
              <Link
                href="/work#work"
                className="inline-flex items-center gap-2 text-pixel-amber transition-colors hover:text-pixel-cream"
              >
                <span className="inline-block size-1.5 bg-pixel-amber" />
                我的作品
              </Link>
            </li>
            <li>
              <Link
                href="https://meygoj.github.io/automatic-waffle"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-pixel-cream/90 transition-colors hover:text-pixel-amber"
              >
                <span className="inline-block size-1.5 bg-pixel-cream/60" />
                云端画廊 · 完整作品库
              </Link>
            </li>
            <li>
              <Link
                href="mailto:meygoj4@gmail.com"
                className="inline-flex items-center gap-2 text-pixel-cream/90 transition-colors hover:text-pixel-amber"
              >
                <span className="inline-block size-1.5 bg-pixel-cream/60" />
                邮箱咨询
              </Link>
            </li>
            <li>
              <Link
                href="tel:17664066212"
                className="inline-flex items-center gap-2 text-pixel-cream/90 transition-colors hover:text-pixel-amber"
              >
                <span className="inline-block size-1.5 bg-pixel-cream/60" />
                电话直联
              </Link>
            </li>
          </ul>

          <div className="mt-auto pt-6 font-mono text-[10px] tracking-widest text-pixel-cream/50">
            期待与您共创增长 · 用技术的杠杆撬动无限可能
          </div>
        </div>
      </div>
      
      {/* 聊天框 */}
      <PixelChat 
        isOpen={chatOpen} 
        onClose={() => setChatOpen(false)} 
      />
    </section>
  )
}
