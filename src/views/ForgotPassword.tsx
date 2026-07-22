import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { forgotPasswordSchema } from "@/lib/schemas";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { z } from "zod";
import { sendPasswordReset } from "@/db/auth";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { useState } from "react";

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sent, setSent] = useState<boolean>(false);

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: z.infer<typeof forgotPasswordSchema>) {
    setIsLoading(true);
    const data = await sendPasswordReset(values.email);

    setIsLoading(false);

    if (data.error) {
      toast("An error occured", { description: data.error.message });
      return;
    }

    setSent(true);
    toast("Password reset email sent!");
  }

  return (
    <div className="flex h-full items-center justify-center">
      <Card className="w-full max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Reset Password</CardTitle>
              <CardDescription>
                {sent
                  ? "Check your inbox for a link to reset your password."
                  : "Enter your email and we'll send you a reset link."}
              </CardDescription>
            </CardHeader>
            {!sent && (
              <CardContent className="grid gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid gap-2">
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            id="email"
                            type="email"
                            placeholder="mac@justapps.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              </CardContent>
            )}
            <CardFooter className="flex flex-col gap-3">
              {!sent && (
                <Button
                  className="w-full"
                  type="submit"
                  isLoading={isLoading}
                  loadingText="Sending"
                >
                  Send Reset Link
                </Button>
              )}
              <div className="flex space-x-2">
                <h1>Remembered your password?</h1>
                <Link className="font-bold underline" to="/login">
                  Login
                </Link>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
