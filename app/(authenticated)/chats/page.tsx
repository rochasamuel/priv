import ChatList from "@/components/Chat/ChatList";
import { FunctionComponent } from "react";

export const Chats: FunctionComponent = () => {
  return (
    <div className="w-full">
      <div className="text-lg font-bold">Mensagens</div>
      <div className="w-full mt-4">
        <ChatList />
      </div>
    </div>
  );
}

export default Chats;