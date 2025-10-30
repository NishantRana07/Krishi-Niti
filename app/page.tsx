"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Leaf, Droplets, Bug, MessageSquare, TrendingUp, Shield } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-primary">AgriSense</span>
          </div>
          <div className="flex gap-4">
            <Link href="/dashboard">
              <Button variant="outline">Dashboard</Button>
            </Link>
            <Link href="/dashboard">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6 text-foreground">Smart Farming Starts Here</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          AgriSense uses AI to help you make better farming decisions. Get crop recommendations, analyze soil health,
          detect diseases, and chat with your farming assistant.
        </p>
        <Link href="/dashboard">
          <Button size="lg" className="text-lg px-8 py-6">
            Start Farming Smarter
          </Button>
        </Link>
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Powerful Features</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <Droplets className="w-8 h-8 text-primary" />
              <h3 className="text-xl font-semibold">Soil Analysis</h3>
            </div>
            <p className="text-muted-foreground">
              Track soil health with detailed analysis of pH, moisture, nutrients, and more.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-8 h-8 text-accent" />
              <h3 className="text-xl font-semibold">Smart Recommendations</h3>
            </div>
            <p className="text-muted-foreground">
              Get AI-powered crop recommendations based on your soil, weather, and location.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <Bug className="w-8 h-8 text-secondary" />
              <h3 className="text-xl font-semibold">Disease Detection</h3>
            </div>
            <p className="text-muted-foreground">
              Upload crop images to detect diseases early and get treatment recommendations.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <MessageSquare className="w-8 h-8 text-primary" />
              <h3 className="text-xl font-semibold">AI Chat Assistant</h3>
            </div>
            <p className="text-muted-foreground">
              Ask questions in your language and get instant farming advice from our AI.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-8 h-8 text-accent" />
              <h3 className="text-xl font-semibold">Weather Integration</h3>
            </div>
            <p className="text-muted-foreground">
              Real-time weather data to help you plan irrigation and pest management.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <Leaf className="w-8 h-8 text-secondary" />
              <h3 className="text-xl font-semibold">Offline Support</h3>
            </div>
            <p className="text-muted-foreground">
              Access your data and get recommendations even without internet connection.
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16 mt-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Farm?</h2>
          <p className="text-lg mb-8 opacity-90">
            Join thousands of farmers using AgriSense to increase yields and reduce costs.
          </p>
          <Link href="/dashboard">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-muted-foreground">
          <p>AgriSense - Smart Farming for Everyone | Hackathon Prototype</p>
        </div>
      </footer>
    </div>
  )
}
