"use client";

import apiClient from "@/backend-sdk";
import { ChatInfo } from "@/types/chat";
import { useSession } from "next-auth/react";
import { FunctionComponent, useCallback, useState } from "react";
import { useQuery } from "react-query";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getAcronym } from "@/utils";
import { Separator } from "../ui/separator";
import { DateTime } from "luxon";
import { getChatRelativeTime } from "@/utils/date";
import { useRouter, useSearchParams } from "next/navigation";
import { Skeleton } from "../ui/skeleton";
import { MessageCirclePlus } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import NewChatDialog from "./NewChatDialog";

const ChatList: FunctionComponent = () => {
  const [newChatDialogOpen, setNewChatDialogOpen] = useState(false);

  const { data: session } = useSession();

  const { data: chats } = useQuery({
    queryKey: ["chats", session?.user.username],
    queryFn: async () => {
      const api = apiClient(session?.user.accessToken!);

      return await api.chat.getActiveChats();
    },
    enabled: !!session?.user.email,
  });

  const handleClickNewChat = () => {
    setNewChatDialogOpen(true);
  }

  const handleCloseComments = useCallback(() => {
    setNewChatDialogOpen(false);
  }, []);

  return (
    <div className="w-full h-full flex flex-col gap-4 relative">
      {!chats
        ? Array.from({ length: 8 }).map((_, index) => (
            <ChatCardSkeleton key={index + 1} />
          ))
        : chats?.map((chat) => <ChatCard key={chat.idChat} chatInfo={chat} />)}

      <Button className="rounded-full w-12 h-12 p-2 opacity-95 fixed lg:absolute lg:bottom-0 lg:right-0 bottom-20 right-4" onClick={handleClickNewChat}>
        <MessageCirclePlus />
      </Button>
      {newChatDialogOpen && <NewChatDialog closeComments={handleCloseComments} />}
    </div>
  );
};

interface ChatCardProps {
  chatInfo: ChatInfo;
}

export const ChatCard: FunctionComponent<ChatCardProps> = ({ chatInfo }) => {
  const searchParams = useSearchParams();

  const router = useRouter();

  const handleChatClick = (chatId: string) => {
    const mobileMediaQuery = window.matchMedia('(max-width: 1024px)');
    const isMobile = mobileMediaQuery.matches;
    if (isMobile) {
      router.push(`/chats/conversation/${chatId}`);
    } else {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      current.set("selectedChat", chatId);

      if (!chatId) {
        current.delete("selectedChat");
      } else {
        current.set("selectedChat", chatId);
      }

      router.push(`chats?${current.toString()}`);
    }
  };

  return (
    <div
      className="w-full flex items-center justify-between cursor-pointer"
      onClick={() => handleChatClick(chatInfo.idChat)}
    >
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
            <div className="text-xs flex-none">
              {getChatRelativeTime(chatInfo.lastMessageDate)}
            </div>
          </div>

          <div className="flex items-center justify-between w-full overflow-hidden gap-2">
            <div className="text-sm text-gray-500 text-ellipsis overflow-hidden whitespace-nowrap">
              {chatInfo.lastMessageText}
            </div>
            {chatInfo.notReadMessages > 0 && (
              <div className="w-5 h-5 flex justify-center items-center bg-purple-800 rounded-full text-xs font-bold">
                {chatInfo.notReadMessages}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ChatCardSkeleton: FunctionComponent = () => {
  return (
    <div className="w-full flex items-center justify-between">
      <div className="flex items-center w-full gap-2">
        <Skeleton className="w-14 h-12 rounded-full" />

        <div className="flex flex-col w-full min-w-0 gap-2">
          <div className="flex items-center justify-between w-full overflow-hidden gap-2">
            <Skeleton className="w-1/4 h-4" />
            <Skeleton className="w-1/5 h-4" />
          </div>

          <div className="flex items-center justify-between w-full overflow-hidden gap-2">
            <Skeleton className="w-1/2 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatList;
