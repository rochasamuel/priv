import { producerAddressFormSchema } from "@/components/Register/ProducerAddress";
import { z } from "zod";
import { Balance } from "@/types/balance";
import axios, { AxiosInstance, AxiosResponse } from "axios";
import { PresignedUrl } from "@/components/Post/PostMaker";
import { producerBankDetailFormSchema } from "@/components/Register/ProducerBankDetails";

export interface SearchResult {
	presentationName: string;
	username: string;
	profilePhotoReference: string;
	coverPhotoReference: string;
}

export enum DocumentType {
	RG = 1,
	CNH = 2,
}

export const ProducerService = (httpClient: AxiosInstance) => {
	return {
		search: async (term: string): Promise<SearchResult[]> => {
			const response: AxiosResponse = await httpClient.get(
				"/producers/search",
				{
					params: { name: term, quantity: 100 },
				},
			);

			return response.data.result as SearchResult[];
		},
		getProducerActiveSubscribersCount: async (): Promise<number> => {
			const response: AxiosResponse = await httpClient.get(
				"/producers/subscriptions-count",
			);

			return response.data.result.subscriptions;
		},
		getProducerBalance: async (): Promise<Balance> => {
			const response: AxiosResponse =
				await httpClient.get("/producers/balance");

			return response.data.result as Balance;
		},
		sendProducersData: async (
			data: z.infer<typeof producerAddressFormSchema> & {
				fullName?: string;
				cpf?: string;
				birthDate?: string;
			},
		): Promise<any> => {
			const response: AxiosResponse = await httpClient.post("/producers", data);

			return response.data.result;
		},
		sendDocuments: async (documentType: DocumentType): Promise<any> => {
			const response: AxiosResponse = await httpClient.post(
				"/producers-documents",
				{ documentType },
			);

			return response.data.result;
		},
		sendBankInformation: async (
			data: z.infer<typeof producerBankDetailFormSchema>,
		): Promise<any> => {
			const response: AxiosResponse = await httpClient.post(
				"/producers/bank",
				data,
			);

			return response.data.result;
		},
		uploadDocuments: async (
			presignedUrls: { front: PresignedUrl; back: PresignedUrl },
			files: { front: File; back: File },
		): Promise<any> => {
			const frontFormData = new FormData();
			for (const [key, value] of Object.entries(presignedUrls.front.fields)) {
				if (key === "id") {
					continue;
				}
				frontFormData.append(key, value);
			}
			frontFormData.append("file", files.front);

			await axios.post(presignedUrls.front.url, frontFormData, {
				headers: {
					"X-Amz-Server-Side-Encryption": "AES256",
				},
			});

			const backFormData = new FormData();
			for (const [key, value] of Object.entries(presignedUrls.back.fields)) {
				if (key === "id") {
					continue;
				}
				backFormData.append(key, value);
			}
			backFormData.append("file", files.back);

			await axios.post(presignedUrls.back.url, backFormData, {
				headers: {
					"X-Amz-Server-Side-Encryption": "AES256",
				},
			});
		},
		uploadSelfie: async (
			presignedUrl: PresignedUrl,
			file: File,
		): Promise<any> => {
			const frontFormData = new FormData();
			for (const [key, value] of Object.entries(presignedUrl.fields)) {
				if (key === "id") {
					continue;
				}
				frontFormData.append(key, value);
			}
			frontFormData.append("file", file);

			await axios.post(presignedUrl.url, frontFormData, {
				headers: {
					"X-Amz-Server-Side-Encryption": "AES256",
				},
			});
		},
	};
};
