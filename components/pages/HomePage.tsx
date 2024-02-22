"use client"

import { useSession } from "next-auth/react";
import Feed from "../Feed/Feed";
import PostMaker from "../Post/PostMaker";
import SuggestionList from "../Suggestion/SuggestionList";
import { useMemo } from "react";

export default function HomePage() {
  const { data: session } = useSession();

  const canMakePosts = useMemo(() => {
    return session?.user.activeProducer;
  }, [session])

	return (
		<>
			<main className="flex-1 h-full">
				{canMakePosts && <PostMaker />}
				<Feed mode="feed" />
			</main>

			<aside className="sticky top-0 hidden w-72 shrink-0 xl:block">
				<p className="text-lg font-bold mb-4">Sugestões pra você</p>
				<SuggestionList />
			</aside>
		</>
	);

}