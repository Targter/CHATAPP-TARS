// src/components/chat/ChatHeader.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  MoreVertical,
  Phone,
  Video,
  Settings,
  ArrowLeft,
  Timer,
} from "lucide-react";
import { isUserOnline } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { ChatSettingsDialog } from "./ChatSettingsDialog";
import { useState } from "react";
import { useQuery } from "convex/react"; // Import
import { api } from "../../../convex/_generated/api"; // Import
import { Id } from "../../../convex/_generated/dataModel";

interface ChatHeaderProps {
  conversationId: Id<"conversations">;
  name: string;
  image?: string;
  lastSeen?: number;
  themeColor?: string;
  isGroup?: boolean;
  partnerId?: Id<"users">;
  currentTimer?: number; // Added to interface
}

export function ChatHeader({
  conversationId,
  name,
  image,
  lastSeen,
  themeColor,
  isGroup,
  partnerId,
  currentTimer,
}: ChatHeaderProps) {
  const online = isUserOnline(lastSeen);
  const router = useRouter();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // If it's a group, fetch member count (Optional optimization: pass length from parent if available, but query is fine)
  const groupMembers = useQuery(
    api.conversations.getGroupMembers,
    isGroup ? { conversationId } : "skip",
  );

  return (
    <div
      className="flex items-center justify-between p-4 pl-14 md:pl-4 border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-10 transition-colors duration-300"
      style={{ borderBottomColor: themeColor }}
    >
      <ChatSettingsDialog
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        conversationId={conversationId}
        currentName={name}
        currentTheme={themeColor}
        isGroup={isGroup}
        partnerId={partnerId}
        currentTimer={currentTimer}
      />

      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden -ml-2"
          onClick={() => router.push("/chat")}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>

        <div className="relative">
          <Avatar>
            <AvatarImage src={image} />
            <AvatarFallback>{name[0]}</AvatarFallback>
          </Avatar>

          {/* Only show Green Dot if it is NOT a group */}
          {!isGroup && online && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></span>
          )}
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h3 className="font-heading font-semibold text-sm">{name}</h3>
            {/* Visual Indicator if Disappearing Messages are ON */}
            {currentTimer ? (
              <Timer
                className="w-3 h-3 text-muted-foreground"
                // title="Disappearing Messages ON"
              />
            ) : null}
          </div>

          {/* UPDATED LOGIC HERE */}
          <p className="text-xs text-muted-foreground">
            {isGroup
              ? `${groupMembers?.length || 1} members`
              : online
                ? "Online"
                : "Offline"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {/* <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-primary"
        >
          <Phone className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-primary"
        >
          <Video className="w-4 h-4" />
        </Button> */}
        <Button
          onClick={() => setIsSettingsOpen(true)}
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-primary"
        >
          <MoreVertical className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
