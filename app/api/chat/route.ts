import { generateText } from "ai"
import { google } from "@ai-sdk/google"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { question, farmerContext } = await request.json()

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
    if (!apiKey) {
      console.error("Missing GOOGLE_GENERATIVE_AI_API_KEY")
      return NextResponse.json({
        response:
          "AI service is not configured. Please set GOOGLE_GENERATIVE_AI_API_KEY in your environment.",
      })
    }

    const { text } = await generateText({
      model: google("gemini-2.0-flash"),
      prompt: `You are an expert agricultural advisor for farmers. Provide helpful, practical farming advice based on the farmer's specific context. Respond in ${farmerContext?.language || "English"}.

Farmer Context:
- Name: ${farmerContext?.name || "Farmer"}
- Current Crop: ${farmerContext?.crop || "Unknown"}
- Location: ${farmerContext?.location || "Unknown"}
- Soil pH: ${farmerContext?.soilPH || "Unknown"}
- Soil Moisture: ${farmerContext?.soilMoisture || "Unknown"}%

Farmer's Question: ${question}

Provide a concise, practical response (2-3 sentences) that is specific to their farm conditions and location. Focus on actionable advice.`,
    })

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error("Chat error:", error)

    return NextResponse.json({
      response:
        "I'm having trouble connecting to the AI service right now. Please try again in a moment, or check our recommendations page for general farming advice.",
    })
  }
}
