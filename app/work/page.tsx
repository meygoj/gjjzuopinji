import { ProfileHeader } from "@/components/profile-header"
import { StatusBar } from "@/components/status-bar"
import { HeroPortrait } from "@/components/hero-portrait"
import { ServiceBadges } from "@/components/service-badges"
import { WorkGrid } from "@/components/work-grid"
import { StatsBlock } from "@/components/stats-block"
import { Testimonial } from "@/components/testimonial"
import { ExperienceTimeline } from "@/components/experience-timeline"
import { ContactCard } from "@/components/contact-card"
import { SiteFooter } from "@/components/site-footer"
import { PixelBackground } from "@/components/pixel-background"

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
