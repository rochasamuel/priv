"use client";

import apiClient from "@/backend-sdk";
import { ChatInfo } from "@/types/chat";
import { useSession } from "next-auth/react";
import { FunctionComponent } from "react";
import { useQuery } from "react-query";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getAcronym } from "@/utils";
import { Separator } from "../ui/separator";
import { DateTime } from "luxon";
import { getChatRelativeTime } from "@/utils/date";
import { useRouter } from "next/navigation";

const ChatList: FunctionComponent = () => {
  const { data: session } = useSession();

  const { data: chats } = useQuery({
    queryKey: ["chats", session?.user.username],
    queryFn: async () => {
      const api = apiClient(session?.user.accessToken!);

      return await api.chat.getActiveChats();
    },
    enabled: !!session?.user.email,
  });

  return (
    <div className="w-full flex flex-col gap-4">
      {chats?.map((chat) => <ChatCard key={chat.idChat} chatInfo={chat} />)}
    </div>
  );
};

interface ChatCardProps {
  chatInfo: ChatInfo;
}

export const ChatCard: FunctionComponent<ChatCardProps> = ({ chatInfo }) => {
  const router = useRouter();

  const handleRedirect = (chatId: string) => {
    router.push(`/chats/${chatId}`);
  };

  return (
    <div className="w-full flex items-center justify-between cursor-pointer" onClick={() => handleRedirect(chatInfo.idChat)}>
      <div className="flex items-center w-full">
        <Avatar className="w-12 h-12 border-2 mr-4">
          <AvatarImage src={chatInfo.avatarReference} />
          <AvatarFallback>{getAcronym(chatInfo.name)}</AvatarFallback>
        </Avatar>

        <div className="flex flex-col w-full min-w-0">
          <div className="flex items-center justify-between w-full overflow-hidden gap-2">
            <div className="font-semibold text-ellipsis overflow-hidden whitespace-nowrap">
              {chatInfo.name}
            </div>
            <div className="text-xs">
              {getChatRelativeTime(chatInfo.lastMessageDate)}
            </div>
          </div>

          <div className="flex items-center justify-between w-full overflow-hidden gap-2">
            <div className="text-sm text-gray-500 text-ellipsis overflow-hidden whitespace-nowrap">
              {chatInfo.lastMessageText}
            </div>
            {chatInfo.notReadMessages > 0 && <div className="w-5 h-5 flex justify-center items-center bg-purple-800 rounded-full text-xs font-bold">
              {chatInfo.notReadMessages}
            </div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatList;
