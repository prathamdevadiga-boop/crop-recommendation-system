import { BookOpen, ListOrdered, Users } from 'lucide-react'
import type { ReactNode } from 'react'

function InfoCard({
  icon,
  title,
  children,
}: {
  icon: ReactNode
  title: string
  children: ReactNode
}) {
  return (
    <section className="card-surface card-surface-hover rounded-2xl border border-border/70 bg-card p-6">
      <div className="mb-3 flex items-center gap-2.5">
        <span className="flex size-9 items-center justify-center rounded-xl bg-accent text-primary">
          {icon}
        </span>
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      </div>
      {children}
    </section>
  )
}

export function SidebarInfo() {
  return (
    <aside className="flex flex-col gap-4" aria-label="About and instructions">
      <InfoCard
        icon={<BookOpen className="size-4" aria-hidden="true" />}
        title="About the Project"
      >
        <p className="text-sm leading-relaxed text-muted-foreground">
          A data-driven tool that recommends the most suitable crop based on your
          soil nutrients, pH, and local weather conditions. Built to help farmers,
          students, and agricultural researchers make informed planting decisions.
        </p>
      </InfoCard>

      <InfoCard
        icon={<ListOrdered className="size-4" aria-hidden="true" />}
        title="Steps to Use"
      >
        <ol className="flex flex-col gap-2 text-sm text-muted-foreground">
          {[
            'Enter your soil nitrogen, phosphorus, potassium, and pH values.',
            'Type your city or district to fetch live weather data.',
            'Click "Recommend Crop" to run the prediction.',
            'Review the recommended crop, confidence, and charts.',
          ].map((step, index) => (
            <li key={step} className="flex gap-2.5">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
                {index + 1}
              </span>
              <span className="leading-snug">{step}</span>
            </li>
          ))}
        </ol>
      </InfoCard>

      <InfoCard
        icon={<Users className="size-4" aria-hidden="true" />}
        title="Team"
      >
        <p className="text-sm leading-relaxed text-muted-foreground">
          Add your team members here — names, roles, and contributions for this
          AI &amp; Data Science project.
        </p>
      </InfoCard>
    </aside>
  )
}
