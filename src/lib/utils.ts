import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: (string | false | null | undefined)[]): string {
  return twMerge(clsx(...inputs));
}
