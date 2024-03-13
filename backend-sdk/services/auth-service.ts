import { PlanSettingsPayload } from "@/components/Plan/PlanSettingsCard";
import { AxiosInstance, AxiosResponse } from "axios";

export type UserAccountDataPayload = {
	email: string;
	name: string;
	username: string;
	password: string
	referrer?: string;
};

export type ProducerAccountDataPayload = {
	name: string;
	password: string
	username: string;
	email: string;
	cpf: string;
	birthDate: string;
	fullName: string;
	phone: string;
	referrer?: string;
};

export type EmailConfirmationPayload = {
	email: string;
	code: string;
};

export const AuthService = (httpClient: AxiosInstance) => {
	return {
		createUserAccount: async (account: UserAccountDataPayload): Promise<any> => {
			const response: AxiosResponse = await httpClient.post(
				"/users",
				{ ...account },
			);

			return response.data.result;
		},
		createProducerAccount: async (account: ProducerAccountDataPayload): Promise<any> => {
			const response: AxiosResponse = await httpClient.post(
				"/producers",
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
		requestPasswordRecovery: async (email: string): Promise<any> => {
			const response: AxiosResponse = await httpClient.post(
				"/token-recuperacao-senha",
				{ email },
			);

			return response.data;
		},
		changePassword: async (newPassword: string, code: string): Promise<any> => {
			const response: AxiosResponse = await httpClient.put(
				"/alteracao-senha",
				{ newPassword, code },
			);

			return response.data;
		}
	};
};
 