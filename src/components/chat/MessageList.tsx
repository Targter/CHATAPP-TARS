// src/components/chat/MessageList.tsx
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Id } from "../../../convex/_generated/dataModel";
import { TypingIndicator } from "./TypingIndicator"; // Import

interface Message {
  _id: Id<"messages">;
  content: string;
  senderId: Id<"users">;
  _creationTime: number;
  conversationId: Id<"conversations">; // Add this to type if missing
}

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
}

export function MessageList({ messages, currentUserId }: MessageListProps) {
  // Get conversationId from first message (fallback handled if empty)
  const conversationId = messages[0]?.conversationId;

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6 flex flex-col">
      {/* Existing Message Mapping... */}
      {messages.map((msg, index) => {
        const isMe = msg.senderId === currentUserId;
        const isConsecutive =
          index > 0 && messages[index - 1].senderId === msg.senderId;

        return (
          <div
            key={msg._id}
            className={cn(
              "flex w-full",
              isMe ? "justify-end" : "justify-start",
            )}
          >
            <div
              className={cn(
                "flex max-w-[70%] md:max-w-[60%] gap-2",
                isMe ? "flex-row-reverse" : "flex-row",
              )}
            >
              {!isMe && (
                <Avatar
                  className={cn(
                    "w-8 h-8",
                    isConsecutive ? "opacity-0" : "opacity-100",
                  )}
                >
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              )}

              <div
                className={cn(
                  "p-3 rounded-2xl text-sm shadow-sm",
                  isMe
                    ? "bg-primary text-primary-foreground rounded-tr-none"
                    : "bg-card border border-border text-card-foreground rounded-tl-none",
                )}
              >
                <p>{msg.content}</p>
                <span className="text-[10px] opacity-50 mt-1 block text-right">
                  {new Date(msg._creationTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          </div>
        );
      })}

      {/* Typing Indicator at the bottom */}
      {conversationId && (
        <div className="mt-auto">
          <TypingIndicator conversationId={conversationId} />
        </div>
      )}

      {/* Dummy div for auto-scroll anchor (Step 10) */}
      <div id="scroll-anchor" />
    </div>
  );
}
