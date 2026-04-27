// clsx — conditionally joins class names (handles arrays, objects, falsy values)
import { clsx } from "clsx";
// twMerge — merges Tailwind CSS classes intelligently, resolving conflicts
// e.g. twMerge('p-2 p-4') → 'p-4' (last one wins)
import { twMerge } from "tailwind-merge";

// cn — utility function used throughout the app to build dynamic className strings
// Combines clsx (conditional logic) with twMerge (Tailwind conflict resolution)
// Usage: cn('base-class', condition && 'conditional-class', className)
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
