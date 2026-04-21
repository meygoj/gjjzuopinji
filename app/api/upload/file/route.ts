import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Next.js 13+ App Router 配置
export const maxDuration = 60; // 60秒超时
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    console.log('Uploading file:', file.name, file.size, file.type)

    // 确保上传目录存在
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    if (!fs.existsSync(uploadDir)) {
      console.log('Creating upload directory:', uploadDir)
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    // 清理文件名中的特殊字符，避免URL编码问题
    const cleanFileName = file.name.replace(/[^\w.\-_]/g, '_')
    // 生成唯一文件名
    const fileName = `${Date.now()}_${cleanFileName}`
    const filePath = path.join(uploadDir, fileName)

    console.log('Saving file to:', filePath)

    // 读取文件数据并写入
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    fs.writeFileSync(filePath, buffer)
    console.log('File saved successfully')

    // 返回文件路径
    const fileUrl = `/uploads/${fileName}`
    console.log('File URL:', fileUrl)
    return NextResponse.json({ url: fileUrl }, { status: 200 })
  } catch (error) {
    console.error('File upload error:', error)
    return NextResponse.json({ error: 'File upload failed', details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}
