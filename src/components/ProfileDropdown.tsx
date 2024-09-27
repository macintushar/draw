import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { useTheme } from "@/components/theme-provider";
import ProfileItem from "@/components/ProfileItem";

import { Github, LogOut, Moon, Sun, SunMoon, User } from "lucide-react";

import { timeMessage } from "@/lib/utils";

import { getLocalUser } from "@/db/auth";
import { logout } from "@/db/auth";

import { useState } from "react";
import { toast } from "sonner";

import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { GITHUB_REPO_URL } from "@/constants";

export default function ProfileDropdown() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { setTheme } = useTheme();
  const navigate = useNavigate();

  const { data: profileData, isLoading: profileIsLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: getLocalUser,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
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

  const message =
    timeMessage() +
    ", " +
    profileData?.data.session?.user.user_metadata.name +
    "!";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant={"outline"} className="rounded-full">
          {profileIsLoading ? (
            <div className="h-full w-full animate-pulse rounded-full bg-gray-900" />
          ) : (
            <User className="h-5 w-5" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>{message}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link to="/profile">
            <ProfileItem Icon={User} text="Profile" />
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <SunMoon className="mr-2 h-4 w-4" />
              <span>Theme</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <ProfileItem
                  Icon={Sun}
                  text="Light"
                  onClick={() => setTheme("light")}
                />
                <ProfileItem
                  Icon={Moon}
                  text="Dark"
                  onClick={() => setTheme("dark")}
                />
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <a href={GITHUB_REPO_URL} rel="noreferrer noopener" target="_blank">
          <ProfileItem Icon={Github} text="GitHub" />
        </a>
        <DropdownMenuSeparator />
        <ProfileItem
          Icon={LogOut}
          text="Log Out"
          onClick={handleLogout}
          isLoading={isLoading}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
