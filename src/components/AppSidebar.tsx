import { Link, useMatchRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  FileText,
  GitBranch,
  LayoutGrid,
  LogOut,
  Moon,
  MoreVertical,
  PanelLeft,
  Plus,
  Sun,
  User,
  Waypoints,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { useTheme } from "@/components/theme-provider";
import { createNewPage, getPages } from "@/db/draw";
import { getLocalUser, logout } from "@/db/auth";
import { GITHUB_REPO_URL } from "@/constants";
import { shortRelativeTime } from "@/lib/utils";

const RECENTS_LIMIT = 5;

function NewPageButton() {
  const navigate = useNavigate();

  async function createPlainPage() {
    const res = await createNewPage();
    if (res.data && res.data[0]?.page_id) {
      navigate({ to: "/page/$id", params: { id: res.data[0].page_id } });
      toast("Successfully created a new page!");
    }
    if (res.error) {
      toast("An error occured", { description: `Error: ${res.error.message}` });
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton className="justify-start bg-sidebar-primary font-semibold text-sidebar-primary-foreground hover:bg-sidebar-primary/90 hover:text-sidebar-primary-foreground">
          <Plus />
          <span>New Page</span>
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-52">
        <DropdownMenuItem onClick={createPlainPage}>
          Plain Page
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate({ to: "/mermaid" })}>
          Mermaid Syntax Diagram
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function RecentPages() {
  const matchRoute = useMatchRoute();

  const { data, isLoading } = useQuery({
    queryKey: ["pages"],
    queryFn: async () => {
      const user_session = await getLocalUser();
      if (!user_session.error && user_session.data.session) {
        return getPages(user_session.data.session.user?.id ?? "");
      }
      return null;
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const recents = data?.data?.slice(0, RECENTS_LIMIT) ?? [];

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="flex items-center justify-between">
        <span>Recent</span>
        <Link
          to="/pages"
          className="text-xs font-normal text-sidebar-foreground/60 hover:underline"
        >
          View all
        </Link>
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <SidebarMenuItem key={i}>
                <SidebarMenuSkeleton showIcon />
              </SidebarMenuItem>
            ))
          ) : recents.length > 0 ? (
            recents.map((page) => (
              <SidebarMenuItem key={page.page_id}>
                <SidebarMenuButton
                  asChild
                  isActive={
                    !!matchRoute({ to: "/page/$id", params: { id: page.page_id } })
                  }
                >
                  <Link to="/page/$id" params={{ id: page.page_id }}>
                    <FileText />
                    <span className="font-accent">
                      {page.name || "Untitled"}
                    </span>
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuBadge>
                  {shortRelativeTime(page.updated_at)}
                </SidebarMenuBadge>
              </SidebarMenuItem>
            ))
          ) : (
            <p className="px-2 py-1 text-xs text-sidebar-foreground/60">
              No pages yet
            </p>
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

function ProfileFooter() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const { data: profileData } = useQuery({
    queryKey: ["profile"],
    queryFn: getLocalUser,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const user = profileData?.data.session?.user;
  const name = (user?.user_metadata?.name as string) || "Account";
  const email = user?.email ?? "";
  const initial = name.charAt(0).toUpperCase();

  async function handleLogout() {
    const res = await logout();
    if (res.error) {
      toast("An error occured", { description: res.error.message });
      return;
    }
    toast("Logged out!");
    navigate({ to: "/" });
  }

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton size="lg" className="flex-1">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-sidebar-border text-sm font-bold">
              {initial}
            </span>
            <span className="flex min-w-0 flex-col text-left">
              <span className="truncate text-sm font-semibold">{name}</span>
              <span className="truncate text-xs text-sidebar-foreground/60">
                {email}
              </span>
            </span>
            <MoreVertical className="ml-auto h-4 w-4 shrink-0 text-sidebar-foreground/60" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" side="top" className="w-56">
          <DropdownMenuItem onClick={() => navigate({ to: "/profile" })}>
            <User className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a href={GITHUB_REPO_URL} rel="noreferrer noopener" target="_blank">
              <GitBranch className="mr-2 h-4 w-4" />
              GitHub
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 shrink-0"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        title="Toggle theme"
      >
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    </div>
  );
}

export function AppSidebar() {
  const matchRoute = useMatchRoute();
  const { toggleSidebar } = useSidebar();

  return (
    <Sidebar variant="sidebar" collapsible="offcanvas">
      <SidebarHeader>
        <div className="flex items-center justify-between px-1">
          <Link to="/pages" className="font-accent text-2xl font-bold">
            Draw
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={toggleSidebar}
            title="Collapse sidebar"
          >
            <PanelLeft className="h-4 w-4" />
            <span className="sr-only">Collapse sidebar</span>
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <NewPageButton />
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={!!matchRoute({ to: "/pages" })}>
                  <Link to="/pages">
                    <LayoutGrid />
                    <span>All Pages</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={!!matchRoute({ to: "/mermaid" })}
                >
                  <Link to="/mermaid">
                    <Waypoints />
                    <span>Mermaid</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <RecentPages />
      </SidebarContent>

      <SidebarFooter>
        <ProfileFooter />
      </SidebarFooter>
    </Sidebar>
  );
}
