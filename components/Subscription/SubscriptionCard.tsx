import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Subscription, SubscriptionStatus } from "@/types/subscription";
import { getAcronym } from "@/utils";
import { DateTime } from "luxon";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PlansDialog from "../Plan/PlansDialog";

interface SubscriptionCardProps {
	subscription: Subscription;
}

const SubscriptionCard = ({ subscription }: SubscriptionCardProps) => {
	const router = useRouter();
  const [openPlansDialog, setOpenPlansDialog] = useState(false);

	const handleRedirect = (username: string) => {
		router.push(`/profile/${username}`);
	};

	const handleClosePlansDialog = () => {
    setOpenPlansDialog(false);
  };

	return (
		<div className="w-full rounded-sm border-[1px] mt-4 mb-4 pb-4">
			<div className="w-full flex flex-col items-center rounded-sm">
				{subscription.coverPhotoPresignedGet ? (
					<img
						className="w-full object-cover rounded-sm h-20"
						src={subscription.coverPhotoPresignedGet}
						alt=""
					/>
				) : (
					<div className="w-full h-20 bg-gray-200 rounded-sm" />
				)}
				<Avatar className="w-16 h-16 -mt-8 border-cyan-50 border-2">
					<AvatarImage src={subscription.profilePhotoPresignedGet} />
					<AvatarFallback>
						{getAcronym(subscription.presentationName)}
					</AvatarFallback>
				</Avatar>

				<p className="text-sm font-medium mt-2" onClick={() => handleRedirect(subscription.username)}>
					{subscription.presentationName}
				</p>
				<p className="text-xs" onClick={() => handleRedirect(subscription.username)}>@{subscription.username}</p>

				{subscription.idStatusContract === SubscriptionStatus.ACTIVE &&
					subscription.expirationDate && (
						<>
							<Badge className="mt-4 bg-green-600">
								Ativa [{subscription.planType}]
							</Badge>
							<Button className="text-xs h-6" variant={"link"}>
								Cancelar assinatura
							</Button>
						</>
					)}
				{subscription.idStatusContract === SubscriptionStatus.ACTIVE &&
					!subscription.expirationDate && (
						<Badge className="mt-4 bg-orange-400">Aguardando pagamento</Badge>
					)}
				{subscription.idStatusContract === SubscriptionStatus.INACTIVE && (
					<Button onClick={() => setOpenPlansDialog(true)} className="mt-4" size={"sm"}>
						Reativar
					</Button>
				)}

				{subscription.idStatusContract === SubscriptionStatus.ACTIVE &&
					subscription.registrationDate &&
					subscription.expirationDate && (
						<p className="text-xs mt-4 flex">
							Inscrição em:{" "}
							{DateTime.fromISO(subscription.registrationDate).toFormat(
								"dd/MM/yyyy",
							)}{" "}
							e Expira em:{" "}
							{DateTime.fromISO(subscription.expirationDate).toFormat(
								"dd/MM/yyyy",
							)}
						</p>
					)}

				{subscription.idStatusContract === SubscriptionStatus.INACTIVE &&
					subscription.registrationDate &&
					subscription.expirationDate && (
						<p className="text-xs mt-4 flex">
							Expirou em:{" "}
							{DateTime.fromISO(subscription.expirationDate).toFormat(
								"dd/MM/yyyy",
							)}
						</p>
					)}
			</div>
			{openPlansDialog && (
        <PlansDialog
          user={{
            presentationName: subscription.presentationName,
            producerId: subscription.idProducer,
          }}
					closePlansDialog={handleClosePlansDialog}
        />
      )}
		</div>
	);
};

export const SubscriptionCardSkeleton = () => {
	return (
		<div className="w-full rounded-sm border-[1px] mt-4 mb-4 pb-4">
			<div className="w-full flex flex-col items-center rounded-sm">
				<Skeleton className="w-full h-20 rounded-sm bg-muted" />
				<Avatar className="w-16 h-16 -mt-8 border-cyan-50 border-2">
					<AvatarImage src="" />
					<AvatarFallback />
				</Avatar>

				<p className="text-sm font-medium mt-2">
					<Skeleton className="animate-pulse w-44 h-4 rounded-sm" />
				</p>
				<p className="text-xs">
					<Skeleton className="animate-pulse w-24 h-3 rounded-sm mt-2" />
				</p>

				<Skeleton className="animate-pulse w-24 h-3 rounded-sm mt-2" />
				<Button className="text-xs h-6" variant={"link"}>
					<Skeleton className="animate-pulse w-24 h-3 rounded-sm mt-2" />
				</Button>

				<p className="text-xs mt-4 flex">
					<Skeleton className="animate-pulse w-36 h-3 rounded-sm mt-2" />
				</p>
			</div>
		</div>
	);
};

export default SubscriptionCard;
