import { BarChart3 } from 'lucide-react'

type Nutrient = { label: string; short: string; value: number; color: string }

export function NpkChart({
  nitrogen,
  phosphorus,
  potassium,
}: {
  nitrogen: number | null
  phosphorus: number | null
  potassium: number | null
}) {
  const nutrients: Nutrient[] = [
    { label: 'Nitrogen', short: 'N', value: nitrogen ?? 0, color: 'var(--chart-1)' },
    { label: 'Phosphorus', short: 'P', value: phosphorus ?? 0, color: 'var(--chart-2)' },
    { label: 'Potassium', short: 'K', value: potassium ?? 0, color: 'var(--chart-3)' },
  ]

  const hasData = [nitrogen, phosphorus, potassium].some(
    (v) => v !== null && !Number.isNaN(v),
  )
  const max = Math.max(...nutrients.map((n) => n.value), 1)

  return (
    <section className="card-surface card-surface-hover rounded-2xl border border-border/70 bg-card p-6">
      <h2 className="mb-5 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        <BarChart3 className="size-4 text-primary" aria-hidden="true" />
        Soil Nutrients (N-P-K)
      </h2>

      {!hasData ? (
        <p className="text-sm text-muted-foreground">
          Enter nutrient values to visualize the N-P-K balance.
        </p>
      ) : (
        <div className="flex h-48 items-end justify-around gap-4 rounded-xl bg-secondary/40 p-4" role="img" aria-label={`Nitrogen ${nutrients[0].value}, Phosphorus ${nutrients[1].value}, Potassium ${nutrients[2].value}`}>
          {nutrients.map((n) => (
            <div key={n.short} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
              <span className="text-sm font-semibold text-foreground">{n.value}</span>
              <div
                className="w-full max-w-16 rounded-t-lg shadow-sm transition-all duration-500"
                style={{
                  height: `${Math.max((n.value / max) * 100, 2)}%`,
                  backgroundColor: n.color,
                }}
              />
              <span className="text-xs font-medium text-muted-foreground">
                {n.short}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
