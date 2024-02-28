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

interface PostPresignedUrls {
	id: string;
	media: PresignedUrl;
	thumbnail?: PresignedUrl;
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
			postPresignedUrls: PostPresignedUrls[],
			files: MediaToSend[],
		) => {
			for (const postPresignedUrl of postPresignedUrls) {
				const mediaFormData = new FormData();
				for (const [key, value] of Object.entries(
					postPresignedUrl.media.fields,
				)) {
					if (key === "id") {
						continue;
					}
					mediaFormData.append(key, value);
				}

				const fileToUpload = files.find(
					(file) => file.id === postPresignedUrl.id,
				);

				if (fileToUpload) {
					mediaFormData.append("file", fileToUpload.file);
				}

				await axios.post(postPresignedUrl.media.url, mediaFormData, {
					headers: {
						"X-Amz-Server-Side-Encryption": "AES256",
					},
				});

				if (postPresignedUrl.thumbnail) {
					const thumbnailFormData = new FormData();
					for (const [key, value] of Object.entries(
						postPresignedUrl.thumbnail.fields,
					)) {
						if (key === "id") {
							continue;
						}
						thumbnailFormData.append(key, value);
					}

					if (fileToUpload?.thumbnail) {
						thumbnailFormData.append("file", fileToUpload.thumbnail);
					}

					await axios.post(postPresignedUrl.thumbnail.url, thumbnailFormData, {
						headers: {
							"X-Amz-Server-Side-Encryption": "AES256",
						},
					});
				}
			}
		},
	};
};
