import { AlertCircle, CheckCircle2, Loader2, Sprout } from 'lucide-react'
import type { CropPrediction } from '@/lib/types'
import type { AsyncStatus } from '@/lib/status'

function ConfidenceMeter({ confidence }: { confidence: number }) {
  const pct = Math.round(Math.min(Math.max(confidence, 0), 1) * 100)
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">Confidence Score</span>
        <span className="font-semibold text-primary">{pct}%</span>
      </div>
      <div
        className="h-3 w-full overflow-hidden rounded-full bg-secondary"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Prediction confidence"
      >
        <div
          className="h-full rounded-full bg-primary transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

export function RecommendationCard({
  status,
  data,
  error,
}: {
  status: AsyncStatus
  data: CropPrediction | null
  error: string | null
}) {
  return (
    <section className="card-surface card-surface-hover rounded-2xl border border-border/70 bg-card p-6">
      <h2 className="mb-5 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        <Sprout className="size-4 text-primary" aria-hidden="true" />
        Recommendation
      </h2>

      {status === 'idle' && (
        <p className="text-sm text-muted-foreground">
          Your recommended crop and confidence score will appear here.
        </p>
      )}

      {status === 'loading' && (
        <div className="flex items-center gap-2 py-4 text-sm text-muted-foreground" role="status">
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          Running the prediction model…
        </div>
      )}

      {status === 'error' && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>{error ?? 'The prediction could not be completed.'}</span>
        </div>
      )}

      {status === 'success' && data && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 rounded-2xl border border-primary/15 bg-gradient-to-br from-secondary to-primary/10 p-4">
            <CheckCircle2 className="size-8 shrink-0 text-primary" aria-hidden="true" />
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Recommended Crop
              </p>
              <p className="text-2xl font-bold capitalize text-foreground">
                {data.crop}
              </p>
            </div>
          </div>

          <ConfidenceMeter confidence={data.confidence} />

          <div>
            <p className="mb-1 text-sm font-medium text-foreground">Why this crop?</p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {data.explanation}
            </p>
          </div>
        </div>
      )}
    </section>
  )
}
