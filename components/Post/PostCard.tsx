/* eslint-disable react/display-name */
"use client";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import {
  ReactElement,
  Ref,
  forwardRef,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PostMedia, MediaType, Post } from "@/types/post";
import {
  Bookmark,
  ChevronRight,
  Forward,
  Globe2,
  Heart,
  ImageIcon,
  Loader2,
  Lock,
  LockKeyhole,
  MessageCircle,
  MoreHorizontal,
  MoreVertical,
  Trash,
} from "lucide-react";

import { getBestAspectRatio } from "@/utils/aspect-ratio";
import { DateTime } from "luxon";
import { useMutation, useQuery } from "react-query";

import apiClient from "@/backend-sdk";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { getAcronym } from "@/utils";
import { useSession } from "next-auth/react";
import Link from "next/link";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
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
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { toast } from "../ui/use-toast";
import PostCommentsDialog from "./PostCommentsDialog";
import { useRouter } from "next/navigation";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import useBackendClient from "@/hooks/useBackendClient";
import PlansDialog from "../Plan/PlansDialog";
import axios from "axios";

interface PostCardProps {
  post: Post;
}

export const PostCard = forwardRef(({ post }: PostCardProps, ref) => {
  const { data: session, status } = useSession();
  const { api, readyToFetch } = useBackendClient();

  const [deletedPost, setDeletedPost] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [postDescription, setPostDescription] = useState(post.description);
  const [openPlansDialog, setOpenPlansDialog] = useState(false);
  const [isPeekingDescription, setIsPeekingDescription] = useState(false);

  const router = useRouter();

  const handleRedirect = (username: string) => {
    router.push(`/profile/${username}`);
  };

  const isOwn = useMemo(
    () => session?.user.userId === post.producer.producerId,
    [session, post]
  );

  const isPrivate = useMemo(() => {
    return (
      post?.medias.some((media) => media.isPublic === false) &&
      session?.user.userId !== post.producer.producerId &&
      post.medias.flatMap((media) => media.presignedUrls).length === 0
    );
  }, [post, session]);

  const relativePostDate = DateTime.fromISO(post.registrationDate, {
    locale: "pt-BR",
  }).toRelative();

  const postHasMedias =
    post.medias.length > 0 &&
    post.medias.some((media) => media.presignedUrls.length > 0);

  const imgUrl =
    postHasMedias && post.medias[0].mediaTypeId === MediaType.Image
      ? post.medias[0].presignedUrls[0]
      : undefined;

  const aspectRatioResult = useQuery({
    queryKey: ["posts", imgUrl],
    queryFn: async () => {
      const result = await getBestAspectRatio(imgUrl!);
      return Number(result);
    },
    enabled: !!imgUrl,
  });

  const { mutate } = useMutation({
    mutationFn: async (postId: string) => {
      const result = await api.post.deletePost(postId);
      return result;
    },
    onSuccess: () => {
      setDeletedPost(true);
      toast({
        variant: "default",
        title: "Post excluído com sucesso",
      });
    },
    onError: (error) => {
      setDeletedPost(false);
      toast({
        variant: "destructive",
        title: "Erro ao excluir o post",
        description: "Tente novamente mais tarde",
      });
    },
  });

  const handleEditPost = useCallback(() => {
    setPostDescription(post.description);
    setEditMode(true);
  }, [post]);

  const { mutate: mutateEditPost, isLoading } = useMutation({
    mutationFn: async (description: string) => {
      const result = await api.post.editPost(post.postId, description);
      return result;
    },
    onSuccess: () => {
      setEditMode(false);
      post.description = postDescription;
      toast({
        variant: "default",
        title: "Post editado com sucesso",
      });
    },
    onError: (error) => {
      setEditMode(true);
      toast({
        variant: "destructive",
        title: "Erro ao editar o post",
        description: "Tente novamente mais tarde",
      });
    },
  });

  const descriptionRef = useRef<HTMLDivElement>(null);

  const isTextClamped = useMemo(() => {
    const el = descriptionRef.current;
    if (!el) return false;
    return el.scrollHeight > el.clientHeight;
  }, [descriptionRef.current]);

  const handleClosePlansDialog = () => {
    setOpenPlansDialog(false);
  };

  // const replacedDescription = (description: string) => description.replace(/(@\w+)/g, (mention) =>
  //   <LinkToProfile key={mention} username={mention.substring(1)} />
  // );

  const replacedDescription = (description: string) => {
    if(!description) return;
    const parts = description.split(/(@\S+)/g);

    return parts.map((part, index) => {
      if (part.match(/@\S+/)) {
        const username = part.substring(1);
        return <LinkToProfile key={index + 1} username={username} />;
      }
      return part;
    });
  };

  return (
    <>
      <Card
        className={`max-w-[96vw] m-auto mb-4 md:max-w-2xl ${
          deletedPost && "hidden"
        }`}
        ref={ref as Ref<HTMLDivElement>}
      >
        <CardHeader className="space-y-2">
          <CardTitle className="relative">
            {isOwn && (
              <div className="absolute right-0 top-0">
                <AlertDialog>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreHorizontal size={18} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={handleEditPost}>
                        Editar
                      </DropdownMenuItem>
                      <AlertDialogTrigger className="w-full">
                        <DropdownMenuItem>Excluir</DropdownMenuItem>
                      </AlertDialogTrigger>
                    </DropdownMenuContent>
                    <AlertDialogContent className="max-w-[96vw] lg:max-w-lg">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Um post excluído não pode ser recuperado. Tem certeza
                          que deseja continuar?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => mutate(post.postId)}>
                          Continuar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </DropdownMenu>
                </AlertDialog>
              </div>
            )}
            <div
              className="flex items-center gap-3"
              onClick={() => handleRedirect(post.producer.username)}
            >
              <Avatar>
                <AvatarImage src={post.producer.presignedUrlProfile} />
                <AvatarFallback>
                  {getAcronym(post.producer.presentationName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col w-full">
                <Link
                  className="text-lg font-bold max-w-[90%] line-clamp-1 cursor-pointer"
                  href={`/profile/${post.producer.username}`}
                >
                  {post.producer.presentationName}
                </Link>
                <div className="flex text-sm items-center">
                  <Link
                    href={`/profile/${post.producer.username}`}
                    className="font-normal hover:underline"
                  >
                    @{post.producer.username}
                  </Link>
                  <PointSeparator />
                  {post?.medias.some((media) => media.isPublic === false) ? (
                    <>
                      <Lock className=" text-secondary" size={14} />
                      <p className="font-semibold text-xs ml-1">Assinantes</p>
                    </>
                  ) : (
                    <>
                      <Globe2 className=" text-secondary" size={14} />
                      <p className="font-semibold text-xs ml-1">Público</p>
                    </>
                  )}
                  {/* <PointSeparator />
                <p className="font-semibold text-xs">{relativePostDate}</p> */}
                </div>
              </div>
            </div>
          </CardTitle>
          <CardDescription
            className={"text-gray-900 dark:text-gray-300 whitespace-pre-line"}
          >
            {editMode ? (
              <div>
                <Textarea
                  rows={5}
                  maxLength={5000}
                  defaultValue={postDescription}
                  onChange={(e) => setPostDescription(e.target.value)}
                />
                <div className="flex justify-between items-start mt-3">
                  <div>{postDescription.length} / 5000</div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => setEditMode(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      disabled={isLoading}
                      onClick={() => mutateEditPost(postDescription)}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Editando
                        </>
                      ) : (
                        <>Salvar</>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div
                  className={`break-words ${
                    isPeekingDescription ? "" : "line-clamp-5"
                  }`}
                  ref={descriptionRef}
                >
                  {replacedDescription(post.description)}
                </div>
                {isTextClamped && (
                  <div
                    className="font-bold text-white cursor-pointer mt-1 w-max"
                    onClick={() =>
                      setIsPeekingDescription(!isPeekingDescription)
                    }
                  >
                    {isPeekingDescription ? "Ver menos" : "Ver mais"}
                  </div>
                )}
              </>
            )}
          </CardDescription>
        </CardHeader>
        {isPrivate && (
          <CardContent className="pl-0 pr-0">
            <div className="h-60 bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 dark:bg-gradient-to-br dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
              <div className="w-full h-full bg-white bg-opacity-50 backdrop-blur-3xl p-4 dark:bg-black dark:bg-opacity-50">
                <div className="w-full h-full opacity-80 flex flex-col gap-4 items-center justify-center">
                  {/* <LockKeyhole size={40} /> */}
                  <img src="/privatus-mask.svg" alt="simple logo" />
                  <p className="w-full text-center font-medium text-lg">
                    Este conteúdo é secreto! Assine o plano do produtor para
                    visualizar
                  </p>
                  <Button onClick={() => setOpenPlansDialog(true)}>
                    Assinar{" "}
                    <strong className="ml-1">
                      {post.producer.presentationName}
                    </strong>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        )}
        {postHasMedias && !isPrivate && (
          <CardContent className="pl-0 pr-0 pb-0">
            {post.medias.length > 1 ? (
              <Carousel>
                <CarouselContent>
                  {post.medias.map((media: PostMedia, index: number) => (
                    <CarouselItem key={index + 1}>
                      <PostMediaVisualization
                        aspectRatioResult={aspectRatioResult}
                        post={post}
                        media={media}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </Carousel>
            ) : (
              <PostMediaVisualization
                aspectRatioResult={aspectRatioResult}
                post={post}
                media={post.medias[0]}
              />
            )}
          </CardContent>
        )}
        {!isPrivate && status !== "unauthenticated" && (
          <CardFooter className={`${postHasMedias ? "pt-6" : "pt-0"}`}>
            <ActionBar
              isLiked={post.isLiked}
              totalComments={post.totalComments}
              totalLikes={post.totalLikes}
              isSaved={post.isSaved}
              post={post}
            />
          </CardFooter>
        )}
      </Card>
      {openPlansDialog && (
        <PlansDialog
          user={{
            producerId: post.producer.producerId,
            presentationName: post.producer.presentationName,
          }}
          closePlansDialog={handleClosePlansDialog}
        />
      )}
    </>
  );
});

export function LinkToProfile({ username }: { username: string }) {
  return (
    <Link
      className="font-semibold text-secondary hover:underline"
      href={`/profile/${username}`}
    >
      @{username}
    </Link>
  );
}

interface PostMediaVisualizationProps {
  media: PostMedia;
  post: Post;
  aspectRatioResult?: any;
}

export const PostMediaVisualization = ({
  media,
  post,
  aspectRatioResult,
}: PostMediaVisualizationProps) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <AspectRatio ratio={aspectRatioResult.data ?? 16 / 9} className="bg-black">
      {/* {isLoading && media.mediaTypeId === MediaType.Image && (
        <div className="w-full h-full flex items-center justify-center animate-pulse bg-muted">
          <ImageIcon className="h-10 w-10 m-auto" />
        </div>
      )} */}
      {media.mediaTypeId === MediaType.Image ? (
        <img
          key={post.postId}
          src={media.presignedUrls.at(0)!}
          alt="Image"
          className="object-contain w-full h-full m-auto"
        />
      ) : (
        <video
          key={post.postId}
          controls
          controlsList="nodownload"
          playsInline
          autoPlay={false}
          className="w-full h-full m-auto"
          onContextMenu={(e) => e.preventDefault()}
          src={post.medias[0].presignedUrls[0]}
        />
      )}
    </AspectRatio>
  );
};

interface ActionBarPros {
  isLiked: boolean;
  isSaved: boolean;
  totalLikes: number;
  totalComments: number;
  post?: Post;
}

export function ActionBar({
  isLiked,
  totalLikes,
  totalComments,
  post,
}: ActionBarPros) {
  const [liked, setLiked] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(Number(totalLikes));
  const [commentsCount, setCommentsCount] = useState(Number(totalComments));
  const [openComments, setOpenComments] = useState(false);

  const router = useRouter();
  const { data: session } = useSession();

  const {
    isLoading: loadingPublish,
    variables,
    mutate,
  } = useMutation({
    mutationFn: async ({
      postId,
      producerId,
    }: {
      postId: string;
      producerId: string;
    }) => {
      const api = apiClient(session?.user.accessToken!);
      setLiked(!liked);
      setLikeCount(liked ? likeCount - 1 : likeCount + 1);
      const result = await api.post.toggleLike(postId, producerId);
      return result;
    },
    onError: (error) => {
      setLiked(liked);
      setLikeCount(likeCount);
      toast({
        variant: "destructive",
        title: "Erro executar a ação",
        description: "Tente novamente mais tarde",
      });
    },
  });

  const handleCloseComments = useCallback(() => {
    setOpenComments(!openComments);
  }, [openComments]);

  const handleUpdateCommentsCount = useCallback(
    (count: number) => {
      if (count === -1) {
        setCommentsCount(commentsCount - 1);
        return;
      }
      setCommentsCount(count);
    },
    [commentsCount]
  );

  const handleClipboardCopy = async () => {
    if (post) {
      const currentDomain = window.location.hostname ?? "";
      await navigator.clipboard.writeText(
        `${currentDomain}/profile/${post.producer.username}/${post.postId}`
      );
      toast({
        title: "Link copiado!",
        description: "O link do post foi copiado. Compartilhe com seus amigos!",
      });
    }
  };

  return (
    <div className="flex justify-between w-full">
      <div className="flex gap-4">
        <ActionButton
          onClick={() =>
            mutate({
              postId: post!.postId,
              producerId: post!.producer.producerId,
            })
          }
          icon={
            <Heart
              className={
                liked
                  ? "transition-all -scale-x-100 duration-500 fill-secondary text-secondary"
                  : "transition-all -scale-x+100 duration-500"
              }
            />
          }
          count={likeCount}
        />
        <ActionButton
          onClick={() => setOpenComments(true)}
          icon={<MessageCircle />}
          count={commentsCount}
        />
        {openComments && (
          <PostCommentsDialog
            post={post!}
            closeComments={handleCloseComments}
            updateCommentsCount={handleUpdateCommentsCount}
          />
        )}
        <ActionButton onClick={handleClipboardCopy} icon={<Forward />} />
      </div>

      {/* <Bookmark className="cursor-pointer" /> */}
    </div>
  );
}

export function PointSeparator() {
  return <p className="ml-2 mr-2">&#x2022;</p>;
}

export interface ActionButtonProps {
  count?: number;
  icon: ReactElement;
  onClick?: () => void;
}

export function ActionButton({ icon, count, ...props }: ActionButtonProps) {
  return (
    <div className="flex gap-2 items-center cursor-pointer" {...props}>
      {icon}
      <span className="text-xs font-semibold select-none">{count}</span>
    </div>
  );
}

export const PostCardSkeleton = ({
  withPicture,
}: {
  withPicture?: boolean;
}) => {
  return (
    <Card className="w-full max-w-[96vw] m-auto mb-2 md:max-w-2xl">
      <CardHeader className="space-y-4">
        <CardTitle>
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex flex-col">
              <Skeleton className="animate-pulse w-32 h-4 rounded-sm" />
              <Skeleton className="animate-pulse w-24 h-3 rounded-sm mt-2" />
            </div>
          </div>
        </CardTitle>
        <Skeleton className="animate-pulse w-48 h-3 rounded-sm mt-6" />
      </CardHeader>
      {withPicture && (
        <CardContent className="pl-0 pr-0">
          <AspectRatio ratio={16 / 9}>
            <Skeleton className="animate-pulse w-full h-full rounded-none" />
          </AspectRatio>
        </CardContent>
      )}
      <CardFooter>
        <div className="flex justify-between w-full mt-6">
          <div className="flex gap-4">
            <Skeleton className="animate-pulse w-7 h-7 rounded-sm" />
            <Skeleton className="animate-pulse w-7 h-7 rounded-sm" />
            <Skeleton className="animate-pulse w-7 h-7 rounded-sm" />
          </div>
          <Skeleton className="animate-pulse w-7 h-7 rounded-sm" />
        </div>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
