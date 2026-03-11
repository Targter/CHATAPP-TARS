// "use client";

// import { useState, useRef, KeyboardEvent } from "react";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Send,
//   Paperclip,
//   Loader2,
//   Image as ImageIcon,
//   FileVideo,
//   Clock,
//   Mic,
// } from "lucide-react";
// import { useMutation } from "convex/react";
// import { api } from "../../../convex/_generated/api";
// import { Id } from "../../../convex/_generated/dataModel";
// import { cn } from "@/lib/utils";

// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { Input } from "@/components/ui/input";

// interface MessageInputProps {
//   conversationId: Id<"conversations">;
// }

// export function MessageInput({ conversationId }: MessageInputProps) {
//   const [content, setContent] = useState("");
//   const [isUploading, setIsUploading] = useState(false); // NEW
//   const [scheduleTime, setScheduleTime] = useState(""); // NEW
//   //
//   const sendMessage = useMutation(api.messages.send);
//   const sendTyping = useMutation(api.typing.kick);
//   const stopTyping = useMutation(api.typing.stop);
//   const generateUploadUrl = useMutation(api.conversations.generateUploadUrl); // Reuse existing mutation

//   const textareaRef = useRef<HTMLTextAreaElement>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null); // NEW

//   const lastTypingRef = useRef(0);

//   const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     const newValue = e.target.value;
//     setContent(newValue);

//     if (newValue.length > 0) {
//       const now = Date.now();
//       if (now - lastTypingRef.current > 1000) {
//         sendTyping({ conversationId });
//         lastTypingRef.current = now;
//       }
//     } else {
//       stopTyping({ conversationId });
//     }
//   };

//   const handleBlur = () => {
//     stopTyping({ conversationId });
//   };

//   const handleSend = async () => {
//     if (!content.trim()) return;

//     try {
//       let scheduledFor: number | undefined = undefined;
//       if (scheduleTime) {
//         const timeMs = new Date(scheduleTime).getTime();
//         if (timeMs > Date.now()) scheduledFor = timeMs;
//       }
//       await sendMessage({ conversationId, content, format: "text" });
//       setContent("");
//       stopTyping({ conversationId });
//       if (textareaRef.current) textareaRef.current.style.height = "auto";
//     } catch (error) {
//       console.error("Failed to send", error);
//     }
//   };

//   const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//   };

//   // NEW: Handle Media Upload
//   const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     setIsUploading(true);
//     try {
//       // 1. Get upload URL
//       const postUrl = await generateUploadUrl();

//       // 2. Upload to Convex
//       const result = await fetch(postUrl, {
//         method: "POST",
//         headers: { "Content-Type": file.type },
//         body: file,
//       });
//       const { storageId } = await result.json();

//       // 3. Determine Format
//       let format = "text";
//       if (file.type.startsWith("image/")) format = "image";
//       else if (file.type.startsWith("video/")) format = "video";
//       else if (file.type.startsWith("audio/")) format = "audio";

//       // 4. Send Message with Storage ID
//       await sendMessage({ conversationId, content: storageId, format });
//     } catch (error) {
//       console.error("Media upload failed", error);
//     } finally {
//       setIsUploading(false);
//       // Reset file input
//       if (fileInputRef.current) fileInputRef.current.value = "";
//     }
//   };

//   return (
//     <div className="p-4 pt-2 bg-transparent">
//       {scheduleTime && (
//         <div className="mb-2 flex items-center justify-between bg-primary/10 border border-primary/20 text-primary text-xs px-3 py-1.5 rounded-lg">
//           <span>
//             Message scheduled for: {new Date(scheduleTime).toLocaleString()}
//           </span>
//           <button
//             onClick={() => setScheduleTime("")}
//             className="hover:text-destructive"
//           >
//             Cancel
//           </button>
//         </div>
//       )}
//       <div className="relative flex items-end gap-2 bg-card/80 backdrop-blur-lg p-2 rounded-2xl border border-border/50 shadow-sm focus-within:shadow-md focus-within:ring-1 focus-within:ring-primary/30 transition-all">
//         {/* Hidden File Input */}
//         <input
//           type="file"
//           accept="image/*,video/*,audio/*"
//           className="hidden"
//           ref={fileInputRef}
//           onChange={handleFileUpload}
//         />

//         <Button
//           onClick={() => fileInputRef.current?.click()}
//           disabled={isUploading}
//           variant="ghost"
//           size="icon"
//           className="text-muted-foreground hover:text-primary h-9 w-9 mb-0.5 rounded-xl shrink-0"
//         >
//           {isUploading ? (
//             <Loader2 className="w-5 h-5 animate-spin" />
//           ) : (
//             <Paperclip className="w-5 h-5" />
//           )}
//         </Button>

//         <Textarea
//           ref={textareaRef}
//           value={content}
//           onChange={handleInputChange}
//           onBlur={handleBlur}
//           onKeyDown={handleKeyDown}
//           placeholder={
//             isUploading ? "Uploading media..." : "Message Tars AI..."
//           }
//           disabled={isUploading}
//           className="min-h-[40px] max-h-[160px] resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-2 py-2.5 text-sm w-full placeholder:text-muted-foreground/60 disabled:opacity-50"
//           rows={1}
//         />

//         <Textarea
//           ref={textareaRef}
//           value={content}
//           onChange={(e) => setContent(e.target.value)}
//           placeholder="Message Tars AI..."
//           className="min-h-[40px] max-h-[160px] resize-none border-0 bg-transparent focus-visible:ring-0 px-2 py-2.5 text-sm w-full"
//           rows={1}
//         />

//         <div className="flex gap-1 mb-0.5 shrink-0  items-center">
//           <Popover>
//             <PopoverTrigger asChild>
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className={cn(
//                   "h-9 w-9 rounded-xl text-muted-foreground hover:text-primary",
//                   scheduleTime && "text-primary bg-primary/10",
//                 )}
//               >
//                 <Clock className="w-4 h-4" />
//               </Button>
//             </PopoverTrigger>
//             <PopoverContent
//               className="w-60 p-3 bg-card border-border mb-2"
//               side="top"
//               align="end"
//             >
//               <div className="space-y-2">
//                 <p className="text-xs font-semibold text-muted-foreground">
//                   Schedule Message
//                 </p>
//                 <Input
//                   type="datetime-local"
//                   value={scheduleTime}
//                   onChange={(e) => setScheduleTime(e.target.value)}
//                   className="bg-background border-border text-sm"
//                   min={new Date().toISOString().slice(0, 16)} // Prevents picking past dates
//                 />
//               </div>
//             </PopoverContent>
//           </Popover>
//           <Button
//             onClick={handleSend}
//             disabled={!content.trim() || isUploading}
//             size="icon"
//             className={cn(
//               "h-9 w-9 rounded-xl transition-all",
//               content.trim()
//                 ? "bg-primary text-primary-foreground shadow-md hover:bg-primary/90 hover:scale-105"
//                 : "bg-muted text-muted-foreground opacity-50 cursor-not-allowed",
//             )}
//           >
//             <Send className="w-4 h-4" />
//           </Button>
//         </div>
//       </div>
//       <div className="text-[10px] text-center text-muted-foreground mt-2 opacity-40">
//         Press Enter to send, Shift + Enter for new line. Max file size: 10MB.
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip, Loader2, Clock } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { cn } from "@/lib/utils";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

interface MessageInputProps {
  conversationId: Id<"conversations">;
}

export function MessageInput({ conversationId }: MessageInputProps) {
  const [content, setContent] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [scheduleTime, setScheduleTime] = useState("");

  const sendMessage = useMutation(api.messages.send);
  const sendTyping = useMutation(api.typing.kick);
  const stopTyping = useMutation(api.typing.stop);
  const generateUploadUrl = useMutation(api.conversations.generateUploadUrl);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const lastTypingRef = useRef(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setContent(newValue);

    if (newValue.length > 0) {
      const now = Date.now();
      if (now - lastTypingRef.current > 1000) {
        sendTyping({ conversationId });
        lastTypingRef.current = now;
      }
    } else {
      stopTyping({ conversationId });
    }
  };

  const handleBlur = () => {
    stopTyping({ conversationId });
  };

  // Helper to get schedule time
  const getScheduledTimeMs = () => {
    if (scheduleTime) {
      const timeMs = new Date(scheduleTime).getTime();
      if (timeMs > Date.now()) return timeMs;
    }
    return undefined;
  };

  const handleSend = async () => {
    if (!content.trim()) return;

    try {
      const scheduledFor = getScheduledTimeMs();

      // FIX: Pass scheduledFor to the backend
      await sendMessage({
        conversationId,
        content,
        format: "text",
        scheduledFor,
      });

      setContent("");
      setScheduleTime(""); // Reset scheduler after sending
      stopTyping({ conversationId });

      if (textareaRef.current) textareaRef.current.style.height = "auto";
    } catch (error) {
      console.error("Failed to send", error);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const postUrl = await generateUploadUrl();

      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await result.json();

      let format = "text";
      if (file.type.startsWith("image/")) format = "image";
      else if (file.type.startsWith("video/")) format = "video";
      else if (file.type.startsWith("audio/")) format = "audio";

      const scheduledFor = getScheduledTimeMs();

      // FIX: Now media uploads can be scheduled too!
      await sendMessage({
        conversationId,
        content: storageId,
        format,
        scheduledFor,
      });

      setScheduleTime(""); // Reset scheduler
    } catch (error) {
      console.error("Media upload failed", error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="p-4 pt-2 bg-transparent flex flex-col gap-2">
      {/* Schedule Indicator */}
      {scheduleTime && (
        <div className="flex items-center justify-between bg-primary/10 border border-primary/20 text-primary text-xs px-3 py-2 rounded-lg animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center gap-2 font-medium">
            <Clock className="w-4 h-4" />
            <span>Scheduled for {new Date(scheduleTime).toLocaleString()}</span>
          </div>
          <button
            onClick={() => setScheduleTime("")}
            className="hover:text-destructive transition-colors font-bold"
          >
            Cancel
          </button>
        </div>
      )}

      <div className="relative flex items-end gap-2 bg-card/80 backdrop-blur-lg p-2 rounded-2xl border border-border/50 shadow-sm focus-within:shadow-md focus-within:ring-1 focus-within:ring-primary/30 transition-all">
        {/* Hidden File Input */}
        <input
          type="file"
          accept="image/*,video/*,audio/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileUpload}
        />

        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-primary h-9 w-9 mb-0.5 rounded-xl shrink-0"
        >
          {isUploading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Paperclip className="w-5 h-5" />
          )}
        </Button>

        {/* FIX: Removed duplicate Textarea */}
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={
            isUploading ? "Uploading media..." : "Message Tars AI..."
          }
          disabled={isUploading}
          className="min-h-[40px] max-h-[160px] resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-2 py-2.5 text-sm w-full placeholder:text-muted-foreground/60 disabled:opacity-50"
          rows={1}
        />

        <div className="flex gap-1 mb-0.5 shrink-0 items-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-9 w-9 rounded-xl text-muted-foreground hover:text-primary transition-colors",
                  scheduleTime && "text-primary bg-primary/10",
                )}
                title="Schedule Message"
              >
                <Clock className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-60 p-3 bg-card border-border mb-2 shadow-xl rounded-xl"
              side="top"
              align="end"
            >
              <div className="space-y-3">
                <p className="text-xs font-semibold text-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" /> Schedule Message
                </p>
                <Input
                  type="datetime-local"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="bg-background/50 border-border text-sm focus:ring-primary/20"
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>
            </PopoverContent>
          </Popover>

          <Button
            onClick={handleSend}
            disabled={(!content.trim() && !isUploading) || isUploading}
            size="icon"
            className={cn(
              "h-9 w-9 rounded-xl transition-all shadow-sm",
              content.trim()
                ? "bg-primary text-primary-foreground shadow-md hover:bg-primary/90 hover:scale-105"
                : "bg-muted text-muted-foreground opacity-50 cursor-not-allowed",
            )}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="text-[10px] text-center text-muted-foreground opacity-40">
        Press Enter to send, Shift + Enter for new line. Max file size: 10MB.
      </div>
    </div>
  );
}
