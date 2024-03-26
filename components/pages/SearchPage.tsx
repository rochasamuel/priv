"use client";
import apiClient from "@/backend-sdk";
import { SearchResult } from "@/backend-sdk/services/producer-service";
import { getAcronym } from "@/utils";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Search, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import IconInput from "../Input/IconInput";
import SuggestionList from "../Suggestion/SuggestionList";
import { useMenuStore } from "@/store/useMenuStore";
import useBackendClient from "@/hooks/useBackendClient";
import Link from "next/link";

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
	const [timeoutId, setTimeoutId] = useState<any>(null);
	const setPageTitle = useMenuStore((state) => state.setPageTitle);

	const router = useRouter();
	
	const { data: session } = useSession();
	const { api, readyToFetch } = useBackendClient();

	const {
		data: searchResut,
		isLoading,
		refetch,
	} = useQuery({
		queryKey: ["search", searchTerm],
		queryFn: async () => {
			return await api.producer.search(searchTerm);
		},
		enabled: searchTerm.length > 2 && readyToFetch,
		retry: false,
		staleTime: 1000,
	});

	useEffect(() => {
		setPageTitle("Busca");
	}, [])

	return (
		<div className="w-full">
			<IconInput
				icon={<Search size={22} />}
				onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
					setSearchTerm(e.target.value)
				}
				placeholder="Nome ou usuário"
			/>
			{isLoading ? (
				<div className="text-gray-500 flex items-center justify-center w-full mt-2">
					Buscando produtores
					<Loader2 className="ml-2 h-4 w-4 animate-spin" />
				</div>
			) : (
				searchResut?.map((searchResult: SearchResult) => (
					<Link
						prefetch
						key={searchResult.username}
						className="flex items-center my-4 cursor-pointer"
						href={`/profile/${searchResult.username}`}
					>
						<Avatar>
							<AvatarImage src={searchResult.profilePhotoReference} />
							<AvatarFallback>
								{getAcronym(searchResult.presentationName)}
							</AvatarFallback>
						</Avatar>
						<div className="flex flex-col ml-4">
							<p className="font-medium line-clamp-1">
								{searchResult.presentationName}
							</p>
							<p className="text-xs text-gray-500">@{searchResult.username}</p>
						</div>
					</Link>
				))
			)}
			<p className="text-lg font-bold mt-6 mb-4">Sugestões pra você</p>
			<SuggestionList />
		</div>
	);
}