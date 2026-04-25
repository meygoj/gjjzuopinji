"use client"

import dynamic from "next/dynamic"
import { ProfileHeader } from "@/components/profile-header"
import { StatusBar } from "@/components/status-bar"
import { HeroPortrait } from "@/components/hero-portrait"
import { ServiceBadges } from "@/components/service-badges"
import { PixelBackground } from "@/components/pixel-background"

// 懒加载大型客户端组件
const WorkGrid = dynamic(
  () => import("@/components/work-grid").then(mod => mod.WorkGrid),
  { ssr: false }
)
const StatsBlock = dynamic(
  () => import("@/components/stats-block").then(mod => mod.StatsBlock),
  { ssr: false }
)
const Testimonial = dynamic(
  () => import("@/components/testimonial").then(mod => mod.Testimonial),
  { ssr: false }
)
const ExperienceTimeline = dynamic(
  () => import("@/components/experience-timeline").then(mod => mod.ExperienceTimeline),
  { ssr: false }
)
const ContactCard = dynamic(
  () => import("@/components/contact-card").then(mod => mod.ContactCard),
  { ssr: false }
)
const SiteFooter = dynamic(
  () => import("@/components/site-footer").then(mod => mod.SiteFooter),
  { ssr: false }
)

export default function WorkPage() {
  return (
    <div className="relative min-h-screen bg-pixel-cream">
      {/* 固定背景层 */}
      <div className="fixed inset-0 -z-10">
        <PixelBackground variant="soft" />
      </div>

      <div className="mx-auto flex max-w-3xl flex-col gap-10 px-4 py-6 md:gap-14 md:px-6 md:py-10">
        <ProfileHeader />
        <StatusBar />
        <HeroPortrait />
        <ServiceBadges />
        <WorkGrid />
        <StatsBlock />
        <Testimonial />
        <ExperienceTimeline />
        <ContactCard />
        <SiteFooter />
      </div>
    </div>
  )
}
