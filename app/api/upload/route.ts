import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"
import { readItems, writeItems, type MediaItem } from "@/lib/items-store"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const caption = (formData.get("caption") as string | null) ?? ""

    if (!file) {
      return NextResponse.json({ error: "未找到上传的文件" }, { status: 400 })
    }

    const isImage = file.type.startsWith("image/")
    const isVideo = file.type.startsWith("video/")
    if (!isImage && !isVideo) {
      return NextResponse.json(
        { error: "仅支持图片或视频文件" },
        { status: 400 },
      )
    }

    // 上传媒体文件
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_")
    const key = `gallery/media/${Date.now()}-${safeName}`
    const blob = await put(key, file, {
      access: "public",
      contentType: file.type,
    })

    const newItem: MediaItem = {
      id: crypto.randomUUID(),
      url: blob.url,
      pathname: blob.pathname,
      type: isImage ? "image" : "video",
      caption: caption.trim(),
      uploadedAt: new Date().toISOString(),
    }

    const items = await readItems()
    const next = [newItem, ...items]
    await writeItems(next)

    return NextResponse.json({ item: newItem })
  } catch (error) {
    console.error("[v0] upload error:", error)
    return NextResponse.json({ error: "上传失败，请稍后重试" }, { status: 500 })
  }
}
