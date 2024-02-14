import apiClient from "@/backend-sdk";
import { Media, MediaType, Post } from "@/types/post";
import { User } from "@/types/user";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FunctionComponent, useEffect, useMemo, useRef, useState } from "react";
import { useInfiniteQuery, useQuery } from "react-query";
import { Skeleton } from "../ui/skeleton";
import { useIntersection } from "@mantine/hooks";

interface MediaCardProps {
	user: User;
}

const MediaCard: FunctionComponent<MediaCardProps> = ({ user }) => {
	const [medias, setMedias] = useState<Media[]>([]);

	const router = useRouter();

	const { data: session } = useSession();

  const { data, fetchNextPage, isFetchingNextPage, isLoading } =
		useInfiniteQuery({
			queryKey: ["posts-medias", session?.user.email],
			queryFn: async ({ pageParam = 1 }) => {
				const api = apiClient(session?.user.accessToken!);

				return await api.post.getPosts(
					{
						itemsPerPage: 12,
						pageNumber: pageParam,
					},
					user.producerId,
				);
			},
			enabled: !!session?.user.accessToken,
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

	const redirectToPost = (postId: string) => {
		router.push(`/profile/${user.username}/${postId}`);
	};

  const posts = useMemo(() => {
    if (data?.pages && data?.pages.length > 0)
      return data?.pages.flatMap((page) => page);
  }, [data]);

	const mediaData = useMemo(() => {
		if (posts && posts?.length > 0)
			return posts?.flatMap((post: Post) =>
				post.medias.map((media) => ({ ...media, postId: post.postId })),
			);
	}, [posts]);

	return (
		<div className="w-full border rounded-md p-4">
			<div className="grid grid-cols-2 md:grid-cols-3 gap-2">
				{isLoading ? Array.from([1, 2, 3, 4]).map((num) => <MediaCardSkeleton key={num} />  ): mediaData?.map((media: any, index: number) => {
					if (media.mediaTypeId === MediaType.Image) {
						return (
							<div
								key={media.presignedUrls[0]}
								className="h-56 border rounded-md cursor-pointer"
								onClick={() => redirectToPost(media.postId)}
                ref={index === mediaData.length - 1 ? ref : null}
							>
								<img
									className="h-full max-w-full w-full rounded-md object-cover"
									src={media.presignedUrls[0]}
									alt=""
								/>
							</div>
						);
					}

					return (
						<div
							className="h-56 border rounded-md cursor-pointer"
							key={media.presignedUrls[0]}
							onClick={() => redirectToPost(media.postId)}
						>
							<video
								className="h-full max-w-full w-full rounded-md object-cover"
								src={media.presignedUrls[0]}
							/>
						</div>
					);
				})}
				{isFetchingNextPage && <MediaCardSkeleton />}
			</div>
		</div>
	);
};

export const MediaCardSkeleton: FunctionComponent = () => {
	return (
			<div className="h-56 w-full border rounded-md">
				<Skeleton className="animate-pulse h-full rounded-md" />
			</div>
	);
};

export default MediaCard;
