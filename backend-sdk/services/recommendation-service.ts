import { Recommendation } from "@/types/recommendation";
import { AxiosInstance, AxiosResponse } from "axios";

export const RecommendationService = (httpClient: AxiosInstance) => {
	return {
		getRecommendations: async (): Promise<Recommendation[]> => {
			const response: AxiosResponse = await httpClient.get("/recomendations");

			return response.data.result as Recommendation[];
		},
	};
};
