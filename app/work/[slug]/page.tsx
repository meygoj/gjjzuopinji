import { PixelBackground } from "@/components/pixel-background"
import { WorkDetail } from "@/components/work-detail"
import { worksBySlug } from "@/lib/works-data"

export async function generateStaticParams() {
  return Object.keys(worksBySlug).map((slug) => ({ slug }))
}

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  return (
    <div className="relative min-h-screen bg-pixel-cream">
      <div className="fixed inset-0 -z-10">
        <PixelBackground variant="soft" />
      </div>
      <WorkDetail slug={slug} />
    </div>
  )
}
