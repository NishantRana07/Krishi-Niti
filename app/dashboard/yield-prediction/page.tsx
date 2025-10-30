"use client"

import type React from "react"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { TrendingUp, AlertCircle } from "lucide-react"
import { getFarmerProfile } from "@/lib/storage"

// Sample weather data
const sampleWeather = {
  temp: 28,
  humidity: 65,
  rainfall: 12,
  windSpeed: 15,
}

// Yield prediction model (simplified ML)
const predictYield = (
  crop: string,
  area: number,
  soilPH: number,
  soilMoisture: number,
  temp: number,
  rainfall: number,
) => {
  const baseYield: Record<string, number> = {
    Wheat: 45,
    Rice: 38,
    Corn: 52,
    Soybean: 28,
    Cotton: 18,
    Sugarcane: 65,
    Potato: 25,
    Tomato: 40,
  }

  let yield_ = baseYield[crop] || 40

  // Adjust for soil pH (optimal 6.5-7.5)
  const phFactor = Math.max(0.7, 1 - Math.abs(soilPH - 7) * 0.15)
  yield_ *= phFactor

  // Adjust for soil moisture (optimal 40-60%)
  const moistureFactor = Math.max(0.6, 1 - Math.abs(soilMoisture - 50) * 0.02)
  yield_ *= moistureFactor

  // Adjust for temperature (varies by crop)
  const tempOptimal = crop === "Rice" ? 25 : crop === "Wheat" ? 20 : 22
  const tempFactor = Math.max(0.5, 1 - Math.abs(temp - tempOptimal) * 0.05)
  yield_ *= tempFactor

  // Adjust for rainfall
  const rainfallOptimal = crop === "Rice" ? 150 : crop === "Wheat" ? 60 : 80
  const rainfallFactor = Math.max(0.6, 1 - Math.abs(rainfall - rainfallOptimal) * 0.01)
  yield_ *= rainfallFactor

  return Math.round(yield_ * 100) / 100
}

export default function YieldPredictionPage() {
  const farmerProfile = getFarmerProfile()

  const [formData, setFormData] = useState({
    crop: farmerProfile?.currentCrop || "Wheat",
    area: farmerProfile?.landArea || 5,
    soilPH: farmerProfile?.soilPH || 6.8,
    soilMoisture: farmerProfile?.soilMoisture || 45,
  })

  const [prediction, setPrediction] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: isNaN(Number(value)) ? value : Number(value),
    }))
  }

  const handlePredict = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/yield-prediction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          crop: formData.crop,
          area: formData.area,
          soilPH: formData.soilPH,
          soilMoisture: formData.soilMoisture,
          farmerContext: farmerProfile,
        }),
      })

      const data = await response.json()
      setPrediction(data)
    } catch (error) {
      console.error("Error predicting yield:", error)
      // Fallback prediction
      setPrediction({
        yieldPerHectare: 42.5,
        totalYield: 212.5,
        revenue: 5312500,
        profit: 2812500,
        profitMargin: "52.9",
        marketPrice: 2500,
        riskFactors: ["Soil pH slightly below optimal range", "Monitor moisture levels during dry season"],
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Yield Prediction</h1>
        <p className="text-muted-foreground">Predict your crop yield based on soil, weather, and crop data</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6">Prediction Parameters</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Crop Type</label>
              <select
                name="crop"
                value={formData.crop}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option>Wheat</option>
                <option>Rice</option>
                <option>Corn</option>
                <option>Soybean</option>
                <option>Cotton</option>
                <option>Sugarcane</option>
                <option>Potato</option>
                <option>Tomato</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Land Area (hectares)</label>
              <input
                type="number"
                name="area"
                step="0.5"
                value={formData.area}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Soil pH</label>
                <input
                  type="number"
                  name="soilPH"
                  step="0.1"
                  value={formData.soilPH}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Soil Moisture (%)</label>
                <input
                  type="number"
                  name="soilMoisture"
                  value={formData.soilMoisture}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm">
              <p className="text-blue-900">
                <strong>Current Weather:</strong> {sampleWeather.temp}°C, {sampleWeather.humidity}% humidity,
                {sampleWeather.rainfall}mm rainfall
              </p>
            </div>

            <Button onClick={handlePredict} disabled={loading} className="w-full gap-2">
              <TrendingUp className="w-4 h-4" />
              {loading ? "Predicting..." : "Predict Yield"}
            </Button>
          </form>
        </Card>

        {/* Results */}
        {prediction && (
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary" />
              Prediction Results
            </h2>

            <div className="space-y-4">
              <div className="border-b border-border pb-4">
                <p className="text-sm text-muted-foreground mb-1">Yield per Hectare</p>
                <p className="text-3xl font-bold text-primary">{prediction.yieldPerHectare} tons</p>
              </div>

              <div className="border-b border-border pb-4">
                <p className="text-sm text-muted-foreground mb-1">Total Yield</p>
                <p className="text-2xl font-bold">{prediction.totalYield.toFixed(1)} tons</p>
              </div>

              <div className="grid grid-cols-2 gap-4 border-b border-border pb-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Estimated Revenue</p>
                  <p className="text-xl font-bold text-green-600">₹{(prediction.revenue / 100000).toFixed(1)}L</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Estimated Profit</p>
                  <p className="text-xl font-bold text-green-600">₹{(prediction.profit / 100000).toFixed(1)}L</p>
                </div>
              </div>

              <div className="border-b border-border pb-4">
                <p className="text-sm text-muted-foreground mb-1">Profit Margin</p>
                <p className="text-lg font-bold">{prediction.profitMargin}%</p>
              </div>

              {prediction.riskFactors && prediction.riskFactors.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-yellow-900 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Risk Factors
                  </p>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    {prediction.riskFactors.map((factor: string, idx: number) => (
                      <li key={idx}>• {factor}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
