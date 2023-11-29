"use client";
import apiClient from "@/backend-sdk";
import PostCard from "@/components/PostCard/PostCard";
import SuggestionCard from "@/components/SuggestionCard/SuggestionCard";
import { signOut, useSession } from "next-auth/react";
import { useInfiniteQuery, useQuery } from "react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Post } from "@/types/post";
import { LegacyRef, useEffect, useRef } from "react";
import { useIntersection } from "@mantine/hooks";

export function SkeletonDemo() {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}

export default function Home() {
  const { data: session, status } = useSession();

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
    threshold: 1,
  });

  useEffect(() => {
    if (!isFetchingNextPage && entry?.isIntersecting) fetchNextPage();
  }, [entry?.isIntersecting]);

  const _posts = data?.pages.flatMap((page) => page);

  return (
    <>
      <main className="flex-1 h-full">
        {!session?.user || isLoading ? (
          <SkeletonDemo />
        ) : (
          <div>
            {_posts?.map((post, index) => {
              if (index === _posts.length - 1) return <PostCard post={post} ref={ref} />;
              return (<PostCard post={post} />)
            })}
            {isFetchingNextPage && <SkeletonDemo />}
          </div>
        )}
      </main>

      <aside className="sticky top-8 hidden w-72 shrink-0 xl:block h-[calc(100vh-72px)] overflow-y-auto">
        <p className="text-lg font-bold mb-4">Sugestões pra você</p>
        <SuggestionCard />
        <SuggestionCard />
        <SuggestionCard />
      </aside>
    </>
  );
}
