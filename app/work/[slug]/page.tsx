import dynamic from "next/dynamic"
import { PixelBackground } from "@/components/pixel-background"
import { worksBySlug } from "@/lib/works-data"

// 懒加载大型客户端组件，关闭SSR
const WorkDetail = dynamic(
  () => import("@/components/work-detail").then(mod => mod.WorkDetail),
  { ssr: false }
)

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
