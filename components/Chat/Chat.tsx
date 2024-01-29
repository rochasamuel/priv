import apiClient from "@/backend-sdk";
import { useSession } from "next-auth/react";
import { FunctionComponent } from "react";
import { useQuery } from "react-query";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getAcronym } from "@/utils";
import { ChevronLeft } from "lucide-react";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { ChatMessage, ChatMessageDirection } from "@/types/chat";
import { useRouter } from "next/navigation";

interface ChatProps {
  chatId: string
}
 
const Chat: FunctionComponent<ChatProps> = ({ chatId }) => {
  const { data: session } = useSession();

  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const { data: chat } = useQuery({
    queryKey: ["chat", session?.user.username, chatId],
    queryFn: async () => {
      const api = apiClient(session?.user.accessToken!);

      return await api.chat.getChatData(chatId);
    },
    enabled: !!session?.user.accessToken,
  });


  return <div className="w-full flex flex-col">
    {chat && <div className="flex items-center justify-start gap-2 ">
      <Button className="px-0 w-8 h-8" variant={"ghost"} onClick={handleBack}><ChevronLeft /></Button>
      <div className="flex items-center gap-2">
        <Avatar className="w-10 h-10 border-2">
          <AvatarImage src={chat.avatarReference} />
          <AvatarFallback>{getAcronym(chat.name)}</AvatarFallback>
        </Avatar>
        <div className="font-semibold">{chat.name}</div>
      </div>
    </div>}
    <Separator className="mt-4" />

    {chat?.messages.map((message: ChatMessage) => <div className={`${message.direction === ChatMessageDirection.Incoming ? "mr-auto" : "ml-auto"}`}>{message.data.text}</div>)}
  </div>;
}
 
export default Chat;