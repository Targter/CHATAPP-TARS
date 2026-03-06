// src/components/providers/ConvexClientProvider.tsx
"use client";

import { ReactNode } from "react";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { usePresence } from "@/hooks/usePresence"; // Import

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Internal component to use the hook
function PresenceManager({ children }: { children: ReactNode }) {
  usePresence();
  return <>{children}</>;
}

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      appearance={{
        variables: {
          colorPrimary: "#9280FC",
          colorBackground: "#0F0F14",
          colorText: "#FFFFFF",
          colorInputBackground: "#1A1A23",
          colorInputText: "#FFFFFF",
        },
      }}
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <PresenceManager>{children}</PresenceManager>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
