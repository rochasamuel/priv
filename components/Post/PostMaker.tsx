"use client";

import { FunctionComponent, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getAcronym } from "@/utils";
import { useSession } from "next-auth/react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe2, Lock, Image, Video, Loader2 } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "react-query";
import apiClient from "@/backend-sdk";
import { useToast } from "../ui/use-toast";
import { Post } from "@/types/post";
import { usePostStore } from "@/store/usePostStore";

interface PostMakerProps {
  algo?: string;
}

const PostMaker: FunctionComponent<PostMakerProps> = ({}) => {
  const { data: session } = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [postDescription, setPostDescription] = useState("");

  const {
    isLoading: isLoadingPublishPost,
    variables,
    isSuccess,
    mutate: createPost,
  } = useMutation({
    mutationFn: (postData: {
      postDescription: string;
      postMedias?: string[];
    }) => {
      const api = apiClient(session?.user.accessToken!);
      return api.post.createPost(postData.postDescription, postData.postMedias);
    },
    onSuccess: () => {
      queryClient.refetchQueries(["posts", session?.user.email]); //update post list
      setPostDescription(""); //clear post description
      toast({
        variant: "default",
        title: "Sucesso",
        description: "Post criado com sucesso",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro ao excluir comentário",
        description: "Tente novamente mais tarde",
      });
      console.error(error);
    },
  });

  return (
    <div className="max-w-[96vw] m-auto mb-4 md:max-w-2xl">
      <Card className="p-0">
        <CardHeader className="mb-0 p-4">
          <CardTitle className="flex items-center gap-4">
            <Avatar className="w-8 h-8">
              <AvatarImage src={session?.user.profilePhotoPresignedGet} />
              <AvatarFallback>
                {getAcronym(session?.user.presentationName || "Anonymous")}
              </AvatarFallback>
            </Avatar>
            <div className="text-sm">Compartilhar com:</div>
            <Select defaultValue="private">
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">
                  <div className="flex items-center">
                    Assinantes <Lock className="text-pink-600 ml-2" size={14} />
                  </div>
                </SelectItem>
                <SelectItem value="public">
                  <div className="flex items-center">
                    Todos <Globe2 className="text-pink-600 ml-2" size={14} />
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pb-2">
          <Textarea
            placeholder="O que está acontecendo?"
            rows={6}
            value={postDescription}
            onChange={(e) => setPostDescription(e.target.value)}
          />
          <div className="text-xs mt-2 text-gray-300">
            {postDescription.length} / 5000
          </div>
        </CardContent>
        <CardFooter className="flex justify-between p-4">
          <div className="flex gap-8">
            <div className="cursor-pointer flex gap-2">
              <Image /> Foto
            </div>
            <div className="cursor-pointer flex gap-2">
              <Video /> Vídeo
            </div>
          </div>
          <Button
            disabled={postDescription.length <= 0}
            onClick={() => createPost({ postDescription })}
          >
            {isLoadingPublishPost ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Publicando
              </>
            ) : (
              <>Publicar</>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PostMaker;
