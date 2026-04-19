import { list, put } from "@vercel/blob"

export type MediaItem = {
  id: string
  url: string
  pathname: string
  type: "image" | "video"
  caption: string
  width?: number
  height?: number
  uploadedAt: string
}

const INDEX_PATH = "gallery/items.json"

async function findIndexBlob() {
  // 使用 list 查找 index 文件（blob 在 pathname 后附加随机后缀）
  const { blobs } = await list({ prefix: "gallery/items" })
  return blobs.find((b) => b.pathname.startsWith("gallery/items") && b.pathname.endsWith(".json")) ?? null
}

export async function readItems(): Promise<MediaItem[]> {
  try {
    const blob = await findIndexBlob()
    if (!blob) return []
    const res = await fetch(blob.url, { cache: "no-store" })
    if (!res.ok) return []
    const data = (await res.json()) as MediaItem[]
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error("[v0] readItems error:", error)
    return []
  }
}

export async function writeItems(items: MediaItem[]): Promise<void> {
  // 先清理旧的 index（allowOverwrite 不适用，因为 blob 会加随机后缀）
  const { blobs } = await list({ prefix: "gallery/items" })
  // 写入新的 index
  await put(INDEX_PATH, JSON.stringify(items, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  })
  // 删除历史残留（如果有多份）
  const { del } = await import("@vercel/blob")
  const stale = blobs.filter((b) => b.pathname !== INDEX_PATH)
  if (stale.length > 0) {
    await del(stale.map((b) => b.url))
  }
}
