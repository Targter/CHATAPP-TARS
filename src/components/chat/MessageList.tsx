// src/components/chat/MessageList.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowDown, MoreVertical, Trash2 } from "lucide-react"; // Import Icons
import { cn } from "@/lib/utils";
import { Id } from "../../../convex/_generated/dataModel";
import { TypingIndicator } from "./TypingIndicator";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "convex/react"; // Import
import { api } from "../../../convex/_generated/api"; // Import
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Import

interface Message {
  _id: Id<"messages">;
  content: string;
  senderId: Id<"users">;
  _creationTime: number;
  conversationId: Id<"conversations">;
  isDeleted?: boolean; // NEW
}

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
}

export function MessageList({ messages, currentUserId }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const prevMessagesLength = useRef(messages.length);

  // Mutation
  const deleteMessage = useMutation(api.messages.deleteMessage);

  const handleDelete = async (messageId: Id<"messages">) => {
    try {
      await deleteMessage({ messageId });
    } catch (error) {
      console.error("Failed to delete", error);
    }
  };

  // ... (Keep handleScroll, scrollToBottom, useEffects same as Step 10) ...
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const isBottom = scrollHeight - scrollTop - clientHeight < 100;
    setIsAtBottom(isBottom);
    if (isBottom) setShowScrollButton(false);
  };

  const scrollToBottom = (behavior: "auto" | "smooth" = "auto") => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior,
      });
    }
  };

  useEffect(() => {
    const hasNewMessage = messages.length > prevMessagesLength.current;
    if (hasNewMessage) {
      const lastMessage = messages[messages.length - 1];
      const isMe = lastMessage.senderId === currentUserId;
      if (isMe || isAtBottom) {
        scrollToBottom("smooth");
      } else {
        setShowScrollButton(true);
      }
    }
    prevMessagesLength.current = messages.length;
  }, [messages, currentUserId, isAtBottom]);

  useEffect(() => {
    scrollToBottom("auto");
  }, []);

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
                "flex w-full group", // Added 'group' for hover effects
                isMe ? "justify-end" : "justify-start",
              )}
            >
              <div
                className={cn(
                  "flex max-w-[70%] md:max-w-[60%] gap-2 items-end",
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

                {/* Message Bubble Group (Bubble + Menu) */}
                <div
                  className={cn(
                    "flex items-center gap-2",
                    isMe ? "flex-row-reverse" : "flex-row",
                  )}
                >
                  {/* The Bubble */}
                  <div
                    className={cn(
                      "p-3 rounded-2xl text-sm shadow-sm relative transition-all",
                      isMe
                        ? "bg-primary text-primary-foreground rounded-tr-none"
                        : "bg-card border border-border text-card-foreground rounded-tl-none",
                      msg.isDeleted &&
                        "bg-secondary/50 text-muted-foreground italic border-dashed",
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

                  {/* Delete Menu (Only for Me & Not Deleted) */}
                  {isMe && !msg.isDeleted && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity rounded-full hover:bg-muted"
                        >
                          <MoreVertical className="w-3 h-3 text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align={isMe ? "end" : "start"}
                        className="bg-card border-border"
                      >
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                          onClick={() => handleDelete(msg._id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Message
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {conversationId && (
          <div className="mt-auto pt-2">
            <TypingIndicator conversationId={conversationId} />
          </div>
        )}

        <div className="h-4" />
      </div>

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
