"use client"

import { useState } from "react"
import NextImage from "next/image"
import { BatchUpload } from "./batch-upload"
import { WaterfallItem, waterfallItems } from "@/lib/waterfall-data"
import { Video, Image as ImageIcon, Edit3, Trash2, X, Check } from "lucide-react"

interface BatchItem extends Omit<WaterfallItem, 'id' | 'originalSrc' | 'compareSrc'> {
  file: File
}

export default function BatchUploadAdmin() {
  const [items, setItems] = useState<WaterfallItem[]>(waterfallItems)
  const [batchItems, setBatchItems] = useState<BatchItem[]>([])
  const [activeTab, setActiveTab] = useState<"upload" | "list">("upload")

  const isVideoFile = (file: File) => file.type.startsWith("video/")

  const detectAspectRatio = async (file: File): Promise<number> => {
    return new Promise((resolve) => {
      if (isVideoFile(file)) {
        const video = document.createElement('video')
        video.preload = 'metadata'
        video.onloadedmetadata = () => {
          URL.revokeObjectURL(video.src)
          const ratio = video.videoWidth / video.videoHeight
          resolve(ratio || 1)
        }
        video.src = URL.createObjectURL(file)
      } else {
        const img = new Image()
        img.onload = () => {
          URL.revokeObjectURL(img.src)
          const ratio = img.width / img.height
          resolve(ratio || 1)
        }
        img.src = URL.createObjectURL(file)
      }
    })
  }

  const handleFilesUploaded = async (uploadedFiles: { file: File; url: string; name: string }[]) => {
    const newBatchItems: BatchItem[] = []

    for (const { file, url, name } of uploadedFiles) {
      const aspectRatio = await detectAspectRatio(file)
      
      newBatchItems.push({
        file,
        src: url,
        alt: name,
        title: name,
        category: "AIGC · 设计",
        aspectRatio: aspectRatio,
        isVideo: isVideoFile(file)
      })
    }

    setBatchItems(prev => [...prev, ...newBatchItems])
  }

  const removeBatchItem = (index: number) => {
    setBatchItems(prev => prev.filter((_, i) => i !== index))
  }

  const updateBatchItem = (index: number, field: keyof BatchItem, value: any) => {
    setBatchItems(prev => {
      const newItems = [...prev]
      newItems[index] = { ...newItems[index], [field]: value }
      return newItems
    })
  }

  const importAllToWaterfall = () => {
    const newWaterfallItems: WaterfallItem[] = batchItems.map((item, index) => ({
      id: `item-${Date.now()}-${index}`,
      src: item.src,
      alt: item.alt,
      title: item.title,
      category: item.category,
      aspectRatio: item.aspectRatio,
      isVideo: item.isVideo,
      originalSrc: "",
      compareSrc: []
    }))

    setItems(prev => [...prev, ...newWaterfallItems])
    setBatchItems([])
    setActiveTab("list")
  }

  const handleDelete = (id: string) => {
    if (confirm("确定要删除这个项目吗？")) {
      setItems(items.filter(item => item.id !== id))
    }
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
    alert("数据已复制到剪贴板！请替换 lib/waterfall-data.ts 文件内容。")
  }

  const updateFrontendData = async () => {
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
        alert('更新失败')
      }
    } catch (error) {
      alert('更新失败')
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">批量上传作品管理</h1>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab("upload")}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === "upload"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                批量上传
              </button>
              <button
                onClick={() => setActiveTab("list")}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === "list"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                作品列表
              </button>
              {activeTab === "list" && (
                <>
                  <button
                    onClick={exportData}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    导出 JSON
                  </button>
                  <button
                    onClick={copyToClipboard}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    复制代码
                  </button>
                  <button
                    onClick={updateFrontendData}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    更新前端
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {activeTab === "upload" && (
          <div className="p-6 space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                第一步：上传文件
              </h2>
              <BatchUpload
                onFilesUploaded={handleFilesUploaded}
                maxFiles={100}
              />
            </div>

            {batchItems.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    第二步：编辑作品信息 ({batchItems.length})
                  </h2>
                  <button
                    onClick={importAllToWaterfall}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                  >
                    <Check className="h-4 w-4" />
                    全部导入到瀑布流
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {batchItems.map((item, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden"
                    >
                      <div className="relative">
                        <div className="aspect-video bg-gray-100">
                          {item.isVideo ? (
                            <video
                              src={item.src}
                              className="w-full h-full object-cover"
                              muted
                            />
                          ) : (
                            <img
                              src={item.src}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        
                        <button
                          onClick={() => removeBatchItem(index)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>

                        <div className="absolute top-2 left-2 flex gap-1">
                          {item.isVideo ? (
                            <span className="px-2 py-1 bg-red-500 text-white text-xs rounded flex items-center gap-1">
                              <Video className="h-3 w-3" />
                              视频
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded flex items-center gap-1">
                              <ImageIcon className="h-3 w-3" />
                              图片
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-4 space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            标题（文件名称）
                          </label>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => updateBatchItem(index, "title", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            描述
                          </label>
                          <input
                            type="text"
                            value={item.alt}
                            onChange={(e) => updateBatchItem(index, "alt", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              分类
                            </label>
                            <select
                              value={item.category}
                              onChange={(e) => updateBatchItem(index, "category", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            >
                              <option value="直播运营">直播运营</option>
                              <option value="AIGC · 设计">AIGC · 设计</option>
                              <option value="自动化工作流">自动化工作流</option>
                              <option value="数据可视化">数据可视化</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              宽高比
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              value={item.aspectRatio.toFixed(2)}
                              onChange={(e) => updateBatchItem(index, "aspectRatio", parseFloat(e.target.value))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                        </div>

                        <p className="text-xs text-gray-500">
                          原始文件名: {item.file.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

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
                        <NextImage
                          src={item.src}
                          alt={item.alt}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      )
                    ) : (
                      <div className="flex items-center justify-center h-full w-full text-gray-400">
                        无图片
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{item.alt}</p>
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">{item.category}</span>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="h-3 w-3" />
                      删除
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {items.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                没有作品，请先去上传
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
