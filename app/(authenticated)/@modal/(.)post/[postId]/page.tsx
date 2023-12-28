"use client";
import apiClient from "@/backend-sdk";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useQuery } from "react-query";

export const PostModal = ({ params }: { params: { postId: string } }) => {
	const router = useRouter();
	const { data: session } = useSession();

	const { data: post, isLoading } = useQuery({
		queryKey: ["post", params.postId],
		queryFn: () => {
			console.log(params);
			const api = apiClient(session?.user.accessToken!);

			return api.post.getPostById(params.postId);
		},
	});

	const handleOpenChange = useCallback(
		(open: boolean) => {
			if (!open) router.back();
		},
		[router],
	);

	return (
		<Dialog defaultOpen onOpenChange={handleOpenChange}>
			dksaldlas
			<DialogContent className="h-full lg:h-auto" />
		</Dialog>
	);
};

export default PostModal;
