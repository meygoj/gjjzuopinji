"use client"

import { useState, useRef } from "react"
import { Upload, X, Image, Video, Loader2 } from "lucide-react"

interface UploadingFile {
  file: File
  id: string
  progress: number
  status: "pending" | "uploading" | "success" | "error"
  url?: string
  error?: string
}

interface BatchUploadProps {
  onFilesUploaded: (files: { file: File; url: string; name: string }[]) => void
  acceptedTypes?: string
  maxFiles?: number
}

export function BatchUpload({ 
  onFilesUploaded, 
  acceptedTypes = "image/*,video/*",
  maxFiles = 50
}: BatchUploadProps) {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isVideoFile = (file: File) => file.type.startsWith("video/")

  const extractFileName = (file: File) => {
    const name = file.name.replace(/\.[^/.]+$/, "")
    return name.replace(/[_-]/g, " ").replace(/^\d+_/, "").trim()
  }

  const handleFiles = async (files: FileList | File[]) => {
    const newFiles = Array.from(files).slice(0, maxFiles)
    const newUploadingFiles: UploadingFile[] = newFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      progress: 0,
      status: "pending"
    }))

    setUploadingFiles(prev => [...prev, ...newUploadingFiles])
    
    for (const uf of newUploadingFiles) {
      await uploadFile(uf)
    }
  }

  const uploadFile = async (uploadingFile: UploadingFile) => {
    setUploadingFiles(prev => prev.map(f => 
      f.id === uploadingFile.id ? { ...f, status: "uploading" as const, progress: 10 } : f
    ))

    try {
      const formData = new FormData()
      formData.append('file', uploadingFile.file)

      const response = await fetch('/api/upload/file', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('上传失败')
      }

      const data = await response.json()
      
      setUploadingFiles(prev => prev.map(f => 
        f.id === uploadingFile.id ? { ...f, status: "success" as const, url: data.url, progress: 100 } : f
      ))
    } catch (error) {
      setUploadingFiles(prev => prev.map(f => 
        f.id === uploadingFile.id ? { 
          ...f, 
          status: "error" as const, 
          error: error instanceof Error ? error.message : "上传失败" 
        } : f
      ))
    }
  }

  const removeFile = (id: string) => {
    setUploadingFiles(prev => prev.filter(f => f.id !== id))
  }

  const importAllFiles = () => {
    const successFiles = uploadingFiles.filter(f => f.status === "success" && f.url)
    const filesToImport = successFiles.map(f => ({
      file: f.file,
      url: f.url!,
      name: extractFileName(f.file)
    }))
    onFilesUploaded(filesToImport)
    setUploadingFiles(prev => prev.filter(f => f.status !== "success"))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const successfulUploads = uploadingFiles.filter(f => f.status === "success").length

  return (
    <div className="space-y-6">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
          isDragging 
            ? 'border-indigo-500 bg-indigo-50' 
            : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
        }`}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-900 mb-2">
          拖拽文件到此处或点击选择
        </p>
        <p className="text-sm text-gray-500 mb-4">
          支持图片和视频文件，最多 {maxFiles} 个文件
        </p>
        <div className="flex justify-center gap-2">
          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">.jpg</span>
          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">.png</span>
          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">.mp4</span>
          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">.webp</span>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes}
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
      </div>

      {uploadingFiles.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              上传列表 ({uploadingFiles.length})
            </h3>
            {successfulUploads > 0 && (
              <button
                onClick={importAllFiles}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                导入 {successfulUploads} 个文件
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {uploadingFiles.map(uploadingFile => (
              <div
                key={uploadingFile.id}
                className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden"
              >
                <div className="relative aspect-video bg-gray-100">
                  {uploadingFile.status === "success" && uploadingFile.url ? (
                    isVideoFile(uploadingFile.file) ? (
                      <video
                        src={uploadingFile.url}
                        className="w-full h-full object-cover"
                        muted
                      />
                    ) : (
                      <img
                        src={uploadingFile.url}
                        alt={uploadingFile.file.name}
                        className="w-full h-full object-cover"
                      />
                    )
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      {isVideoFile(uploadingFile.file) ? (
                        <Video className="h-8 w-8 text-gray-400" />
                      ) : (
                        <Image className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                  )}
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      removeFile(uploadingFile.id)
                    }}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="p-3">
                  <p className="text-sm font-medium text-gray-900 truncate mb-1">
                    {uploadingFile.file.name}
                  </p>
                  <p className="text-xs text-gray-500 mb-2">
                    {(uploadingFile.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  
                  {uploadingFile.status === "uploading" && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-indigo-600">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        上传中...
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full transition-all"
                          style={{ width: `${uploadingFile.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                  
                  {uploadingFile.status === "success" && (
                    <p className="text-sm text-green-600 flex items-center gap-1">
                      <span className="h-2 w-2 bg-green-500 rounded-full" />
                      上传成功
                    </p>
                  )}
                  
                  {uploadingFile.status === "error" && (
                    <p className="text-sm text-red-600">
                      {uploadingFile.error}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
