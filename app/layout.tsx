import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AgriSense - Smart Farming Assistant",
  description: "AI-powered farming assistant for crop recommendations, soil analysis, and disease detection",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const isOnboarded = false // Example condition for onboarding status

  if (!isOnboarded) {
    return (
      <html lang="en">
        <body className={`font-sans antialiased`}>
          <div>Redirecting to onboarding...</div>
          {/* Add your redirection logic here */}
          {children}
          <Analytics />
        </body>
      </html>
    )
  }

  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
