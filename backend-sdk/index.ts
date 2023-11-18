import axios from 'axios';
import { PostService } from './services/post-service';

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
  }
};

export default apiClient;
