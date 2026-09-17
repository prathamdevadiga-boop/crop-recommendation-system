import { AlertCircle, CloudRain, Droplets, Loader2, Thermometer } from 'lucide-react'
import type { WeatherData } from '@/lib/types'
import type { AsyncStatus } from '@/lib/status'

function Metric({
  icon,
  label,
  value,
  unit,
}: {
  icon: React.ReactNode
  label: string
  value: number
  unit: string
}) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl border border-border/50 bg-secondary/60 px-3 py-4 text-center">
      <span className="mb-0.5 flex size-9 items-center justify-center rounded-full bg-card text-primary shadow-sm" aria-hidden="true">
        {icon}
      </span>
      <span className="text-lg font-semibold text-foreground">
        {value}
        <span className="ml-0.5 text-sm font-normal text-muted-foreground">{unit}</span>
      </span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}

export function WeatherCard({
  status,
  data,
  error,
}: {
  status: AsyncStatus
  data: WeatherData | null
  error: string | null
}) {
  return (
    <section className="card-surface card-surface-hover rounded-2xl border border-border/70 bg-card p-6">
      <h2 className="mb-5 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        <CloudRain className="size-4 text-primary" aria-hidden="true" />
        Weather Conditions
      </h2>

      {status === 'idle' && (
        <p className="text-sm text-muted-foreground">
          Enter a location and request a recommendation to load live weather data.
        </p>
      )}

      {status === 'loading' && (
        <div className="flex items-center gap-2 py-4 text-sm text-muted-foreground" role="status">
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          Fetching live weather…
        </div>
      )}

      {status === 'error' && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>{error ?? 'Unable to load weather data.'}</span>
        </div>
      )}

      {status === 'success' && data && (
        <div className="grid grid-cols-3 gap-3">
          <Metric
            icon={<Thermometer className="size-5" />}
            label="Temperature"
            value={data.temperature}
            unit="°C"
          />
          <Metric
            icon={<Droplets className="size-5" />}
            label="Humidity"
            value={data.humidity}
            unit="%"
          />
          <Metric
            icon={<CloudRain className="size-5" />}
            label="Rainfall"
            value={data.rainfall}
            unit="mm"
          />
        </div>
      )}
    </section>
  )
}
