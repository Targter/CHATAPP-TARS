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
//   format?: string; // NEW: Add format to interface
//   mediaUrl?: string | null; // NEW: Add mediaUrl to interface
//   conversationId: Id<"conversations">;
//   isDeleted?: boolean;
//   reactions?: Reaction[];
// }

// interface MessageListProps {
//   messages: Message[];
//   currentUserId: string;
//   themeColor: string;
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
//   const toggleReaction = useMutation(api.reactions.toggle);

//   const handleDelete = async (messageId: Id<"messages">) => {
//     try {
//       await deleteMessage({ messageId });
//     } catch (error) {
//       console.error("Failed to delete", error);
//     }
//   };

//   const handleReaction = async (messageId: Id<"messages">, emoji: string) => {
//     try {
//       await toggleReaction({ messageId, emoji });
//     } catch (error) {
//       console.error("Failed to toggle reaction", error);
//     }
//   };

//   const handleScroll = () => {
//     if (!scrollRef.current) return;
//     const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
//     const isBottom = scrollHeight - scrollTop - clientHeight < 100;
//     setIsAtBottom(isBottom);
//     if (isBottom) setShowScrollButton(false);
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

//           const reactionCounts: Record<string, number> = {};
//           const myReactions = new Set<string>();

//           if (msg.reactions) {
//             msg.reactions.forEach((r) => {
//               reactionCounts[r.emoji] = (reactionCounts[r.emoji] || 0) + 1;
//               if (r.userId === currentUserId) myReactions.add(r.emoji);
//             });
//           }

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
//                   "flex max-w-[75%] md:max-w-[65%] gap-2 items-end",
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
//                     "flex flex-col gap-1",
//                     isMe ? "items-end" : "items-start",
//                   )}
//                 >
//                   <div
//                     className={cn(
//                       "flex items-center gap-2 relative",
//                       isMe ? "flex-row-reverse" : "flex-row",
//                     )}
//                   >
//                     {/* The Message Bubble */}
//                     {/* <div
//                       className={cn(
//                         "p-3 rounded-2xl text-sm shadow-sm relative transition-all",
//                         isMe
//                           ? "bg-primary text-primary-foreground rounded-br-none"
//                           : "bg-card border border-border text-card-foreground rounded-bl-none",
//                         msg.isDeleted &&
//                           "bg-secondary/50 text-muted-foreground italic border-dashed",
//                       )}
//                       style={{
//                         backgroundColor:
//                           isMe && !msg.isDeleted ? themeColor : undefined,
//                         color: isMe && !msg.isDeleted ? "#FFFFFF" : undefined,
//                       }}
//                     >
//                       <p className="whitespace-pre-wrap break-words">
//                         {msg.content}
//                       </p>
//                       <span className="text-[10px] opacity-60 mt-1 block text-right font-medium">
//                         {formatMessageTime(msg._creationTime)}
//                       </span>
//                     </div> */}
//                     <div
//                       className={cn(
//                         "p-3 rounded-2xl text-sm shadow-sm relative transition-all max-w-full overflow-hidden", // Added overflow hidden for videos
//                         isMe
//                           ? "bg-primary text-primary-foreground rounded-br-none"
//                           : "bg-card border border-border text-card-foreground rounded-bl-none",
//                         msg.isDeleted &&
//                           "bg-secondary/50 text-muted-foreground italic border-dashed",
//                       )}
//                       style={{
//                         backgroundColor:
//                           isMe && !msg.isDeleted && msg.format === "text"
//                             ? themeColor
//                             : undefined,
//                         color:
//                           isMe && !msg.isDeleted && msg.format === "text"
//                             ? "#FFFFFF"
//                             : undefined,
//                         // Note: If it's an image/video, we strip the background color so the media fits flush
//                         ...(msg.format !== "text" && !msg.isDeleted
//                           ? {
//                               padding: "0.25rem",
//                               backgroundColor: "transparent",
//                               border: "none",
//                               boxShadow: "none",
//                             }
//                           : {}),
//                       }}
//                     >
//                       {msg.isDeleted ? (
//                         <p className="whitespace-pre-wrap break-words">
//                           This message was deleted
//                         </p>
//                       ) : (
//                         <>
//                           {/* Render Text */}
//                           {(!msg.format || msg.format === "text") && (
//                             <p className="whitespace-pre-wrap break-words">
//                               {msg.content}
//                             </p>
//                           )}

//                           {/* Render Image */}
//                           {msg.format === "image" && msg.mediaUrl && (
//                             <img
//                               src={msg.mediaUrl}
//                               alt="Uploaded media"
//                               className="max-w-[250px] md:max-w-[350px] rounded-xl object-cover cursor-pointer hover:opacity-90 transition-opacity ring-1 ring-border shadow-md"
//                             />
//                           )}

//                           {/* Render Video */}
//                           {msg.format === "video" && msg.mediaUrl && (
//                             <video
//                               src={msg.mediaUrl}
//                               controls
//                               className="max-w-[250px] md:max-w-[350px] rounded-xl ring-1 ring-border shadow-md bg-black"
//                             />
//                           )}

//                           {/* Render Audio */}
//                           {msg.format === "audio" && msg.mediaUrl && (
//                             <audio
//                               src={msg.mediaUrl}
//                               controls
//                               className={cn(
//                                 "max-w-[200px] md:max-w-[300px] rounded-full",
//                                 isMe ? "invert" : "",
//                               )}
//                             />
//                           )}
//                         </>
//                       )}

//                       <span
//                         className={cn(
//                           "text-[10px] mt-1 block font-medium",
//                           // If it's a media file, position the time overlay nicely or keep it below
//                           msg.format !== "text" && !msg.isDeleted
//                             ? "absolute bottom-2 right-3 text-white drop-shadow-md bg-black/40 px-1.5 py-0.5 rounded backdrop-blur-sm"
//                             : "text-right opacity-60",
//                         )}
//                       >
//                         {formatMessageTime(msg._creationTime)}
//                       </span>
//                     </div>
//                     {/* Quick Actions Menu (Hover) - IMPROVED STYLING */}
//                     {!msg.isDeleted && (
//                       <div
//                         className={cn(
//                           "flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity",
//                           isMe ? "flex-row-reverse" : "flex-row",
//                         )}
//                       >
//                         {/* Hover Emoji Bar - Brightened up for Dark Mode */}
//                         <div className="flex bg-popover border border-border rounded-full p-1 shadow-md">
//                           {EMOJI_OPTIONS.map((emoji) => (
//                             <button
//                               key={emoji}
//                               onClick={() => handleReaction(msg._id, emoji)}
//                               className="hover:scale-125 transition-transform px-1 text-base hover:bg-muted rounded-full"
//                             >
//                               {emoji}
//                             </button>
//                           ))}
//                         </div>

//                         {isMe && (
//                           <DropdownMenu>
//                             <DropdownMenuTrigger asChild>
//                               <Button
//                                 variant="ghost"
//                                 size="icon"
//                                 className="h-8 w-8 rounded-full hover:bg-muted bg-popover border border-border shadow-md"
//                               >
//                                 <MoreVertical className="w-4 h-4 text-muted-foreground" />
//                               </Button>
//                             </DropdownMenuTrigger>
//                             <DropdownMenuContent
//                               align={isMe ? "end" : "start"}
//                               className="bg-card border-border"
//                             >
//                               <DropdownMenuItem
//                                 className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
//                                 onClick={() => handleDelete(msg._id)}
//                               >
//                                 <Trash2 className="w-4 h-4 mr-2" />
//                                 Delete Message
//                               </DropdownMenuItem>
//                             </DropdownMenuContent>
//                           </DropdownMenu>
//                         )}
//                       </div>
//                     )}
//                   </div>

//                   {/* Reaction Badges Row */}
//                   {Object.keys(reactionCounts).length > 0 && (
//                     <div
//                       className={cn(
//                         "flex flex-wrap gap-1 mt-0.5",
//                         isMe ? "justify-end" : "justify-start",
//                       )}
//                     >
//                       {Object.entries(reactionCounts).map(([emoji, count]) => (
//                         <button
//                           key={emoji}
//                           onClick={() => handleReaction(msg._id, emoji)}
//                           className={cn(
//                             "flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold transition-all border shadow-sm",
//                             myReactions.has(emoji)
//                               ? "bg-primary/20 border-primary/50 text-foreground"
//                               : "bg-popover border-border text-muted-foreground hover:bg-muted",
//                           )}
//                         >
//                           <span className="text-[12px]">{emoji}</span>
//                           <span>{count}</span>
//                         </button>
//                       ))}
//                     </div>
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
//               className="shadow-lg rounded-full px-4 gap-2 text-white hover:brightness-110"
//               onClick={() => {
//                 scrollToBottom("smooth");
//                 setShowScrollButton(false);
//               }}
//               style={{ backgroundColor: themeColor }}
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
import { ArrowDown, MoreVertical, Trash2 } from "lucide-react";
import { cn, formatMessageTime } from "@/lib/utils";
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
  format?: string;
  mediaUrl?: string | null;
  senderId: Id<"users">;
  _creationTime: number;
  conversationId: Id<"conversations">;
  isDeleted?: boolean;
  reactions?: Reaction[];
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
  const toggleReaction = useMutation(api.reactions.toggle);

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

                <div
                  className={cn(
                    "flex flex-col gap-1",
                    isMe ? "items-end" : "items-start",
                  )}
                >
                  <div
                    className={cn(
                      "flex items-center gap-2 relative",
                      isMe ? "flex-row-reverse" : "flex-row",
                    )}
                  >
                    {/* The Message Bubble - FIXED BACKGROUND STYLING */}
                    <div
                      className={cn(
                        "relative transition-all max-w-full overflow-hidden",

                        // Apply standard bubble styles ONLY if it's text
                        (!msg.format || msg.format === "text") &&
                          !msg.isDeleted &&
                          "p-3 rounded-2xl text-sm shadow-sm",
                        (!msg.format || msg.format === "text") &&
                          !msg.isDeleted &&
                          isMe &&
                          "bg-primary text-primary-foreground rounded-br-none",
                        (!msg.format || msg.format === "text") &&
                          !msg.isDeleted &&
                          !isMe &&
                          "bg-card border border-border text-card-foreground rounded-bl-none",

                        // Apply deleted styles
                        msg.isDeleted &&
                          "p-3 rounded-2xl text-sm bg-secondary/50 text-muted-foreground italic border-dashed",

                        // Apply media styles (Transparent background)
                        msg.format &&
                          msg.format !== "text" &&
                          !msg.isDeleted &&
                          "p-1 rounded-xl bg-transparent",
                      )}
                      style={{
                        // Only apply custom theme colors if it is text
                        backgroundColor:
                          isMe &&
                          !msg.isDeleted &&
                          (!msg.format || msg.format === "text")
                            ? themeColor
                            : undefined,
                        color:
                          isMe &&
                          !msg.isDeleted &&
                          (!msg.format || msg.format === "text")
                            ? "#FFFFFF"
                            : undefined,
                      }}
                    >
                      {msg.isDeleted ? (
                        <p className="whitespace-pre-wrap break-words">
                          This message was deleted
                        </p>
                      ) : (
                        <>
                          {(!msg.format || msg.format === "text") && (
                            <p className="whitespace-pre-wrap break-words">
                              {msg.content}
                            </p>
                          )}

                          {msg.format === "image" && msg.mediaUrl && (
                            <img
                              src={msg.mediaUrl}
                              alt="Uploaded media"
                              className="max-w-[220px] md:max-w-[320px] rounded-lg object-cover cursor-pointer ring-1 ring-border/50 shadow-md bg-black/20"
                            />
                          )}

                          {msg.format === "video" && msg.mediaUrl && (
                            <video
                              src={msg.mediaUrl}
                              controls
                              className="max-w-[220px] md:max-w-[320px] rounded-lg ring-1 ring-border/50 shadow-md bg-black"
                            />
                          )}

                          {msg.format === "audio" && msg.mediaUrl && (
                            <audio
                              src={msg.mediaUrl}
                              controls
                              className={cn(
                                "max-w-[200px] md:max-w-[260px]",
                                isMe ? "invert" : "",
                              )}
                            />
                          )}
                        </>
                      )}

                      {/* Smart Timestamp positioning */}
                      <span
                        className={cn(
                          "text-[10px] mt-1 block font-medium",
                          msg.format && msg.format !== "text" && !msg.isDeleted
                            ? "absolute bottom-3 right-3 text-white drop-shadow-md bg-black/60 px-1.5 py-0.5 rounded-md backdrop-blur-md z-10"
                            : "text-right opacity-60",
                        )}
                      >
                        {formatMessageTime(msg._creationTime)}
                      </span>
                    </div>

                    {/* Quick Actions Menu (Hover) - IMPROVED STYLING */}
                    {!msg.isDeleted && (
                      <div
                        className={cn(
                          "flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity",
                          isMe ? "flex-row-reverse" : "flex-row",
                        )}
                      >
                        {/* Hover Emoji Bar */}
                        <div className="flex bg-popover border border-border rounded-full p-1 shadow-md">
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
                                className="h-8 w-8 rounded-full hover:bg-muted bg-popover border border-border shadow-md"
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

                  {/* Reaction Badges Row */}
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
                              : "bg-popover border-border text-muted-foreground hover:bg-muted",
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
