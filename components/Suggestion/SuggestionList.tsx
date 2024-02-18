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

	const { data: recommendations, isLoading } = useQuery({
		queryKey: ["recommendations"],
		queryFn: async () => {
			return await api.reccomendation.getRecommendations();
		},
		enabled: readyToFetch,
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
					{recommendations?.map((recommendation) => (
						<SuggestionCard key={recommendation.username} recommendation={recommendation} />
					))}
				</ScrollArea>
			)}
		</>
	);
};

export default SuggestionList;
