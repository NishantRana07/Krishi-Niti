"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Cloud, Droplets, Leaf, TrendingUp, AlertCircle, MapPin, MessageSquare } from "lucide-react"

// Sample data for demonstration
const sampleWeather = {
  temp: 28,
  humidity: 65,
  rainfall: 12,
  windSpeed: 15,
  condition: "Partly Cloudy",
  location: "Punjab, India",
}

const sampleSoilData = {
  ph: 6.8,
  moisture: 45,
  nitrogen: 120,
  phosphorus: 35,
  potassium: 180,
  organicMatter: 2.5,
}

const sampleCrops = [
  { name: "Wheat", yield: "45 tons/ha", profit: "₹85,000", status: "Healthy" },
  { name: "Rice", yield: "38 tons/ha", profit: "₹72,000", status: "Needs Attention" },
  { name: "Corn", yield: "52 tons/ha", profit: "₹95,000", status: "Excellent" },
]

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Welcome to AgriSense</h1>
        <p className="text-muted-foreground flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          {sampleWeather.location}
        </p>
      </div>

      {/* Weather Section */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Temperature</p>
              <p className="text-3xl font-bold text-primary">{sampleWeather.temp}°C</p>
            </div>
            <Cloud className="w-12 h-12 text-accent opacity-50" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Humidity</p>
              <p className="text-3xl font-bold text-primary">{sampleWeather.humidity}%</p>
            </div>
            <Droplets className="w-12 h-12 text-blue-400 opacity-50" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Rainfall</p>
              <p className="text-3xl font-bold text-primary">{sampleWeather.rainfall}mm</p>
            </div>
            <Cloud className="w-12 h-12 text-blue-500 opacity-50" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Wind Speed</p>
              <p className="text-3xl font-bold text-primary">{sampleWeather.windSpeed} km/h</p>
            </div>
            <Cloud className="w-12 h-12 text-secondary opacity-50" />
          </div>
        </Card>
      </div>

      {/* Soil Health */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Droplets className="w-6 h-6 text-primary" />
            Soil Health
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">pH Level</span>
              <span className="font-semibold text-primary">{sampleSoilData.ph}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Moisture</span>
              <span className="font-semibold text-primary">{sampleSoilData.moisture}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Nitrogen</span>
              <span className="font-semibold text-primary">{sampleSoilData.nitrogen} mg/kg</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Phosphorus</span>
              <span className="font-semibold text-primary">{sampleSoilData.phosphorus} mg/kg</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Potassium</span>
              <span className="font-semibold text-primary">{sampleSoilData.potassium} mg/kg</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Organic Matter</span>
              <span className="font-semibold text-primary">{sampleSoilData.organicMatter}%</span>
            </div>
          </div>
          <Link href="/dashboard/soil-analysis">
            <Button className="w-full mt-6">Analyze Soil</Button>
          </Link>
        </Card>

        {/* Current Crops */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Leaf className="w-6 h-6 text-secondary" />
            Your Crops
          </h2>
          <div className="space-y-3">
            {sampleCrops.map((crop) => (
              <div key={crop.name} className="border-b border-border pb-3 last:border-0">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-semibold">{crop.name}</span>
                  <span
                    className={`text-sm px-2 py-1 rounded ${
                      crop.status === "Excellent"
                        ? "bg-green-100 text-green-800"
                        : crop.status === "Healthy"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {crop.status}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Yield: {crop.yield} | Profit: {crop.profit}
                </div>
              </div>
            ))}
          </div>
          <Link href="/dashboard/recommendations">
            <Button className="w-full mt-6">Get Recommendations</Button>
          </Link>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-4 gap-4">
          <Link href="/dashboard/soil-analysis">
            <Button
              variant="outline"
              className="w-full h-20 flex flex-col items-center justify-center gap-2 bg-transparent"
            >
              <Droplets className="w-6 h-6" />
              <span>Soil Analysis</span>
            </Button>
          </Link>
          <Link href="/dashboard/recommendations">
            <Button
              variant="outline"
              className="w-full h-20 flex flex-col items-center justify-center gap-2 bg-transparent"
            >
              <TrendingUp className="w-6 h-6" />
              <span>Recommendations</span>
            </Button>
          </Link>
          <Link href="/dashboard/disease-detection">
            <Button
              variant="outline"
              className="w-full h-20 flex flex-col items-center justify-center gap-2 bg-transparent"
            >
              <AlertCircle className="w-6 h-6" />
              <span>Disease Check</span>
            </Button>
          </Link>
          <Link href="/dashboard/chat">
            <Button
              variant="outline"
              className="w-full h-20 flex flex-col items-center justify-center gap-2 bg-transparent"
            >
              <MessageSquare className="w-6 h-6" />
              <span>Ask AI</span>
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
