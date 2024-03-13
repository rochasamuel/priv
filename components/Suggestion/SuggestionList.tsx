import apiClient from "@/backend-sdk";
import { Loader2, RefreshCcw } from "lucide-react";
import { useSession } from "next-auth/react";
import { FunctionComponent, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { ScrollArea } from "../ui/scroll-area";
import SuggestionCard from "./SuggestionCard";
import useBackendClient from "@/hooks/useBackendClient";
import { Button } from "../ui/button";

const SuggestionList: FunctionComponent = () => {
	const { data: session, status } = useSession();
	const { api, readyToFetch } = useBackendClient();
	const queryClient = useQueryClient();
	const [refetching, setRefetching] = useState(false);

	const { data: suggestions, isLoading } = useQuery({
		queryKey: ["suggestions", session?.user?.userId],
		queryFn: async () => {
			const result = await api.suggestion.getSuggestions();
			setRefetching(false);
			return result;
		},
		enabled: readyToFetch,
		staleTime: Infinity
	});

	const refreshSuggestions = async () => {
		setRefetching(true);
		await queryClient.refetchQueries(["suggestions", session?.user?.userId]);
	}

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
					<Button onClick={refreshSuggestions} variant={"link"} className="text-white flex justify-center gap-2 w-full">
						Mostrar novas sugestões
						<RefreshCcw size={16} className={`${refetching ? "animate-spin" : ""}`} />
					</Button>
				</ScrollArea>
			)}
		</>
	);
};

export default SuggestionList;
