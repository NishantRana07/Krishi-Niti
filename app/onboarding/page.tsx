"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Leaf, MapPin, Loader } from "lucide-react"
import { saveFarmerProfile, setOnboardingComplete } from "@/lib/storage"

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [locationLoading, setLocationLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    latitude: 0,
    longitude: 0,
    soilPH: 6.8,
    soilMoisture: 45,
    currentCrop: "Wheat",
    landArea: 5,
  })

  const handleGetLocation = () => {
    setLocationLoading(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setFormData((prev) => ({
            ...prev,
            latitude,
            longitude,
            location: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
          }))
          setLocationLoading(false)
        },
        () => {
          // Fallback to sample location if permission denied
          setFormData((prev) => ({
            ...prev,
            latitude: 31.1471,
            longitude: 75.3412,
            location: "Punjab, India (Sample)",
          }))
          setLocationLoading(false)
        },
      )
    }
  }

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    const profile = {
      ...formData,
      createdAt: new Date().toISOString(),
    }
    saveFarmerProfile(profile)
    setOnboardingComplete()
    setTimeout(() => {
      router.push("/dashboard")
    }, 500)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: isNaN(Number(value)) ? value : Number(value),
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8">
        <div className="flex items-center gap-3 mb-8">
          <Leaf className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-primary">AgriSense</h1>
        </div>

        <div className="mb-8">
          <div className="flex gap-2 mb-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 flex-1 rounded-full transition-colors ${s <= step ? "bg-primary" : "bg-muted"}`}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">Step {step} of 3</p>
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Welcome to AgriSense</h2>
              <p className="text-muted-foreground">Let's set up your farming profile</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Your Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="location"
                  placeholder="Your location"
                  value={formData.location}
                  onChange={handleChange}
                  className="flex-1 px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button
                  onClick={handleGetLocation}
                  variant="outline"
                  className="gap-2 bg-transparent"
                  disabled={locationLoading}
                >
                  {locationLoading ? <Loader className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
                  Auto-detect
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                We'll use this to provide region-specific recommendations
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Soil Data */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Soil Information</h2>
              <p className="text-muted-foreground">Tell us about your soil (optional fields can be skipped)</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Soil pH</label>
                <input
                  type="number"
                  name="soilPH"
                  placeholder="6.8"
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
                  placeholder="45"
                  value={formData.soilMoisture}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Land Area (hectares)</label>
              <input
                type="number"
                name="landArea"
                placeholder="5"
                step="0.5"
                value={formData.landArea}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        )}

        {/* Step 3: Current Crop */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Current Crop</h2>
              <p className="text-muted-foreground">What are you currently growing?</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Current Crop</label>
              <select
                name="currentCrop"
                value={formData.currentCrop}
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

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                This information will help us provide personalized recommendations and region-specific advice through
                our AI chat assistant.
              </p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-4 mt-8">
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
              Back
            </Button>
          )}
          {step < 3 ? (
            <Button onClick={handleNext} className="flex-1">
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={loading} className="flex-1">
              {loading ? "Setting up..." : "Get Started"}
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
}
