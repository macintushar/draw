import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { Github, Loader2, LogOut, Moon, Sun, User } from "lucide-react";

import { useTheme } from "@/components/theme-provider";
import { logout } from "@/db/auth";

import { useState } from "react";
import { toast } from "sonner";

import { useNavigate } from "@tanstack/react-router";

import { getLocalUser } from "@/db/auth";
import { useQuery } from "@tanstack/react-query";
import { timeMessage } from "@/lib/utils";

export default function Profile() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { setTheme } = useTheme();
  const navigate = useNavigate();

  const { data: profileData, isLoading: profileIsLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: getLocalUser,
  });

  async function handleLogout() {
    setIsLoading(true);
    const data = await logout();

    if (data.error) {
      setIsLoading(false);
      toast("An error occured", { description: data.error.message });
    }

    setIsLoading(false);
    toast("Logged out!");
    navigate({ to: "/" });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant={"outline"} className="rounded-full">
          {profileIsLoading ? (
            <div className="h-full w-full bg-gray-900 animate-pulse rounded-full" />
          ) : (
            <User className="h-5 w-5" strokeWidth={4} />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>
          {timeMessage() +
            ", " +
            profileData?.data.session?.user.user_metadata.name +
            "!"}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <div className="mr-2 h-4 w-4 flex items-center">
                <Sun className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 h-4 w-4 " />
                <Moon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 h-4 w-4 " />
                <span className="sr-only">Toggle theme</span>
              </div>
              <span>Theme</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  <Sun className="mr-2 h-4 w-4" />
                  <span>Light</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  <Moon className="mr-2 h-4 w-4" />
                  <span>Dark</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <a
          href="https://github.com/Use-Just-Apps/draw"
          rel="noreferrer noopener"
          target="_blank"
        >
          <DropdownMenuItem>
            <Github className="mr-2 h-4 w-4" />
            <span>GitHub</span>
          </DropdownMenuItem>
        </a>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleLogout()}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
          {isLoading && <Loader2 className="animate-spin h-4 w-4 ml-4" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
