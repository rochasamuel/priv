import { PlanSettingsPayload } from "@/components/Plan/PlanSettingsCard";
import { ProfitMetrics, SocialMetric, UserTransaction } from "@/types/metric";
import { Plan } from "@/types/plan";
import { User } from "@/types/user";
import { AxiosInstance, AxiosResponse } from "axios";

export const MetricService = (httpClient: AxiosInstance) => {
	return {
		getSocialMetrics: async (referenceDate: string): Promise<SocialMetric[]> => {
			const response: AxiosResponse = await httpClient.get("/producers/metrics/followers-and-subscriptions", { params: { referenceDate } });

			return response.data.result as SocialMetric[];
		},
		getProfitMetrics: async (referenceDate: string): Promise<ProfitMetrics[]> => {
			const response: AxiosResponse = await httpClient.get("/producers/metrics/profit", { params: { referenceDate } });

			return response.data.result as ProfitMetrics[];
		},
		getTransactionHistory: async (period: number): Promise<UserTransaction[]> => {
			const response: AxiosResponse = await httpClient.get("/producers/transaction-history", { params: { period } });

			return response.data.result as UserTransaction[];
		}
	};
};
