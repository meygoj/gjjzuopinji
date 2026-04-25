import dynamic from "next/dynamic"

// 懒加载管理面板，关闭SSR以减少初始体积
const UnifiedAdminPanel = dynamic(
  () => import("@/components/unified-admin-panel"),
  { ssr: false }
)

export default function AdminDashboard() {
  return <UnifiedAdminPanel />
}
