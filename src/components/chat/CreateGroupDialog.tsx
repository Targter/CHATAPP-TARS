"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import { Loader2, CheckCircle2, Circle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";
import { Id } from "../../../convex/_generated/dataModel";

interface CreateGroupDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateGroupDialog({ isOpen, onClose }: CreateGroupDialogProps) {
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<Id<"users">[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const users = useQuery(api.users.getUsers);
  const createGroup = useMutation(api.conversations.createGroup);
  const router = useRouter();

  const toggleUser = (userId: Id<"users">) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleCreate = async () => {
    if (!groupName.trim() || selectedUsers.length === 0) return;
    setIsLoading(true);
    try {
      const conversationId = await createGroup({
        name: groupName,
        participants: selectedUsers,
      });
      onClose();
      router.push(`/chat/${conversationId}`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]  ">
        <DialogHeader>
          <DialogTitle>Create Group</DialogTitle>
          <DialogDescription>
            Select friends to start a new group conversation.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <Input
            placeholder="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          <div className="text-sm font-medium text-muted-foreground">
            Select Members
          </div>
          <ScrollArea className="h-[250px] pr-4">
            <div className="space-y-2">
              {users?.map((user) => (
                <div
                  key={user._id}
                  onClick={() => toggleUser(user._id)}
                  className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${selectedUsers.includes(user._id) ? "bg-primary/20" : "hover:bg-muted"}`}
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.image} />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <span>{user.name}</span>
                  </div>
                  {selectedUsers.includes(user._id) ? (
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
        <DialogFooter>
          <Button
            onClick={handleCreate}
            disabled={isLoading || !groupName || selectedUsers.length === 0}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Create Group"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
