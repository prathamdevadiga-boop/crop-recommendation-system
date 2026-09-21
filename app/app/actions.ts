'use server'

import type {
  CropPrediction,
  Result,
  SoilFeatures,
  WeatherData,
} from '@/lib/types'

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://127.0.0.1:8000'

async function responseError(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { detail?: string }
    return body.detail ?? `The backend returned ${response.status}.`
  } catch {
    return `The backend returned ${response.status}.`
  }
}

/**
 * get_weather(location)
 *
 * Fetches real weather data for the given location.
 *
 * TODO(backend): Replace the body below with a real implementation, e.g. a
 * call to a weather provider or your own model service. Return
 * `{ ok: true, data: { temperature, humidity, rainfall } }` on success.
 *
 * Until it is connected this returns a clear, typed error so the UI shows an
 * error state instead of fabricated data.
 */
export async function get_weather(
  location: string,
): Promise<Result<WeatherData>> {
  if (!location.trim()) {
    return { ok: false, error: 'A location is required to fetch weather.' }
  }

  try {
    const response = await fetch(
      `${BACKEND_URL}/weather?location=${encodeURIComponent(location.trim())}`,
      { cache: 'no-store' },
    )
    if (!response.ok) return { ok: false, error: await responseError(response) }

    return { ok: true, data: (await response.json()) as WeatherData }
  } catch {
    return {
      ok: false,
      error: 'Cannot reach the Python backend. Start it with: uvicorn backend.main:app --reload',
    }
  }
}

/**
 * predict_crop(features)
 *
 * Runs the crop recommendation model on the provided soil + weather features.
 *
 * TODO(backend): Replace the body below with a real implementation, e.g. a
 * call to your ML model endpoint. Return
 * `{ ok: true, data: { crop, confidence, explanation } }` on success.
 *
 * Until it is connected this returns a clear, typed error so the UI shows an
 * error state instead of fabricated predictions.
 */
export async function predict_crop(
  features: SoilFeatures,
): Promise<Result<CropPrediction>> {
  try {
    const response = await fetch(`${BACKEND_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(features),
      cache: 'no-store',
    })
    if (!response.ok) return { ok: false, error: await responseError(response) }

    return { ok: true, data: (await response.json()) as CropPrediction }
  } catch {
    return {
      ok: false,
      error: 'Cannot reach the Python backend. Start it with: uvicorn backend.main:app --reload',
    }
  }
}
