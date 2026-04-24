"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { Upload, Loader2, RefreshCw } from "lucide-react"

export type WorkMeta = {
  label: string
  value: string
}

export type WorkSection = {
  title: string
  body: string[]
}

export type WorkDetailData = {
  slug: string
  title: string
  subtitle: string
  category: string
  summary: string
  cover: string
  meta: WorkMeta[]
  sections: WorkSection[]
  highlights: { num: string; label: string }[]
  nextSlug: string
}

const emptyWork: Omit<WorkDetailData, "slug"> = {
  title: "",
  subtitle: "",
  category: "",
  summary: "",
  cover: "",
  meta: [
    { label: "", value: "" },
    { label: "", value: "" },
    { label: "", value: "" },
    { label: "", value: "" },
  ],
  sections: [
    { title: "", body: ["", ""] },
    { title: "", body: ["", ""] },
  ],
  highlights: [
    { num: "", label: "" },
    { num: "", label: "" },
    { num: "", label: "" },
  ],
  nextSlug: "",
}

export default function WorksAdminPanel() {
  const [works, setWorks] = useState<Record<string, WorkDetailData>>({})
  const [selectedWork, setSelectedWork] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [editData, setEditData] = useState<WorkDetailData | null>(null)
  const [activeTab, setActiveTab] = useState<"list" | "form">("list")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploadingCover, setIsUploadingCover] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const categories = [...new Set(Object.values(works).map((w) => w.category))]

  const loadWorks = useCallback(async () => {
    try {
      setIsLoading(true)
      const res = await fetch("/api/works")
      if (!res.ok) throw new Error("加载失败")
      const data = await res.json()
      if (data.works) {
        setWorks(data.works)
      }
    } catch (error) {
      console.error("加载作品数据失败:", error)
      setMessage({ type: "error", text: "加载作品数据失败" })
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadWorks()
  }, [loadWorks])

  const filteredWorks = Object.values(works).filter((work) => {
    const matchesSearch =
      work.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      work.summary.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !filterCategory || work.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const handleAdd = () => {
    setEditData({
      ...emptyWork,
      slug: `work-${Date.now()}`,
    } as WorkDetailData)
    setIsAdding(true)
    setIsEditing(true)
    setActiveTab("form")
  }

  const handleEdit = (slug: string) => {
    setSelectedWork(slug)
    setEditData(JSON.parse(JSON.stringify(works[slug])))
    setIsAdding(false)
    setIsEditing(true)
    setActiveTab("form")
  }

  const handleDelete = (slug: string) => {
    if (confirm(`确定要删除作品「${works[slug].title}」吗？`)) {
      const newWorks = { ...works }
      delete newWorks[slug]
      setWorks(newWorks)
    }
  }

  const handleSave = async () => {
    if (!editData) return

    try {
      setIsSaving(true)
      setMessage(null)

      let newWorks: Record<string, WorkDetailData>
      if (isAdding) {
        newWorks = { ...works, [editData.slug]: editData }
      } else if (selectedWork) {
        newWorks = { ...works, [selectedWork]: editData }
      } else {
        return
      }

      const res = await fetch("/api/works", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ works: newWorks }),
      })

      if (!res.ok) throw new Error("保存失败")

      setWorks(newWorks)
      setIsEditing(false)
      setIsAdding(false)
      setEditData(null)
      setSelectedWork(null)
      setActiveTab("list")
      setMessage({ type: "success", text: "作品数据保存成功！请点击「复制数据代码」并替换 lib/works-data.ts 文件，然后刷新页面以查看更新。" })
    } catch (error) {
      console.error("保存作品数据失败:", error)
      setMessage({ type: "error", text: "保存作品数据失败" })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setIsAdding(false)
    setEditData(null)
    setSelectedWork(null)
    setActiveTab("list")
    setMessage(null)
  }

  const handleCoverUpload = async (file: File) => {
    if (!editData) return

    try {
      setIsUploadingCover(true)
      
      const reader = new FileReader()
      reader.onload = (e) => {
        const base64 = e.target?.result as string
        updateEditData("cover", base64)
        setMessage({ type: "success", text: "封面图片上传成功！" })
        setTimeout(() => setMessage(null), 3000)
        setIsUploadingCover(false)
      }
      reader.onerror = () => {
        setMessage({ type: "error", text: "上传封面图片失败" })
        setIsUploadingCover(false)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error("上传封面图片失败:", error)
      setMessage({ type: "error", text: "上传封面图片失败" })
      setIsUploadingCover(false)
    }
  }

  const updateEditData = (field: string, value: any) => {
    if (!editData) return
    setEditData({ ...editData, [field]: value })
  }

  const updateMeta = (index: number, field: keyof WorkMeta, value: string) => {
    if (!editData) return
    const newMeta = [...editData.meta]
    newMeta[index] = { ...newMeta[index], [field]: value }
    setEditData({ ...editData, meta: newMeta })
  }

  const updateSection = (index: number, field: keyof WorkSection, value: any) => {
    if (!editData) return
    const newSections = [...editData.sections]
    if (field === "body") {
      newSections[index] = { ...newSections[index], body: value }
    } else {
      newSections[index] = { ...newSections[index], [field]: value }
    }
    setEditData({ ...editData, sections: newSections })
  }

  const updateHighlight = (index: number, field: keyof { num: string; label: string }, value: string) => {
    if (!editData) return
    const newHighlights = [...editData.highlights]
    newHighlights[index] = { ...newHighlights[index], [field]: value }
    setEditData({ ...editData, highlights: newHighlights })
  }

  const exportData = () => {
    const dataStr = JSON.stringify(works, null, 2)
    const blob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `works-data-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const copyToClipboard = () => {
    // 生成完整的TypeScript文件内容
    let dataStr = `export type WorkMeta = {
  label: string
  value: string
}

export type WorkSection = {
  title: string
  body: string[]
}

export type WorkDetailData = {
  slug: string
  title: string
  subtitle: string
  category: string
  summary: string
  cover: string
  meta: WorkMeta[]
  sections: WorkSection[]
  highlights: { num: string; label: string }[]
  nextSlug: string
}

export const worksBySlug: Record<string, WorkDetailData> = ${JSON.stringify(works, null, 2)}`
    
    // 确保JSON中的字符串正确转义
    navigator.clipboard.writeText(dataStr)
    alert("✅ 数据已复制到剪贴板！\n\n请完全替换 lib/works-data.ts 文件的内容。")
  }

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-4 rounded-lg ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {message.text}
        </div>
      )}
      
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <h3 className="text-blue-800 font-semibold mb-2">💡 使用说明</h3>
        <ol className="list-decimal list-inside text-blue-700 space-y-1 text-sm">
          <li>编辑或添加作品信息，支持上传封面图片（会自动转换为base64）</li>
          <li>点击「保存」按钮保存到内存中</li>
          <li>点击「复制数据代码」按钮复制代码</li>
          <li>打开 <code className="bg-blue-100 px-1 rounded">lib/works-data.ts</code> 文件，替换其中的内容</li>
          <li>刷新浏览器页面查看更新后的作品</li>
        </ol>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">作品数据管理面板</h1>
              <button
                onClick={loadWorks}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <RefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
                {isLoading ? "加载中..." : "刷新"}
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={exportData}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                导出 JSON
              </button>
              <button
                onClick={copyToClipboard}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                复制数据代码
              </button>
              {!isEditing && (
                <button
                  onClick={handleAdd}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  添加作品
                </button>
              )}
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-8 animate-spin text-gray-500" />
            <span className="ml-2 text-gray-500">加载中...</span>
          </div>
        ) : activeTab === "list" && (
          <div className="p-6">
            <div className="flex gap-4 mb-6">
              <input
                type="text"
                placeholder="搜索作品..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">全部分类</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWorks.map((work) => (
                <div key={work.slug} className="bg-gray-50 rounded-lg p-4 hover:shadow-lg transition-shadow">
                  <div className="relative h-48 mb-4 rounded-lg overflow-hidden bg-gray-200">
                    {work.cover ? (
                      <Image src={work.cover} alt={work.title} fill className="object-cover" unoptimized />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">无封面</div>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{work.title}</h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{work.summary}</p>
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">{work.category}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(work.slug)}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        编辑
                      </button>
                      <button
                        onClick={() => handleDelete(work.slug)}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                      >
                        删除
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredWorks.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                没有找到匹配的作品
              </div>
            )}
          </div>
        )}

        {activeTab === "form" && editData && (
          <div className="p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
                  <input
                    type="text"
                    value={editData.slug}
                    onChange={(e) => updateEditData("slug", e.target.value)}
                    disabled={!isAdding}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">分类</label>
                  <input
                    type="text"
                    value={editData.category}
                    onChange={(e) => updateEditData("category", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="例如：AIGC · 设计"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">标题</label>
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) => updateEditData("title", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">副标题</label>
                <input
                  type="text"
                  value={editData.subtitle}
                  onChange={(e) => updateEditData("subtitle", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">封面图片</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="relative h-48 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                      {editData.cover ? (
                        <Image src={editData.cover} alt="封面预览" fill className="object-cover" unoptimized />
                      ) : (
                        <span className="text-gray-400">预览区域</span>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editData.cover}
                      onChange={(e) => updateEditData("cover", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="或直接输入图片URL"
                    />
                    <div className="flex items-center gap-2">
                      <label className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer text-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              handleCoverUpload(file)
                            }
                          }}
                          className="hidden"
                        />
                        <span className="flex items-center justify-center gap-2">
                          {isUploadingCover ? (
                            <>
                              <Loader2 className="size-4 animate-spin" />
                              上传中...
                            </>
                          ) : (
                            <>
                              <Upload className="size-4" />
                              上传封面图片
                            </>
                          )}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">简介</label>
                <textarea
                  value={editData.summary}
                  onChange={(e) => updateEditData("summary", e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">元数据</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {editData.meta.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={item.label}
                        onChange={(e) => updateMeta(index, "label", e.target.value)}
                        placeholder="标签"
                        className="w-1/3 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <input
                        type="text"
                        value={item.value}
                        onChange={(e) => updateMeta(index, "value", e.target.value)}
                        placeholder="值"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">高光数据</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {editData.highlights.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={item.num}
                        onChange={(e) => updateHighlight(index, "num", e.target.value)}
                        placeholder="数字"
                        className="w-1/3 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <input
                        type="text"
                        value={item.label}
                        onChange={(e) => updateHighlight(index, "label", e.target.value)}
                        placeholder="标签"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">内容板块</h3>
                {editData.sections.map((section, index) => (
                  <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => updateSection(index, "title", e.target.value)}
                      placeholder="板块标题"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mb-3"
                    />
                    <textarea
                      value={section.body.join("\n")}
                      onChange={(e) => updateSection(index, "body", e.target.value.split("\n"))}
                      rows={4}
                      placeholder="内容（每行一段）"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">下一篇 Slug</label>
                <select
                  value={editData.nextSlug}
                  onChange={(e) => updateEditData("nextSlug", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">无</option>
                  {Object.keys(works).filter((s) => s !== editData.slug).map((slug) => (
                    <option key={slug} value={slug}>
                      {works[slug].title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t">
                <button
                  onClick={handleCancel}
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
