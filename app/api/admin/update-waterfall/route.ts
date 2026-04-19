import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { data } = body

    if (!data) {
      return NextResponse.json({ error: 'No data provided' }, { status: 400 })
    }

    const filePath = path.join(process.cwd(), 'lib', 'waterfall-data.ts')
    
    fs.writeFileSync(filePath, data)

    return NextResponse.json({ message: 'Data updated successfully' }, { status: 200 })
  } catch (error) {
    console.error('Update error:', error)
    return NextResponse.json({ error: 'Failed to update data' }, { status: 500 })
  }
}
