"use client";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { ReactElement, Ref, forwardRef, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Bookmark,
  ChevronRight,
  Forward,
  Globe2,
  Heart,
  MessageCircle,
} from "lucide-react";
import { Media, MediaType, Post } from "@/types/post";

import { DateTime } from "luxon";
import { getBestAspectRatio } from "@/utils/aspect-ratio";
import { useQuery } from "react-query";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { getAcronym } from "@/utils";
import { Skeleton } from "../ui/skeleton";

interface PostCardProps {
  post: Post;
}

export const PostCard = forwardRef(({ post }: PostCardProps, ref) => {
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

  return (
    <Card
      className="max-w-[96vw] m-auto mb-4 md:max-w-2xl"
      ref={ref as Ref<HTMLDivElement>}
    >
      <CardHeader className="space-y-2">
        <CardTitle>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={post.producer.presignedUrlProfile} />
              <AvatarFallback>
                {getAcronym(post.producer.presentationName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="text-lg font-bold">
                {post.producer.presentationName}
              </p>
              <div className="flex text-sm items-center">
                <a href="#" className="font-normal hover:underline">
                  @{post.producer.username}
                </a>
                <PointSeparator />
                <Globe2 className=" text-pink-600" size={14} />
                <p className="font-semibold text-xs ml-1">Público</p>
                {/* <PointSeparator />
                <p className="font-semibold text-xs">{relativePostDate}</p> */}
              </div>
            </div>
          </div>
        </CardTitle>
        <CardDescription className="text-gray-900 dark:text-gray-300">
          {post.description}
        </CardDescription>
      </CardHeader>
      {postHasMedias && (
        <CardContent className="pl-0 pr-0">
          {/* 1.91/1 || 16/9 || 4/5 || 1/1 */}
          <Swiper
            spaceBetween={0.5}
            slidesPerView={1}
            navigation={true}
            modules={[Navigation]}
            autoHeight={true}
            onSlideChange={() => console.log("slide change")}
          >
            {post.medias.map((media: Media) => (
              <SwiperSlide>
                <AspectRatio
                  ratio={aspectRatioResult.data ?? 16 / 9}
                  className="bg-slate-100"
                >
                  {media.mediaTypeId === MediaType.Image ? (
                    <Image
                      key={post.postId}
                      fill={true}
                      src={media.presignedUrls.at(0)!}
                      alt="Image"
                      className="object-contain"
                    />
                  ) : (
                    <video
                      key={post.postId}
                      controls
                      className="w-full h-full m-auto"
                      src={post.medias[0].presignedUrls[0]}
                    />
                  )}
                </AspectRatio>
              </SwiperSlide>
            ))}
          </Swiper>
        </CardContent>
      )}
      <CardFooter>
        <ActionBar
          isLiked={post.isLiked}
          totalComments={post.totalComments}
          totalLikes={post.totalLikes}
          isSaved={post.isSaved}
        />
      </CardFooter>
    </Card>
  );
});

interface ActionBarPros {
  isLiked: boolean;
  isSaved: boolean;
  totalLikes: number;
  totalComments: number;
}

export function ActionBar({
  isLiked,
  totalLikes,
  totalComments,
}: ActionBarPros) {
  const [liked, setLiked] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(Number(totalLikes));
  const [commentsCount, setCommentsCount] = useState(Number(totalComments));

  return (
    <div className="flex justify-between w-full">
      <div className="flex gap-4">
        <ActionButton
          onClick={() => {
            setLiked(!liked);
            setLikeCount(liked ? likeCount - 1 : likeCount + 1);
          }}
          icon={
            <Heart
              className={
                liked
                  ? "transition-all -scale-x-100 duration-500 fill-pink-500 text-pink-500"
                  : "transition-all -scale-x+100 duration-500"
              }
            />
          }
          count={likeCount}
        />
        <ActionButton icon={<MessageCircle />} count={commentsCount} />
        <ActionButton icon={<Forward />} count={0} />
      </div>

      <Bookmark className="cursor-pointer" />
    </div>
  );
}

export function PointSeparator() {
  return <p className="ml-2 mr-2">&#x2022;</p>;
}

export interface ActionButtonProps {
  count: number;
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

export const PostCardSkeleton = ({ withPicture }: {withPicture?: boolean}) => {
  return (
      <Card className="max-w-[96vw] m-auto mb-4 md:max-w-2xl">
        <CardHeader className="space-y-4">
          <CardTitle>
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex flex-col">
                <Skeleton className="animate-pulse w-32 h-4 rounded-sm"></Skeleton>
                <Skeleton className="animate-pulse w-24 h-3 rounded-sm mt-2"></Skeleton>
              </div>
            </div>
          </CardTitle>
          <Skeleton className="animate-pulse w-48 h-3 rounded-sm mt-6"></Skeleton>
        </CardHeader>
        {withPicture && (
          <CardContent className="pl-0 pr-0">
            <AspectRatio ratio={16 / 9}>
              <Skeleton className="animate-pulse w-full h-full rounded-none" />
            </AspectRatio>
          </CardContent>
        )}
        <CardFooter>
          <div className="flex justify-between w-full">
            <div className="flex gap-4">
              <Skeleton className="animate-pulse w-7 h-7 rounded-sm"></Skeleton>
              <Skeleton className="animate-pulse w-7 h-7 rounded-sm"></Skeleton>
              <Skeleton className="animate-pulse w-7 h-7 rounded-sm"></Skeleton>
            </div>
            <Skeleton className="animate-pulse w-7 h-7 rounded-sm"></Skeleton>
          </div>
        </CardFooter>
      </Card>
  );
};

export default PostCard;
