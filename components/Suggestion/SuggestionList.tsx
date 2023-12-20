import apiClient from "@/backend-sdk";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { FunctionComponent } from "react";
import { useQuery } from "react-query";
import { ScrollArea } from "../ui/scroll-area";
import SuggestionCard from "./SuggestionCard";

type SuggestionListProps = {};

const SuggestionList: FunctionComponent<SuggestionListProps> = () => {
	const { data: session, status } = useSession();

	const { data: recommendations, isLoading } = useQuery({
		queryKey: ["recommendations"],
		queryFn: async () => {
			const api = apiClient(session?.user.accessToken!);

			return await api.reccomendation.getRecommendations();
		},
		enabled: !!session?.user.accessToken,
	});

	return (
		<>
			{isLoading ? (
				<div className="text-gray-500 flex items-center justify-center w-full">
					Procurando sugestões
					<Loader2 className="ml-2 h-4 w-4 animate-spin" />
				</div>
			) : (
				<ScrollArea className="h-[calc(100vh-270px)] lg:h-[calc(100vh-140px)]">
					{recommendations?.map((recommendation) => (
						<SuggestionCard recommendation={recommendation} />
					))}
				</ScrollArea>
			)}
		</>
	);
};

export default SuggestionList;
