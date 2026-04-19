import { del } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"
import { readItems, writeItems } from "@/lib/items-store"

export const runtime = "nodejs"

export async function GET() {
  try {
    const items = await readItems()
    return NextResponse.json({ items })
  } catch (error) {
    console.error("[v0] list items error:", error)
    return NextResponse.json({ error: "读取作品列表失败" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = (await request.json()) as { id?: string }
    if (!id) {
      return NextResponse.json({ error: "缺少作品 ID" }, { status: 400 })
    }

    const items = await readItems()
    const target = items.find((item) => item.id === id)
    if (!target) {
      return NextResponse.json({ error: "未找到该作品" }, { status: 404 })
    }

    await del(target.url)
    const next = items.filter((item) => item.id !== id)
    await writeItems(next)

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("[v0] delete item error:", error)
    return NextResponse.json({ error: "删除失败" }, { status: 500 })
  }
}
