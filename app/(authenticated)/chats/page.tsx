import ChatsPage from "@/components/pages/ChatsPage";
import { FunctionComponent } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chats",
};

const Chats: FunctionComponent = () => {
  return <ChatsPage />
}

export default Chats;