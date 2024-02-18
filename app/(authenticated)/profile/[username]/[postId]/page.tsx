"use client";
import apiClient from "@/backend-sdk";
import PostCard, { PostCardSkeleton } from "@/components/Post/PostCard";
import SuggestionList from "@/components/Suggestion/SuggestionList";
import useBackendClient from "@/hooks/useBackendClient";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useQuery } from "react-query";

interface LonelyPostProps {
	params: { postId: string; username: string };
}

const LonelyPost = ({
	params,
}: LonelyPostProps) => {
	const { api, readyToFetch } = useBackendClient();

	const { data: lonelyPost, isLoading } = useQuery({
		queryKey: ["post", params.username, params.postId],
		queryFn: async () => {
			return await api.post.getPostById(params.postId);
		},
		enabled: readyToFetch,
	});

	return (
		<>
			<main className="flex-1 h-full">
				{isLoading && <PostCardSkeleton />}
        {!isLoading && lonelyPost && <PostCard post={lonelyPost} />}
			</main>

			<aside className="sticky top-8 hidden w-72 shrink-0 xl:block">
				<p className="text-lg font-bold mb-4">Sugestões pra você</p>
				<SuggestionList />
			</aside>
		</>
	);
};

export default LonelyPost;
