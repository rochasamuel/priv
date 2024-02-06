"use client"

import Chat from "@/components/Chat/Chat"

export default function ChatPage({ params }: { params: { chatId: string } }) {
  return <Chat chatId={params.chatId} />
}