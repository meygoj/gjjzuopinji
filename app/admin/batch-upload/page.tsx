import dynamic from "next/dynamic"

const BatchUploadAdmin = dynamic(
  () => import("@/components/batch-upload-admin"),
  { ssr: false }
)

export default function BatchUploadPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BatchUploadAdmin />
      </div>
    </div>
  )
}
