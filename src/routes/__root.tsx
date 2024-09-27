import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import NotFound from "@/views/NotFound";
import { TooltipProvider } from "@/components/ui/tooltip";

export const Route = createRootRoute({
  component: () => (
    <React.Fragment>
      <main className="h-screen max-h-screen w-screen bg-gray-100 text-black dark:bg-gray-950 dark:text-white">
        <TooltipProvider>
          <Outlet />
        </TooltipProvider>
      </main>
    </React.Fragment>
  ),
  notFoundComponent: NotFound,
});
