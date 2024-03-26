"use client";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Recommendation } from "@/types/recommendation";
import { getAcronym } from "@/utils";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SuggestionsCardProps {
  recommendation: Recommendation;
}

export default function SuggestionsCard({
  recommendation,
}: SuggestionsCardProps) {

  return (
    <Card className="m-auto mb-4 relative cursor-pointer">
      <CardContent className="pl-0 pr-0 pb-0 max-h-36 relative">
        <AspectRatio
          ratio={21 / 9}
          className="rounded-md max-h-36 pb-0 bg-muted"
        >
          {recommendation.coverPhotoReference && (
            <img
              src={recommendation.coverPhotoReference}
              alt="Imagem de capa"
              onError={(e) => {}}
              className="w-full h-full object-cover rounded-md"
            />
          )}
        </AspectRatio>
      </CardContent>
      <CardFooter
        className="flex flex-col w-full absolute p-0 bottom-0"
      >
        <Link
          className="w-full flex flex-col items-center justify-center"
          prefetch
          href={`/profile/${recommendation.username}`}
        >
          <div className="w-16 h-16 rounded-full mb-1 bg-gradient-to-br from-[#FF63FE] to-[#4518A7] flex justify-center items-center">
            <Avatar className="w-[58px] h-[58px]">
              <AvatarImage src={recommendation.profilePhotoReference} />
              <AvatarFallback>
                {getAcronym(recommendation.presentationName)}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex justify-center items-center self-stretch h-12 rounded-b-md leading-4 text-white bg-black bg-opacity-50 backdrop-blur-lg p-2">
            <div className="flex flex-1 flex-col justify-center items-center">
              <p className="font-semibold text-sm ">
                {recommendation.presentationName}
              </p>
              <p className="text-xs">@{recommendation.username}</p>
            </div>
          </div>
        </Link>
      </CardFooter>
    </Card>
  );
}
