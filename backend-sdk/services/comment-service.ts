import { Post, PostComment } from "@/types/post";
import { AxiosInstance, AxiosResponse } from "axios";

interface QueryOptions {
	itemsPerPage: number;
	pageNumber: number;
}

interface ApiActionResponse {
	result: string;
	status: number;
	message: string;
}

export const CommentService = (httpClient: AxiosInstance) => {
	return {
		createPostComment: async (
			postId: string,
			comment: string,
		): Promise<ApiActionResponse> => {
			const response: AxiosResponse = await httpClient.post(
				`/post/${postId}/comments`,
				{ comment },
			);

			return response.data as ApiActionResponse;
		},
		deletePostComment: async (
			postId: string,
			commentId: string,
		): Promise<ApiActionResponse> => {
			const response: AxiosResponse = await httpClient.delete(
				`/post/${postId}/comments/${commentId}`,
			);

			return response.data as ApiActionResponse;
		},
	};
};
