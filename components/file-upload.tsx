"use client"

import { useState } from "react"
import { Upload, Loader2 } from "lucide-react"

interface FileUploadProps {
  onFileUpload: (file: File) => Promise<string>
  acceptedTypes?: string
  maxSize?: number
  className?: string
}

export function FileUpload({ 
  onFileUpload, 
  acceptedTypes = "image/*,video/*", 
  maxSize = 500 * 1024 * 1024, // 500MB
  className = ""
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    setIsUploading(true)

    try {
      if (file.size > maxSize) {
        throw new Error(`文件大小超过限制（${maxSize / 1024 / 1024}MB）`)
      }

      const result = await onFileUpload(file)
      console.log("File uploaded successfully:", result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "上传失败")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        上传文件 <span className="text-gray-500">（最大 {maxSize / 1024 / 1024}MB）</span>
      </label>
      <div className="flex items-center gap-3">
        <input
          type="file"
          accept={acceptedTypes}
          onChange={handleFileChange}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          disabled={isUploading}
        />
        <button
          type="button"
          onClick={() => document.querySelector('input[type="file"]')?.click()}
          disabled={isUploading}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isUploading ? (
            <><Loader2 className="size-4 animate-spin inline mr-1" /> 上传中...</>
          ) : (
            <><Upload className="size-4 inline mr-1" /> 选择文件</>
          )}
        </button>
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
