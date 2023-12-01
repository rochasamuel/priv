"use client";
import { PostComment } from "@/types/post";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getAcronym } from "@/utils";
import { MoreVertical, Trash } from "lucide-react";
import { useSession } from "next-auth/react";

interface PostCommentCardProps {
  comment: PostComment;
}

const PostCommentCard = ({ comment }: PostCommentCardProps) => {
  const { data: session } = useSession();

  const isOwner = comment.idUser === session?.user.userId;

  return (
    <div className="flex items-start justify-start w-full my-4">
      <Avatar>
        <AvatarImage src={comment.profilePhotoPresignedGet} />
        <AvatarFallback>{getAcronym(comment.presentationName)}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col ml-2">
        <div className="text-xs font-bold">{comment.presentationName}</div>
        <div className="text-sm">{comment.comment}</div>
      </div>
      {isOwner && <Trash size={18} className="ml-auto" />}
    </div>
  );
};

export default PostCommentCard;
