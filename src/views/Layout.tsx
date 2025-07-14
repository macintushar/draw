import Navbar from "./Navbar";
import { Outlet } from "@tanstack/react-router";

export default function Layout() {
  return (
    <div className="flex h-screen w-full flex-col overflow-hidden p-1">
      <Navbar />
      <div className="w-full flex-1 overflow-hidden p-3 pt-1">
        <div className="h-full max-h-full w-full overflow-hidden rounded-xl border-2 border-black bg-gray-200/60 dark:border-white dark:bg-gray-900">
          <div className="h-full w-full overflow-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
