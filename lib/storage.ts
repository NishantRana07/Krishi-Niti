export interface FarmerProfile {
  name: string
  location: string
  latitude: number
  longitude: number
  soilPH: number
  soilMoisture: number
  currentCrop: string
  landArea: number
  createdAt: string
  language?: string
}

export const storageKeys = {
  FARMER_PROFILE: "agrisense_farmer_profile",
  SOIL_DATA: "agrisense_soil_data",
  CROP_DATA: "agrisense_crop_data",
  ONBOARDING_COMPLETE: "agrisense_onboarding_complete",
}

export const getFarmerProfile = (): FarmerProfile | null => {
  if (typeof window === "undefined") return null
  const data = localStorage.getItem(storageKeys.FARMER_PROFILE)
  return data ? JSON.parse(data) : null
}

export const saveFarmerProfile = (profile: FarmerProfile) => {
  if (typeof window === "undefined") return
  localStorage.setItem(storageKeys.FARMER_PROFILE, JSON.stringify(profile))
}

export const isOnboardingComplete = (): boolean => {
  if (typeof window === "undefined") return false
  return localStorage.getItem(storageKeys.ONBOARDING_COMPLETE) === "true"
}

export const setOnboardingComplete = () => {
  if (typeof window === "undefined") return
  localStorage.setItem(storageKeys.ONBOARDING_COMPLETE, "true")
}

export const clearFarmerData = () => {
  if (typeof window === "undefined") return
  localStorage.removeItem(storageKeys.FARMER_PROFILE)
  localStorage.removeItem(storageKeys.SOIL_DATA)
  localStorage.removeItem(storageKeys.CROP_DATA)
  localStorage.removeItem(storageKeys.ONBOARDING_COMPLETE)
}
