import { Sprout } from 'lucide-react'

export function Header() {
  return (
    <header className="border-b border-border bg-gradient-to-b from-secondary/70 to-card">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-7 sm:px-6">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[oklch(0.68_0.16_150)] to-primary text-primary-foreground shadow-md shadow-primary/25">
          <Sprout className="size-6" aria-hidden="true" />
        </span>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground text-balance sm:text-2xl">
            Crop Recommendation System
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter soil details and location to receive the best crop recommendation.
          </p>
        </div>
      </div>
    </header>
  )
}
