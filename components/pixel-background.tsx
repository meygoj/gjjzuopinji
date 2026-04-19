"use client"

import { useEffect, useRef } from "react"

interface PixelBackgroundProps {
  density?: number
  speed?: number
  intensity?: number
  className?: string
  /**
   * "hero" 用于欢迎页：饱和度高、速度快；
   * "soft" 用于内容页：更淡更慢，避免干扰阅读。
   */
  variant?: "hero" | "soft"
}

/**
 * 动态暖色像素背景
 * 在 canvas 上绘制网格像素，颜色随时间以柏林风格的波动变化，
 * 呈现沙漠日落般的暖色流动效果。
 */
export function PixelBackground({
  density,
  speed,
  intensity,
  className = "",
  variant = "hero",
}: PixelBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const resolvedDensity = density ?? (variant === "soft" ? 22 : 16)
  const resolvedSpeed = speed ?? (variant === "soft" ? 0.00045 : 0.0009)
  const resolvedIntensity = intensity ?? (variant === "soft" ? 0.7 : 1)
  const softMode = variant === "soft"

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId = 0
    let width = 0
    let height = 0
    let cols = 0
    let rows = 0
    const cellSize = resolvedDensity

    // 暖色调色板：从奶油 -> 琥珀 -> 橙 -> 赤陶
    const palette: Array<[number, number, number]> = [
      [248, 228, 193], // cream
      [243, 206, 152], // sand
      [232, 168, 104], // amber
      [211, 126, 71], // orange
      [176, 87, 54], // terracotta
      [132, 60, 42], // coffee-red
      [92, 48, 38], // deep coffee
    ]

    const pickColor = (t: number) => {
      const idx = t * (palette.length - 1)
      const i = Math.floor(idx)
      const f = idx - i
      const a = palette[Math.max(0, Math.min(palette.length - 1, i))]
      const b = palette[Math.max(0, Math.min(palette.length - 1, i + 1))]
      return [
        Math.round(a[0] + (b[0] - a[0]) * f),
        Math.round(a[1] + (b[1] - a[1]) * f),
        Math.round(a[2] + (b[2] - a[2]) * f),
      ]
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cols = Math.ceil(width / cellSize) + 1
      rows = Math.ceil(height / cellSize) + 1
    }

    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)

    const render = (time: number) => {
      const t = time * resolvedSpeed
      // 清空为奶油底色
      ctx.fillStyle = "rgb(248, 228, 193)"
      ctx.fillRect(0, 0, width, height)

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          // 用叠加正弦波模拟柏林噪声的流动
          const nx = x * 0.12
          const ny = y * 0.12
          const v =
            Math.sin(nx + t) * 0.5 +
            Math.sin(ny * 1.3 - t * 1.2) * 0.3 +
            Math.sin((nx + ny) * 0.6 + t * 0.7) * 0.2

          const n = (v + 1) / 2 // 归一化到 0-1
          const shaped = Math.pow(n, 1.6) * resolvedIntensity
          const [r, g, b] = pickColor(Math.min(1, shaped))

          // 像素化方块，偶尔跳过形成颗粒感
          const hash = (x * 73856093) ^ (y * 19349663)
          const flicker = ((hash + Math.floor(time / 120)) & 63) === 0 ? 0.7 : 1

          const alpha = (softMode ? 0.55 : 0.92) * flicker
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize)
        }
      }

      // 柔光渐晕，聚焦中心
      const gradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        Math.min(width, height) * 0.2,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.75,
      )
      gradient.addColorStop(0, "rgba(0,0,0,0)")
      gradient.addColorStop(1, "rgba(60, 28, 20, 0.45)")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)

      animationId = requestAnimationFrame(render)
    }

    animationId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animationId)
      observer.disconnect()
    }
  }, [resolvedDensity, resolvedSpeed, resolvedIntensity, softMode])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`absolute inset-0 h-full w-full ${className}`}
    />
  )
}
