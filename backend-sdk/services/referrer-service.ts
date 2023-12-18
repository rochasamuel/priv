import { AxiosInstance, AxiosResponse } from "axios";

interface ReferrerMetricsResponse {
  metrics: {
    referrerPercentage: number;
    totalMonetaryReferences: number;
    totalReferences: number;
  };
}

export const ReferrerService = (httpClient: AxiosInstance) => {
  return {
    getMetrics: async (): Promise<ReferrerMetricsResponse> => {
      const response: AxiosResponse = await httpClient.get(
        "/referrer/metrics"
      );

      return response.data as ReferrerMetricsResponse;
    },
  };
};
