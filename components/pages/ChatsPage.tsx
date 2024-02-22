"use client"
import { useSearchParams } from "next/navigation";
import Chat from "../Chat/Chat";
import ChatList from "../Chat/ChatList";
import { useEffect, useMemo, useState } from "react";
import { useMenuStore } from "@/store/useMenuStore";
import { useSession } from "next-auth/react";
import useWebSocket from "@/hooks/useWebSocket";

export default function ChatsPage() {
  const searchParams = useSearchParams();
  const setPageTitle = useMenuStore((state) => state.setPageTitle);
  const { socket } = useWebSocket();

	useEffect(() => {
		setPageTitle("Mensagens");
	}, [setPageTitle])

  useEffect(() => {
    if(socket) {
      socket.onopen = () => {
        console.log('WebSocket connection opened');
      };

      socket.onmessage = (event) => {
        console.log('WebSocket message received:', event.data);
      }
    }
  }, [socket])

  const selectedChat = useMemo(() => searchParams.get("selectedChat"), [searchParams]);
  
  return (
    <div className="w-full lg:flex lg:flex-col lg:h-full">
      <div className="hidden text-lg font-bold lg:block">Mensagens</div>
      <div className="w-full max-h-full overflow-y-auto mt-4 lg:border lg:flex lg:flex-1 lg:rounded-sm">
        <div className="w-full lg:w-[50%] lg:border-r lg:p-4 lg:overflow-auto">
          <ChatList />
        </div>
        <div className="hidden w-full p-4 justify-center items-center lg:flex">
          {selectedChat ? <Chat chatId={selectedChat} /> : <div className="text-lg font-normal opacity-50">Selecione um chat para visualizar</div>}
        </div>
      </div>
    </div>
  )
}