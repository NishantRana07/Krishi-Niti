"use client"

import type React from "react"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Droplets, Plus } from "lucide-react"

// Sample soil analysis data
const sampleAnalysis = {
  date: "2024-10-28",
  location: "Field A",
  ph: 6.8,
  moisture: 45,
  nitrogen: 120,
  phosphorus: 35,
  potassium: 180,
  organicMatter: 2.5,
  texture: "Loamy",
  recommendation: "Soil is in good condition. Consider adding phosphorus for better crop yield.",
}

export default function SoilAnalysisPage() {
  const [formData, setFormData] = useState({
    location: "",
    ph: "",
    moisture: "",
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    organicMatter: "",
    texture: "Loamy",
  })

  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Soil Analysis</h1>
        <p className="text-muted-foreground">Analyze your soil health and get recommendations</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6">Enter Soil Data</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Field Location</label>
              <input
                type="text"
                name="location"
                placeholder="e.g., Field A"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">pH Level</label>
                <input
                  type="number"
                  name="ph"
                  placeholder="6.8"
                  step="0.1"
                  value={formData.ph}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Moisture (%)</label>
                <input
                  type="number"
                  name="moisture"
                  placeholder="45"
                  value={formData.moisture}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nitrogen (mg/kg)</label>
                <input
                  type="number"
                  name="nitrogen"
                  placeholder="120"
                  value={formData.nitrogen}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phosphorus (mg/kg)</label>
                <input
                  type="number"
                  name="phosphorus"
                  placeholder="35"
                  value={formData.phosphorus}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Potassium (mg/kg)</label>
                <input
                  type="number"
                  name="potassium"
                  placeholder="180"
                  value={formData.potassium}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Organic Matter (%)</label>
                <input
                  type="number"
                  name="organicMatter"
                  placeholder="2.5"
                  step="0.1"
                  value={formData.organicMatter}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Soil Texture</label>
              <select
                name="texture"
                value={formData.texture}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option>Loamy</option>
                <option>Sandy</option>
                <option>Clay</option>
                <option>Silty</option>
              </select>
            </div>

            <Button type="submit" className="w-full gap-2">
              <Plus className="w-4 h-4" />
              Analyze Soil
            </Button>

            {submitted && (
              <div className="p-4 bg-green-100 text-green-800 rounded-lg">Soil data submitted successfully!</div>
            )}
          </form>
        </Card>

        {/* Sample Analysis Result */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Droplets className="w-6 h-6 text-primary" />
            Latest Analysis
          </h2>
          <div className="space-y-4">
            <div className="border-b border-border pb-3">
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="font-semibold">{sampleAnalysis.date}</p>
            </div>
            <div className="border-b border-border pb-3">
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="font-semibold">{sampleAnalysis.location}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 border-b border-border pb-3">
              <div>
                <p className="text-sm text-muted-foreground">pH Level</p>
                <p className="font-semibold text-lg text-primary">{sampleAnalysis.ph}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Moisture</p>
                <p className="font-semibold text-lg text-primary">{sampleAnalysis.moisture}%</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 border-b border-border pb-3">
              <div>
                <p className="text-sm text-muted-foreground">Nitrogen</p>
                <p className="font-semibold text-primary">{sampleAnalysis.nitrogen} mg/kg</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phosphorus</p>
                <p className="font-semibold text-primary">{sampleAnalysis.phosphorus} mg/kg</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 border-b border-border pb-3">
              <div>
                <p className="text-sm text-muted-foreground">Potassium</p>
                <p className="font-semibold text-primary">{sampleAnalysis.potassium} mg/kg</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Organic Matter</p>
                <p className="font-semibold text-primary">{sampleAnalysis.organicMatter}%</p>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-blue-900 mb-2">Recommendation</p>
              <p className="text-blue-800">{sampleAnalysis.recommendation}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
