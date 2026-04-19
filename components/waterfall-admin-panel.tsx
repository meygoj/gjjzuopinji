"use client"

import { useState } from "react"
import Image from "next/image"
import { FileUpload } from "./file-upload"
import { WaterfallItem, waterfallItems } from "@/lib/waterfall-data"

export default function WaterfallAdminPanel() {
  const [items, setItems] = useState<WaterfallItem[]>(waterfallItems)
  const [isAdding, setIsAdding] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentItem, setCurrentItem] = useState<WaterfallItem | null>(null)
  const [activeTab, setActiveTab] = useState<"list" | "form">("list")

  const handleFileUpload = async (file: File): Promise<string> => {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload/file', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('上传失败')
      }

      const data = await response.json()
      return data.url
    } catch (error) {
      console.error('File upload error:', error)
      throw error
    }
  }

  const handleAdd = () => {
    setCurrentItem({
      id: `item-${Date.now()}`,
      src: "",
      alt: "",
      title: "",
      category: "",
      aspectRatio: 1,
      isVideo: false,
      originalSrc: "",
      compareSrc: []
    })
    setIsAdding(true)
    setIsEditing(true)
    setActiveTab("form")
  }

  const handleEdit = (item: WaterfallItem) => {
    setCurrentItem({ ...item })
    setIsAdding(false)
    setIsEditing(true)
    setActiveTab("form")
  }

  const handleDelete = (id: string) => {
    if (confirm("确定要删除这个项目吗？")) {
      setItems(items.filter(item => item.id !== id))
    }
  }

  const handleSave = () => {
    if (!currentItem) return

    if (isAdding) {
      setItems([...items, currentItem])
    } else {
      setItems(items.map(item => item.id === currentItem.id ? currentItem : item))
    }

    setIsEditing(false)
    setIsAdding(false)
    setCurrentItem(null)
    setActiveTab("list")
  }

  const handleCancel = () => {
    setIsEditing(false)
    setIsAdding(false)
    setCurrentItem(null)
    setActiveTab("list")
  }

  const updateItem = (field: keyof WaterfallItem, value: any) => {
    if (!currentItem) return
    setCurrentItem({ ...currentItem, [field]: value })
  }

  const exportData = () => {
    const dataStr = JSON.stringify(items, null, 2)
    const blob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `waterfall-data-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const copyToClipboard = () => {
    const dataStr = `export interface WaterfallItem {
  id: string
  src: string
  alt: string
  title: string
  category: string
  aspectRatio: number
  isVideo?: boolean
  originalSrc?: string
  compareSrc?: string[]
}

export const waterfallItems: WaterfallItem[] = ${JSON.stringify(items, null, 2)}`
    navigator.clipboard.writeText(dataStr)
    alert("数据已复制到剪贴板！请替换 lib/waterfall-data.ts 文件内容。\n\n步骤：\n1. 打开 lib/waterfall-data.ts 文件\n2. 全选并删除现有内容\n3. 粘贴复制的代码\n4. 保存文件\n\n这样前端页面就会显示新上传的作品。")
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">瀑布流数据管理面板</h1>
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
              <button
                onClick={async () => {
                  try {
                    const dataStr = `export interface WaterfallItem {
  id: string
  src: string
  alt: string
  title: string
  category: string
  aspectRatio: number
  isVideo?: boolean
  originalSrc?: string
  compareSrc?: string[]
}

export const waterfallItems: WaterfallItem[] = ${JSON.stringify(items, null, 2)}`
                    
                    const response = await fetch('/api/admin/update-waterfall', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify({ data: dataStr })
                    })
                    
                    if (response.ok) {
                      alert('前端数据已成功更新！请刷新页面查看效果。')
                    } else {
                      const error = await response.json()
                      alert('更新失败：' + (error.error || '未知错误'))
                    }
                  } catch (error) {
                    console.error('Update error:', error)
                    alert('更新失败：' + (error instanceof Error ? error.message : '网络错误'))
                  }
                }}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                更新前端数据
              </button>
              {!isEditing && (
                <button
                  onClick={handleAdd}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  添加项目
                </button>
              )}
            </div>
          </div>
        </div>

        {activeTab === "list" && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <div key={item.id} className="bg-gray-50 rounded-lg p-4 hover:shadow-lg transition-shadow">
                  <div className="relative aspect-[4/3] mb-4 rounded-lg overflow-hidden bg-gray-200">
                    {item.src ? (
                      item.isVideo ? (
                        <video 
                          src={item.src}
                          alt={item.alt}
                          className="w-full h-full object-cover"
                          muted
                          loop
                          playsInline
                        />
                      ) : (
                        <Image 
                          src={item.src} 
                          alt={item.alt} 
                          fill 
                          className="object-cover" 
                        />
                      )
                    ) : (
                      <div className="flex items-center justify-center h-full w-full text-gray-400">
                        {item.originalSrc ? '对比图项目' : '无图片'}
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{item.alt}</p>
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">{item.category}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        编辑
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                      >
                        删除
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {items.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                没有瀑布流项目
              </div>
            )}
          </div>
        )}

        {activeTab === "form" && currentItem && (
          <div className="p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ID</label>
                  <input
                    type="text"
                    value={currentItem.id}
                    onChange={(e) => updateItem("id", e.target.value)}
                    disabled={!isAdding}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">类型</label>
                  <select
                    value={currentItem.isVideo ? "video" : "image"}
                    onChange={(e) => updateItem("isVideo", e.target.value === "video")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="image">图片</option>
                    <option value="video">视频</option>
                  </select>
                </div>
              </div>

              <div className="p-6 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">基本信息</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">类型</label>
                    <select
                      value={currentItem.isVideo ? "video" : "image"}
                      onChange={(e) => updateItem("isVideo", e.target.value === "video")}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="image">图片</option>
                      <option value="video">视频</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">分类</label>
                    <select
                      value={currentItem.category}
                      onChange={(e) => updateItem("category", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">选择分类</option>
                      <option value="直播运营">直播运营</option>
                      <option value="AIGC · 设计">AIGC · 设计</option>
                      <option value="自动化工作流">自动化工作流</option>
                      <option value="数据可视化">数据可视化</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">文件路径 (可选，如只上传对比图可留空)</label>
                  <input
                    type="text"
                    value={currentItem.src}
                    onChange={(e) => updateItem("src", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mb-4"
                    placeholder="/images/work-example.jpg 或 /videos/example.mp4"
                  />
                  <FileUpload 
                    onFileUpload={async (file) => {
                      const path = await handleFileUpload(file)
                      updateItem("src", path)
                      return path
                    }}
                    acceptedTypes={currentItem.isVideo ? "video/*" : "image/*"}
                  />
                  <p className="mt-1 text-xs text-gray-500">如果只上传对比图，此部分可留空</p>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">标题</label>
                  <input
                    type="text"
                    value={currentItem.title}
                    onChange={(e) => updateItem("title", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">描述</label>
                  <input
                    type="text"
                    value={currentItem.alt}
                    onChange={(e) => updateItem("alt", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">宽高比</label>
                  <input
                    type="number"
                    value={currentItem.aspectRatio}
                    onChange={(e) => updateItem("aspectRatio", parseFloat(e.target.value) || 1)}
                    step="0.1"
                    min="0.1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">例如：1 表示正方形，4/5=0.8 表示竖屏，16/9≈1.78 表示横屏</p>
                </div>
              </div>

              <div className="p-6 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">对比图设置 (可选)</h3>
                <p className="text-sm text-gray-600 mb-4">添加原图和设计图后会在页面上显示对比效果</p>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">原图</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="text"
                      value={currentItem.originalSrc || ""}
                      onChange={(e) => updateItem("originalSrc", e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="原图 URL 或留空"
                    />
                    <FileUpload 
                      onFileUpload={async (file) => {
                        const path = await handleFileUpload(file)
                        updateItem("originalSrc", path)
                        return path
                      }}
                      acceptedTypes="image/*"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">设计图 1</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="text"
                      value={currentItem.compareSrc?.[0] || ""}
                      onChange={(e) => {
                        const newCompareSrc = [...(currentItem.compareSrc || [])]
                        newCompareSrc[0] = e.target.value
                        updateItem("compareSrc", newCompareSrc)
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="设计图 1 URL 或留空"
                    />
                    <FileUpload
                      onFileUpload={async (file) => {
                        const path = await handleFileUpload(file)
                        const newCompareSrc = [...(currentItem.compareSrc || [])]
                        newCompareSrc[0] = path
                        updateItem("compareSrc", newCompareSrc)
                        return path
                      }}
                      acceptedTypes="image/*"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">设计图 2</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="text"
                      value={currentItem.compareSrc?.[1] || ""}
                      onChange={(e) => {
                        const newCompareSrc = [...(currentItem.compareSrc || [])]
                        newCompareSrc[1] = e.target.value
                        updateItem("compareSrc", newCompareSrc)
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="设计图 2 URL 或留空"
                    />
                    <FileUpload
                      onFileUpload={async (file) => {
                        const path = await handleFileUpload(file)
                        const newCompareSrc = [...(currentItem.compareSrc || [])]
                        newCompareSrc[1] = path
                        updateItem("compareSrc", newCompareSrc)
                        return path
                      }}
                      acceptedTypes="image/*"
                    />
                  </div>
                </div>
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
