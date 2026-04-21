"use client"

import Link from "next/link"
import { Grid, Layers, Upload, Settings } from "lucide-react"

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              数据管理中心
            </h1>
            <p className="text-gray-600">
              管理你的作品集内容和数据
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              href="/admin/batch-upload"
              className="group bg-white rounded-lg shadow p-6 hover:shadow-lg transition-all border border-transparent hover:border-indigo-300"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                  <Upload className="h-8 w-8 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">
                    批量上传
                  </h2>
                  <p className="text-gray-600 text-sm">
                    快速批量上传多个作品文件
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/admin/waterfall"
              className="group bg-white rounded-lg shadow p-6 hover:shadow-lg transition-all border border-transparent hover:border-indigo-300"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <Grid className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">
                    瀑布流管理
                  </h2>
                  <p className="text-gray-600 text-sm">
                    管理首页瀑布流显示的内容
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/admin/works"
              className="group bg-white rounded-lg shadow p-6 hover:shadow-lg transition-all border border-transparent hover:border-indigo-300"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                  <Layers className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">
                    作品管理
                  </h2>
                  <p className="text-gray-600 text-sm">
                    管理作品页面的展示内容
                  </p>
                </div>
              </div>
            </Link>

            <div className="group bg-white rounded-lg shadow p-6 border border-gray-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <Settings className="h-8 w-8 text-gray-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">
                    更多功能
                  </h2>
                  <p className="text-gray-600 text-sm">
                    即将推出更多管理功能
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              快速操作
            </h3>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/"
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                访问网站首页
              </Link>
              <Link
                href="/work"
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                查看作品页面
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
