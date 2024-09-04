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
  night: "🌚 Good night",
};

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
