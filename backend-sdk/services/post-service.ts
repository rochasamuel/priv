import { MediaToSend, PresignedUrl } from "@/components/Post/PostMaker";
import { Media } from "@/types/media";
import { Post, PostComment } from "@/types/post";
import axios, { AxiosInstance, AxiosResponse } from "axios";

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
		getPosts: async (
			queryOptions: QueryOptions,
			producerId?: string,
		): Promise<Post[]> => {
			const response: AxiosResponse = await httpClient.get("/post", {
				params: {
					itemsPerPage: queryOptions.itemsPerPage,
					pageNumber: queryOptions.pageNumber,
					producerId,
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
		createPost: async (description: string, medias: MediaToSend[] = []) => {
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
		getMedias: async (producerId: string, queryOptions: QueryOptions) => {
			const response = await httpClient.get("/medias", {
				params: {
					producerId,
					itemsPerPage: queryOptions.itemsPerPage,
					pageNumber: queryOptions.pageNumber,
				},
			});

			return response.data.result as Media[];
		},
		uploadFiles: async (
			presignedUrls: PresignedUrl[],
			files: File[],
			setUploadProgress: (progress: number) => void,
		) => {

			const totalPromises = presignedUrls.length;
			let completedPromises = 0;
			let overallProgress = 0;

			const promises = presignedUrls.map((presignedUrl, index) => {
				const formData = new FormData();
				for (const [key, value] of Object.entries(presignedUrl.fields)) {
					if (key === "id") {
						continue;
					}
					formData.append(key, value);
				}
				formData.append("file", files[index]);

				return axios
					.post(presignedUrl.url, formData, {
						headers: {
							"X-Amz-Server-Side-Encryption": "AES256",
						},
						onUploadProgress: (progressEvent) => {
							const percentCompleted = Math.round(
								(progressEvent.loaded * 100) / (progressEvent.total ?? 0),
							);

							// Update individual promise progress
							setUploadProgress(percentCompleted);

							// Calculate and update overall progress
							overallProgress =
								(completedPromises * overallProgress + percentCompleted) /
								(completedPromises + 1);

							setUploadProgress(overallProgress);
						},
					})
					.finally(() => {
						completedPromises++;

						// Check if all promises are completed and set overall progress to 100%
						if (completedPromises === totalPromises) {
							setUploadProgress(100);
						}
					});
			});

			console.log(promises);

			return Promise.all(promises);
		},
	};
};
