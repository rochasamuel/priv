"use client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { Badge } from "../ui/badge";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import FollowerList from "../Follower/FollowerList";
import FollowingList from "../Follower/FollowingList";
import SubscriberList from "../Subscription/SubscriberList";
import SubscriptionList from "../Subscription/SubscriptionList";
import { useMenuStore } from "@/store/useMenuStore";

export default function Subscriptions() {
	const setPageTitle = useMenuStore((state) => state.setPageTitle);

	useEffect(() => {
		setPageTitle("Assinaturas");
	}, [])
	
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