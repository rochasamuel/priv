"use client";

import apiClient from "@/backend-sdk";
import PostCard, { PostCardSkeleton } from "@/components/Post/PostCard";
import useBackendClient from "@/hooks/useBackendClient";
import { Post } from "@/types/post";
import { useIntersection } from "@mantine/hooks";
import { useSession } from "next-auth/react";
import { FunctionComponent, useEffect, useRef } from "react";
import { useInfiniteQuery } from "react-query";

interface FeedProps {
	mode: "feed" | "profile" | "hot";
	producerId?: string;
}

const Feed: FunctionComponent<FeedProps> = ({ mode, producerId }) => {
	const { data: session } = useSession();
	const { api, readyToFetch } = useBackendClient();
	const { data, fetchNextPage, isFetchingNextPage, isLoading } =
		useInfiniteQuery({
			queryKey: ["posts", session?.user.email, mode, producerId],
			queryFn: async ({ pageParam = 1 }) => {
				return await api.post.getPosts(
					{
						itemsPerPage: 7,
						pageNumber: pageParam,
					},
					producerId,
				);
			},
			enabled: readyToFetch,
			onError: (error: any) => {
			},
			getNextPageParam: (_, pages) => {
				return pages.length + 1;
			},
			staleTime: mode === "profile" ? 1000 * 30 : 1000 * 60 * 60,
			refetchOnWindowFocus: false,
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
		<div className="pb-2">
			{!session?.user || isLoading ? (
				Array.from({ length: 4 }).map((_, index) => (
					<PostCardSkeleton key={index + 1} withPicture={index % 2 === 0} />
				))
			) : (
				<div>
					{_posts?.map((post, index) => {
						if (index === _posts.length - 3)
							return <PostCard key={index+1} post={post} ref={ref} />;
						return <PostCard key={index+111} post={post} />;
					})}
					{isFetchingNextPage && <PostCardSkeleton />}
				</div>
			)}
			{!isLoading && _posts?.length === 0 && <div className="w-full text-center">Não há nenhum post para ser mostrado.</div>}
		</div>
	);
};

export default Feed;
