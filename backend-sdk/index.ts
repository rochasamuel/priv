import axios, { AxiosInstance, HeadersDefaults } from 'axios';
import { PostService } from '@/services/post-service';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export class BackendClient {
  public readonly httpClient: AxiosInstance;

  public readonly post: PostService;

  public readonly defaultHeaders = {
    'X-Api': 1,
    'X-TimeZone': 'America/Sao_Paulo',
  };

  /**
   * Use this constructor to customize ou pass more options to services classes
   * @param opts Options to overwrite default options of BackendClient
   */
  constructor(accessToken?: string) {
    this.httpClient = axios.create({
      baseURL: 'https://privatus-homol.automatizai.com.br/',
      headers: {
        ...this.defaultHeaders,
        Authorization: `Bearer ${accessToken}`,
        'Access-Control-Allow-Origin': '*',
      },
    });

    this.post = new PostService(this.httpClient);
  }
}

// async function getSessionAccessToken() {
//   const session = await getServerSession(authOptions);
//   return session?.user?.accessToken;
// }

export const getBackEndClient = (accessToken: string) => new BackendClient(accessToken) ;
