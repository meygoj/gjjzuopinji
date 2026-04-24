"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Layers, Grid, Upload, Home, ArrowLeft } from "lucide-react"
import WorksAdminPanel from "./works-admin-panel"
import WaterfallAdminPanel from "./waterfall-admin-panel"
import BatchUploadAdmin from "./batch-upload-admin"
import { worksBySlug } from "@/lib/works-data"

export default function UnifiedAdminPanel() {
  const [activeTab, setActiveTab] = useState<"works" | "waterfall" | "batch">("works")
  
  // 动态获取所有分类
  const categories = [...new Set(Object.values(worksBySlug).map(work => work.category))]
  
  // 把当前分类传递给子组件 - 通过上下文或直接修改组件
  // 先创建版本，然后修复分类问题

  const tabs = [
    { id: "works" as const, name: "作品管理", icon: Layers, color: "bg-green-600" },
    { id: "waterfall" as const, name: "瀑布流管理", icon: Grid, color: "bg-blue-600" },
    { id: "batch" as const, name: "批量上传", icon: Upload, color: "bg-purple-600" },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 顶部导航栏 */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">数据管理中心</h1>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">统一管理</span>
              </div>
              <div className="flex gap-2">
                <Link
                  href="/"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Home className="h-4 w-4" />
                  访问首页
                </Link>
                <Link
                  href="/work/all"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  查看作品
                </Link>
              </div>
            </div>
            
            {/* 快速切换标签 */}
            <div className="flex gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? `${tab.color} text-white shadow-md`
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  {tab.name}
                </button>
              ))}
            </div>
            
            {/* 当前分类提示 */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">现有分类：</span>
                {categories.join('，')}
                <span className="ml-2 text-blue-600">(可在作品管理中添加新分类)</span>
              </p>
            </div>
          </div>
        </div>

        {/* 内容区域 */}
        <div className="bg-white rounded-lg shadow">
          {activeTab === "works" && (
            <div className="p-4">
              <WorksAdminPanel />
            </div>
          )}
          
          {activeTab === "waterfall" && (
            <div className="p-4">
              <WaterfallAdminPanel />
            </div>
          )}
          
          {activeTab === "batch" && (
            <div className="p-4">
              <BatchUploadAdmin />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
