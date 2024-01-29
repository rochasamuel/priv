import { PlanSettingsPayload } from "@/components/Plan/PlanSettingsCard";
import { Plan } from "@/types/plan";
import { AxiosInstance, AxiosResponse } from "axios";

export const PlanService = (httpClient: AxiosInstance) => {
	return {
		getProducerPlans: async (producerId: string): Promise<Plan[]> => {
			const response: AxiosResponse = await httpClient.get("/producers/plans", { params: { producerId } });

			return response.data.plans as Plan[];
		},
		savePlans: async (plansPayload: PlanSettingsPayload) => {
			const response: AxiosResponse = await httpClient.post("/producers/plans", plansPayload);

			return response.data.plans as Plan[];
		}
	};
};
