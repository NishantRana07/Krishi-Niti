"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Settings, Globe, Bell, Info, MapPin, Loader } from "lucide-react"
import { getFarmerProfile, saveFarmerProfile } from "@/lib/storage"

export default function SettingsPage() {
  const profile = getFarmerProfile()
  const [settings, setSettings] = useState({
    language: profile?.language || "English",
    notifications: true,
    weatherAlerts: true,
    diseaseAlerts: true,
    theme: "light",
  })

  const [locationState, setLocationState] = useState({
    location: profile?.location || "",
    latitude: profile?.latitude || 0,
    longitude: profile?.longitude || 0,
  })

  const [locating, setLocating] = useState(false)

  const handleChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleAutoDetect = () => {
    setLocating(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setLocationState({
            location: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
            latitude,
            longitude,
          })
          setLocating(false)
        },
        () => {
          setLocationState({
            location: "Punjab, India (Sample)",
            latitude: 31.1471,
            longitude: 75.3412,
          })
          setLocating(false)
        },
      )
    } else {
      setLocating(false)
    }
  }

  const handleSave = () => {
    if (!profile) return
    const updated = {
      ...profile,
      location: locationState.location,
      latitude: locationState.latitude,
      longitude: locationState.longitude,
      language: settings.language,
    }
    saveFarmerProfile(updated as any)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your preferences and account settings</p>
      </div>

      {/* Language & Location Settings */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Globe className="w-6 h-6 text-primary" />
          Language & Region
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={locationState.location}
                onChange={(e) => setLocationState((p) => ({ ...p, location: e.target.value }))}
                placeholder="City, State or coordinates"
                className="flex-1 px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button onClick={handleAutoDetect} variant="outline" className="gap-2 bg-transparent" disabled={locating}>
                {locating ? <Loader className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
                Auto-detect
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {locationState.latitude && locationState.longitude
                ? `Lat: ${locationState.latitude.toFixed(4)}, Lon: ${locationState.longitude.toFixed(4)}`
                : "Set your location for region-specific advice"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Preferred Language</label>
            <select
              value={settings.language}
              onChange={(e) => handleChange("language", e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option>English</option>
              <option>Hindi</option>
              <option>Punjabi</option>
              <option>Tamil</option>
              <option>Telugu</option>
              <option>Marathi</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Notification Settings */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Bell className="w-6 h-6 text-accent" />
          Notifications
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Enable Notifications</p>
              <p className="text-sm text-muted-foreground">Get updates about your farm</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) => handleChange("notifications", e.target.checked)}
              className="w-5 h-5 cursor-pointer"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Weather Alerts</p>
              <p className="text-sm text-muted-foreground">Get notified about weather changes</p>
            </div>
            <input
              type="checkbox"
              checked={settings.weatherAlerts}
              onChange={(e) => handleChange("weatherAlerts", e.target.checked)}
              className="w-5 h-5 cursor-pointer"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Disease Alerts</p>
              <p className="text-sm text-muted-foreground">Get notified about potential diseases</p>
            </div>
            <input
              type="checkbox"
              checked={settings.diseaseAlerts}
              onChange={(e) => handleChange("diseaseAlerts", e.target.checked)}
              className="w-5 h-5 cursor-pointer"
            />
          </div>
        </div>
      </Card>

      {/* Theme Settings */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Settings className="w-6 h-6 text-secondary" />
          Appearance
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Theme</label>
            <select
              value={settings.theme}
              onChange={(e) => handleChange("theme", e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>
        </div>
      </Card>

      {/* About Section */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Info className="w-6 h-6 text-primary" />
          About AgriSense
        </h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Version</span>
            <span className="font-semibold">1.0.0 (Hackathon Prototype)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Last Updated</span>
            <span className="font-semibold">October 2025</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status</span>
            <span className="font-semibold text-green-600">Active</span>
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <Button className="w-full" onClick={handleSave}>Save Settings</Button>
    </div>
  )
}
