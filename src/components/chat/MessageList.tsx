// "use client";

// import { useEffect, useRef, useState } from "react";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { ArrowDown, MoreVertical, Trash2 } from "lucide-react";
// import { cn, formatMessageTime } from "@/lib/utils";
// import { Id } from "../../../convex/_generated/dataModel";
// import { TypingIndicator } from "./TypingIndicator";
// import { motion, AnimatePresence } from "framer-motion";
// import { useMutation } from "convex/react";
// import { api } from "../../../convex/_generated/api";

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// interface Reaction {
//   _id: Id<"reactions">;
//   emoji: string;
//   userId: Id<"users">;
// }

// interface Message {
//   _id: Id<"messages">;
//   content: string;
//   senderId: Id<"users">;
//   _creationTime: number;
//   conversationId: Id<"conversations">;
//   isDeleted?: boolean;
//   reactions?: Reaction[]; // ADDED reactions
// }

// interface MessageListProps {
//   messages: Message[];
//   currentUserId: string;
//   themeColor: string; // Updated type
// }

// const EMOJI_OPTIONS = ["👍", "❤️", "😂", "😮", "😢"];

// export function MessageList({
//   messages,
//   currentUserId,
//   themeColor,
// }: MessageListProps) {
//   const scrollRef = useRef<HTMLDivElement>(null);
//   const [showScrollButton, setShowScrollButton] = useState(false);
//   const [isAtBottom, setIsAtBottom] = useState(true);
//   const prevMessagesLength = useRef(messages.length);

//   const deleteMessage = useMutation(api.messages.deleteMessage);
//   const toggleReaction = useMutation(api.reactions.toggle); // NEW

//   const handleDelete = async (messageId: Id<"messages">) => {
//     try {
//       await deleteMessage({ messageId });
//     } catch (error) {
//       console.error("Failed to delete", error);
//     }
//   };

//   const handleScroll = () => {
//     if (!scrollRef.current) return;
//     const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
//     const isBottom = scrollHeight - scrollTop - clientHeight < 100;
//     setIsAtBottom(isBottom);
//     if (isBottom) setShowScrollButton(false);
//   };
//   const handleReaction = async (messageId: Id<"messages">, emoji: string) => {
//     try {
//       await toggleReaction({ messageId, emoji });
//     } catch (error) {
//       console.error("Failed to toggle reaction", error);
//     }
//   };

//   const scrollToBottom = (behavior: "auto" | "smooth" = "auto") => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollTo({
//         top: scrollRef.current.scrollHeight,
//         behavior,
//       });
//     }
//   };

//   useEffect(() => {
//     const hasNewMessage = messages.length > prevMessagesLength.current;
//     if (hasNewMessage) {
//       const lastMessage = messages[messages.length - 1];
//       const isMe = lastMessage.senderId === currentUserId;
//       if (isMe || isAtBottom) {
//         scrollToBottom("smooth");
//       } else {
//         setShowScrollButton(true);
//       }
//     }
//     prevMessagesLength.current = messages.length;
//   }, [messages, currentUserId, isAtBottom]);

//   useEffect(() => {
//     scrollToBottom("auto");
//   }, []);

//   const conversationId = messages[0]?.conversationId;

//   return (
//     <div className="flex-1 relative overflow-hidden flex flex-col">
//       <div
//         ref={scrollRef}
//         onScroll={handleScroll}
//         className="flex-1 overflow-y-auto p-4 space-y-6 flex flex-col scroll-smooth"
//       >
//         {messages.map((msg, index) => {
//           const isMe = msg.senderId === currentUserId;
//           const isConsecutive =
//             index > 0 && messages[index - 1].senderId === msg.senderId;

//           return (
//             <div
//               key={msg._id}
//               className={cn(
//                 "flex w-full group",
//                 isMe ? "justify-end" : "justify-start",
//               )}
//             >
//               <div
//                 className={cn(
//                   "flex max-w-[70%] md:max-w-[60%] gap-2 items-end",
//                   isMe ? "flex-row-reverse" : "flex-row",
//                 )}
//               >
//                 {!isMe && (
//                   <Avatar
//                     className={cn(
//                       "w-8 h-8",
//                       isConsecutive ? "opacity-0" : "opacity-100",
//                     )}
//                   >
//                     <AvatarFallback>U</AvatarFallback>
//                   </Avatar>
//                 )}

//                 <div
//                   className={cn(
//                     "flex items-center gap-2",
//                     isMe ? "flex-row-reverse" : "flex-row",
//                   )}
//                 >
//                   {/* The Bubble with Dynamic Color */}
//                   <div
//                     className={cn(
//                       "p-3 rounded-2xl text-sm shadow-sm relative transition-all",
//                       isMe
//                         ? "bg-primary text-primary-foreground rounded-tr-none"
//                         : "bg-card border border-border text-card-foreground rounded-tl-none",
//                       msg.isDeleted &&
//                         "bg-secondary/50 text-muted-foreground italic border-dashed",
//                     )}
//                     style={{
//                       // APPLY THEME COLOR HERE
//                       // Only apply if it's My Message and NOT deleted
//                       backgroundColor:
//                         isMe && !msg.isDeleted ? themeColor : undefined,
//                       // Ensure text is readable (assuming white text for colored bubbles)
//                       color: isMe && !msg.isDeleted ? "#FFFFFF" : undefined,
//                     }}
//                   >
//                     <p>{msg.content}</p>
//                     <span className="text-[10px] opacity-50 mt-1 block text-right">
//                       {new Date(msg._creationTime).toLocaleTimeString([], {
//                         hour: "2-digit",
//                         minute: "2-digit",
//                       })}
//                     </span>
//                   </div>

//                   {isMe && !msg.isDeleted && (
//                     <DropdownMenu>
//                       <DropdownMenuTrigger asChild>
//                         <Button
//                           variant="ghost"
//                           size="icon"
//                           className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity rounded-full hover:bg-muted"
//                         >
//                           <MoreVertical className="w-3 h-3 text-muted-foreground" />
//                         </Button>
//                       </DropdownMenuTrigger>
//                       <DropdownMenuContent
//                         align={isMe ? "end" : "start"}
//                         className="bg-card border-border"
//                       >
//                         <DropdownMenuItem
//                           className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
//                           onClick={() => handleDelete(msg._id)}
//                         >
//                           <Trash2 className="w-4 h-4 mr-2" />
//                           Delete Message
//                         </DropdownMenuItem>
//                       </DropdownMenuContent>
//                     </DropdownMenu>
//                   )}
//                 </div>
//               </div>
//             </div>
//           );
//         })}

//         {conversationId && (
//           <div className="mt-auto pt-2">
//             <TypingIndicator conversationId={conversationId} />
//           </div>
//         )}

//         <div className="h-4" />
//       </div>

//       <AnimatePresence>
//         {showScrollButton && (
//           <motion.div
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: 10 }}
//             className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20"
//           >
//             <Button
//               variant="secondary"
//               size="sm"
//               className="shadow-lg rounded-full px-4 gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
//               onClick={() => {
//                 scrollToBottom("smooth");
//                 setShowScrollButton(false);
//               }}
//               style={{ backgroundColor: themeColor, color: "#FFF" }}
//             >
//               <ArrowDown className="w-4 h-4" />
//               New Messages
//             </Button>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

"use client";

import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowDown, MoreVertical, Trash2, SmilePlus } from "lucide-react";
import { cn, formatMessageTime } from "@/lib/utils"; // ADDED formatMessageTime
import { Id } from "../../../convex/_generated/dataModel";
import { TypingIndicator } from "./TypingIndicator";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Reaction {
  _id: Id<"reactions">;
  emoji: string;
  userId: Id<"users">;
}

interface Message {
  _id: Id<"messages">;
  content: string;
  senderId: Id<"users">;
  _creationTime: number;
  conversationId: Id<"conversations">;
  isDeleted?: boolean;
  reactions?: Reaction[]; // ADDED reactions
}

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  themeColor: string;
}

const EMOJI_OPTIONS = ["👍", "❤️", "😂", "😮", "😢"];

export function MessageList({
  messages,
  currentUserId,
  themeColor,
}: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const prevMessagesLength = useRef(messages.length);

  const deleteMessage = useMutation(api.messages.deleteMessage);
  const toggleReaction = useMutation(api.reactions.toggle); // NEW

  const handleDelete = async (messageId: Id<"messages">) => {
    try {
      await deleteMessage({ messageId });
    } catch (error) {
      console.error("Failed to delete", error);
    }
  };

  const handleReaction = async (messageId: Id<"messages">, emoji: string) => {
    try {
      await toggleReaction({ messageId, emoji });
    } catch (error) {
      console.error("Failed to toggle reaction", error);
    }
  };

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

          // Process Reactions Grouping
          const reactionCounts: Record<string, number> = {};
          const myReactions = new Set<string>();

          if (msg.reactions) {
            msg.reactions.forEach((r) => {
              reactionCounts[r.emoji] = (reactionCounts[r.emoji] || 0) + 1;
              if (r.userId === currentUserId) myReactions.add(r.emoji);
            });
          }

          return (
            <div
              key={msg._id}
              className={cn(
                "flex w-full group",
                isMe ? "justify-end" : "justify-start",
              )}
            >
              <div
                className={cn(
                  "flex max-w-[75%] md:max-w-[65%] gap-2 items-end",
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

                {/* Column wrapper to hold Bubble + Reactions Badge */}
                <div
                  className={cn(
                    "flex flex-col gap-1",
                    isMe ? "items-end" : "items-start",
                  )}
                >
                  {/* Row wrapper for Bubble + Actions (Emojis, Delete) */}
                  <div
                    className={cn(
                      "flex items-center gap-2 relative",
                      isMe ? "flex-row-reverse" : "flex-row",
                    )}
                  >
                    {/* The Message Bubble */}
                    <div
                      className={cn(
                        "p-3 rounded-2xl text-sm shadow-sm relative transition-all",
                        isMe
                          ? "bg-primary text-primary-foreground rounded-br-none" // Right alignment
                          : "bg-card border border-border text-card-foreground rounded-bl-none", // Left alignment
                        msg.isDeleted &&
                          "bg-secondary/50 text-muted-foreground italic border-dashed",
                      )}
                      style={{
                        backgroundColor:
                          isMe && !msg.isDeleted ? themeColor : undefined,
                        color: isMe && !msg.isDeleted ? "#FFFFFF" : undefined,
                      }}
                    >
                      <p className="whitespace-pre-wrap break-words">
                        {msg.content}
                      </p>
                      <span className="text-[10px] opacity-60 mt-1 block text-right font-medium">
                        {/* UPDATED: Smart Timestamp formatting */}
                        {formatMessageTime(msg._creationTime)}
                      </span>
                    </div>

                    {/* Quick Actions Menu (Hover) */}
                    {!msg.isDeleted && (
                      <div
                        className={cn(
                          "flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity",
                          isMe ? "flex-row-reverse" : "flex-row",
                        )}
                      >
                        {/* Hover Emoji Bar */}
                        <div className="flex bg-card border border-border rounded-full p-1 shadow-sm">
                          {EMOJI_OPTIONS.map((emoji) => (
                            <button
                              key={emoji}
                              onClick={() => handleReaction(msg._id, emoji)}
                              className="hover:scale-125 transition-transform px-1 text-base hover:bg-muted rounded-full"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>

                        {/* Delete Menu (Only for Me) */}
                        {isMe && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 rounded-full hover:bg-muted bg-card border border-border shadow-sm"
                              >
                                <MoreVertical className="w-4 h-4 text-muted-foreground" />
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
                    )}
                  </div>

                  {/* Reaction Badges Row (Bottom of bubble) */}
                  {Object.keys(reactionCounts).length > 0 && (
                    <div
                      className={cn(
                        "flex flex-wrap gap-1 mt-0.5",
                        isMe ? "justify-end" : "justify-start",
                      )}
                    >
                      {Object.entries(reactionCounts).map(([emoji, count]) => (
                        <button
                          key={emoji}
                          onClick={() => handleReaction(msg._id, emoji)}
                          className={cn(
                            "flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold transition-all border shadow-sm",
                            myReactions.has(emoji)
                              ? "bg-primary/20 border-primary/50 text-foreground"
                              : "bg-card border-border text-muted-foreground hover:bg-muted",
                          )}
                        >
                          <span className="text-[12px]">{emoji}</span>
                          <span>{count}</span>
                        </button>
                      ))}
                    </div>
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
              className="shadow-lg rounded-full px-4 gap-2 text-white hover:brightness-110"
              onClick={() => {
                scrollToBottom("smooth");
                setShowScrollButton(false);
              }}
              style={{ backgroundColor: themeColor }}
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
