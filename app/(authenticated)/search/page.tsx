"use client";

import apiClient from "@/backend-sdk";
import { SearchResult } from "@/backend-sdk/services/producer-service";
import IconInput from "@/components/Input/IconInput";
import SuggestionList from "@/components/Suggestion/SuggestionList";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAcronym } from "@/utils";
import { Loader2, Search } from "lucide-react";
import { useSession } from "next-auth/react";
import { FunctionComponent, useState } from "react";
import { useQuery } from "react-query";

type SearchComponentProps = {};

const SearchComponent: FunctionComponent<SearchComponentProps> = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [timeoutId, setTimeoutId] = useState<any>(null);

	const { data: session } = useSession();
	const {
		data: searchResut,
		isLoading,
		refetch,
	} = useQuery({
		queryKey: ["search", searchTerm],
		queryFn: async () => {
			const api = apiClient(session?.user.accessToken!);
			return await api.producer.search(searchTerm);
		},
		enabled: searchTerm.length > 0 && !!session?.user.accessToken,
		retry: false,
		staleTime: 1000,
	});

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
					<div
						key={searchResult.username}
						className="flex items-center my-4 cursor-pointer"
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
					</div>
				))
			)}
			<p className="text-lg font-bold mt-6 mb-4">Sugestões pra você</p>
			<SuggestionList />
		</div>
	);
};

export default SearchComponent;
