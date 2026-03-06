// src/app/chat/[id]/page.tsx
"use client";

import { useQuery, useMutation } from "convex/react"; // Add useMutation
import { useParams } from "next/navigation";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { MessageList } from "@/components/chat/MessageList";
import { MessageInput } from "@/components/chat/MessageInput";
import { Loader2 } from "lucide-react";
import { useEffect } from "react"; // Add useEffect

export default function ConversationPage() {
  const params = useParams();
  const conversationId = params.id as Id<"conversations">;

  const messages = useQuery(api.messages.list, { conversationId });
  const currentUser = useQuery(api.users.currentUser);
  const conversation = useQuery(api.conversations.get, { id: conversationId });

  // NEW: Mutation
  const markAsRead = useMutation(api.conversations.markAsRead);

  // NEW: Mark as read when entering
  useEffect(() => {
    if (conversationId) {
      markAsRead({ conversationId });
    }
  }, [conversationId, markAsRead, messages]); // Re-run if messages update (optional, keeps it read while open)

  if (
    messages === undefined ||
    currentUser === undefined ||
    conversation === undefined
  ) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <ChatHeader
        name={conversation?.partner?.name || "User"}
        image={conversation?.partner?.image}
        lastSeen={conversation?.partner?.lastSeen}
      />

      <MessageList messages={messages} currentUserId={currentUser?._id!} />

      <MessageInput conversationId={conversationId} />
    </div>
  );
}
