"use client";

import useBackendClient from "@/hooks/useBackendClient";
import { useMenuStore } from "@/store/useMenuStore";
import { ChatInfo } from "@/types/chat";
import { getAcronym } from "@/utils";
import { getChatRelativeDate } from "@/utils/date";
import { MessageCirclePlus } from "lucide-react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FunctionComponent, useCallback, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import NewChatDialog from "./NewChatDialog";
import { useWebSocket } from "@/providers/web-socket-provider";
import { useChatStore } from "@/store/useChatStore";
import Link from "next/link";

const ChatList: FunctionComponent = () => {
  const [newChatDialogOpen, setNewChatDialogOpen] = useState(false);

  const { api, readyToFetch } = useBackendClient();
  const queryClient = useQueryClient();
  const socket = useWebSocket();

  const setPageTitle = useMenuStore((state) => state.setPageTitle);
  const setChats = useChatStore((state) => state.setChats);
  const chats = useChatStore((state) => state.chats);
  const modifyChat = useChatStore((state) => state.modifyChat);

  useEffect(() => {
    setPageTitle("Chats");
  }, [setPageTitle]);

  const { data: session } = useSession();

  const { data: chatList } = useQuery({
    queryKey: ["chats", session?.user.username],
    queryFn: async () => {
      return await api.chat.getActiveChats();
    },
    onSuccess: (data) => {
      setChats(data);
    },
    enabled: readyToFetch,
  });

  const handleClickNewChat = () => {
    setNewChatDialogOpen(true);
  };

  const handleCloseComments = useCallback(() => {
    setNewChatDialogOpen(false);
  }, []);

  useEffect(() => {
    if (socket) {
      socket.onmessage = async (event) => {
        const wsData = JSON.parse(event.data);

        if (wsData.type === "receiveMessage") {
          modifyChat(wsData.data.idChat, {
            idChat: wsData.data.idChat,
            lastMessageDate: wsData.data.registrationDate,
            lastMessageText: wsData.data.text,
          });
        }
      };
    }
  }, [chats, queryClient, socket]);

  return (
    <div className="w-full h-full flex flex-col gap-4 relative">
      {!chats
        ? Array.from({ length: 8 }).map((_, index) => (
            <ChatCardSkeleton key={index + 1} />
          ))
        : chats?.map((chat) => <ChatCard key={chat.idChat} chatInfo={chat} />)}

      <Button
        className="rounded-full w-12 h-12 p-2 opacity-95 fixed lg:absolute lg:bottom-0 lg:right-0 bottom-20 right-4"
        onClick={handleClickNewChat}
      >
        <MessageCirclePlus />
      </Button>
      {newChatDialogOpen && (
        <NewChatDialog closeComments={handleCloseComments} />
      )}
    </div>
  );
};

interface ChatCardProps {
  chatInfo: ChatInfo;
}

export const ChatCard: FunctionComponent<ChatCardProps> = ({ chatInfo }) => {
  const modifyChat = useChatStore((state) => state.modifyChat);
  const setMessages = useChatStore((state) => state.setMessages);
  const searchParams = useSearchParams();
  const pathName = usePathname();

  const router = useRouter();

  return (
    <Link
      prefetch
      href={`/chats/conversation/${chatInfo.idChat}`}
      className="w-full flex items-center justify-between cursor-pointer"
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
              {getChatRelativeDate(chatInfo.lastMessageDate)}
            </div>
          </div>

          <div className="flex items-center justify-between w-full overflow-hidden gap-2">
            <div
              className={`text-sm opacity-60 font-light text-ellipsis overflow-hidden whitespace-nowrap ${
                chatInfo.notReadMessages > 0 ? "font-medium opacity-90" : ""
              }`}
            >
              {chatInfo.lastMessageText}
            </div>
            {chatInfo.notReadMessages > 0 && (
              <div className="min-w-5 min-h-5 flex justify-center items-center bg-purple-800 rounded-full text-xs font-medium">
                {chatInfo.notReadMessages}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
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
