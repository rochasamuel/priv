"use client"

import Chat from "@/components/Chat/Chat"

export default function ChatPage({ params }: { params: { chatId: string } }) {
  return <div className="w-full">
    <Chat chatId={params.chatId} />
  </div>
}