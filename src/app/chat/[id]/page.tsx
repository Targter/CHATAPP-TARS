// src/app/chat/[id]/page.tsx
"use client";

import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
// import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { MessageList } from "@/components/chat/MessageList";
import { MessageInput } from "@/components/chat/MessageInput";
import { Loader2 } from "lucide-react";

export default function ConversationPage() {
  const params = useParams();
  const conversationId = params.id as Id<"conversations">;

  const messages = useQuery(api.messages.list, { conversationId });
  const currentUser = useQuery(api.users.currentUser);
  const conversation = useQuery(api.conversations.get, { id: conversationId }); // NEW

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
        isOnline={conversation?.partner?.isOnline}
      />

      <MessageList messages={messages} currentUserId={currentUser?._id!} />

      <MessageInput conversationId={conversationId} />
    </div>
  );
}
