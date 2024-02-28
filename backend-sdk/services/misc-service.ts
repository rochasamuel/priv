import { PlanSettingsPayload } from "@/components/Plan/PlanSettingsCard";
import { BankDomain } from "@/types/domain";
import { AxiosInstance, AxiosResponse } from "axios";

export const MiscService = (httpClient: AxiosInstance) => {
	return {
		getBankDomains: async (): Promise<BankDomain> => {
			const response: AxiosResponse = await httpClient.get("/domains/bank");

			return response.data.bankDomains as BankDomain;
		},
	};
};
