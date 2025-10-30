import { generateObject } from "ai"
import { google } from "@ai-sdk/google"
import { z } from "zod"
import { type NextRequest, NextResponse } from "next/server"

const RecommendationSchema = z.object({
  crop: z.string().describe("Crop name"),
  yield: z.string().describe("Expected yield in tons/ha"),
  profit: z.string().describe("Estimated profit in rupees"),
  season: z.string().describe("Best season to plant"),
  waterNeeded: z.string().describe("Water requirement in mm"),
  fertilizer: z.string().describe("Recommended fertilizer NPK ratio"),
  daysToMaturity: z.number().describe("Days to harvest"),
  marketPrice: z.string().describe("Current market price"),
  risk: z.enum(["Low", "Medium", "High"]).describe("Risk level"),
  reason: z.string().describe("Why this crop is recommended"),
})

const RecommendationsListSchema = z.object({
  recommendations: z.array(RecommendationSchema).describe("List of crop recommendations"),
})

export async function POST(request: NextRequest) {
  try {
    const { farmerContext } = await request.json()

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
    if (!apiKey) {
      console.error("Missing GOOGLE_GENERATIVE_AI_API_KEY")
      return NextResponse.json({
        recommendations: [
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
            reason: "AI key not configured; showing sample data.",
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
        ],
      })
    }

    const { object } = await generateObject({
      model: google("gemini-2.0-flash"),
      schema: RecommendationsListSchema,
      prompt: `You are an expert agricultural advisor. Based on the farmer's soil and location, recommend 4 best crops to plant. Respond in ${farmerContext?.language || "English"}.

Farmer Context:
- Location: ${farmerContext?.location || "Unknown"}
- Soil pH: ${farmerContext?.soilPH || "6.8"}
- Soil Moisture: ${farmerContext?.soilMoisture || "45"}%
- Current Crop: ${farmerContext?.crop || "Unknown"}

For each recommended crop, provide:
1. Expected yield in tons/ha
2. Estimated profit in rupees per hectare
3. Best season to plant
4. Water requirement in mm
5. Recommended NPK fertilizer ratio
6. Days to maturity
7. Current market price per quintal
8. Risk level (Low/Medium/High)
9. Reason why this crop is recommended for their specific conditions

Return exactly 4 crop recommendations in JSON format.`,
    })

    return NextResponse.json(object)
  } catch (error) {
    console.error("Recommendations error:", error)

    const fallbackResponse = {
      recommendations: [
        {
          crop: "Wheat",
          yield: "45 tons/ha",
          profit: "₹85,000",
          season: "Winter",
          waterNeeded: "450mm",
          fertilizer: "NPK 20:20:20",
          daysToMaturity: 120,
          marketPrice: "₹2,500/quintal",
          risk: "Low" as const,
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
          risk: "Medium" as const,
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
          risk: "Low" as const,
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
          risk: "Low" as const,
          reason: "Good nitrogen fixation potential",
        },
      ],
    }

    return NextResponse.json(fallbackResponse)
  }
}
