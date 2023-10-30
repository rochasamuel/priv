import { AxiosInstance } from "axios";

export class PostService {
  constructor(protected httpClient: AxiosInstance) {}

  /**
   * Get all posts
   * @returns List with all posts
   * @example [{}]
   */
  async getPosts() {
    return (await this.httpClient.get('/post')).data;
  }
}
