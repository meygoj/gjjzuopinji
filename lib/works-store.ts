import { worksBySlug, type WorkDetailData } from "./works-data"

// 内存中的缓存
let cachedWorks: Record<string, WorkDetailData> | null = null

export async function readWorks(): Promise<Record<string, WorkDetailData>> {
  try {
    // 如果有缓存，返回缓存
    if (cachedWorks) {
      return cachedWorks
    }
    // 否则返回初始数据
    return worksBySlug
  } catch (error) {
    console.error("[v0] readWorks error:", error)
    return worksBySlug
  }
}

export async function writeWorks(works: Record<string, WorkDetailData>): Promise<void> {
  try {
    // 更新缓存
    cachedWorks = works
    console.log("[v0] Works data saved to cache")
  } catch (error) {
    console.error("[v0] writeWorks error:", error)
    throw error
  }
}
