"use client";
import {
  Card,
  CardContent,
  CardFooter
} from "@/components/ui/card";

import { AspectRatio } from "@/components/ui/aspect-ratio";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import HorizontalImage from "../public/horizontal.png";


export default function SuggestionCard() {

  return (
    <Card className="m-auto mb-4 relative cursor-pointer">
      <CardContent className="pl-0 pr-0 pb-0 max-h-fit relative">
        <AspectRatio ratio={21 / 9} className="rounded-md">
          <Image
            fill={true}
            src={HorizontalImage}
            alt="Image"
            className="object-cover rounded-md"
          />
        </AspectRatio>
      </CardContent>
      <CardFooter className="flex flex-col w-full absolute p-0 bottom-0 ">
        <Avatar className="w-16 h-16 mb-2">
          <AvatarImage src="https://github.com/rochasamuel.png" />
          <AvatarFallback>SR</AvatarFallback>
        </Avatar>
        <div className="flex justify-center items-center self-stretch h-10 rounded-b-md leading-4 text-white bg-black bg-opacity-50 backdrop-blur-lg p-2">
          <div className="flex flex-1 flex-col justify-center items-center">
            <p className="font-semibold text-sm ">Samuel Rocha</p>
            <p className="text-xs">@rochasamuel</p>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}