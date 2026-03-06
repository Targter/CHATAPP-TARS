// src/components/chat/MessageList.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Id } from "../../../convex/_generated/dataModel";
import { TypingIndicator } from "./TypingIndicator";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  _id: Id<"messages">;
  content: string;
  senderId: Id<"users">;
  _creationTime: number;
  conversationId: Id<"conversations">;
}

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  // We might pass user images map here in a real app,
  // but for now we fallback to initials
}

export function MessageList({ messages, currentUserId }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const prevMessagesLength = useRef(messages.length);

  // 1. Check scroll position
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;

    // We are at the bottom if we are within 100px of the end
    const isBottom = scrollHeight - scrollTop - clientHeight < 100;
    setIsAtBottom(isBottom);

    // Hide button if we scroll to bottom manually
    if (isBottom) {
      setShowScrollButton(false);
    }
  };

  // 2. Scroll to bottom helper
  const scrollToBottom = (behavior: "auto" | "smooth" = "auto") => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior,
      });
    }
  };

  // 3. Effect: Handle new messages
  useEffect(() => {
    const hasNewMessage = messages.length > prevMessagesLength.current;

    if (hasNewMessage) {
      const lastMessage = messages[messages.length - 1];
      const isMe = lastMessage.senderId === currentUserId;

      if (isMe || isAtBottom) {
        // If I sent it, or I was already at the bottom, scroll down
        // Use 'smooth' for nice effect when chatting, 'auto' could be used for instant
        scrollToBottom("smooth");
      } else {
        // If I'm reading history and someone else sent a message, show button
        setShowScrollButton(true);
      }
    }

    prevMessagesLength.current = messages.length;
  }, [messages, currentUserId, isAtBottom]);

  // 4. Effect: Initial load scroll
  useEffect(() => {
    // Scroll to bottom immediately on mount without animation
    scrollToBottom("auto");
  }, []); // Run once on mount

  // 5. Get conversation ID safely
  const conversationId = messages[0]?.conversationId;

  return (
    <div className="flex-1 relative overflow-hidden flex flex-col">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-6 flex flex-col scroll-smooth"
      >
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

        {/* Typing Indicator */}
        {conversationId && (
          <div className="mt-auto pt-2">
            <TypingIndicator conversationId={conversationId} />
          </div>
        )}

        {/* Invisible div to ensure bottom spacing */}
        <div className="h-4" />
      </div>

      {/* "New Messages" Floating Button */}
      <AnimatePresence>
        {showScrollButton && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20"
          >
            <Button
              variant="secondary"
              size="sm"
              className="shadow-lg rounded-full px-4 gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => {
                scrollToBottom("smooth");
                setShowScrollButton(false);
              }}
            >
              <ArrowDown className="w-4 h-4" />
              New Messages
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
