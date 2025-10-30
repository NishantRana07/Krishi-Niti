"use client"

import { Card } from "@/components/ui/card"
import { Leaf, AlertCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { getFarmerProfile } from "@/lib/storage"

export default function RecommendationsPage() {
  const farmerProfile = getFarmerProfile()
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await fetch("/api/recommendations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ farmerContext: farmerProfile }),
        })

        const data = await response.json()
        setRecommendations(data.recommendations || [])
      } catch (error) {
        console.error("Error fetching recommendations:", error)
        // Fallback to sample data
        setRecommendations([
          {
            crop: "Wheat",
            yield: "45 tons/ha",
            profit: "₹85,000",
            season: "Winter",
            waterNeeded: "450mm",
            fertilizer: "NPK 20:20:20",
            daysToMaturity: 120,
            marketPrice: "₹2,500/quintal",
            risk: "Low",
            reason: "Optimal soil pH and moisture for wheat cultivation",
          },
          {
            crop: "Rice",
            yield: "38 tons/ha",
            profit: "₹72,000",
            season: "Monsoon",
            waterNeeded: "1200mm",
            fertilizer: "NPK 15:15:15",
            daysToMaturity: 135,
            marketPrice: "₹3,200/quintal",
            risk: "Medium",
            reason: "Requires more water management",
          },
          {
            crop: "Corn",
            yield: "52 tons/ha",
            profit: "₹95,000",
            season: "Summer",
            waterNeeded: "600mm",
            fertilizer: "NPK 25:15:15",
            daysToMaturity: 110,
            marketPrice: "₹2,800/quintal",
            risk: "Low",
            reason: "Excellent soil conditions for corn",
          },
          {
            crop: "Soybean",
            yield: "28 tons/ha",
            profit: "₹65,000",
            season: "Monsoon",
            waterNeeded: "600mm",
            fertilizer: "NPK 10:20:20",
            daysToMaturity: 100,
            marketPrice: "₹4,500/quintal",
            risk: "Low",
            reason: "Good nitrogen fixation potential",
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [farmerProfile])

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Crop Recommendations</h1>
          <p className="text-muted-foreground">Loading AI-powered recommendations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Crop Recommendations</h1>
        <p className="text-muted-foreground">AI-powered recommendations based on your soil and weather</p>
      </div>

      <div className="grid gap-6">
        {recommendations.map((rec, idx) => (
          <Card key={idx} className="p-6 hover:shadow-lg transition-shadow">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Leaf className="w-6 h-6 text-primary" />
                  {rec.crop}
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Expected Yield</span>
                    <span className="font-semibold text-primary">{rec.yield}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Estimated Profit</span>
                    <span className="font-semibold text-green-600 text-lg">{rec.profit}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Season</span>
                    <span className="font-semibold">{rec.season}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Days to Maturity</span>
                    <span className="font-semibold">{rec.daysToMaturity} days</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Water Needed</span>
                    <span className="font-semibold">{rec.waterNeeded}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Fertilizer</span>
                    <span className="font-semibold">{rec.fertilizer}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Market Price</span>
                    <span className="font-semibold text-accent">{rec.marketPrice}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Risk Level</span>
                    <span
                      className={`font-semibold px-3 py-1 rounded text-sm ${
                        rec.risk === "Low" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {rec.risk}
                    </span>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm font-semibold text-blue-900 mb-1 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Why this crop?
                  </p>
                  <p className="text-blue-800 text-sm">{rec.reason}</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
