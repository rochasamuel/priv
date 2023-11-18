import { AxiosInstance, AxiosResponse } from 'axios';
import { Post } from '@/types/post';

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
  };
};