import { PlanSettingsPayload } from "@/components/Plan/PlanSettingsCard";
import { Plan } from "@/types/plan";
import { User } from "@/types/user";
import { AxiosInstance, AxiosResponse } from "axios";

export const AccountService = (httpClient: AxiosInstance) => {
	return {
		getUserAccountData: async (): Promise<User> => {
			const response: AxiosResponse = await httpClient.get("/users/me");

			return response.data.user as User;
		},
		updateUserAccountData: async (user: User): Promise<User> => {
			const response: AxiosResponse = await httpClient.put("/users", user);

			return response.data.user as User;
		}
	};
};
