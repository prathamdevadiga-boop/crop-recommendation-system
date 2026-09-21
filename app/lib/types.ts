export type WeatherData = {
  temperature: number
  humidity: number
  rainfall: number
  latitude?: number
  longitude?: number
}

export type SoilFeatures = {
  nitrogen: number
  phosphorus: number
  potassium: number
  ph: number
  location: string
  temperature: number
  humidity: number
  rainfall: number
}

export type CropPrediction = {
  crop: string
  confidence: number
  explanation: string
}

export type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: string }
