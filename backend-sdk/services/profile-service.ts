import { User } from "@/types/user";
import { AxiosInstance, AxiosResponse } from "axios";

export const ProfileService = (httpClient: AxiosInstance) => {
	return {
		getByUsername: async (username: string): Promise<User> => {
			const response: AxiosResponse = await httpClient.get("/producers/profile", {
				params: { producerUsername: username },
			});

			return response.data.profile as User;
		},
		toggleFollow: async (producerId: string): Promise<void> => {
			const response = await httpClient.post(`/users/${producerId}/follow`);

			return response.data;
		}
	};
};
