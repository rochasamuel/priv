"use client";

import { cn } from "@/lib/utils";
import { ChatMessage, ChatMessageDirection } from "@/types/chat";
import { getChatMessageRelativeTime, getChatRelativeDate } from "@/utils/date";
import { DateTime } from "luxon";
import { useEffect, useRef } from "react";

interface MessageListProps {
  messages: ChatMessage[];
}

export default function MessageList({ messages }: MessageListProps) {
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (lastMessageRef.current && containerRef.current) {
      if (
        containerRef.current.scrollHeight > containerRef.current.clientHeight
      ) {
        lastMessageRef.current.scrollIntoView({
          behavior: containerRef.current.scrollTop === 0 ? "auto" : "smooth",
        });
      }
    }
  }, [messages]);

  return (
    <div
      className="w-full min-h-[85%] overflow-y-auto overflow-x-hidden flex flex-col"
      ref={containerRef}
    >
      {messages.map((message, index) => (
        <div
          key={index + 1}
          className={cn(
            "flex gap-2 my-2 items-end w-full",
            message.direction !== ChatMessageDirection.Incoming
              ? "justify-end"
              : "justify-start"
          )}
        >
          {message.direction !== ChatMessageDirection.Incoming && (
            <div className="text-xs opacity-50">
              {getChatMessageRelativeTime(message.data.registrationDate)}
            </div>
          )}
          <div
            className={cn(
              "text-sm bg-accent min-w-fit p-2 rounded-md max-w-[80%] w-[max-content] break-words whitespace-pre-line",
              message.direction !== ChatMessageDirection.Incoming
                ? "bg-primary"
                : "bg-secondary"
            )}
          >
            {message.data.text}
          </div>
          {message.direction !== ChatMessageDirection.Outgoing && (
            <div className="text-xs opacity-50">
              {getChatMessageRelativeTime(message.data.registrationDate)}
            </div>
          )}
        </div>
      ))}
      <div ref={lastMessageRef} />
    </div>
  );
}
