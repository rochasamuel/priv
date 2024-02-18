import { PaymentPayload, PaymentResponse } from "@/types/payment";
import { AxiosInstance, AxiosResponse } from "axios";

export const PaymentService = (httpClient: AxiosInstance) => {
	return {
		sign: async (payload: PaymentPayload): Promise<PaymentResponse> => {
			const response: AxiosResponse = await httpClient.post("/producers/sign", {
				...payload
			});

			return response.data.result as PaymentResponse;
		},
	};
};
