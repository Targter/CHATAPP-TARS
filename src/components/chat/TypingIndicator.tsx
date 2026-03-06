// src/components/chat/TypingIndicator.tsx
"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { motion, AnimatePresence } from "framer-motion";

export function TypingIndicator({
  conversationId,
}: {
  conversationId: Id<"conversations">;
}) {
  const typers = useQuery(api.typing.list, { conversationId });

  if (!typers || typers.length === 0) return null;

  return (
    <div className="p-4 pt-0">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="flex items-center gap-2 text-xs text-muted-foreground bg-card/50 px-3 py-2 rounded-full w-fit border border-border/50"
        >
          <div className="flex gap-1">
            <motion.span
              className="w-1.5 h-1.5 bg-primary rounded-full"
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
            />
            <motion.span
              className="w-1.5 h-1.5 bg-primary rounded-full"
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
            />
            <motion.span
              className="w-1.5 h-1.5 bg-primary rounded-full"
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
            />
          </div>
          <span>
            {typers.join(", ")} {typers.length > 1 ? "are" : "is"} typing...
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
