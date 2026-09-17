'use server'

import type {
  CropPrediction,
  Result,
  SoilFeatures,
  WeatherData,
} from '@/lib/types'

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

  return {
    ok: false,
    error:
      'Weather service is not connected yet. Wire up get_weather(location) in app/actions.ts to return live temperature, humidity, and rainfall.',
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
  void features

  return {
    ok: false,
    error:
      'Prediction model is not connected yet. Wire up predict_crop(features) in app/actions.ts to return a recommended crop and confidence score.',
  }
}
