import PostCard from '@/components/PostCard'
import SuggestionCard from '@/components/SuggestionCard'

export default function Home() {
  return (
    <>
      <main className="flex-1 h-full">
        <PostCard />
        <PostCard />
        <PostCard />
        <PostCard />
        <PostCard />
        <PostCard />
        <PostCard />
      </main>

      <aside className="sticky top-8 hidden w-72 shrink-0 xl:block h-[calc(100vh-72px)] overflow-y-auto">
        <p className="text-lg font-bold mb-4">Sugestões pra você</p>
        <SuggestionCard />
        <SuggestionCard />
        <SuggestionCard />
      </aside>
    </>
  )
}
