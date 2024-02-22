import apiClient from "@/backend-sdk";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { FunctionComponent } from "react";
import { useQuery } from "react-query";
import { ScrollArea } from "../ui/scroll-area";
import SuggestionCard from "./SuggestionCard";
import useBackendClient from "@/hooks/useBackendClient";

const SuggestionList: FunctionComponent = () => {
	const { data: session, status } = useSession();
	const { api, readyToFetch } = useBackendClient();

	const { data: suggestions, isLoading } = useQuery({
		queryKey: ["suggestions", session?.user?.userId],
		queryFn: async () => {
			return await api.suggestion.getSuggestions();
		},
		enabled: readyToFetch,
		staleTime: Infinity
	});

	return (
		<>
			{isLoading ? (
				<div className="text-gray-500 flex items-center justify-center w-full">
					Procurando sugestões
					<Loader2 className="ml-2 h-4 w-4 animate-spin" />
				</div>
			) : (
				<ScrollArea className="h-[calc(100dvh-270px)] lg:h-[calc(100dvh-140px)]">
					{suggestions?.map((suggestions) => (
						<SuggestionCard key={suggestions.username} recommendation={suggestions} />
					))}
				</ScrollArea>
			)}
		</>
	);
};

export default SuggestionList;
