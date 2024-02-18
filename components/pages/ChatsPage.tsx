"use client"
import { useSearchParams } from "next/navigation";
import Chat from "../Chat/Chat";
import ChatList from "../Chat/ChatList";
import { useEffect, useMemo } from "react";
import { useMenuStore } from "@/store/useMenuStore";

export default function ChatsPage() {
  const searchParams = useSearchParams();
  const setPageTitle = useMenuStore((state) => state.setPageTitle);

	useEffect(() => {
		setPageTitle("Mensagens");
	}, [])

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