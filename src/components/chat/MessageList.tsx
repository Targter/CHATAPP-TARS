// src/components/chat/MessageList.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Id } from "../../../convex/_generated/dataModel";

interface Message {
  _id: Id<"messages">;
  content: string;
  senderId: Id<"users">;
  _creationTime: number; // Convex adds this automatically
}

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
}

export function MessageList({ messages, currentUserId }: MessageListProps) {
  // We need to scroll to bottom, will add that in Step 10.
  // For now just render list.

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
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
              {/* Avatar - only show if not consecutive or it's the first message */}
              {!isMe && (
                <Avatar
                  className={cn(
                    "w-8 h-8",
                    isConsecutive ? "opacity-0" : "opacity-100",
                  )}
                >
                  {/* We'd need to look up the sender image here, for now placeholder */}
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
    </div>
  );
}
