"use client";
import apiClient from "@/backend-sdk";
import PostCard, { PostCardSkeleton } from "@/components/Post/PostCard";
import RecommendationCard from "@/components/SuggestionCard/SuggestionCard";
import { signOut, useSession } from "next-auth/react";
import { useInfiniteQuery, useQuery } from "react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Post } from "@/types/post";
import { LegacyRef, useEffect, useRef } from "react";
import { useIntersection } from "@mantine/hooks";
import { ScrollArea } from "@/components/ui/scroll-area";
import Feed from "@/components/Feed/Feed";
import PostMaker from "@/components/Post/PostMaker";

export default function Home() {
  const { data: session, status } = useSession();

  const { data: recommendations } = useQuery({
    queryKey: ["recommendations"],
    queryFn: async () => {
      const api = apiClient(session?.user.accessToken!);

      return await api.reccomendation.getRecommendations();
    },
    enabled: !!session?.user.accessToken,
  });

  return (
    <>
      <main className="flex-1 h-full">
        <PostMaker />
        <Feed mode="feed" />
      </main>

      <aside className="sticky top-8 hidden w-72 shrink-0 xl:block">
        <p className="text-lg font-bold mb-4">Sugestões pra você</p>
        <ScrollArea className="h-[calc(100vh-140px)]">
          {recommendations?.map((recommendation) => (
            <RecommendationCard recommendation={recommendation} />
          ))}
        </ScrollArea>
      </aside>
    </>
  );
}
