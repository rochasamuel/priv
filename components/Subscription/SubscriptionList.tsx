import apiClient from "@/backend-sdk";
import { Input } from "@/components/ui/input";
import { Subscription } from "@/types/subscription";
import { Search } from "lucide-react";
import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";
import { useQuery } from "react-query";
import SubscriptionCard, { SubscriptionCardSkeleton } from "./SubscriptionCard";

const SubscriptionList = () => {
	const [searchTerm, setSeachTerm] = useState("");

	const { data: session, status } = useSession();

	const { data: subscriptions, isLoading } = useQuery({
		queryKey: ["subscriptions", session?.user.email],
		queryFn: async () => {
			const api = apiClient(session?.user.accessToken!);

			return await api.subscription.getSubscriptions();
		},
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		enabled: !!session?.user.email,
	});

	const searchResult = useMemo(() => {
		if (!searchTerm) return subscriptions;

		const termToSearch = searchTerm.toLowerCase();

		return subscriptions?.filter((subscription: Subscription) => {
			return (
				subscription.username.toLowerCase().includes(termToSearch) ||
				subscription.presentationName.toLowerCase().includes(termToSearch)
			);
		});
	}, [subscriptions, searchTerm]);

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSeachTerm(e.target.value);
	};

	return (
		<div className="mt-4 mb-4">
			<div
				className={
					"flex h-10 items-center rounded-md border border-input bg-transparent pl-3 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
				}
			>
				<Search size={22} />
				<input
					onChange={handleSearch}
					className="w-full bg-transparent p-2 placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
					type="search"
					placeholder="Nome ou usuário"
				/>
			</div>
			<div className="mt-4">
				{isLoading ? (
					Array.from({ length: 10 }).map((_, index) => (
						<SubscriptionCardSkeleton key={index} />
					))
				) : (
					<>
						{searchResult?.map((subscription: Subscription) => (
							<SubscriptionCard subscription={subscription} />
						))}
					</>
				)}
			</div>
		</div>
	);
};

export default SubscriptionList;
