"use client";
import apiClient from "@/backend-sdk";
import PostCard, { PostCardSkeleton } from "@/components/PostCard/PostCard";
import RecommendationCard from "@/components/SuggestionCard/SuggestionCard";
import { signOut, useSession } from "next-auth/react";
import { useInfiniteQuery, useQuery } from "react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Post } from "@/types/post";
import { LegacyRef, useEffect, useRef } from "react";
import { useIntersection } from "@mantine/hooks";
import { ScrollArea } from "@/components/ui/scroll-area";

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

  const { data, fetchNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["posts", session?.user.email],
      queryFn: async ({ pageParam = 1 }) => {
        const api = apiClient(session?.user.accessToken!);

        return await api.post.getPosts({
          itemsPerPage: 7,
          pageNumber: pageParam,
        });
      },
      enabled: !!session?.user.accessToken,
      retry: false,
      onError: (error: any) => {
        // if (error.response.status === 401) {
        //   signOut();
        // }
      },
      getNextPageParam: (_, pages) => {
        return pages.length + 1;
      },
    });

  const infiniteTriggerPostRef = useRef<HTMLElement>(null);
  const { ref, entry } = useIntersection({
    root: infiniteTriggerPostRef.current,
    threshold: 0.2,
  });

  useEffect(() => {
    if (!isFetchingNextPage && entry?.isIntersecting) fetchNextPage();
  }, [entry?.isIntersecting]);

  const _posts = data?.pages.flatMap((page) => page);

  return (
    <>
      <main className="flex-1 h-full">
        {!session?.user || isLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <PostCardSkeleton key={index} withPicture={index % 2 === 0} />
          ))
        ) : (
          <div>
            {_posts?.map((post, index) => {
              if (index === _posts.length - 1)
                return <PostCard post={post} ref={ref} />;
              return <PostCard post={post} />;
            })}
            {isFetchingNextPage && <PostCardSkeleton />}
          </div>
        )}
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
