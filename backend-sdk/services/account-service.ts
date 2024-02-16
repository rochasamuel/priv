import { PlanSettingsPayload } from "@/components/Plan/PlanSettingsCard";
import { PresignedUrl } from "@/components/Post/PostMaker";
import { Plan } from "@/types/plan";
import { User } from "@/types/user";
import axios, { AxiosInstance, AxiosResponse } from "axios";

export const AccountService = (httpClient: AxiosInstance) => {
	return {
		getUserAccountData: async (): Promise<User> => {
			const response: AxiosResponse = await httpClient.get("/users/me");

			return response.data.user as User;
		},
		updateUserAccountData: async (user: User): Promise<any> => {
			const response: AxiosResponse = await httpClient.put("/users", user);

			return response.data.result as any;
		},
		uploadAccountImage: async (
			presignedUrl: PresignedUrl,
			file: Blob,
		): Promise<any> => {
			const formData = new FormData();
			for (const [key, value] of Object.entries(presignedUrl.fields)) {
				if (key === "id") {
					continue;
				}
				formData.append(key, value);
			}
			formData.append("file", file);

			return await axios.post(presignedUrl.url, formData, {
				headers: {
					"X-Amz-Server-Side-Encryption": "AES256",
				}
			});
		},
	};
};
