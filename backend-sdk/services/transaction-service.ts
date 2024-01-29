import { PlanSettingsPayload } from "@/components/Plan/PlanSettingsCard";
import { Plan } from "@/types/plan";
import { Transaction } from "@/types/transaction";
import { AxiosInstance, AxiosResponse } from "axios";

export type TransactionHistoryPayload = {
	period?: number;
};

export const TransactionService = (httpClient: AxiosInstance) => {
	return {
		getTransactionsHistory: async ({ period }: TransactionHistoryPayload): Promise<Transaction[]> => {
			const response: AxiosResponse = await httpClient.get("/users/transaction-history", { params: { period } });

			return response.data.result as Transaction[];
		},
	};
};
