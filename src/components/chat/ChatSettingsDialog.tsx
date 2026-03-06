"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { useState, useEffect, useRef } from "react";
import {
  Loader2,
  Palette,
  UserPen,
  Upload,
  Image as ImageIcon,
  Users,
  UserPlus,
  X,
} from "lucide-react";
// import { toast } from "sonner"; // If you have sonner/toast, otherwise remove

interface ChatSettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  conversationId: Id<"conversations">;
  currentName: string;
  currentTheme?: string;
  isGroup?: boolean;
  partnerId?: Id<"users">;
}

export function ChatSettingsDialog({
  isOpen,
  onClose,
  conversationId,
  currentName,
  currentTheme,
  isGroup,
  partnerId,
}: ChatSettingsDialogProps) {
  const updateSettings = useMutation(api.conversations.updateSettings);
  const generateUploadUrl = useMutation(api.conversations.generateUploadUrl);
  const addMember = useMutation(api.conversations.addMember);

  // Queries
  const groupMembers = useQuery(
    api.conversations.getGroupMembers,
    isGroup ? { conversationId } : "skip",
  );
  const allUsers = useQuery(api.users.getUsers);

  const [name, setName] = useState(currentName);
  const [color, setColor] = useState(currentTheme || "#9280FC");
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setName(currentName);
    setColor(currentTheme || "#9280FC");
  }, [currentName, currentTheme, isOpen]);

  const colors = [
    "#9280FC",
    "#FF4D4D",
    "#22C55E",
    "#EAB308",
    "#3B82F6",
    "#EC4899",
    "#8B5CF6",
    "#F97316",
  ];

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateSettings({
        conversationId,
        themeColor: color,
        name: name,
        targetUserId: partnerId,
      });
      onClose();
    } catch (error) {
      console.error("Failed to update settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMember = async (userId: Id<"users">) => {
    setIsLoading(true);
    try {
      await addMember({ conversationId, userId });
      setIsAddingMember(false); // Close the add view
    } catch (error) {
      console.error("Failed to add member", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await result.json();

      await updateSettings({
        conversationId,
        groupImageId: storageId,
      });
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter users who are NOT already in the group
  const potentialNewMembers = allUsers?.filter(
    (u) => !groupMembers?.some((member) => member._id === u._id),
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] max-h-[85vh] overflow-y-auto bg-card border-border shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-primary" />
            {isGroup ? "Group Settings" : "Chat Settings"}
          </DialogTitle>
          <DialogDescription>
            Manage theme, name, {isGroup && "and members"} for this chat.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* GROUP IMAGE UPLOAD */}
          {isGroup && (
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <ImageIcon className="w-4 h-4" /> Group Photo
              </Label>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-2 border-dashed"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                >
                  <Upload className="w-4 h-4" />
                  Upload New Photo
                </Button>
              </div>
            </div>
          )}

          <div className="h-[1px] bg-border/50" />

          {/* NAME / NICKNAME */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <UserPen className="w-4 h-4" />
              {isGroup ? "Group Name" : "Nickname"}
            </Label>
            <div className="relative">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-background/50 border-border focus:ring-primary/20"
              />
            </div>
          </div>

          {/* MEMBERS SECTION (Only for Groups) */}
          {isGroup && (
            <>
              <div className="h-[1px] bg-border/50" />
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <Users className="w-4 h-4" /> Members (
                    {groupMembers?.length || 0})
                  </Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-primary hover:text-primary/80"
                    onClick={() => setIsAddingMember(!isAddingMember)}
                  >
                    {isAddingMember ? "Cancel" : "+ Add Member"}
                  </Button>
                </div>

                {isAddingMember && (
                  <div className="bg-muted/30 p-2 rounded-lg border border-border animate-in fade-in slide-in-from-top-2">
                    <p className="text-xs text-muted-foreground mb-2 px-1">
                      Select user to add:
                    </p>
                    <ScrollArea className="h-[120px]">
                      {potentialNewMembers?.length === 0 ? (
                        <p className="text-xs text-center py-2 text-muted-foreground">
                          No users available to add.
                        </p>
                      ) : (
                        potentialNewMembers?.map((user) => (
                          <div
                            key={user._id}
                            className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md cursor-pointer"
                            onClick={() => handleAddMember(user._id)}
                          >
                            <div className="flex items-center gap-2">
                              <Avatar className="w-6 h-6">
                                <AvatarImage src={user.image} />
                                <AvatarFallback>{user.name[0]}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm">{user.name}</span>
                            </div>
                            <UserPlus className="w-4 h-4 text-muted-foreground" />
                          </div>
                        ))
                      )}
                    </ScrollArea>
                  </div>
                )}

                <ScrollArea className="h-[120px] pr-2">
                  <div className="space-y-1">
                    {groupMembers?.map((member) => (
                      <div
                        key={member?._id}
                        className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/20"
                      >
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={member?.image} />
                          <AvatarFallback>{member?.name?.[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            {member?.name}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {member?.email}
                          </span>
                        </div>
                        {member?.isOnline && (
                          <div className="ml-auto w-2 h-2 bg-green-500 rounded-full" />
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </>
          )}

          <div className="h-[1px] bg-border/50" />

          {/* COLOR */}
          <div className="space-y-3">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Theme Color
            </Label>
            <div className="grid grid-cols-4 gap-3">
              {colors.map((c) => (
                <div
                  key={c}
                  onClick={() => setColor(c)}
                  className={`h-10 w-full rounded-lg cursor-pointer transition-all flex items-center justify-center ${color === c ? "ring-2 ring-offset-2 ring-offset-card ring-white scale-95" : "hover:opacity-80"}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="w-full font-semibold shadow-lg hover:brightness-110 transition-all"
            style={{ backgroundColor: color, color: "#fff" }}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
