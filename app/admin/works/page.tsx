"use client"

import { useState } from "react"
import WorksAdminPanel from "@/components/works-admin-panel"

export default function AdminWorksPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <WorksAdminPanel />
      </div>
    </div>
  )
}
