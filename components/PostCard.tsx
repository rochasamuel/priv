"use client";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { ReactElement, useState } from "react";

import HorizontalImage from "../public/horizontal.png";

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
  Forward,
  Globe2,
  Heart,
  MessageCircle
} from "lucide-react";

export default function PostCard() {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(10);

  return (
    <Card className="max-w-2xl m-auto mb-6">
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="https://github.com/rochasamuel.png" />
              <AvatarFallback>SR</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="text-lg font-bold">Samuel Rocha</p>
              <div className="flex text-sm items-center">
                <a href="#" className="font-normal hover:underline">
                  @rochasamuel
                </a>
                <PointSeparator />
                <Globe2 className=" text-pink-600" size={14} />
                <p className="font-semibold text-xs ml-1">Público</p>
                <PointSeparator />
                <p className="font-semibold text-xs">há 2h</p>
              </div>
            </div>
          </div>
        </CardTitle>
        <CardDescription className="text-gray-900 dark:text-gray-300">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore
          fugit a vitae consequuntur iusto, distinctio atque obcaecati
          doloremque, eligendi dignissimos minima dolores libero deleniti
          sapiente ipsam porro nihil tempore exercitationem.
        </CardDescription>
        {false && <div>bota de asinar</div>}
      </CardHeader>
      <CardContent className="pl-0 pr-0">
        {/* 1.91/1 || 16/9 || 4/5 || 1/1 */}
        <AspectRatio ratio={1.91 / 1}>
          <Image
            fill={true}
            src={HorizontalImage}
            alt="Image"
            className="object-cover"
          />
        </AspectRatio>
      </CardContent>
      <CardFooter>
        <div className="flex justify-between w-full">
          <div className="flex gap-4">
            <ActionButton
              onClick={() => {
                setLiked(!liked);
                setLikeCount(liked ? likeCount - 1 : likeCount + 1);
              }}
              icon={<Heart className={liked ? "transition-all -scale-x-100 duration-500 fill-pink-500 text-pink-500" : "transition-all -scale-x+100 duration-500"} />}
              count={likeCount}
            />
            <ActionButton icon={<MessageCircle />} count={5} />
            <ActionButton icon={<Forward />} count={102} />
          </div>

          <Bookmark className="cursor-pointer" />
        </div>
      </CardFooter>
    </Card>
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
