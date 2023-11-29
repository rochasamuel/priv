import axios from 'axios';
import { PostService } from './services/post-service';
import { SubscriptionService } from './services/subscription-service';
import { FollowService } from './services/follow-service';

const defaultHeaders = {
  'X-Api': 1,
  'X-TimeZone': 'America/Sao_Paulo',
};

export const apiClient = (accessToken: string) => {

  const httpClient = axios.create({
    baseURL: 'https://privatus-homol.automatizai.com.br/',
    headers: {
      ...defaultHeaders,
      Authorization: `Bearer ${accessToken}`,
      'Access-Control-Allow-Origin': '*',
    },
  });

  return {
    post: PostService(httpClient),
    subscription: SubscriptionService(httpClient),
    follow: FollowService(httpClient),
  }
};

export default apiClient;
