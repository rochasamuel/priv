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

export const PostService = (httpClient: AxiosInstance) => {
	return {
		getPosts: async (queryOptions: QueryOptions): Promise<Post[]> => {
			const response: AxiosResponse = await httpClient.get("/post", {
				params: {
					itemsPerPage: queryOptions.itemsPerPage,
					pageNumber: queryOptions.pageNumber,
				},
			});

			return response.data.result as Post[];
		},
		getPostById: async (id: string): Promise<Post> => {
			const response: AxiosResponse = await httpClient.get(`/post/${id}`);

			return response.data.result as Post;
		},
		getPostComments: async (id: string): Promise<PostComment[]> => {
			const response: AxiosResponse = await httpClient.get(
				`/post/${id}/comments`,
			);

			return response.data.comments as PostComment[];
		},
		toggleLike: async (postId: string, producerId: string) => {
			const response: AxiosResponse = await httpClient.post(
				`/post/${postId}/favorites/${producerId}`,
			);

			return response.data as ApiActionResponse;
		},
		deletePost: async (postId: string) => {
			const response: AxiosResponse = await httpClient.delete(
				`/post/${postId}`,
			);

			return response.data as ApiActionResponse;
		},
		editPost: async (postId: string, description: string) => {
			const response: AxiosResponse = await httpClient.put("/post", {
				postId,
				description,
			});

			return response.data as ApiActionResponse;
		},
		createPost: async (description: string, medias: string[] = []) => {
			const response: AxiosResponse = await httpClient.post("/post", {
				description,
				medias,
			});

			return response.data as ApiActionResponse;
		},
		getHotPosts: async (queryOptions: QueryOptions) => {
			const response: AxiosResponse = await httpClient.get("/post/hot", {
				params: {
					itemsPerPage: queryOptions.itemsPerPage,
					pageNumber: queryOptions.pageNumber,
				},
			});

			return response.data.result as Post[];
		},
	};
};
