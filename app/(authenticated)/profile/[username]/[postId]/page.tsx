"use client";
import apiClient from "@/backend-sdk";
import PostCard, { PostCardSkeleton } from "@/components/Post/PostCard";
import SuggestionList from "@/components/Suggestion/SuggestionList";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useQuery } from "react-query";

export const LonelyPost = ({
	params,
}: { params: { postId: string; username: string } }) => {
	const { data: session } = useSession();
	const router = useRouter();

	const { data: lonelyPost, isLoading } = useQuery({
		queryKey: ["post", params.username, params.postId],
		queryFn: async () => {
			const api = apiClient(session?.user.accessToken!);

			return await api.post.getPostById(params.postId);
		},
		enabled: !!session?.user.accessToken,
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
