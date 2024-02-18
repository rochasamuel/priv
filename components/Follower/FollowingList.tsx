import apiClient from "@/backend-sdk";
import { Input } from "@/components/ui/input";
import { Following } from "@/types/follower";
import { Search } from "lucide-react";
import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";
import { useQuery } from "react-query";
import FollowerCard, { FollowerCardSkeleton } from "./FollowerCard";
import useBackendClient from "@/hooks/useBackendClient";

const FollowingList = () => {
	const [searchTerm, setSeachTerm] = useState("");

	const { data: session, status } = useSession();
	const { api, readyToFetch } = useBackendClient();

	const { data: following, isLoading } = useQuery({
		queryKey: ["following", session?.user.email],
		queryFn: async () => {
			return await api.follow.getFollowing();
		},
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		enabled: readyToFetch,
	});

	const searchResult = useMemo(() => {
		if (!searchTerm) return following;

		const termToSearch = searchTerm.toLowerCase();

		return following?.filter((following: Following) => {
			return (
				following.username.toLowerCase().includes(termToSearch) ||
				following.presentationName.toLowerCase().includes(termToSearch)
			);
		});
	}, [following, searchTerm]);

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
						<FollowerCardSkeleton key={index+1} />
					))
				) : (
					<>
						{searchResult?.map((following: Following, index: number) => (
							<FollowerCard key={index+1} follower={following} />
						))}
					</>
				)}
			</div>
		</div>
	);
};

export default FollowingList;
