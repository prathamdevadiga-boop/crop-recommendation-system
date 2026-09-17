import type { InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type LabeledFieldProps = {
  id: string
  label: string
  hint?: string
  error?: string
} & InputHTMLAttributes<HTMLInputElement>

export function LabeledField({
  id,
  label,
  hint,
  error,
  className,
  ...inputProps
}: LabeledFieldProps) {
  const describedBy = [hint ? `${id}-hint` : null, error ? `${id}-error` : null]
    .filter(Boolean)
    .join(' ')

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy || undefined}
        className={cn(
          'h-11 rounded-xl border border-input bg-secondary/40 px-3.5 text-base text-foreground outline-none transition-all',
          'placeholder:text-muted-foreground',
          'focus-visible:border-ring focus-visible:bg-card focus-visible:ring-4 focus-visible:ring-ring/15',
          error && 'border-destructive focus-visible:border-destructive focus-visible:ring-destructive/30',
          className,
        )}
        {...inputProps}
      />
      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-xs font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
