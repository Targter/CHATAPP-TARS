// "use client";

// import { useState, useRef, KeyboardEvent } from "react";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { Send, Paperclip } from "lucide-react";
// import { useMutation } from "convex/react";
// import { api } from "../../../convex/_generated/api";
// import { Id } from "../../../convex/_generated/dataModel";
// import { cn } from "@/lib/utils";

// interface MessageInputProps {
//   conversationId: Id<"conversations">;
// }

// export function MessageInput({ conversationId }: MessageInputProps) {
//   const [content, setContent] = useState("");
//   const sendMessage = useMutation(api.messages.send);
//   const sendTyping = useMutation(api.typing.kick);
//   const stopTyping = useMutation(api.typing.stop); // NEW
//   const textareaRef = useRef<HTMLTextAreaElement>(null);

//   const lastTypingRef = useRef(0);

//   const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     const newValue = e.target.value;
//     setContent(newValue);

//     if (newValue.length > 0) {
//       // Send typing notification at most every 1 second
//       const now = Date.now();
//       if (now - lastTypingRef.current > 1000) {
//         sendTyping({ conversationId });
//         lastTypingRef.current = now;
//       }
//     } else {
//       // If empty, stop immediately
//       stopTyping({ conversationId });
//     }
//   };

//   const handleBlur = () => {
//     // User left the input box -> Stop typing immediately
//     stopTyping({ conversationId });
//   };

//   const handleSend = async () => {
//     if (!content.trim()) return;

//     try {
//       await sendMessage({ conversationId, content });
//       setContent("");
//       stopTyping({ conversationId }); // Stop typing when sent

//       // Reset height
//       if (textareaRef.current) {
//         textareaRef.current.style.height = "auto";
//       }
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

//   return (
//     <div className="p-4 pt-2 bg-transparent">
//       <div className="relative flex items-end gap-2 bg-card/80 backdrop-blur-lg p-2 rounded-2xl border border-border/50 shadow-sm focus-within:shadow-md focus-within:ring-1 focus-within:ring-primary/30 transition-all">
//         <Button
//           variant="ghost"
//           size="icon"
//           className="text-muted-foreground hover:text-primary h-9 w-9 mb-0.5 rounded-xl shrink-0"
//         >
//           <Paperclip className="w-5 h-5" />
//         </Button>

//         <Textarea
//           ref={textareaRef}
//           value={content}
//           onChange={handleInputChange}
//           onBlur={handleBlur} // NEW: Handle blur
//           onKeyDown={handleKeyDown}
//           placeholder="Message Tars AI..."
//           className="min-h-[40px] max-h-[160px] resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-2 py-2.5 text-sm w-full placeholder:text-muted-foreground/60"
//           rows={1}
//         />

//         <div className="flex gap-1 mb-0.5 shrink-0">
//           <Button
//             onClick={handleSend}
//             disabled={!content.trim()}
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
//         Press Enter to send, Shift + Enter for new line
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Send,
  Paperclip,
  Loader2,
  Image as ImageIcon,
  FileVideo,
  Mic,
} from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { cn } from "@/lib/utils";

interface MessageInputProps {
  conversationId: Id<"conversations">;
}

export function MessageInput({ conversationId }: MessageInputProps) {
  const [content, setContent] = useState("");
  const [isUploading, setIsUploading] = useState(false); // NEW

  const sendMessage = useMutation(api.messages.send);
  const sendTyping = useMutation(api.typing.kick);
  const stopTyping = useMutation(api.typing.stop);
  const generateUploadUrl = useMutation(api.conversations.generateUploadUrl); // Reuse existing mutation

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // NEW

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

  const handleSend = async () => {
    if (!content.trim()) return;

    try {
      await sendMessage({ conversationId, content, format: "text" });
      setContent("");
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

  // NEW: Handle Media Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // 1. Get upload URL
      const postUrl = await generateUploadUrl();

      // 2. Upload to Convex
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await result.json();

      // 3. Determine Format
      let format = "text";
      if (file.type.startsWith("image/")) format = "image";
      else if (file.type.startsWith("video/")) format = "video";
      else if (file.type.startsWith("audio/")) format = "audio";

      // 4. Send Message with Storage ID
      await sendMessage({ conversationId, content: storageId, format });
    } catch (error) {
      console.error("Media upload failed", error);
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="p-4 pt-2 bg-transparent">
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

        <div className="flex gap-1 mb-0.5 shrink-0">
          <Button
            onClick={handleSend}
            disabled={!content.trim() || isUploading}
            size="icon"
            className={cn(
              "h-9 w-9 rounded-xl transition-all",
              content.trim()
                ? "bg-primary text-primary-foreground shadow-md hover:bg-primary/90 hover:scale-105"
                : "bg-muted text-muted-foreground opacity-50 cursor-not-allowed",
            )}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="text-[10px] text-center text-muted-foreground mt-2 opacity-40">
        Press Enter to send, Shift + Enter for new line. Max file size: 10MB.
      </div>
    </div>
  );
}
