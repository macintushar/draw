import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import Loader from "@/components/Loader";
import { getUser, updateUser } from "@/db/auth";
import { Input } from "@/components/ui/input";

import {
  Card,
  CardContent,
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
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProfileSchema } from "@/lib/schemas";
import { z } from "zod";
import { queryClient } from "@/main";
import TitleBar from "@/components/TitleBar";

export default function Profile() {
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
    <div className="mx-2 my-3 h-full w-full">
      <TitleBar title="PROFILE" />
      <div className="flex w-full items-center justify-center">
        <Card className="w-full lg:w-2/3">
          <Form {...form}>
            <form
              className="flex flex-col gap-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <CardHeader>
                <CardTitle>Update your Profile</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid gap-2">
                        <FormLabel htmlFor="first-name">Name</FormLabel>
                        <FormControl>
                          <Input
                            id="name"
                            type="text"
                            placeholder="Mac"
                            {...field}
                          />
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
      </div>
    </div>
  );
}
