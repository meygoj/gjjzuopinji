"use client"

import { useState, useRef, useEffect } from "react"
import { X, Send } from "lucide-react"

interface Message {
  id: string
  text: string
  type: "user" | "bot"
  timestamp: Date
}

interface PixelChatProps {
  isOpen: boolean
  onClose: () => void
}

const BOT_RESPONSES = [
  "你好！很高兴认识你！我是郭建军，新媒体操盘手 & 创意营销人 😊",
  "欢迎来到我的作品集！如果你对我的工作感兴趣，我们可以进一步交流。",
  "我专注于将 AIGC 能力转化为可量化的商业增长，有什么我可以帮助你的吗？",
  "我的微信号是 17664066212，邮箱是 meygoj4@gmail.com，欢迎随时联系！",
  "我过去几年主导过单场 50 万+ GMV 的无人直播闭环，对直播运营很熟悉~",
  "我用 Midjourney 与 ComfyUI 搭建出完整的内容工业化流水线，需要设计服务吗？",
  "期待与你共创增长！用技术的杠杆撬动无限可能！🚀"
]

export function PixelChat({ isOpen, onClose }: PixelChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "你好！欢迎来到我的像素工坊！我是郭建军，有什么想跟我聊的吗？✨",
      type: "bot",
      timestamp: new Date()
    }
  ])
  const [inputText, setInputText] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // 自动滚动到底部
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // 自动聚焦输入框
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    
    if (!inputText.trim()) return
    
    // 添加用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      type: "user",
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setInputText("")
    
    // 延迟显示机器人回复
    setTimeout(() => {
      const randomReply = BOT_RESPONSES[Math.floor(Math.random() * BOT_RESPONSES.length)]
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: randomReply,
        type: "bot",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botMessage])
    }, 800)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-pixel-coffee/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md border-2 border-pixel-coffee bg-pixel-cream shadow-[8px_8px_0_0_rgba(92,48,38,0.25)]">
        {/* 像素角落装饰 */}
        <span className="absolute left-0 top-0 size-2 bg-pixel-amber" />
        <span className="absolute right-0 top-0 size-2 bg-pixel-amber" />
        <span className="absolute left-0 bottom-0 size-2 bg-pixel-amber" />
        <span className="absolute right-0 bottom-0 size-2 bg-pixel-amber" />
        
        {/* 头部 */}
        <div className="flex items-center justify-between border-b-2 border-pixel-coffee bg-pixel-coffee px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="relative size-10 overflow-hidden border-2 border-pixel-amber pixel-avatar-frame">
              <img 
                src="/images/avatar.jpg" 
                alt="郭建军头像" 
                className="w-full h-full object-cover pixel-avatar"
              />
              <div className="absolute inset-0 pointer-events-none pixel-art-effect" />
            </div>
            <div>
              <h3 className="font-display text-lg text-pixel-amber">郭建军</h3>
              <p className="font-mono text-xs text-pixel-cream/70">新媒体操盘手 · 创意营销人</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="grid size-10 place-items-center text-pixel-amber transition-transform hover:rotate-90 hover:text-pixel-cream"
          >
            <X className="size-5" strokeWidth={2.5} />
          </button>
        </div>
        
        {/* 消息区域 */}
        <div className="h-80 overflow-y-auto p-4 bg-pixel-cream/50">
          <div className="flex flex-col gap-3">
            {messages.map((message) => (
              <div 
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] p-3 border-2 ${
                    message.type === 'user' 
                      ? 'border-pixel-amber bg-pixel-amber text-pixel-coffee shadow-[4px_4px_0_0_rgba(255,179,71,0.25)]' 
                      : 'border-pixel-coffee bg-pixel-cream text-pixel-coffee shadow-[4px_4px_0_0_rgba(92,48,38,0.25)]'
                  }`}
                >
                  <p className="font-sans text-sm">{message.text}</p>
                  <p className="font-mono text-[10px] mt-1 text-right opacity-60">
                    {message.timestamp.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        {/* 输入区域 */}
        <div className="border-t-2 border-pixel-coffee p-4 bg-pixel-orange">
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="发送消息..."
              className="flex-1 border-2 border-pixel-coffee bg-pixel-cream px-4 py-2 font-sans text-sm text-pixel-coffee focus:outline-none focus:border-pixel-amber"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="grid size-12 place-items-center border-2 border-pixel-coffee bg-pixel-coffee text-pixel-amber transition-all hover:bg-pixel-amber hover:text-pixel-coffee disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="size-5" strokeWidth={2.5} />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
