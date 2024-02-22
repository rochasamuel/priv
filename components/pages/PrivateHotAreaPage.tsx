"use client"
import apiClient from "@/backend-sdk";
import { useIntersection } from "@mantine/hooks";
import { useSession } from "next-auth/react";
import { useRef, useEffect } from "react";
import { useInfiniteQuery } from "react-query";
import PostCard, { PostCardSkeleton } from "../Post/PostCard";
import { useMenuStore } from "@/store/useMenuStore";

export default function PrivateHotAreaPage() {
  const { data: session, status } = useSession();
  const setPageTitle = useMenuStore((state) => state.setPageTitle);

	useEffect(() => {
		setPageTitle("Área HOT");
	}, [])

  const { data, fetchNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["hotPosts"],
      queryFn: async ({ pageParam = 1 }) => {
        return await apiClient(session?.user.accessToken).post.getHotPosts({
          itemsPerPage: 7,
          pageNumber: pageParam,
        });
      },
      retry: false,
      onError: (error: any) => {
        // if (error.response.status === 401) {
        //   signOut();
        // }
      },
      getNextPageParam: (posts, pages) => {
        if(posts.length === 0) return;
        return pages.length + 1;
      },
      enabled: status === "authenticated",
    });

  const infiniteTriggerPostRef = useRef<HTMLElement>(null);
  const { ref, entry } = useIntersection({
    root: infiniteTriggerPostRef.current,
    threshold: 0.2,
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!isFetchingNextPage && entry?.isIntersecting) fetchNextPage();
  }, [entry?.isIntersecting]);

  const _posts = data?.pages.flatMap((page) => page);
  return (
    <div className="m-auto flex flex-col w-full">
      {isLoading ? (
        Array.from({ length: 4 }).map((_, index) => (
          <PostCardSkeleton key={index + 1} withPicture={index % 2 === 0} />
        ))
      ) : (<div>
          {_posts?.map((post, index) => {
            if (index === _posts.length - 3)
              return <PostCard key={index+1} post={post} ref={ref} />;
            return <PostCard key={index+1} post={post} />;
          })}
          {isFetchingNextPage && <PostCardSkeleton />}
          </div>
      )}
    </div>
  );
}