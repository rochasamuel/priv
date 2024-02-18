"use client";
import apiClient from "@/backend-sdk";
import Feed from "@/components/Feed/Feed";
import PostCard, { PostCardSkeleton } from "@/components/Post/PostCard";
import PostMaker from "@/components/Post/PostMaker";
import RecommendationCard from "@/components/Suggestion/SuggestionCard";
import SuggestionList from "@/components/Suggestion/SuggestionList";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import useBackendClient from "@/hooks/useBackendClient";
import { Post } from "@/types/post";
import { useIntersection } from "@mantine/hooks";
import { signOut, useSession } from "next-auth/react";
import { LegacyRef, useEffect, useRef } from "react";
import { useInfiniteQuery, useQuery } from "react-query";

export default function Home() {
	const { data: session, status } = useSession();
	const { api, readyToFetch } = useBackendClient();

	const { data: recommendations } = useQuery({
		queryKey: ["recommendations"],
		queryFn: async () => {
			return await api.reccomendation.getRecommendations();
		},
		enabled: readyToFetch,
	});

	return (
		<>
			<main className="flex-1 h-full">
				<PostMaker />
				<Feed mode="feed" />
			</main>

			<aside className="sticky top-0 hidden w-72 shrink-0 xl:block">
				<p className="text-lg font-bold mb-4">Sugestões pra você</p>
				<SuggestionList />
			</aside>
		</>
	);
}
