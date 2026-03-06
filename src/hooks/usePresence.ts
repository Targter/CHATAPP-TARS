// src/hooks/usePresence.ts
import { useEffect } from "react";
import { useMutation, useConvexAuth } from "convex/react";
import { api } from "../../convex/_generated/api";

export function usePresence() {
  const { isAuthenticated } = useConvexAuth();
  const updatePresence = useMutation(api.users.updatePresence);

  useEffect(() => {
    if (!isAuthenticated) return;

    // Initial ping
    updatePresence();

    // Ping every 60 seconds
    const intervalId = setInterval(() => {
      updatePresence();
    }, 60 * 1000);

    return () => clearInterval(intervalId);
  }, [isAuthenticated, updatePresence]);
}
