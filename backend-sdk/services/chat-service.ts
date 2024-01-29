import { Chat, ChatInfo } from "@/types/chat";
import { AxiosInstance, AxiosResponse } from "axios";

export const ChatService = (httpClient: AxiosInstance) => {
	return {
		getActiveChats: async (): Promise<ChatInfo[]> => {
			const response: AxiosResponse = await httpClient.get("/chats");

			return response.data.result as ChatInfo[];
		},
		getChatData: async (idChat: string): Promise<Chat> => {
			const response: AxiosResponse = await httpClient.get(`/chats/${idChat}/messages`);

			return response.data.result as Chat;
		}
	};
};
