import { CreditCard } from "@/types/credit-card";
import { AxiosInstance, AxiosResponse } from "axios";

export const CreditCardService = (httpClient: AxiosInstance) => {
	return {
		getCreditCards: async (): Promise<CreditCard[]> => {
			const response: AxiosResponse = await httpClient.get("/users/cards");

			return response.data.cards as CreditCard[];
		},
		deleteCreditCard: async (cardId: string): Promise<void> => {
			await httpClient.delete("/users/cards", { params: { cardId } });
		},
	};
};
