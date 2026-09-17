import { CropRecommender } from '@/components/crop-recommender'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { SidebarInfo } from '@/components/sidebar-info'

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
          <SidebarInfo />
          <CropRecommender />
        </div>
      </main>

      <Footer />
    </div>
  )
}
