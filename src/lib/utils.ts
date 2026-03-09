// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

import { format, isToday, isThisYear } from "date-fns" // Ensure date-fns is installed

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


// NEW: Smart Timestamp Formatting
export function formatMessageTime(timestamp: number) {
  const date = new Date(timestamp);
  
  if (isToday(date)) {
    return format(date, "h:mm a"); // e.g., 2:34 PM
  } 
  
  if (isThisYear(date)) {
    return format(date, "MMM d, h:mm a"); // e.g., Feb 15, 2:34 PM
  }
  
  return format(date, "MMM d yyyy, h:mm a"); // e.g., Feb 15 2023, 2:34 PM
}
