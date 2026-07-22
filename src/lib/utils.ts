import { clsx, type ClassValue } from "clsx";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { twMerge } from "tailwind-merge";

dayjs.extend(relativeTime);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Human relative time for page cards, e.g. "2 minutes ago", "17 minutes ago".
 */
export function fullRelativeTime(date: string | number | Date) {
  return dayjs(date).fromNow();
}

export const timeMessages = {
  default: "👋 Hey",
  morning: "☀️ Good morning",
  afternoon: "☀️ Good afternoon",
  evening: "🌝 Good evening",
  night: "🌚 Good night",
};

/**
 * Compact relative time for the sidebar recents list, e.g. "2h", "3d", "1w".
 * Falls back to an absolute short date for anything older than a month.
 */
export function shortRelativeTime(date: string | number | Date) {
  const then = dayjs(date);
  const now = dayjs();

  const minutes = now.diff(then, "minute");
  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m`;

  const hours = now.diff(then, "hour");
  if (hours < 24) return `${hours}h`;

  const days = now.diff(then, "day");
  if (days < 7) return `${days}d`;

  const weeks = now.diff(then, "week");
  if (weeks < 5) return `${weeks}w`;

  return then.format("MMM D");
}

export function timeMessage() {
  let message = timeMessages.default;

  try {
    const hour = dayjs().hour();

    if (hour >= 5 && hour < 12) {
      message = timeMessages.morning;
    } else if (hour >= 12 && hour < 17) {
      message = timeMessages.afternoon;
    } else if (hour >= 17 && hour < 20) {
      message = timeMessages.evening;
    } else {
      message = timeMessages.night;
    }

    return message;
  } catch (error) {
    console.error(error);
    return message;
  }
}
