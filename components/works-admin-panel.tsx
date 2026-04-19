"use client"

import { useState } from "react"
import Image from "next/image"

type WorkMeta = {
  label: string
  value: string
}

type WorkSection = {
  title: string
  body: string[]
}

type WorkDetailData = {
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

const initialWorks: Record<string, WorkDetailData> = {
  "livestream-engine": {
    slug: "livestream-engine",
    title: "爆款直播引擎",
    subtitle: "让每一场无人直播都变成可复制的 GMV 事件",
    category: "直播运营",
    summary: "主导快手无人直播闭环,从选品、话术、节奏到投放链路全链搭建。通过高频 A/B 测试与轻量化混剪素材池,将单场 GMV 稳定推升至 50 万+,并沉淀出一套可复制给团队成员的 SOP 与数字资产。",
    cover: "/images/work-livestream.jpg",
    meta: [
      { label: "客户", value: "某头部快消品牌" },
      { label: "年份", value: "2024 — 至今" },
      { label: "角色", value: "直播操盘手 · 主导" },
      { label: "工具", value: "快手磁力金牛 · 剪映 · 飞书" },
    ],
    sections: [
      {
        title: "打不同新销售引擎",
        body: [
          "主导快手无人直播闭环,精细化调优视觉素材与高转化话术,在 2 个月内将日均 GMV 稳定拉高 3.8 倍。",
          "建立了基于商品 ROI 与观众画像的节奏表模型,直播间可以在 4 小时内自动完成从暖场到爆单的节奏切换。",
        ],
      },
      {
        title: "爆款复制逻辑",
        body: [
          "通过高频 A/B 测试与轻量化混剪,建立高 ROI 的短视频多形式矩阵。每条素材平均产出 3 条变体,用于直播投流与引流双路径。",
          "配套搭建爆款归档库,所有高 CTR 素材都会回流到 Midjourney 结构化 Prompt 中,作为下一轮创作的冷启动资产。",
        ],
      },
    ],
    highlights: [
      { num: "50万+", label: "单场 GMV" },
      { num: "15K / 日", label: "带货峰值" },
      { num: "3.8×", label: "GMV 增幅" },
    ],
    nextSlug: "brand-visual",
  },
  "brand-visual": {
    slug: "brand-visual",
    title: "品牌视觉资产",
    subtitle: "用 AIGC 重塑美术生产力,让视觉变成可规模化的资产",
    category: "AIGC · 设计",
    summary: "通过 Midjourney 的结构化 Prompt 设计,搭建出一套可复制的品牌视觉资产生产线。从 IP 角色到商品原图,从电商成品图到直播背板,保持 100% 的品牌视觉一致性,同时把交付周期缩短到原来的 40%。",
    cover: "/images/work-aigc.jpg",
    meta: [
      { label: "客户", value: "多个电商与本地生活商家" },
      { label: "年份", value: "2023 — 2024" },
      { label: "角色", value: "创意总监 · AIGC 落地" },
      { label: "工具", value: "Midjourney · Photoshop · Figma" },
    ],
    sections: [
      {
        title: "极致审美控制",
        body: [
          "精通 Midjourney 结构化 Prompt 设计,确保 IP 角色与品牌视觉在不同场景下 100% 一致。",
          "同一个 IP 可以无缝切换到电商主图、直播背板、短视频封面与私域推文,摆脱过往&ldquo;抽卡式&rdquo;创作的不确定性。",
        ],
      },
      {
        title: "视觉牌维打造",
        body: [
          "将前 AI 成图技术引入电商商品与本地生活场景,实现高级感美术的规模化产出。",
          "为品牌搭建视觉中台,产品图 → 原图 → 成品图 → 分发物料一条龙,设计师交付效率提升 50% 以上。",
        ],
      },
    ],
    highlights: [
      { num: "100%", label: "IP 一致性" },
      { num: "50%↑", label: "美术人效" },
      { num: "40%↓", label: "交付周期" },
    ],
    nextSlug: "content-assembly",
  },
  "content-assembly": {
    slug: "content-assembly",
    title: "内容工业化流水线",
    subtitle: "把创作变成可监控、可复用、可迭代的生产线",
    category: "自动化工作流",
    summary: "把绝活盒式产出:独立搭建并主导 ComfyUI 节点工作流,让 AIGC 从&ldquo;抽卡&rdquo;变为&ldquo;精准可控&rdquo;的工业化生产线。建立专属 Lora 模型与重绘流程,实现营销素材的批量矩阵分发。",
    cover: "/images/work-workflow.jpg",
    meta: [
      { label: "模块数", value: "12 条核心节点流" },
      { label: "年份", value: "2024 — 至今" },
      { label: "角色", value: "工作流架构师" },
      { label: "工具", value: "ComfyUI · Lora · Python" },
    ],
    sections: [
      {
        title: "技术业务化",
        body: [
          "独立搭建并主导 ComfyUI 节点工作流,把 AIGC 从&ldquo;抽卡&rdquo;精准可控的工业化生产线。",
          "数字资产沉淀:建立专属 Lora 模型与重绘流程,实现营销素材的批量矩阵分发,所有产出都可版本管理、可灰度测试。",
        ],
      },
      {
        title: "从原型到流水线",
        body: [
          "上游接入爆款选题库,中游调用结构化 Prompt 与 Lora,下游直接导出抖音 / 小红书 / 电商详情页的标准物料。",
          "整条流水线让一名运营一天内可独立产出 200+ 张可投放的高质量素材,人效较传统方式提升近 5 倍。",
        ],
      },
    ],
    highlights: [
      { num: "200+", label: "日产物料" },
      { num: "12", label: "节点流模块" },
      { num: "5×", label: "人效提升" },
    ],
    nextSlug: "commerce-dashboard",
  },
  "commerce-dashboard": {
    slug: "commerce-dashboard",
    title: "商业数据矩阵",
    subtitle: "让每一次营销动作都能被监控、被复盘、被复利",
    category: "数据可视化",
    summary: "从获客到留存,从带货到复购的全链路数据面板。通过智能客服链路、货架与本地生活、数据驱动复购三大板块,把用户总触达拉升 25%,复购率同比提升 21%。",
    cover: "/images/work-data.jpg",
    meta: [
      { label: "覆盖链路", value: "获客 · 成交 · 复购" },
      { label: "年份", value: "2024" },
      { label: "角色", value: "数据产品 Owner" },
      { label: "工具", value: "Coze · 飞书多维表 · FineBI" },
    ],
    sections: [
      {
        title: "智能客服链路",
        body: [
          "基于 Coze 搭建业务流 AI 智能体,全天候承接流量。用户进入客服的第一触点即可被自动引导至合适的货架路径,告别传统人工客服的高成本与低响应。",
          "复杂问题自动升级人工,常见问题 90% 自动化解决,整体客服团队人效提升 3 倍。",
        ],
      },
      {
        title: "货架与本地生活",
        body: [
          "统筹小程序选品上架,打通本地服务商闭环。结合 LBS 将流量精准匹配到门店,让线上种草与线下核销形成真实闭环。",
          "数据驱动复购:重构用户忠诚度计划,通过数据触达使复购率拉升 25%。",
        ],
      },
    ],
    highlights: [
      { num: "15K / 日", label: "带货峰值" },
      { num: "25%↑", label: "复购率" },
      { num: "3×", label: "客服人效" },
    ],
    nextSlug: "livestream-engine",
  },
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
  const [works, setWorks] = useState<Record<string, WorkDetailData>>(initialWorks)
  const [selectedWork, setSelectedWork] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [editData, setEditData] = useState<WorkDetailData | null>(null)
  const [activeTab, setActiveTab] = useState<"list" | "form">("list")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("")

  const categories = [...new Set(Object.values(works).map((w) => w.category))]

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

  const handleSave = () => {
    if (!editData) return

    if (isAdding) {
      setWorks((prev) => ({ ...prev, [editData.slug]: editData }))
    } else if (selectedWork) {
      setWorks((prev) => ({ ...prev, [selectedWork]: editData }))
    }

    setIsEditing(false)
    setIsAdding(false)
    setEditData(null)
    setSelectedWork(null)
    setActiveTab("list")
  }

  const handleCancel = () => {
    setIsEditing(false)
    setIsAdding(false)
    setEditData(null)
    setSelectedWork(null)
    setActiveTab("list")
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
    const dataStr = `export const worksBySlug: Record<string, WorkDetailData> = ${JSON.stringify(works, null, 2)}`
    navigator.clipboard.writeText(dataStr)
    alert("数据已复制到剪贴板！请替换 lib/works-data.ts 文件内容。")
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">作品数据管理面板</h1>
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

        {activeTab === "list" && (
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
                    <Image src={work.cover} alt={work.title} fill className="object-cover" />
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
                <label className="block text-sm font-medium text-gray-700 mb-2">封面图片路径</label>
                <input
                  type="text"
                  value={editData.cover}
                  onChange={(e) => updateEditData("cover", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="/images/work-example.jpg"
                />
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
