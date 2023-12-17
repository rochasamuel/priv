import axios from 'axios';
import { PostService } from './services/post-service';
import { SubscriptionService } from './services/subscription-service';
import { FollowService } from './services/follow-service';
import { RecommendationService } from './services/recommendation-service';
import { CommentService } from './services/comment-service';
import { ProducerService } from './services/producer-service';

const defaultHeaders = {
  'X-Api': 1,
  'X-TimeZone': 'America/Sao_Paulo',
};

export const apiClient = (accessToken?: string) => {

  const httpClient = axios.create({
    baseURL: 'https://privatus-homol.automatizai.com.br/',
    headers: {
      ...defaultHeaders,
      Authorization: accessToken && `Bearer ${accessToken}`,
      'Access-Control-Allow-Origin': '*',
    },
  });

  return {
    post: PostService(httpClient),
    subscription: SubscriptionService(httpClient),
    follow: FollowService(httpClient),
    reccomendation: RecommendationService(httpClient),
    comment: CommentService(httpClient),
    producer: ProducerService(httpClient),
  }
};

export default apiClient;
