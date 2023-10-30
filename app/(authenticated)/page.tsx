"use client"
import { getBackEndClient } from '@/backend-sdk';
import PostCard from '@/components/post-card/PostCard'
import SuggestionCard from '@/components/suggestion-card/SuggestionCard'
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

export default function Home() {
  const { data: session, status } = useSession()

  useEffect(() => {
    (async () => {
      if(session) {
        const client = await getBackEndClient(session?.user.accessToken!);
        const result = client.post.getPosts();
        console.log(result);
      }
    })();
  }, [session]);

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
