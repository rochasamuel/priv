import apiClient from "@/backend-sdk";
import { useSession } from "next-auth/react";
import { FunctionComponent, useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getAcronym } from "@/utils";
import { ChevronLeft, Send } from "lucide-react";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { ChatMessage, ChatMessageDirection } from "@/types/chat";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ScrollArea } from "../ui/scroll-area";
import { Textarea } from "../ui/textarea";
import Header from "../Header/Header";
import { useMenuStore } from "@/store/useMenuStore";

interface ChatProps {
  chatId: string;
}

const Chat: FunctionComponent<ChatProps> = ({ chatId }) => {
  const { data: session } = useSession();
  const setPageTitle = useMenuStore((state) => state.setPageTitle);

  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      const maxScrollHeight =
        chatContainerRef.current.scrollHeight -
        chatContainerRef.current.clientHeight;
      chatContainerRef.current.scrollTop = maxScrollHeight;
    }
  };

  const [message, setMessage] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      // handleSend();
    }

    if (event.key === "Enter" && event.shiftKey) {
    }
  };

  const { data: chat } = useQuery({
    queryKey: ["chat", session?.user.username, chatId],
    queryFn: async () => {
      const api = apiClient(session?.user.accessToken!);

      return await api.chat.getChatData(chatId);
    },
    enabled: !!session?.user.accessToken,
    onSuccess(data) {
      setPageTitle(data.name);
    },
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    scrollToBottom();
  }, [chat?.messages]);

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
        className="w-full overflow-y-auto overflow-x-hidden flex flex-col"
        ref={chatContainerRef}
      >
        {chat?.messages.map((message, index) => (
          <div
            key={index+1}
            className={cn(
              "flex gap-2 whitespace-pre-wrap my-2",
              message.direction !== ChatMessageDirection.Incoming
                ? "justify-end"
                : "justify-start"
            )}
          >
            <span className="text-sm bg-accent p-2 rounded-md max-w-xs">
              {message.data.text}
            </span>
          </div>
        ))}
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
        <Button>
          <Send />
        </Button>
      </div>
    </div>
  );
};

export default Chat;
