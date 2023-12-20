import { Follower, Following } from "@/types/follower";
import { AxiosInstance, AxiosResponse } from "axios";

export const FollowService = (httpClient: AxiosInstance) => {
	return {
		getFollowers: async (): Promise<Follower[]> => {
			const response: AxiosResponse = await httpClient.get("/followers");

			return response.data.result as Follower[];
		},
		getFollowing: async (): Promise<Following[]> => {
			const response: AxiosResponse = await httpClient.get("/following");

			return response.data.result as Following[];
		},
	};
};
