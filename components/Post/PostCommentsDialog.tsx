import apiClient from "@/backend-sdk";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Post } from "@/types/post";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useToast } from "../ui/use-toast";
import PostCommentCard from "./PostCommentCard";
import useBackendClient from "@/hooks/useBackendClient";

interface PostCommentsDialogProps {
	post: Post;
	closeComments: () => void;
	updateCommentsCount: (count: number) => void;
}

const PostCommentsDialog = ({
	post,
	closeComments,
	updateCommentsCount,
}: PostCommentsDialogProps) => {
	const [commentText, setCommentText] = useState("");
	const { toast } = useToast();

	const { data: session } = useSession();
	const { api, readyToFetch } = useBackendClient();

	const { data: comments, isLoading } = useQuery({
		queryKey: ["post", post.postId, "comments"],
		queryFn: () => api.post.getPostComments(post.postId),
		enabled: readyToFetch,
		onSuccess: (data) => {
			updateCommentsCount(data.length);
		},
		refetchOnWindowFocus: false,
	});

	const {
		isLoading: loadingPublish,
		variables,
		mutate,
	} = useMutation({
		mutationFn: async (comment: string) => {
			const response = await api.comment.createPostComment(
				post.postId,
				comment,
			);
			if (response.status === 201)
				comments?.unshift({
					comment: commentText,
					idComment: response.result,
					idUser: session?.user.userId!,
					presentationName: session?.user.presentationName!,
					profilePhotoPresignedGet: session?.user.profilePhotoPresignedGet!,
					registrationDate: new Date().toDateString(),
				});
			return response;
		},
		onSuccess: () => {
			setCommentText("");
			updateCommentsCount(comments?.length || 0);
		},
		onError: (error) => {
			toast({
				variant: "destructive",
				title: "Erro ao publicar comentário",
				description: "Tente novamente mais tarde",
			});
		},
	});

	return (
		<Dialog defaultOpen onOpenChange={closeComments}>
			{/* <DialogTrigger>{trigger}</DialogTrigger> */}
			<DialogContent className="max-w-screen-md h-dvh flex flex-col px-4 md:max-w-[50vw] md:h-auto md:max-h-[90dvh] lg:max-w-[45vw]">
				<DialogHeader>
					<DialogTitle>Comentários</DialogTitle>
				</DialogHeader>
				{isLoading ? (
					<div className="w-full flex items-center justify-center h-[80dvh]">
						Carregando <Loader2 className="animate-spin ml-2" />
					</div>
				) : (comments?.length || 0) > 0 || loadingPublish ? (
					<ScrollArea className="h-[80dvh] p-3">
						{loadingPublish && (
							<PostCommentCard
								comment={{
									idComment: "0",
									idUser: session?.user.userId!,
									presentationName: session?.user.presentationName!,
									profilePhotoPresignedGet:
										session?.user.profilePhotoPresignedGet!,
									registrationDate: new Date().toDateString(),
									comment: variables!,
								}}
								postId={post.postId}
								loadingPublish
								updateCommentsCount={updateCommentsCount}
							/>
						)}
						{comments?.map((comment) => (
							<PostCommentCard
								key={comment.idComment}
								postId={post.postId}
								comment={comment}
								updateCommentsCount={updateCommentsCount}
							/>
						))}
					</ScrollArea>
				) : (
					<div className="w-full text-center h-[80dvh]">
						Nenhum comentário. <br />
						Seja o primeiro a comentar!
					</div>
				)}
				<DialogFooter>
					<div className="w-full flex">
						<Input
							onChange={(e) => setCommentText(e.target.value)}
							value={commentText}
							maxLength={280}
							placeholder="Digite seu comentário"
						/>
						<Button className="ml-2" onClick={() => mutate(commentText)}>
							Publicar
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default PostCommentsDialog;
