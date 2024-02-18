"use client";

import apiClient from "@/backend-sdk";
import PostCard, { PostCardSkeleton } from "@/components/Post/PostCard";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useIntersection } from "@mantine/hooks";
import { VenetianMask } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useInfiniteQuery } from "react-query";

export default function HotArea() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const { data, fetchNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["hotPosts"],
      queryFn: async ({ pageParam = 1 }) => {
        return await apiClient().post.getHotPosts({
          itemsPerPage: 7,
          pageNumber: pageParam,
        });
      },
      retry: false,
      onError: (error: any) => {
        // if (error.response.status === 401) {
        //   signOut();
        // }
      },
      getNextPageParam: (_, pages) => {
        return pages.length + 1;
      },
    });

  const infiniteTriggerPostRef = useRef<HTMLElement>(null);
  const { ref, entry } = useIntersection({
    root: infiniteTriggerPostRef.current,
    threshold: 0.2,
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!isFetchingNextPage && entry?.isIntersecting) fetchNextPage();
  }, [entry?.isIntersecting]);

  const _posts = data?.pages.flatMap((page) => page);
  return (
    <div className="m-auto flex flex-col w-full min-w-full overflow-y-auto">
      {isLoading ? (
        Array.from({ length: 4 }).map((_, index) => (
          <PostCardSkeleton key={index + 1} withPicture={index % 2 === 0} />
        ))
      ) : (
        <div>
          {_posts?.map((post, index) => {
            if (index === _posts.length - 3)
              return <PostCard key={index + 1} post={post} ref={ref} />;
            return <PostCard key={index + 1} post={post} />;
          })}
          {isFetchingNextPage && <PostCardSkeleton />}
        </div>
      )}

      {!session?.user && (
        <>
          <Separator />
          <Card className="border-none">
            <CardHeader className="text-center">
              <CardTitle>
                Autentique ou faça o seu cadastro e tenha acesso completo a
                nossa área hot!
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <Button
                onClick={() => router.push("/")}
                variant="default"
                size="default"
                className="font-bold"
              >
                Acessar área VIP
                <VenetianMask className="ml-2" />
              </Button>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
