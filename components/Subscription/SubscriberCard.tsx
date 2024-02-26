import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Subscriber } from "@/types/subscription";
import { getAcronym } from "@/utils";
import { MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import PlansDialog from "../Plan/PlansDialog";
import { useState } from "react";

interface SubscriberCardProps {
  subscriber: Subscriber;
}

const SubscriberCard = ({ subscriber }: SubscriberCardProps) => {
  const router = useRouter();

  const handleRedirect = (username: string) => {
    router.push(`/profile/${username}`);
  };

  return (
    <div className="w-full my-4 flex items-center justify-between">
      <div className="flex items-center justify-start">
        <Avatar>
          <AvatarImage src={subscriber.profilePhotoPresignedGet} />
          <AvatarFallback>
            {getAcronym(subscriber.presentationName)}
          </AvatarFallback>
        </Avatar>
        <div className="ml-2 flex flex-col gap-1">
          <div
            className="font-medium text-sm flex items-center"
            onClick={() => handleRedirect(subscriber.username)}
          >
            {subscriber.presentationName}{" "}
            <Badge className="ml-2 h-4 bg-primary">
              {subscriber.planType}
            </Badge>
          </div>
          <a className="text-xs" href={`/profile/${subscriber.username}`}>
            @{subscriber.username}
          </a>
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreVertical size={18} />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>@{subscriber.username}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Compartilhar</DropdownMenuItem>
          <DropdownMenuItem>Seguir</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export const SubscriberCardSkeleton = () => {
  return (
    <div className="w-full mt-5 mb-5 flex items-center justify-between">
      <div className="flex items-center justify-start">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="ml-2 flex flex-col">
          <div className="flex">
            <Skeleton className="animate-pulse w-32 h-4 rounded-sm" />
            <Skeleton className="animate-pulse ml-2 w-12 h-4 rounded-sm" />
          </div>
          <Skeleton className="animate-pulse w-24 h-3 rounded-sm mt-2" />
        </div>
      </div>
      <Skeleton className="animate-pulse w-4 h-4 rounded-sm" />
    </div>
  );
};

export default SubscriberCard;
