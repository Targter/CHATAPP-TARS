// src/components/common/UserSync.tsx
"use client";

import { useConvexAuth, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useEffect } from "react";

export function UserSync() {
  const { isAuthenticated } = useConvexAuth();
  const storeUser = useMutation(api.users.store);

  useEffect(() => {
    if (isAuthenticated) {
      // Always ensure user exists in DB when auth state is true
      storeUser();
    }
  }, [isAuthenticated, storeUser]);

  return null; // This component renders nothing
}
