"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Send, MessageSquare, Loader } from "lucide-react"
import { getFarmerProfile } from "@/lib/storage"

export default function ChatPage() {
  const farmerProfile = getFarmerProfile()

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hello ${farmerProfile?.name || "Farmer"}! I'm your AgriSense AI Assistant. I can help you with crop recommendations, soil management, disease prevention, and farming best practices tailored to your region and farm conditions. What would you like to know?`,
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = input
      setMessages([...messages, { role: "user", content: userMessage }])
      setInput("")
      setLoading(true)

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: userMessage,
            farmerContext: {
              name: farmerProfile?.name,
              crop: farmerProfile?.currentCrop,
              location: farmerProfile?.location,
              soilPH: farmerProfile?.soilPH,
              soilMoisture: farmerProfile?.soilMoisture,
              language: farmerProfile?.language,
            },
          }),
        })

        const data = await response.json()
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.response,
          },
        ])
      } catch (error) {
        console.error("Error getting response:", error)
        const fallbackResponse = generateContextAwareResponse(userMessage, farmerProfile)
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: fallbackResponse,
          },
        ])
      } finally {
        setLoading(false)
      }
    }
  }

  const generateContextAwareResponse = (question: string, profile: any) => {
    const crop = profile?.currentCrop || "your crop"
    const location = profile?.location || "your region"
    const soilPH = profile?.soilPH || 6.8

    const responses: Record<string, string> = {
      "best time to plant": `For ${crop} in ${location}, the optimal planting time depends on your local climate. With your soil pH of ${soilPH}, ensure proper soil preparation. I recommend consulting local agricultural extension services for exact dates.`,
      "water requirements": `${crop} typically needs 450-600mm of water. Given your soil moisture level and location (${location}), monitor soil moisture regularly and irrigate when needed.`,
      fertilizer: `For ${crop} with soil pH ${soilPH}, use balanced NPK fertilizer. Your soil conditions suggest focusing on phosphorus and potassium levels.`,
      "disease prevention": `In ${location}, common diseases for ${crop} include fungal infections. Maintain proper spacing, avoid overhead watering, and monitor weather conditions.`,
      "yield improvement": `To improve ${crop} yield in ${location}, focus on: 1) Optimal soil pH (currently ${soilPH}), 2) Proper irrigation timing, 3) Pest management, 4) Quality seeds.`,
    }

    for (const [key, response] of Object.entries(responses)) {
      if (question.toLowerCase().includes(key)) {
        return response
      }
    }

    return `Based on your farm in ${location} growing ${crop}, I recommend consulting our recommendations page for detailed insights. Feel free to ask specific questions about your farming practices!`
  }

  const commonQuestions = [
    `Best time to plant ${farmerProfile?.currentCrop || "crops"}?`,
    "How to improve soil fertility?",
    "When should I irrigate?",
    "How to prevent crop diseases?",
    "What fertilizer should I use?",
    "How to manage pests naturally?",
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Chat Assistant</h1>
        <p className="text-muted-foreground">Ask farming questions and get AI-powered advice tailored to your farm</p>
      </div>

      <Card className="p-6 flex flex-col h-96">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                  msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                }`}
              >
                <p className="text-sm">{msg.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-muted text-foreground px-4 py-3 rounded-lg flex items-center gap-2">
                <Loader className="w-4 h-4 animate-spin" />
                <p className="text-sm">Thinking...</p>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && !loading && handleSend()}
            placeholder="Ask me anything about farming..."
            disabled={loading}
            className="flex-1 px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          />
          <Button onClick={handleSend} size="icon" disabled={loading}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </Card>

      {/* FAQ Section */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-primary" />
          Common Questions
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {commonQuestions.map((q, idx) => (
            <Button
              key={idx}
              variant="outline"
              className="justify-start h-auto py-3 px-4 text-left bg-transparent"
              onClick={() => setInput(q)}
              disabled={loading}
            >
              {q}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  )
}
