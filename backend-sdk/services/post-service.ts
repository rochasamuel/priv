import { AxiosInstance, AxiosResponse } from 'axios';
import { Post, PostComment } from '@/types/post';

interface QueryOptions {
  itemsPerPage: number;
  pageNumber: number;
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
    }
  };
};