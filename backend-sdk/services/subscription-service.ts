import { AxiosInstance, AxiosResponse } from 'axios';
import { Post } from '@/types/post';
import { Subscriber, Subscription } from '@/types/subscription';

interface QueryOptions {
  itemsPerPage: number;
  pageNumber: number;
}

export const SubscriptionService = (httpClient: AxiosInstance) => {
  return {
    getSubscriptions: async (): Promise<Subscription[]> => {
      const response: AxiosResponse = await httpClient.get('/subscriptions');

      return response.data.result as Subscription[];
    },
    getSubscribers: async (): Promise<Subscriber[]> => {
      const response: AxiosResponse = await httpClient.get('/subscribers');

      return response.data.result as Subscriber[];
    },
  };
};