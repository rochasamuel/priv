import { PlanSettingsPayload } from "@/components/Plan/PlanSettingsCard";
import { AxiosInstance, AxiosResponse } from "axios";

export type AccountDataPayload = {
	email: string;
	name: string;
	username: string;
	presentationName: string;
	password: string
	referrer?: string;
};

export type EmailConfirmationPayload = {
	email: string;
	code: string;
};

export const AuthService = (httpClient: AxiosInstance) => {
	return {
		createAccount: async (account: AccountDataPayload): Promise<any> => {
			const response: AxiosResponse = await httpClient.post(
				"/users",
				{ ...account },
			);

			return response.data.result;
		},
		confirmEmail: async (confirmation: EmailConfirmationPayload): Promise<any> => {
			const response: AxiosResponse = await httpClient.post(
				"/confirm-email",
				{ ...confirmation },
			);

			return response.data.result;
		},
		resendEmail: async (email: string): Promise<any> => {
			const response: AxiosResponse = await httpClient.post(
				"/resend-email-confirmation-code",
				{ email },
			);

			return response.data.result;
		},
		refreshAccessToken: async (refreshToken: string): Promise<any> => {
			const response: AxiosResponse = await httpClient.post(
				"/token",
				{
					client_id: "autenticador",
					grant_type: "refresh_token",
					refresh_token: refreshToken,
				},
				{
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
					},
				},
			);

			return response.data;
		},
	};
};
