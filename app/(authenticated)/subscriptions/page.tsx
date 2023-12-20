"use client";
import FollowerList from "@/components/Follower/FollowerList";
import FollowingList from "@/components/Follower/FollowingList";
import SubscriberList from "@/components/Subscription/SubscriberList";
import SubscriptionList from "@/components/Subscription/SubscriptionList";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function Subscriptions() {
	const [subscriptionsFilterSelected, setSubscriptionsFilterSelected] =
		useState("subscriptions");
	const [followersFilterSelected, setFollowersFilterSelected] =
		useState("followers");
	const { data: session, status } = useSession();

	const handleSubscriptionsFilterSelectedToggle = (mode: string) => {
		setSubscriptionsFilterSelected(mode);
	};

	const handleFollowersFilterSelectedToggle = (mode: string) => {
		setFollowersFilterSelected(mode);
	};

	console.log(session);
	return (
		<div className="w-full flex align-middle justify-center">
			<Tabs defaultValue="subscriptions" className="w-full max-w-[800px]">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="subscriptions">Assinaturas</TabsTrigger>
					<TabsTrigger value="followers">Seguidores</TabsTrigger>
				</TabsList>
				<TabsContent value="subscriptions" className="mt-3">
					<Badge
						onClick={() =>
							handleSubscriptionsFilterSelectedToggle("subscriptions")
						}
						className="mr-2 cursor-pointer"
						variant={
							subscriptionsFilterSelected === "subscriptions"
								? "default"
								: "outline"
						}
					>
						Minhas assinaturas
					</Badge>
					<Badge
						onClick={() =>
							handleSubscriptionsFilterSelectedToggle("subscribers")
						}
						className="cursor-pointer"
						variant={
							subscriptionsFilterSelected === "subscribers"
								? "default"
								: "outline"
						}
					>
						Meus assinantes
					</Badge>

					{subscriptionsFilterSelected === "subscriptions" ? (
						<SubscriptionList />
					) : (
						<SubscriberList />
					)}
				</TabsContent>
				<TabsContent value="followers" className="mt-3">
					<Badge
						onClick={() => handleFollowersFilterSelectedToggle("followers")}
						className="mr-2  cursor-pointer"
						variant={
							followersFilterSelected === "followers" ? "default" : "outline"
						}
					>
						Seguidores
					</Badge>
					<Badge
						onClick={() => handleFollowersFilterSelectedToggle("following")}
						className="cursor-pointer"
						variant={
							followersFilterSelected === "following" ? "default" : "outline"
						}
					>
						Seguindo
					</Badge>

					{followersFilterSelected === "following" ? (
						<FollowingList />
					) : (
						<FollowerList />
					)}
				</TabsContent>
			</Tabs>
		</div>
	);
}
