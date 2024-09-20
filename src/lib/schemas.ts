import { z } from "zod";

export const emailSchema = z.string().email();

export const checkPasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .max(100, "Password must not exceed 100 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character",
  );

export const passwordSchema = z.string();

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const signUpSchema = z.object({
  name: z.string().min(1, "Name must be atleast 1 character"),
  email: emailSchema,
  password: passwordSchema,
});

export const updateProfileSchema = z.object({
  name: z.string().min(1, "Name must be atleast 1 character"),
  email: emailSchema,
});
