import { Post } from "@/types/post";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useQuery } from "react-query";
import apiClient from "@/backend-sdk";
import { useSession } from "next-auth/react";
import PostCommentCard from "./PostCommentCard";
import { ScrollArea } from "../ui/scroll-area";


interface PostCommentsDialogProps {
  post: Post;
  closeComments: () => void;
  updateCommentsCount: (count: number) => void;
}

const PostCommentsDialog = ({ post, closeComments, updateCommentsCount }: PostCommentsDialogProps) => {
  const { data: session } = useSession();

  const { data: comments } = useQuery({
    queryKey: ["post", post.postId, "comments"],
    queryFn: () => {
      const api = apiClient(session?.user.accessToken!);

      return api.post.getPostComments(post.postId);
    },
    enabled: !!session?.user.accessToken,
    onSuccess: (data) => {
      updateCommentsCount(data.length);
    },
  });

  return (
    <Dialog defaultOpen onOpenChange={closeComments}>
      {/* <DialogTrigger>{trigger}</DialogTrigger> */}
      <DialogContent className="h-full lg:h-auto flex flex-col px-4">
        <DialogHeader>
          <DialogTitle>Comentários</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-full">
          {comments?.map((comment) => (
            <PostCommentCard key={comment.idComment} comment={comment} />
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default PostCommentsDialog;