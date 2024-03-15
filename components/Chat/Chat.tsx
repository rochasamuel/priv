import useBackendClient from "@/hooks/useBackendClient";
import { cn } from "@/lib/utils";
import { useMenuStore } from "@/store/useMenuStore";
import { ChatMessageDirection } from "@/types/chat";
import { getAcronym } from "@/utils";
import { Send } from "lucide-react";
import { useSession } from "next-auth/react";
import { FunctionComponent, useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useWebSocket } from "@/providers/web-socket-provider";
import { DateTime } from "luxon";

interface ChatProps {
  chatId: string;
}

const Chat: FunctionComponent<ChatProps> = ({ chatId }) => {
  const { data: session } = useSession();
  const { api, readyToFetch } = useBackendClient();
  const [shouldScrollSmoothly, setShouldScrollSmoothly] = useState(false);
  const setPageTitle = useMenuStore((state) => state.setPageTitle);
  const socket = useWebSocket();
  const queryClient = useQueryClient();

  const lastMessageRef: any = useRef(null);
  const containerRef: any = useRef(null);

  const [message, setMessage] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage(message);
    }

    if (event.key === "Enter" && event.shiftKey) {
    }
  };

  enum SocketMessageType {
    Pending = "pending",
    Send = "sendMessage",
    SendMessageStatus = "sendMessageStatus",
    Received = "receiveMessage",
    Failed = "failed",
    Ping = "ping",
    Pong = "pong",
  }
  interface OutgoingMessage {
    type: SocketMessageType;
    id: string;
    data: {
      text: string;
      idChat: string;
    };
  }

  const { data: chat } = useQuery({
    queryKey: ["chat", session?.user.username, chatId],
    queryFn: async () => {
      const result = await api.chat.getChatData(chatId);
      await api.chat.ackChat(chatId);
      return result;
    },
    enabled: readyToFetch,
    onSuccess(data) {
      setPageTitle(data.name);
    },
  });

  const sendMessage = (message: string) => {
    if (message.trim().length === 0) return;

    const messageId = crypto.randomUUID();
    const messageToSend: OutgoingMessage = {
      type: SocketMessageType.Send,
      id: messageId,
      data: {
        text: message.substring(0, 1999),
        idChat: chatId,
      },
    };

    setShouldScrollSmoothly(true);
    const messageToView = {
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

    chat?.messages.push(messageToView);
    socket?.send(JSON.stringify(messageToSend));
    setMessage("");
  };

  useEffect(() => {
    if (socket) {
      socket.onmessage = async (event) => {
        const messageData = JSON.parse(event.data);
        const message = {
          direction:
            messageData.type === SocketMessageType.Received
              ? ChatMessageDirection.Incoming
              : ChatMessageDirection.Outgoing,
          data: { ...messageData.data, idDomainStatusMessage: 3 },
        };

        if (messageData.type === SocketMessageType.Received) {
          setShouldScrollSmoothly(true);
          await queryClient.setQueryData(
            ["chat", session?.user.username, chatId],
            (oldData: any) => {
              return {
                ...oldData,
                messages: [...oldData.messages, message],
              };
            }
          );
        }
      };
    }
  }, [socket, chatId]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    containerRef.current?.scrollTo({
      top: containerRef.current?.scrollHeight,
      behavior: shouldScrollSmoothly ? "smooth" : "auto",
    });
  }, [chat?.messages.length]);

  return (
    <div className="w-full h-full flex flex-col justify-between">
      {chat && (
        <div className="items-center justify-start gap-2 mb-2 hidden lg:block">
          <div className="flex items-center gap-2">
            <Avatar className="w-10 h-10 border-2">
              <AvatarImage src={chat.avatarReference} />
              <AvatarFallback>{getAcronym(chat.name)}</AvatarFallback>
            </Avatar>
            <div className="font-semibold">{chat.name}</div>
          </div>
        </div>
      )}

      <div
        className="w-full min-h-[85%] overflow-y-auto overflow-x-hidden flex flex-col"
        ref={containerRef}
      >
        {chat?.messages.map((message, index) => (
          <div
            key={index + 1}
            className={cn(
              "flex gap-2 my-2 items-end",
              message.direction !== ChatMessageDirection.Incoming
                ? "justify-end"
                : "justify-start"
            )}
          >
            {message.direction !== ChatMessageDirection.Incoming && (
              <div className="text-xs opacity-50">
                {DateTime.fromISO(message.data.registrationDate).toFormat(
                  `${DateTime.fromISO(message.data.registrationDate).diffNow().hours > 24 ? "dd/MM/yyyy HH:mm" : "HH:mm"}`
                )}
              </div>
            )}
            <div
              className={cn(
                "text-sm bg-accent p-2 rounded-md max-w-[80%] w-[max-content] break-words whitespace-pre-line",
                message.direction !== ChatMessageDirection.Incoming
                  ? "bg-primary"
                  : "bg-secondary"
              )}
            >
              {message.data.text}
            </div>
            {message.direction !== ChatMessageDirection.Outgoing && (
              <div className="text-xs opacity-50">
                {DateTime.fromISO(message.data.registrationDate).toFormat(
                  `${DateTime.fromISO(message.data.registrationDate).diffNow().hours > 24 ? "dd/MM/yyyy HH:mm" : "HH:mm"}`
                )}
              </div>
            )}
          </div>
        ))}
        <div ref={lastMessageRef} />
      </div>
      <div className="pt-2 flex justify-between w-full items-center gap-2">
        <Textarea
          autoComplete="off"
          name="message"
          value={message}
          onKeyDown={handleKeyPress}
          onChange={handleInputChange}
          placeholder="Mensagem"
          className="w-full border rounded-sm h-10 flex items-center resize-none overflow-hidden bg-background mt-auto"
        />
        <Button onClick={() => sendMessage(message)}>
          <Send />
        </Button>
      </div>
    </div>
  );
};

export default Chat;
