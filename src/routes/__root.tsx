import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import NotFound from "@/views/NotFound";

export const Route = createRootRoute({
  component: () => (
    <React.Fragment>
      <main className="h-screen w-screen max-h-screen bg-gray-100 dark:bg-gray-950 text-black dark:text-white">
        <Outlet />
      </main>
    </React.Fragment>
  ),
  notFoundComponent: NotFound,
});
