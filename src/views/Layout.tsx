import { Outlet } from "@tanstack/react-router";
import { PanelLeft } from "lucide-react";

import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { cn } from "@/lib/utils";

/**
 * Floating control shown only when the sidebar is collapsed: a page emoji that
 * swaps to an expand button on hover.
 */
function ExpandButton() {
  const { open, toggleSidebar } = useSidebar();

  if (open) return null;

  return (
    <button
      onClick={toggleSidebar}
      title="Expand sidebar"
      className="group/expand border-sidebar-border fixed top-3 left-3 z-20 flex h-9 w-9 items-center justify-center rounded-lg border bg-white text-lg dark:bg-zinc-900"
    >
      <span className="group-hover/expand:hidden">📄</span>
      <PanelLeft className="hidden h-4 w-4 group-hover/expand:block" />
      <span className="sr-only">Expand sidebar</span>
    </button>
  );
}

function LayoutContent() {
  const { open } = useSidebar();

  return (
    <>
      <AppSidebar />
      <ExpandButton />
      <main className="h-svh min-w-0 flex-1 p-2">
        <div
          className={cn(
            "scrollbar-thumb-accent flex h-full flex-row justify-center gap-8 overflow-y-auto rounded-xl border-2 border-black bg-white dark:border-white dark:bg-zinc-900",
            !open && "pl-12",
          )}
        >
          <Outlet />
        </div>
      </main>
    </>
  );
}

export default function Layout() {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
}
