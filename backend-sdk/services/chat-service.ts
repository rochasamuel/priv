import { Chat, ChatInfo } from "@/types/chat";
import { AxiosInstance, AxiosResponse } from "axios";

export interface ContactSearchResult {
	avatarReference: string;
	idUser: string;
	name: string;
}

export const ChatService = (httpClient: AxiosInstance) => {
	return {
		getActiveChats: async (): Promise<ChatInfo[]> => {
			const response: AxiosResponse = await httpClient.get("/chats");

			return response.data.result as ChatInfo[];
		},
		getChatData: async (idChat: string): Promise<Chat> => {
			const response: AxiosResponse = await httpClient.get(
				`/chats/${idChat}/messages`,
			);

			return response.data.result as Chat;
		},
		searchContacts: async (term: string): Promise<ContactSearchResult[]> => {
			const response: AxiosResponse = await httpClient.get("/chats/contacts", {
				params: { name: term, quantity: 100 },
			});

			return response.data.result as ContactSearchResult[];
		},
		createChat: async (idUser: string): Promise<string> => {
			const response: AxiosResponse = await httpClient.post(`/chats?idUser=${idUser}`);

			return response.data.result.idChat as string;
		},
		ackChat: async (idChat: string): Promise<void> => {
			await httpClient.post(`/chats/${idChat}/ack`);
		}
	};
};
