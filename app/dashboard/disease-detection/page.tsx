"use client"

import type React from "react"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, AlertCircle, CheckCircle, Loader } from "lucide-react"
import { getFarmerProfile } from "@/lib/storage"

export default function DiseaseDetectionPage() {
  const farmerProfile = getFarmerProfile()
  const [uploaded, setUploaded] = useState(false)
  const [analyzed, setAnalyzed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<any>(null)

  const cropHealthPct = analysis?.cropHealth != null
    ? (analysis.cropHealth <= 1 ? Math.round(analysis.cropHealth * 100) : Math.round(analysis.cropHealth))
    : 0
  const confidencePct = analysis?.confidence != null
    ? (analysis.confidence <= 1 ? Math.round(analysis.confidence * 100) : Math.round(analysis.confidence))
    : 0

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploaded(true)
    setLoading(true)

    try {
      const reader = new FileReader()

      reader.onload = async (event) => {
        const imageBase64 = event.target?.result as string
        try {
          const response = await fetch("/api/disease-detection", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              imageBase64,
              farmerContext: {
                crop: farmerProfile?.currentCrop || "",
                location: farmerProfile?.location || "",
                soilPH: farmerProfile?.soilPH || "",
                soilMoisture: farmerProfile?.soilMoisture || "",
                language: farmerProfile?.language || "en",
              },
            }),
          })

          if (!response.ok) throw new Error("Failed to analyze image")

          const data = await response.json()
          setAnalysis(data)
          setAnalyzed(true)
        } catch (err) {
          console.error("Error analyzing image:", err)
        } finally {
          setLoading(false)
        }
      }

      reader.onerror = () => {
        setLoading(false)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error("Error analyzing image:", error)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Disease Detection</h1>
        <p className="text-muted-foreground">
          Upload crop images to detect diseases with AI analysis using your farm context
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Upload Section */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6">Upload Crop Image</h2>

          <div
            className="border-2 border-dashed border-border rounded-lg p-12 text-center mb-6 bg-muted/30"
            onClick={() => document.getElementById("image-upload")?.click()}
          >
            <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              Drag and drop your crop image here or click to select
            </p>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
            />
            <Button variant="outline" className="cursor-pointer bg-transparent">
              Select Image
            </Button>
          </div>

          {uploaded && (
            <div className="space-y-4">
              {loading && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2">
                  <Loader className="w-4 h-4 animate-spin text-blue-600" />
                  <p className="text-sm text-blue-800">Analyzing image with Gemini AI...</p>
                </div>
              )}
              {analyzed && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">Analysis complete! See results on the right.</p>
                </div>
              )}
            </div>
          )}

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm font-semibold text-yellow-900 mb-2">Tips for best results:</p>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Take clear photos in good lighting</li>
              <li>• Focus on affected areas of the crop</li>
              <li>• Include multiple angles if possible</li>
              <li>• Ensure the crop is clearly visible</li>
              <li>• Avoid shadows and reflections</li>
            </ul>
          </div>

          {farmerProfile && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-semibold text-blue-900 mb-2">Your Farm Context</p>
              <div className="text-sm text-blue-800 space-y-1">
                <p>Crop: {farmerProfile.currentCrop}</p>
                <p>Location: {farmerProfile.location}</p>
                <p>Soil pH: {farmerProfile.soilPH}</p>
                <p>Soil Moisture: {farmerProfile.soilMoisture}%</p>
              </div>
            </div>
          )}
        </Card>

        {/* Results Section */}
        {analyzed && analysis ? (
          <Card className="p-6 overflow-y-auto max-h-96 relative">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-accent" />
              Analysis Results
            </h2>

            <div className="space-y-4">
              {/* Crop Health Bar */}
              <div className="border-b border-border pb-4">
                <p className="text-sm text-muted-foreground mb-2">Crop Health</p>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      cropHealthPct > 70
                        ? "bg-green-500"
                        : cropHealthPct > 40
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${cropHealthPct}%` }}
                  />
                </div>
                <p className="text-sm font-semibold mt-1">{cropHealthPct}% Healthy</p>
              </div>

              <div className="border-b border-border pb-4">
                <p className="text-sm text-muted-foreground mb-1">Disease Detected</p>
                <p className="text-2xl font-bold text-accent">{analysis.disease}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Confidence: {confidencePct}%
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="h-2 bg-accent rounded-full" style={{ width: `${confidencePct}%` }} />
                </div>
              </div>

              <div className="border-b border-border pb-4">
                <p className="text-sm text-muted-foreground mb-1">Severity</p>
                <p
                  className={`text-lg font-bold px-3 py-1 rounded inline-block ${
                    analysis.severity === "High"
                      ? "bg-red-100 text-red-800"
                      : analysis.severity === "Medium"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {analysis.severity}
                </p>
              </div>

              {analysis.cause && (
                <div className="border-b border-border pb-4">
                  <p className="text-sm font-semibold text-muted-foreground mb-2">Cause</p>
                  <p className="text-sm">{analysis.cause}</p>
                </div>
              )}

              {analysis.harmfulness && (
                <div className="border-b border-border pb-4">
                  <p className="text-sm font-semibold text-muted-foreground mb-2">Potential Impact</p>
                  <p className="text-sm">{analysis.harmfulness}</p>
                </div>
              )}

              {analysis.affectedArea && (
                <div className="border-b border-border pb-4">
                  <p className="text-sm font-semibold text-muted-foreground mb-2">Affected Area</p>
                  <p className="text-sm">{analysis.affectedArea}</p>
                </div>
              )}

              {Array.isArray(analysis.whyHappened) && analysis.whyHappened.length > 0 && (
                <div className="border-b border-border pb-4">
                  <p className="text-sm font-semibold text-muted-foreground mb-2">Why It Happened</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    {analysis.whyHappened.map((item: string, idx: number) => (
                      <li key={`why-${idx}`}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {Array.isArray(analysis.treatment) && analysis.treatment.length > 0 && (
                <div className="border-b border-border pb-4">
                  <p className="text-sm font-semibold text-muted-foreground mb-2">Treatment Steps</p>
                  <ol className="list-decimal pl-5 space-y-1 text-sm">
                    {analysis.treatment.map((step: string, idx: number) => (
                      <li key={`treat-${idx}`}>{step}</li>
                    ))}
                  </ol>
                </div>
              )}

              {Array.isArray(analysis.prevention) && analysis.prevention.length > 0 && (
                <div className="border-b border-border pb-4">
                  <p className="text-sm font-semibold text-muted-foreground mb-2">Prevention</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    {analysis.prevention.map((p: string, idx: number) => (
                      <li key={`prev-${idx}`}>{p}</li>
                    ))}
                  </ul>
                </div>
              )}

              {Array.isArray(analysis.recommendations) && analysis.recommendations.length > 0 && (
                <div className="pb-2">
                  <p className="text-sm font-semibold text-muted-foreground mb-2">Recommendations</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    {analysis.recommendations.map((r: string, idx: number) => (
                      <li key={`rec-${idx}`}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            {loading && (
              <div className="absolute inset-0 bg-white/60 dark:bg-black/30 backdrop-blur-sm flex items-center justify-center rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <Loader className="w-4 h-4 animate-spin" />
                  Analyzing...
                </div>
              </div>
            )}
          </Card>
        ) : (
          <Card className="p-6 flex items-center justify-center min-h-96">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-30" />
              <p className="text-muted-foreground">Upload an image to see AI-powered analysis</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

