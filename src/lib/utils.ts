// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// NEW: Check if user is online (active in last 90 seconds)
export function isUserOnline(lastSeen?: number) {
  if (!lastSeen) return false;
  const now = Date.now();
  // 90 seconds threshold to allow for network delay/missed beat
  return now - lastSeen < 90 * 1000; 
}