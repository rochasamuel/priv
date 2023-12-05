import { AxiosInstance, AxiosResponse } from 'axios';
import { Post, PostComment } from '@/types/post';

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
      const response: AxiosResponse = await httpClient.get('/post', {
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
      const response: AxiosResponse = await httpClient.get(`/post/${id}/comments`);

      return response.data.comments as PostComment[];
    },
    createPostComment: async (postId: string, comment: string): Promise<ApiActionResponse> => {
      const response: AxiosResponse = await httpClient.post(`/post/${postId}/comments`, { comment });

      return response.data as ApiActionResponse;
    },
    deletePostComment: async (postId: string, commentId: string): Promise<ApiActionResponse> => {
      const response: AxiosResponse = await httpClient.delete(`/post/${postId}/comments/${commentId}`);

      return response.data as ApiActionResponse;
    }
  };
};