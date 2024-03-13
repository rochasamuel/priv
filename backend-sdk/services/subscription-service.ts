import { Post } from "@/types/post";
import { Subscriber, Subscription } from "@/types/subscription";
import { AxiosInstance, AxiosResponse } from "axios";

interface QueryOptions {
	itemsPerPage: number;
	pageNumber: number;
}

export const SubscriptionService = (httpClient: AxiosInstance) => {
	return {
		getSubscriptions: async (): Promise<Subscription[]> => {
			const response: AxiosResponse = await httpClient.get("/subscriptions");

			return response.data.result as Subscription[];
		},
		getSubscribers: async (): Promise<Subscriber[]> => {
			const response: AxiosResponse = await httpClient.get("/subscribers");

			return response.data.result as Subscriber[];
		},
		cancelSubscription: async (producerId: string): Promise<any> => {
			const response: AxiosResponse = await httpClient.delete(
				"/producers/sign",
				{ params: { producerId } },
			);

			return response.data.result;
		},
	};
};
