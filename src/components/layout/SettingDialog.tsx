"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";
import { Moon, Sun, Upload, Loader2, Monitor } from "lucide-react";
import { useState, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsDialog({ isOpen, onClose }: SettingsDialogProps) {
  const { setTheme, theme } = useTheme();
  const user = useQuery(api.users.currentUser);

  const generateUploadUrl = useMutation(api.users.generateUploadUrl);
  const updateImage = useMutation(api.users.updateImage);

  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // 1. Get upload URL
      const postUrl = await generateUploadUrl();

      // 2. Upload file
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await result.json();

      // 3. Save to user profile
      await updateImage({ storageId });
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-card border-border">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription className="sr-only">
            Manage your account settings and theme.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* PROFILE IMAGE SECTION */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Profile Picture</Label>
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 border-2 border-border">
                <AvatarImage src={user?.image} />
                <AvatarFallback className="bg-primary/20 text-primary text-xl">
                  {user?.name?.[0]}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                />
                <Button
                  variant="outline"
                  className="w-full gap-2 border-dashed border-primary/30 hover:border-primary/60 hover:bg-primary/5"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  {uploading ? "Uploading..." : "Upload New Image"}
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Recommended: Square JPG or PNG, max 2MB.
                </p>
              </div>
            </div>
          </div>

          <div className="h-[1px] bg-border" />

          {/* THEME SECTION */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Appearance</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={theme === "light" ? "default" : "outline"}
                className="gap-2"
                onClick={() => setTheme("light")}
              >
                <Sun className="w-4 h-4" /> Light
              </Button>
              <Button
                variant={theme === "dark" ? "default" : "outline"}
                className="gap-2"
                onClick={() => setTheme("dark")}
              >
                <Moon className="w-4 h-4" /> Dark
              </Button>
              <Button
                variant={theme === "system" ? "default" : "outline"}
                className="gap-2"
                onClick={() => setTheme("system")}
              >
                <Monitor className="w-4 h-4" /> System
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
