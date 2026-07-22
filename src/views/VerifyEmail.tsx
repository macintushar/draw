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
import { resendVerificationEmail } from "@/db/auth";
import { Link, getRouteApi } from "@tanstack/react-router";
import { toast } from "sonner";
import { useEffect, useState } from "react";

const RESEND_COOLDOWN_SECONDS = 30;

const routeApi = getRouteApi("/verify-email");

export default function VerifyEmail() {
  const { email: emailParam } = routeApi.useSearch();

  const [email, setEmail] = useState<string | undefined>(emailParam);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [cooldown, setCooldown] = useState<number>(0);

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(
      () => setCooldown((current) => current - 1),
      1000,
    );

    return () => clearInterval(timer);
  }, [cooldown]);

  async function sendVerification(email: string) {
    setIsLoading(true);
    const data = await resendVerificationEmail(email);

    setIsLoading(false);

    if (data.error) {
      toast("An error occured", { description: data.error.message });
      return;
    }

    setEmail(email);
    setCooldown(RESEND_COOLDOWN_SECONDS);
    toast("Verification email sent!");
  }

  async function onSubmit(values: z.infer<typeof forgotPasswordSchema>) {
    await sendVerification(values.email);
  }

  return (
    <div className="flex h-full items-center justify-center">
      <Card className="w-full max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Verify Your Email</CardTitle>
              <CardDescription>
                {email ? (
                  <>
                    We sent a verification link to{" "}
                    <span className="font-medium">{email}</span>. Click the link
                    in the email to activate your account.
                  </>
                ) : (
                  "Enter your email and we'll send you a verification link."
                )}
              </CardDescription>
            </CardHeader>
            {!email && (
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
              {email ? (
                <Button
                  className="w-full"
                  type="button"
                  variant="outline"
                  onClick={() => sendVerification(email)}
                  isLoading={isLoading}
                  loadingText="Sending"
                  disabled={cooldown > 0}
                >
                  {cooldown > 0
                    ? `Resend in ${cooldown}s`
                    : "Resend Verification Email"}
                </Button>
              ) : (
                <Button
                  className="w-full"
                  type="submit"
                  isLoading={isLoading}
                  loadingText="Sending"
                >
                  Send Verification Link
                </Button>
              )}
              <div className="flex space-x-2">
                <h1>Already verified?</h1>
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
