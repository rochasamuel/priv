import { Recommendation } from "@/types/recommendation";
import { AxiosInstance, AxiosResponse } from "axios";

export const SuggestionService = (httpClient: AxiosInstance) => {
	return {
		getSuggestions: async (): Promise<Recommendation[]> => {
			const response: AxiosResponse = await httpClient.get("/recomendations", {
				params: { itemsPerPage: 20, pageNumber: 1 },
			});

			return response.data.result as Recommendation[];
		},
	};
};
