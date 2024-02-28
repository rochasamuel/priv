import apiClient from "@/backend-sdk";
import { PostMedia, MediaType, Post } from "@/types/post";
import { User } from "@/types/user";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FunctionComponent, useEffect, useMemo, useRef, useState } from "react";
import { useInfiniteQuery, useQuery } from "react-query";
import { Skeleton } from "../ui/skeleton";
import { useIntersection } from "@mantine/hooks";
import useBackendClient from "@/hooks/useBackendClient";
import Image from "next/image";
import { Media } from "@/types/media";
import { Lock, LockKeyhole, PlayCircle } from "lucide-react";
import { Button } from "../ui/button";

interface MediaCardProps {
  user: User;
}

const MediaCard: FunctionComponent<MediaCardProps> = ({ user }) => {
  const [medias, setMedias] = useState<PostMedia[]>([]);

  const router = useRouter();

  const { data: session } = useSession();
  const { api, readyToFetch } = useBackendClient();

  const { data, fetchNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["medias", user.username],
      queryFn: async ({ pageParam = 1 }) => {
        return await api.post.getMedias(user.producerId, {
          itemsPerPage: 12,
          pageNumber: pageParam,
        });
      },
      enabled: readyToFetch,
      getNextPageParam: (_, pages) => {
        return pages.length + 1;
      },
      staleTime: 1000 * 60 * 5, //5 minutes
    });

  const infiniteTriggerPostRef = useRef<HTMLElement>(null);
  const { ref, entry } = useIntersection({
    root: infiniteTriggerPostRef.current,
    threshold: 0.2,
  });

  useEffect(() => {
    if (!isFetchingNextPage && entry?.isIntersecting) fetchNextPage();
  }, [entry?.isIntersecting]);

  const redirectToPost = (postId: string) => {
    router.push(`/profile/${user.username}/${postId}`);
  };

  const isPrivate = (media: Media) => {
    return media.isPublic === false && media.presignedUrls.length === 0;
  };

  const _medias = data?.pages.flatMap((page) => page);

  return (
    <div className="w-full border rounded-md p-4">
      {!isLoading && !_medias && (
        <div className="w-full text-center">Nenhuma mídia encontrada.</div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {isLoading
          ? Array.from([1, 2, 3, 4]).map((num) => (
              <MediaCardSkeleton key={num} />
            ))
          : _medias?.map((media: any, index: number) => {
              if (media.mediaTypeId === MediaType.Image) {
                return (
                  <div
                    key={media.presignedUrls[0]}
                    className="h-56 border rounded-md cursor-pointer bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900"
                    onClick={() => redirectToPost(media.postId)}
                    ref={index === _medias.length - 2 ? ref : null}
                  >
                    {isPrivate(media) ? (
                      <div className="h-full flex flex-col gap-4 justify-center items-center backdrop-blur-3xl bg-black bg-opacity-50 p-4">
                        <LockKeyhole />
                        <div className="w-full text-center">
                          Conteúdo exclusivo para assinantes
                        </div>
                      </div>
                    ) : (
                      <img
                        className="h-full max-w-full w-full rounded-md object-cover"
                        src={media.presignedUrls[0]}
                        alt=""
                      />
                    )}
                  </div>
                );
              }

              return (
                <div
                  className="h-56 border rounded-md cursor-pointer bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 relative"
                  key={media.presignedUrls[0]}
                  onClick={() => redirectToPost(media.postId)}
                >
                  {isPrivate(media) ? (
                    <div className="h-full flex flex-col  rounded-md gap-4 justify-center items-center backdrop-blur-3xl bg-black bg-opacity-50 p-4">
                      <LockKeyhole />
                      <div className="w-full text-center">
                        Conteúdo exclusivo para assinantes
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full relative flex items-center justify-center">
                     {media.presignedUrls[0] ? <img
                        className="h-full max-w-full w-full rounded-md object-cover"
                        src={media.presignedUrls[0]}
                        alt="keke"
                      />: <div className="w-full h-full bg-black max-w-full rounded-md" />}
                      <PlayCircle size={60} className="absolute opacity-50" />
                    </div>
                  )}
                </div>
              );
            })}
        {isFetchingNextPage && <MediaCardSkeleton />}
      </div>
    </div>
  );
};

export const MediaCardSkeleton: FunctionComponent = () => {
  return (
    <div className="h-56 w-full border rounded-md">
      <Skeleton className="animate-pulse h-full rounded-md" />
    </div>
  );
};

export default MediaCard;
