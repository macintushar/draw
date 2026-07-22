import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import Loader from "@/components/Loader";
import {
  getUser,
  getUserIdentities,
  linkIdentity,
  unlinkIdentity,
  updatePassword,
  updateUser,
} from "@/db/auth";
import type { UserIdentity } from "@supabase/supabase-js";
import { HiddenInput, Input } from "@/components/ui/input";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, updateProfileSchema } from "@/lib/schemas";
import { z } from "zod";
import { queryClient } from "@/main";
import TitleBar from "@/components/TitleBar";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { Moon, Sun } from "lucide-react";

function ProfileSection() {
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const { data, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  if (data?.error) {
    toast(data.error.message);
  }

  const form = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
    values: {
      name: data?.data?.user?.user_metadata.name,
      email: data?.data?.user?.email || "",
    },
  });

  async function onSubmit(values: z.infer<typeof updateProfileSchema>) {
    setIsSaving(true);
    const data = await updateUser(values.name, values.email);

    if (
      data.data.user?.email === values.email &&
      data.data.user?.user_metadata.name === values.name
    ) {
      setIsSaving(false);
      queryClient.invalidateQueries({ queryKey: ["profile"] });

      toast("Updated profile!");
    }

    if (data.error) {
      setIsSaving(false);
      toast("An error occured", { description: data.error.message });
    }
  }

  if (isLoading) return <Loader />;

  return (
    <Card>
      <Form {...form}>
        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Update your name and email.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <div className="grid gap-2">
                    <FormLabel htmlFor="name">Name</FormLabel>
                    <FormControl>
                      <Input id="name" type="text" placeholder="Mac" {...field} />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
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
          <CardFooter className="flex justify-end border-t px-6 py-4">
            <Button type="submit" isLoading={isSaving}>
              Save
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

function AppearanceSection() {
  const { theme, setTheme } = useTheme();

  const options = [
    { value: "light" as const, label: "Light", Icon: Sun },
    { value: "dark" as const, label: "Dark", Icon: Moon },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>Choose your preferred theme.</CardDescription>
      </CardHeader>
      <CardContent className="flex gap-3">
        {options.map(({ value, label, Icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-lg border p-3 text-sm font-medium transition-colors",
              theme === value
                ? "border-black bg-gray-100 dark:border-white dark:bg-zinc-800"
                : "border-gray-200 hover:bg-gray-50 dark:border-zinc-700 dark:hover:bg-zinc-800/50",
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </CardContent>
    </Card>
  );
}

function PasswordSection() {
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  async function onSubmit(values: z.infer<typeof resetPasswordSchema>) {
    setIsSaving(true);
    const data = await updatePassword(values.password);

    if (data.error) {
      setIsSaving(false);
      toast("An error occured", { description: data.error.message });
      return;
    }

    setIsSaving(false);
    form.reset();
    toast("Password updated!");
  }

  return (
    <Card>
      <Form {...form}>
        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>Change your account password.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="grid gap-2">
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <HiddenInput id="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <div className="grid gap-2">
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <HiddenInput id="confirmPassword" {...field} />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-end border-t px-6 py-4">
            <Button type="submit" isLoading={isSaving} loadingText="Saving">
              Update Password
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

function LinkedAccountsSection() {
  const [isLinking, setIsLinking] = useState<boolean>(false);
  const [unlinkingId, setUnlinkingId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["identities"],
    queryFn: getUserIdentities,
  });

  const identities = data?.data?.identities ?? [];
  const googleIdentity = identities.find(
    (identity) => identity.provider === "google",
  );

  // Surface errors from the OAuth redirect (e.g. identity already linked to
  // another account) and clean them from the URL.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const errorDescription = params.get("error_description");

    if (errorDescription) {
      toast("Could not link account", { description: errorDescription });
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  async function link() {
    setIsLinking(true);
    const data = await linkIdentity("google");

    if (data.error) {
      setIsLinking(false);
      toast("An error occured", { description: data.error.message });
    }
  }

  async function unlink(identity: UserIdentity) {
    setUnlinkingId(identity.id);
    const data = await unlinkIdentity(identity);
    setUnlinkingId(null);

    if (data.error) {
      toast("An error occured", { description: data.error.message });
      return;
    }

    queryClient.invalidateQueries({ queryKey: ["identities"] });
    toast("Account unlinked!");
  }

  if (isLoading) return <Loader />;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Linked Accounts</CardTitle>
        <CardDescription>
          Connect third-party accounts to sign in with them.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {identities.map((identity) => (
          <div
            key={identity.id}
            className="flex items-center justify-between rounded-lg border p-3"
          >
            <div className="flex flex-col">
              <span className="text-sm font-medium capitalize">
                {identity.provider}
              </span>
              <span className="text-muted-foreground text-sm">
                {identity.identity_data?.email}
              </span>
            </div>
            {identity.provider !== "email" && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => unlink(identity)}
                isLoading={unlinkingId === identity.id}
                loadingText="Unlinking"
                disabled={identities.length <= 1}
              >
                Unlink
              </Button>
            )}
          </div>
        ))}
      </CardContent>
      {!googleIdentity && (
        <CardFooter className="flex justify-end border-t px-6 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={link}
            isLoading={isLinking}
            loadingText="Redirecting"
          >
            Link Google Account
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

export default function Profile() {
  return (
    <div className="mx-2 my-3 h-full w-full overflow-y-auto">
      <TitleBar title="PROFILE" />
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 pb-6">
        <ProfileSection />
        <LinkedAccountsSection />
        <AppearanceSection />
        <PasswordSection />
      </div>
    </div>
  );
}
