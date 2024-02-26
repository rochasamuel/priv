import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Follower, Following } from "@/types/follower";
import { getAcronym } from "@/utils";
import { MoreVertical } from "lucide-react";

interface FollowerCardProps {
	follower: Follower | Following;
}

const FollowerCard = ({ follower }: FollowerCardProps) => {
	return (
		<div className="w-full my-4 flex items-center justify-between">
			<div className="flex items-center justify-start">
				<Avatar>
					<AvatarImage src={follower.profilePhotoPresignedGet} />
					<AvatarFallback>
						{getAcronym(follower.presentationName)}
					</AvatarFallback>
				</Avatar>
				<div className="ml-2 flex flex-col">
					<p className="font-medium text-sm">
						{follower.presentationName}{" "}
						{"isProducer" in follower && follower.isProducer && (
							<span className="text-xs text-gray-500">[PRODUTOR]</span>
						)}
					</p>
					<a className="text-xs">@{follower.username}</a>
				</div>
			</div>
			<DropdownMenu>
				<DropdownMenuTrigger>
					<MoreVertical size={18} />
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuLabel>@{follower.username}</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem>Remover</DropdownMenuItem>
					{"isProducer" in follower && follower.isProducer && <DropdownMenuItem>Compartilhar</DropdownMenuItem>}
					{"isProducer" in follower && follower.isProducer && <DropdownMenuItem>Seguir</DropdownMenuItem>}
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};

export const FollowerCardSkeleton = () => {
	return (
		<div className="w-full mt-5 mb-5 flex items-center justify-between">
			<div className="flex items-center justify-start">
				<Skeleton className="h-10 w-10 rounded-full" />
				<div className="ml-2 flex flex-col">
					<Skeleton className="animate-pulse w-44 h-4 rounded-sm" />
					<Skeleton className="animate-pulse w-24 h-3 rounded-sm mt-2" />
				</div>
			</div>
			<Skeleton className="animate-pulse w-4 h-4 rounded-sm" />
		</div>
	);
};

export default FollowerCard;
