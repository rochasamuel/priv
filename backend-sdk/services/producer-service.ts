import { AxiosInstance, AxiosResponse } from "axios";

export interface SearchResult {
  presentationName: string;
  username: string;
  profilePhotoReference: string;
  coverPhotoReference: string;
}

export const ProducerService = (httpClient: AxiosInstance) => {
  return {
    search: async (term: string): Promise<SearchResult[]> => {
      const response: AxiosResponse = await httpClient.get("/producers/search", {
        params: { name: term, quantity: 100 },
      });

      return response.data.result as SearchResult[];
    },
  };
};
