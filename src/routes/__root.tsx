import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import NotFound from "@/views/NotFound";

export const Route = createRootRoute({
  component: () => (
    <React.Fragment>
      <main className="h-screen max-h-screen w-screen bg-gray-100 text-black dark:bg-gray-950 dark:text-white">
        <Outlet />
      </main>
    </React.Fragment>
  ),
  notFoundComponent: NotFound,
});
