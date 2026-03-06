// src/components/common/UserSearch.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Id } from "../../../convex/_generated/dataModel";

interface UserSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserSearch({ isOpen, onClose }: UserSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const users = useQuery(api.users.getUsers);
  const createConversation = useMutation(api.conversations.createConversation);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const filteredUsers = users?.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleStartChat = async (userId: Id<"users">) => {
    setIsLoading(true);
    try {
      const conversationId = await createConversation({
        participantId: userId,
      });
      onClose();
      router.push(`/chat/${conversationId}`);
    } catch (error) {
      console.error("Failed to create conversation", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-card border-border">
        <DialogHeader>
          <DialogTitle>New Chat</DialogTitle>
        </DialogHeader>
        <div className="relative mt-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-9 bg-background/50 border-border"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <ScrollArea className="h-[300px] mt-4 pr-4">
          <div className="space-y-2">
            {!users ? (
              <div className="flex justify-center p-4">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : filteredUsers?.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground p-4">
                No users found
              </p>
            ) : (
              filteredUsers?.map((user) => (
                <div
                  key={user._id}
                  onClick={() => handleStartChat(user._id)}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/10 cursor-pointer transition-colors"
                >
                  <Avatar>
                    <AvatarImage src={user.image} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
