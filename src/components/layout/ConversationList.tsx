// src/components/layout/ConversationList.tsx
"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { isUserOnline } from "@/lib/utils"; // Import
import { Loader2, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";

export function ConversationList() {
  const conversations = useQuery(api.conversations.getMyConversations);
  const params = useParams();

  if (conversations === undefined) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="px-2 py-8 text-center text-sm text-muted-foreground">
        <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-20" />
        <p>No conversations yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {conversations.map((conv) => {
        const isActive = params?.id === conv?._id;

        return (
          <Link
            key={conv?._id}
            href={`/chat/${conv?._id}`}
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg transition-all group",
              isActive
                ? "bg-primary/10 border-l-2 border-primary"
                : "hover:bg-primary/5 border-l-2 border-transparent",
            )}
          >
            {/* Avatar */}
            <div className="relative">
              <Avatar className="w-10 h-10 border border-border">
                <AvatarImage src={conv?.partner?.image} />
                <AvatarFallback>{conv?.partner?.name?.[0]}</AvatarFallback>
              </Avatar>
              {isUserOnline(conv?.partner?.lastSeen) && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full animate-pulse"></span>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-0.5">
                <h4
                  className={cn(
                    "text-sm font-medium truncate",
                    isActive ? "text-primary" : "text-foreground",
                  )}
                >
                  {conv?.partner?.name}
                </h4>
                {conv?.lastMessage && (
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(
                      conv.lastMessage._creationTime,
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {conv?.lastMessage ? (
                  (conv.lastMessage.senderId === conv.partner._id
                    ? ""
                    : "You: ") + conv.lastMessage.content
                ) : (
                  <span className="italic opacity-50">Drafting...</span>
                )}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
