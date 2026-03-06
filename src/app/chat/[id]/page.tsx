"use client";

import { useQuery, useMutation } from "convex/react";
import { useParams } from "next/navigation";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { MessageList } from "@/components/chat/MessageList";
import { MessageInput } from "@/components/chat/MessageInput";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

export default function ConversationPage() {
  const params = useParams();
  const conversationId = params.id as Id<"conversations">;

  const messages = useQuery(api.messages.list, { conversationId });
  const currentUser = useQuery(api.users.currentUser);
  const conversation = useQuery(api.conversations.get, { id: conversationId });
  const markAsRead = useMutation(api.conversations.markAsRead);

  useEffect(() => {
    if (conversationId) {
      markAsRead({ conversationId });
    }
  }, [conversationId, markAsRead, messages]);

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

  // --- SMART NAME RESOLUTION ---
  // 1. Default to "User"
  let displayName = "User";
  let displayImage = conversation?.partner?.image;
  let partnerId = conversation?.partner?._id;

  if (conversation?.isGroup) {
    // If Group: Use group name
    displayName = conversation.name || "Group Chat";
    displayImage = conversation.groupImage;
  } else {
    // If 1:1: Check for Nickname -> Fallback to Real Name
    const partnerRealName = conversation?.partner?.name;
    const nickname = conversation?.nicknames?.[partnerId!] as
      | string
      | undefined;
    displayName = nickname || partnerRealName || "User";
  }

  // --- THEME BACKGROUND LOGIC ---
  const themeColor = conversation?.themeColor || "#9280FC";

  return (
    <div className="flex flex-col h-full relative overflow-hidden bg-background">
      {/* 
         PROFESSIONAL BACKGROUND OVERLAY 
         Creates a subtle gradient based on the selected theme color.
      */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-10 transition-colors duration-500"
        style={{
          background: `radial-gradient(circle at top right, ${themeColor}, transparent 60%), radial-gradient(circle at bottom left, ${themeColor}, transparent 60%)`,
        }}
      />

      <div className="z-10 flex flex-col h-full">
        <ChatHeader
          conversationId={conversationId}
          name={displayName}
          image={displayImage}
          lastSeen={conversation?.partner?.lastSeen}
          themeColor={themeColor}
          isGroup={conversation?.isGroup}
          partnerId={partnerId}
        />

        <MessageList
          messages={messages}
          currentUserId={currentUser?._id!}
          themeColor={themeColor}
        />

        <MessageInput conversationId={conversationId} />
      </div>
    </div>
  );
}
