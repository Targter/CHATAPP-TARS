"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { isUserOnline } from "@/lib/utils";
import { Loader2, MessageSquare, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Id } from "../../../convex/_generated/dataModel";

export function ConversationList({
  isCollapsed = false,
}: {
  isCollapsed?: boolean;
}) {
  const conversations = useQuery(api.conversations.getMyConversations);
  const currentUser = useQuery(api.users.currentUser);
  const params = useParams();
  const router = useRouter();

  const deleteConversation = useMutation(api.conversations.deleteConversation);

  const handleDelete = async (
    e: React.MouseEvent,
    conversationId: Id<"conversations">,
  ) => {
    e.preventDefault(); // Stop the <Link> from navigating
    e.stopPropagation(); // Stop event bubbling

    try {
      await deleteConversation({ conversationId });
      // Redirect to home if deleting the active chat
      if (params?.id === conversationId) {
        router.push("/chat");
      }
    } catch (error) {
      console.error("Failed to delete conversation:", error);
    }
  };

  if (conversations === undefined || currentUser === undefined) {
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
        const showOnline = conv.isGroup ? false : isUserOnline(conv.lastSeen);

        return (
          <Link
            key={conv._id}
            href={`/chat/${conv._id}`}
            className={cn(
              "flex items-center p-3 rounded-lg transition-all group",
              isCollapsed ? "justify-center" : "gap-3", // Center if collapsed
              isActive
                ? "bg-primary/10 border-l-2 border-primary"
                : "hover:bg-primary/5 border-l-2 border-transparent",
            )}
            title={isCollapsed ? conv.name : undefined} // Show tooltip if collapsed
          >
            {/* Avatar */}
            <div className="relative shrink-0">
              <Avatar className="w-10 h-10 border border-border">
                <AvatarImage src={conv.image} />
                <AvatarFallback>
                  {conv.name?.[0]?.toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>

              {showOnline && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full animate-pulse"></span>
              )}

              {conv.unreadCount > 0 && (
                <div
                  className={cn(
                    "absolute -top-1 -right-1 flex items-center justify-center rounded-full bg-red-500 font-bold text-white shadow-sm ring-2 ring-background",
                    isCollapsed ? "w-4 h-4 text-[8px]" : "h-5 w-5 text-[10px]",
                  )}
                >
                  {isCollapsed ? "" : conv.unreadCount}{" "}
                  {/* Dot if collapsed, number if expanded */}
                </div>
              )}
            </div>

            {/* Hide Content Area if Collapsed */}
            {!isCollapsed && (
              <div className="flex-1 min-w-0 pr-6">
                {/* ... Keep the exact same right-side content area from previous step ... */}
                <div className="flex justify-between items-center mb-0.5">
                  <h4
                    className={cn(
                      "text-sm font-medium truncate pr-2",
                      isActive ? "text-primary" : "text-foreground",
                      conv.unreadCount > 0 && "font-bold",
                    )}
                  >
                    {conv.name || "Unknown"}
                  </h4>

                  <div className="flex items-center justify-end shrink-0 h-5 min-w-[40px]">
                    {conv.lastMessage && (
                      <span className="text-[10px] text-muted-foreground group-hover:hidden transition-all">
                        {new Date(
                          conv.lastMessage._creationTime,
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    )}

                    <button
                      onClick={(e) => handleDelete(e, conv._id)}
                      className="hidden group-hover:flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors rounded"
                      title={conv.isGroup ? "Leave Group" : "Delete Chat"}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p
                  className={cn(
                    "text-xs truncate",
                    conv.unreadCount > 0
                      ? "text-foreground font-medium"
                      : "text-muted-foreground",
                  )}
                >
                  {conv.lastMessage ? (
                    <>
                      {conv.lastMessage.senderId === currentUser?._id
                        ? "You: "
                        : ""}
                      {conv.lastMessage.isDeleted ? (
                        <span className="italic opacity-50">
                          Message deleted
                        </span>
                      ) : // Show 'Media attachment' text if it's an image/video/audio
                      conv.lastMessage.format !== "text" ? (
                        `Sent an ${conv.lastMessage.format}`
                      ) : (
                        conv.lastMessage.content
                      )}
                    </>
                  ) : (
                    <span className="italic opacity-50">Drafting...</span>
                  )}
                </p>
              </div>
            )}
          </Link>
        );
      })}
    </div>
  );
}
