"use client"

import Chat from "@/components/Chat/Chat"

interface ChatPageProps {
  params: { chatId: string }
}

export default function ChatPage({ params }: ChatPageProps) {
  return <Chat chatId={params.chatId} />
}