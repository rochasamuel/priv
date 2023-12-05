import { Post, PostComment } from "@/types/post";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMutation, useQuery } from "react-query";
import apiClient from "@/backend-sdk";
import { useSession } from "next-auth/react";
import PostCommentCard from "./PostCommentCard";
import { ScrollArea } from "../ui/scroll-area";
import { Loader2 } from "lucide-react";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useCallback, useMemo, useState } from "react";
import { now } from "next-auth/client/_utils";
import { string } from "zod";

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

  const { data: session } = useSession();

  const api = useMemo(
    () => apiClient(session?.user.accessToken!),
    [session?.user.accessToken]
  );

  const { data: comments, isLoading } = useQuery({
    queryKey: ["post", post.postId, "comments"],
    queryFn: () => api.post.getPostComments(post.postId),
    enabled: !!session?.user.accessToken,
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
      const response = await api.post.createPostComment(post.postId, comment);
      if (response.status === 201)
        comments?.unshift({
          comment: commentText,
          idComment: response.result,
          idUser: session?.user.userId!,
          presentationName: session?.user.presentationName!,
          profilePhotoPresignedGet: session?.user.profilePhotoPresignedGet!,
          registrationDate: new Date().toDateString(),
        });
      setCommentText("");
      return response;
    },
    onSuccess: () => {
      updateCommentsCount(comments?.length || 0);
    },
  });

  return (
    <Dialog defaultOpen onOpenChange={closeComments}>
      {/* <DialogTrigger>{trigger}</DialogTrigger> */}
      <DialogContent className="max-w-screen-md h-screen flex flex-col px-4 md:max-w-[50vw] md:h-auto md:max-h-[90vh] lg:max-w-[45vw]">
        <DialogHeader>
          <DialogTitle>Comentários</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="w-full flex items-center justify-center h-[80vh]">
            Carregando <Loader2 className="animate-spin ml-2" />
          </div>
        ) : (comments?.length || 0) > 0 ? (
          <ScrollArea className="h-[80vh] p-3">
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
              <PostCommentCard key={comment.idComment} postId={post.postId} comment={comment} updateCommentsCount={updateCommentsCount}/>
            ))}
          </ScrollArea>
        ) : (
          <div className="w-full text-center h-[80vh]">
            Nenhum comentário. <br />
            Seja o primeiro a comentar!
          </div>
        )}
        <DialogFooter>
          <div className="w-full flex">
            <Input
              onChange={(e) => setCommentText(e.target.value)}
              value={commentText}
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
