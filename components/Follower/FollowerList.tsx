import apiClient from "@/backend-sdk";
import { Input } from "@/components/ui/input";
import { Follower, Following } from "@/types/follower";
import { Search } from "lucide-react";
import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";
import { useQuery } from "react-query";
import FollowerCard, { FollowerCardSkeleton } from "./FollowerCard";

const FollowerList = () => {
	const [searchTerm, setSeachTerm] = useState("");

	const { data: session, status } = useSession();

	const { data: followers, isLoading } = useQuery({
		queryKey: ["followers", session?.user.email],
		queryFn: async () => {
			const api = apiClient(session?.user.accessToken!);

			return await api.follow.getFollowers();
		},
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		enabled: !!session?.user.email,
	});

	const searchResult = useMemo(() => {
		if (!searchTerm) return followers;

		const termToSearch = searchTerm.toLowerCase();

		return followers?.filter((follower: Follower) => {
			return (
				follower.username.toLowerCase().includes(termToSearch) ||
				follower.presentationName.toLowerCase().includes(termToSearch)
			);
		});
	}, [followers, searchTerm]);

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
						<FollowerCardSkeleton key={index} />
					))
				) : (
					<>
						{searchResult?.map((follower: Follower) => (
							<FollowerCard key={follower.idUser} follower={follower} />
						))}
					</>
				)}
			</div>
		</div>
	);
};

export default FollowerList;
