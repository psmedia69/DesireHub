import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFakeViews(baseViews: number, createdAt: string | undefined) {
  if (!createdAt) return baseViews;
  const createdDate = new Date(createdAt).getTime();
  const now = new Date().getTime();
  const hoursPassed = Math.max(0, Math.floor((now - createdDate) / (1000 * 60 * 60)));
  // Increase views by 1 per hour as requested
  return baseViews + hoursPassed;
}
