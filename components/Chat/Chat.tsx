import useBackendClient from "@/hooks/useBackendClient";
import { cn } from "@/lib/utils";
import { useMenuStore } from "@/store/useMenuStore";
import { ChatMessage, ChatMessageDirection, SocketChatMessageType, SocketChatOutgoingMessage } from "@/types/chat";
import { getAcronym } from "@/utils";
import { ChevronLeft, Send } from "lucide-react";
import { useSession } from "next-auth/react";
import { FunctionComponent, useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useWebSocket } from "@/providers/web-socket-provider";
import { DateTime } from "luxon";
import { useChatStore } from "@/store/useChatStore";
import MessageList from "./MessageList";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "@mantine/hooks";

interface ChatProps {
  chatId: string;
}

const Chat: FunctionComponent<ChatProps> = ({ chatId }) => {
  const { data: session } = useSession();
  const { api, readyToFetch } = useBackendClient();
  const setPageTitle = useMenuStore((state) => state.setPageTitle);
  const socket = useWebSocket();
  const router = useRouter();

  const isMobile = useMediaQuery("(max-width: 768px)");

  const setMessages = useChatStore((state) => state.setMessages);
  const messages = useChatStore((state) => state.messages);
  const addMessage = useChatStore((state) => state.addMessage);
  const modifyChat = useChatStore((state) => state.modifyChat);

  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey && !isMobile) {
      event.preventDefault();
      if(inputRef.current?.value) {
        sendMessage(inputRef.current.value);
      }
    }

    if (event.key === "Enter" && event.shiftKey) {
    }
  };

  const { data: chat } = useQuery({
    queryKey: ["chat", session?.user.username, chatId],
    queryFn: async () => {
      const result = await api.chat.getChatData(chatId);
      await api.chat.ackChat(chatId);
      return result;
    },
    enabled: readyToFetch,
    onSuccess(data) {
      setMessages(data.messages);
      setPageTitle(data.name);
    },
  });

  const sendMessage = (message: string) => {
    if (message.trim().length === 0) return;

    const messageId = crypto.randomUUID();
    const messageToSend: SocketChatOutgoingMessage = {
      type: SocketChatMessageType.Send,
      id: messageId,
      data: {
        text: message.substring(0, 1999),
        idChat: chatId,
      },
    };

    socket?.send(JSON.stringify(messageToSend));

    const messageToView: ChatMessage = {
      direction: ChatMessageDirection.Outgoing,
      data: {
        idChat: chatId,
        idDomainStatusMessage: 3,
        idMessage: messageId,
        idSender: session?.user.userId!,
        registrationDate: new Date().toISOString(),
        text: message,
      },
    };

    addMessage(messageToView);
    modifyChat(chatId, {
      lastMessageDate: DateTime.now().toISO()!,
      lastMessageText: message,
    });

    if(inputRef.current) {
      inputRef.current.value = "";
    }
  };

  useEffect(() => {
    if (socket) {
      socket.onmessage = async (event) => {
        const messageData = JSON.parse(event.data);

        if (messageData.type === SocketChatMessageType.Received) {
          const message: ChatMessage = {
            direction: ChatMessageDirection.Incoming,
            data: { ...messageData.data, idDomainStatusMessage: 3 },
          };

          if(chatId === messageData.data.idChat) {
            await api.chat.ackChat(chatId);
            modifyChat(chatId, {
              lastMessageDate: messageData.data.registrationDate,
              lastMessageText: messageData.data.text,
              notReadMessages: 0,
            }, true);
          }
          addMessage(message);
        }
      };
    }
  }, [socket, chatId]);

  return (
    <div className="w-full h-full flex flex-col justify-between rounded-sm md:border md:p-4">
      {chat && (
        <div className="items-center justify-start gap-2 mb-2 hidden lg:block">
          <div className="flex items-center gap-2">
          <Button
            className="px-0 w-8 h-8"
            variant={"ghost"}
            onClick={() => {
              setMessages([]);
              router.push("/chats")
            }}
          >
            <ChevronLeft />
          </Button>{" "}
            <Avatar className="w-10 h-10 border-2">
              <AvatarImage src={chat.avatarReference} />
              <AvatarFallback>{getAcronym(chat.name)}</AvatarFallback>
            </Avatar>
            <div className="font-semibold">{chat.name}</div>
          </div>
        </div>
      )}

      {!messages && <div
        className="w-full min-h-[85%] overflow-y-auto overflow-x-hidden flex flex-col"
      >
        <div className="flex justify-center items-center w-full h-full">
          <div className="text-lg font-normal opacity-50">Carregando mensagens...</div>
        </div>
      </div>}
      {messages && <MessageList messages={messages} />}

      <div className="pt-2 flex justify-between w-full items-center gap-2">
        <Textarea
          autoComplete="off"
          name="message"
          onKeyDown={handleKeyPress}
          ref={inputRef}
          placeholder="Mensagem"
          className="w-full border rounded-sm h-10 flex items-center resize-none overflow-hidden bg-background mt-auto"
        />
        <Button onClick={() => sendMessage(inputRef.current?.value!)}>
          <Send />
        </Button>
      </div>
    </div>
  );
};

export default Chat;
