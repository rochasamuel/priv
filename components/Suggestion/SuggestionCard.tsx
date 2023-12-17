"use client";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Recommendation } from "@/types/recommendation";
import Image from "next/image";

interface SuggestionsCardProps {
  recommendation: Recommendation;
}

export default function SuggestionsCard({ recommendation }: SuggestionsCardProps) {
  return (
    <Card className="m-auto mb-4 relative cursor-pointer">
      <CardContent className="pl-0 pr-0 pb-0 max-h-36 relative">
        <AspectRatio ratio={21 / 9} className="rounded-md max-h-36 pb-0 bg-slate-600">
          {recommendation.coverPhotoReference && <img
            src={recommendation.coverPhotoReference}
            alt="Image"
            onError={(e) => {}}
            className="w-full h-full object-cover rounded-md"
          />}
        </AspectRatio>
      </CardContent>
      <CardFooter className="flex flex-col w-full absolute p-0 bottom-0 ">
        <Avatar className="w-16 h-16 mb-2">
          <AvatarImage src={recommendation.profilePhotoReference} />
          <AvatarFallback>SR</AvatarFallback>
        </Avatar>
        <div className="flex justify-center items-center self-stretch h-10 rounded-b-md leading-4 text-white bg-black bg-opacity-50 backdrop-blur-lg p-2">
          <div className="flex flex-1 flex-col justify-center items-center">
            <p className="font-semibold text-sm ">{recommendation.presentationName}</p>
            <p className="text-xs">@{recommendation.username}</p>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}