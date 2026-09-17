'use client'

import { Loader2, MapPin, Sprout } from 'lucide-react'
import { useState } from 'react'
import { get_weather, predict_crop } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { LabeledField } from '@/components/labeled-field'
import { NpkChart } from '@/components/npk-chart'
import { RecommendationCard } from '@/components/recommendation-card'
import { WeatherCard } from '@/components/weather-card'
import type { AsyncStatus } from '@/lib/status'
import type { CropPrediction, WeatherData } from '@/lib/types'

type FormState = {
  nitrogen: string
  phosphorus: string
  potassium: string
  ph: string
  location: string
}

type FieldErrors = Partial<Record<keyof FormState, string>>

const EMPTY_FORM: FormState = {
  nitrogen: '',
  phosphorus: '',
  potassium: '',
  ph: '',
  location: '',
}

function validate(form: FormState): FieldErrors {
  const errors: FieldErrors = {}

  const numericFields: { key: keyof FormState; label: string }[] = [
    { key: 'nitrogen', label: 'Nitrogen' },
    { key: 'phosphorus', label: 'Phosphorus' },
    { key: 'potassium', label: 'Potassium' },
  ]

  for (const { key, label } of numericFields) {
    const raw = form[key].trim()
    if (!raw) {
      errors[key] = `${label} is required.`
      continue
    }
    const value = Number(raw)
    if (Number.isNaN(value)) {
      errors[key] = `${label} must be a valid number.`
    } else if (value < 0) {
      errors[key] = `${label} cannot be negative.`
    }
  }

  const phRaw = form.ph.trim()
  if (!phRaw) {
    errors.ph = 'Soil pH is required.'
  } else {
    const ph = Number(phRaw)
    if (Number.isNaN(ph)) {
      errors.ph = 'Soil pH must be a valid number.'
    } else if (ph < 0 || ph > 14) {
      errors.ph = 'Soil pH must be between 0 and 14.'
    }
  }

  if (!form.location.trim()) {
    errors.location = 'Location is required.'
  }

  return errors
}

export function CropRecommender() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [errors, setErrors] = useState<FieldErrors>({})

  const [weatherStatus, setWeatherStatus] = useState<AsyncStatus>('idle')
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [weatherError, setWeatherError] = useState<string | null>(null)

  const [predictionStatus, setPredictionStatus] = useState<AsyncStatus>('idle')
  const [prediction, setPrediction] = useState<CropPrediction | null>(null)
  const [predictionError, setPredictionError] = useState<string | null>(null)

  const isRunning = weatherStatus === 'loading' || predictionStatus === 'loading'

  function update(key: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    const nextErrors = validate(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    // Reset previous results
    setPrediction(null)
    setPredictionError(null)
    setPredictionStatus('idle')

    // 1) Fetch live weather
    setWeatherStatus('loading')
    setWeather(null)
    setWeatherError(null)

    const weatherResult = await get_weather(form.location.trim())
    if (!weatherResult.ok) {
      setWeatherStatus('error')
      setWeatherError(weatherResult.error)
      return
    }
    setWeather(weatherResult.data)
    setWeatherStatus('success')

    // 2) Run prediction using soil + weather features
    setPredictionStatus('loading')
    const predictionResult = await predict_crop({
      nitrogen: Number(form.nitrogen),
      phosphorus: Number(form.phosphorus),
      potassium: Number(form.potassium),
      ph: Number(form.ph),
      location: form.location.trim(),
      temperature: weatherResult.data.temperature,
      humidity: weatherResult.data.humidity,
      rainfall: weatherResult.data.rainfall,
    })

    if (!predictionResult.ok) {
      setPredictionStatus('error')
      setPredictionError(predictionResult.error)
      return
    }
    setPrediction(predictionResult.data)
    setPredictionStatus('success')
  }

  const nitrogenNum = form.nitrogen.trim() ? Number(form.nitrogen) : null
  const phosphorusNum = form.phosphorus.trim() ? Number(form.phosphorus) : null
  const potassiumNum = form.potassium.trim() ? Number(form.potassium) : null

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Soil Information */}
        <section className="card-surface card-surface-hover rounded-2xl border border-border/70 bg-card p-6">
          <h2 className="mb-5 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
            Soil Information
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <LabeledField
              id="nitrogen"
              label="Nitrogen (N)"
              type="number"
              inputMode="decimal"
              placeholder="e.g. 90"
              value={form.nitrogen}
              onChange={(e) => update('nitrogen', e.target.value)}
              error={errors.nitrogen}
            />
            <LabeledField
              id="phosphorus"
              label="Phosphorus (P)"
              type="number"
              inputMode="decimal"
              placeholder="e.g. 42"
              value={form.phosphorus}
              onChange={(e) => update('phosphorus', e.target.value)}
              error={errors.phosphorus}
            />
            <LabeledField
              id="potassium"
              label="Potassium (K)"
              type="number"
              inputMode="decimal"
              placeholder="e.g. 43"
              value={form.potassium}
              onChange={(e) => update('potassium', e.target.value)}
              error={errors.potassium}
            />
            <LabeledField
              id="ph"
              label="Soil pH"
              type="number"
              inputMode="decimal"
              step="0.1"
              min={0}
              max={14}
              placeholder="0 – 14"
              hint="Value between 0 and 14"
              value={form.ph}
              onChange={(e) => update('ph', e.target.value)}
              error={errors.ph}
            />
          </div>
        </section>

        {/* Location */}
        <section className="card-surface card-surface-hover rounded-2xl border border-border/70 bg-card p-6">
          <h2 className="mb-5 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            <MapPin className="size-4 text-primary" aria-hidden="true" />
            Location
          </h2>
          <LabeledField
            id="location"
            label="City or District"
            type="text"
            placeholder="Enter city or district"
            hint="Used to fetch live weather for your area."
            value={form.location}
            onChange={(e) => update('location', e.target.value)}
            error={errors.location}
          />
        </section>
      </div>

      <Button
        type="submit"
        disabled={isRunning}
        className="h-14 w-full rounded-2xl bg-gradient-to-r from-primary to-[oklch(0.6_0.15_150)] text-base font-semibold shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 hover:brightness-105"
      >
        {isRunning ? (
          <>
            <Loader2 className="size-5 animate-spin" aria-hidden="true" />
            Working…
          </>
        ) : (
          <>
            <Sprout className="size-5" aria-hidden="true" />
            Recommend Crop
          </>
        )}
      </Button>

      <div className="grid gap-6 lg:grid-cols-2">
        <WeatherCard status={weatherStatus} data={weather} error={weatherError} />
        <RecommendationCard
          status={predictionStatus}
          data={prediction}
          error={predictionError}
        />
      </div>

      <NpkChart
        nitrogen={nitrogenNum}
        phosphorus={phosphorusNum}
        potassium={potassiumNum}
      />
    </form>
  )
}
