import { CropRecommender } from '@/components/crop-recommender'
import { Header } from '@/components/header'

export default function Page() {
  return (
    <div className="app-shell flex min-h-screen flex-col">
      <Header />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <CropRecommender />
      </main>
    </div>
  )
}
