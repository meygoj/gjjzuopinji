import { type NextRequest, NextResponse } from "next/server"
import { readWorks, writeWorks } from "@/lib/works-store"
import { type WorkDetailData } from "@/lib/works-data"

export const runtime = "nodejs"

export async function GET() {
  try {
    const works = await readWorks()
    return NextResponse.json({ works })
  } catch (error) {
    console.error("[API] works GET error:", error)
    return NextResponse.json({ error: "读取作品数据失败" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { works } = await request.json() as { works: Record<string, WorkDetailData> }
    if (!works || typeof works !== "object") {
      return NextResponse.json({ error: "无效的作品数据格式" }, { status: 400 })
    }
    await writeWorks(works)
    return NextResponse.json({ success: true, works })
  } catch (error) {
    console.error("[API] works POST error:", error)
    return NextResponse.json({ error: "保存作品数据失败" }, { status: 500 })
  }
}
