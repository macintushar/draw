import Navbar from "./Navbar";
import { Outlet } from "@tanstack/react-router";

export default function Layout() {
  return (
    <div className="flex h-full w-full flex-col bg-white dark:bg-gray-950">
      <Navbar />
      <div className="h-full w-full overflow-hidden">
        <div className="flex h-full flex-row justify-center gap-6 overflow-auto bg-white p-6 dark:bg-gray-950">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
