import { ChatInfo, ChatMessage } from "@/types/chat";
import { create } from "zustand";

interface ChatStoreInterface {
	messages: ChatMessage[] | undefined;
	setMessages: (messages: ChatMessage[] | undefined) => void;
	addMessage: (message: ChatMessage) => void;
  chats: ChatInfo[] | undefined;
  setChats: (chats: ChatInfo[] | undefined) => void;
  modifyChat: (chatId: string, partialChat: Partial<ChatInfo>, isSelectedChat?: boolean) => void;
}

export const useChatStore = create<ChatStoreInterface>((set) => ({
	messages: undefined,
	setMessages: (values: ChatMessage[] | undefined) =>
		set((state) => ({ messages: values })),
	addMessage: (message: ChatMessage) =>
		set((state) => ({
			messages: state.messages ? [...state.messages, message] : [message],
		})),
  chats: undefined,
  setChats: (values: ChatInfo[] | undefined) =>
    set((state) => ({ chats: values })),
    modifyChat: (chatId: string, partialChat: Partial<ChatInfo>, isSelectedChat?: boolean) =>
      set((state) => {
        const newChats = state.chats ? state.chats.map((c) => {
          if (c.idChat === chatId) {
            const isReceived = partialChat.lastMessageDate && c.lastMessageDate !== partialChat.lastMessageDate;
            return { ...c, ...partialChat, notReadMessages: isSelectedChat ? 0 : isReceived ? c.notReadMessages + 1 : 0 }; // Merge the existing chat object with the partialChat
          }
          return c;
        }) : [];
        return { chats: newChats };
      }),
}));
