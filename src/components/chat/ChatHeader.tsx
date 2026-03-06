// src/components/chat/ChatHeader.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreVertical, Phone, Video } from "lucide-react";
import { isUserOnline } from "@/lib/utils"; // Import
import { ArrowLeft } from "lucide-react"; // Import
import { useRouter } from "next/navigation"; // Import

interface ChatHeaderProps {
  name: string;
  image?: string;
  lastSeen?: number; // Changed from isOnline boolean
}

export function ChatHeader({ name, image, lastSeen }: ChatHeaderProps) {
  const online = isUserOnline(lastSeen);
  const router = useRouter(); // Hook

  return (
    <div className="flex items-center justify-between p-4 pl-14 md:pl-4 border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden -ml-2"
          onClick={() => router.push("/chat")}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        {/*  */}
        <div className="relative">
          <Avatar>
            <AvatarImage src={image} />
            <AvatarFallback>{name[0]}</AvatarFallback>
          </Avatar>
          {online && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></span>
          )}
        </div>
        <div>
          <h3 className="font-heading font-semibold text-sm">{name}</h3>
          <p className="text-xs text-muted-foreground">
            {online ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      {/* Buttons ... */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-primary"
          disabled
        >
          <Phone className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-primary"
          disabled
        >
          <Video className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-primary"
          disabled
        >
          <MoreVertical className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
