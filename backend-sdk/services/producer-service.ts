import { Balance } from "@/types/balance";
import { AxiosInstance, AxiosResponse } from "axios";

export interface SearchResult {
	presentationName: string;
	username: string;
	profilePhotoReference: string;
	coverPhotoReference: string;
}

export const ProducerService = (httpClient: AxiosInstance) => {
	return {
		search: async (term: string): Promise<SearchResult[]> => {
			const response: AxiosResponse = await httpClient.get(
				"/producers/search",
				{
					params: { name: term, quantity: 100 },
				},
			);

			return response.data.result as SearchResult[];
		},
		getProducerActiveSubscribersCount: async (): Promise<number> => {
			const response: AxiosResponse = await httpClient.get(
				"/producers/subscriptions-count",
			);

			return response.data.result.subscriptions;
		},
		getProducerBalance: async (): Promise<Balance> => {
			const response: AxiosResponse = await httpClient.get(
				"/producers/balance",
			);

			return response.data.result as Balance;
		},
	};
};
