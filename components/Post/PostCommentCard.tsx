"use client";
import { PostComment } from "@/types/post";
import { getAcronym } from "@/utils";
import { Trash } from "lucide-react";
import { useSession } from "next-auth/react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useMutation } from "react-query";
import { useState } from "react";
import apiClient from "@/backend-sdk";
import { useToast } from "../ui/use-toast";
import { ToastAction } from "../ui/toast";

interface PostCommentCardProps {
  comment: PostComment;
  postId: string;
  loadingPublish?: boolean;
  updateCommentsCount: (count: number) => void;
}

const PostCommentCard = ({
  comment,
  loadingPublish,
  postId,
  updateCommentsCount,
}: PostCommentCardProps) => {
  const { data: session } = useSession();
  const [isDeleted, setIsDeleted] = useState(false);
  const { toast } = useToast()

  const isOwner = comment.idUser === session?.user.userId;

  const {
    isLoading: loadingDeletion,
    variables,
    mutate,
  } = useMutation({
    mutationFn: (commentId: string) => {
      const api = apiClient(session?.user.accessToken!);
      return api.comment.deletePostComment(
        postId,
        commentId
      );
    },
    onSuccess: () => {
      setIsDeleted(true);
      updateCommentsCount(-1);
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: "Erro ao excluir comentário",
        description: 'Tente novamente mais tarde',
      })
      console.error(error);
    }
  });

  return (
    <div
      className={`flex items-start justify-start w-full my-4 ${
        loadingPublish ? "opacity-50" : ""
      }
      ${isDeleted ? "hidden" : ""}`}
    >
      <Avatar>
        <AvatarImage src={comment.profilePhotoPresignedGet} />
        <AvatarFallback>{getAcronym(comment.presentationName)}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col ml-2">
        <div className="text-xs font-bold">{comment.presentationName}</div>
        <div className="text-sm">{comment.comment}</div>
      </div>

      <AlertDialog>
        <AlertDialogTrigger className="ml-auto">
          {isOwner && !loadingPublish && (
            <Button className="p-2" variant={"ghost"}>
              <Trash size={16} />
            </Button>
          )}
        </AlertDialogTrigger>
        <AlertDialogContent className="max-w-[95vw]">
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Um comentário excluido não pode ser recuperado. Deseja continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => mutate(comment.idComment)}>Continuar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PostCommentCard;
