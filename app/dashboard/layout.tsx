"use client"

import type React from "react"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Leaf, BarChart3, Droplets, Bug, MessageSquare, Settings, Home, TrendingUp } from "lucide-react"
import { useEffect } from "react"
import { isOnboardingComplete } from "@/lib/storage"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (!isOnboardingComplete()) {
      router.push("/onboarding")
    }
  }, [router])

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/dashboard/soil-analysis", label: "Soil Analysis", icon: Droplets },
    { href: "/dashboard/yield-prediction", label: "Yield Prediction", icon: TrendingUp },
    { href: "/dashboard/recommendations", label: "Recommendations", icon: BarChart3 },
    { href: "/dashboard/disease-detection", label: "Disease Detection", icon: Bug },
    { href: "/dashboard/chat", label: "Chat Assistant", icon: MessageSquare },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ]

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card overflow-y-auto">
        <div className="p-6 border-b border-border">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Leaf className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold text-primary">AgriSense</span>
          </Link>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <Button variant={isActive ? "default" : "ghost"} className="w-full justify-start gap-3">
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Button>
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}
