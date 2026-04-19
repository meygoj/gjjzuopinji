"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from "react"

interface ToastContextType {
  showToast: (message: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{ message: string; id: number } | null>(null)

  const showToast = useCallback((message: string) => {
    const id = Date.now()
    setToast({ message, id })
    setTimeout(() => {
      setToast(current => current?.id === id ? null : current)
    }, 3000)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="relative border-2 border-pixel-coffee bg-pixel-cream px-6 py-4 shadow-[6px_6px_0_0_rgba(92,48,38,0.25)]">
            <span className="absolute left-0 top-0 size-2 bg-pixel-amber" />
            <span className="absolute right-0 top-0 size-2 bg-pixel-amber" />
            <span className="absolute left-0 bottom-0 size-2 bg-pixel-amber" />
            <span className="absolute right-0 bottom-0 size-2 bg-pixel-amber" />
            <p className="font-display text-base text-pixel-coffee">{toast.message}</p>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  )
}
