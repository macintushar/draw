import { clsx, type ClassValue } from "clsx";
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const timeMessages = {
  default: "👋 Hey",
  morning: "☀️ Good morning",
  afternoon: "☀️ Good afternoon",
  evening: "🌝 Good evening",
};

export function timeMessage() {
  let message = timeMessages.default;

  try {
    const hour = dayjs().get("h");

    if (hour > 4 && hour < 12) message = timeMessages.morning;
    if (hour >= 12 && hour < 18) message = timeMessages.afternoon;
    if (hour > 18) message = timeMessages.evening;

    console.log(hour, message);

    return message;
  } catch (error) {
    console.error(error);

    return message;
  }
}
