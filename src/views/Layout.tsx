import Navbar from "./Navbar";
import { Outlet } from "@tanstack/react-router";

export default function Layout() {
  return (
    <div className="flex flex-col h-full w-full p-1">
      <Navbar />
      <div className="w-full h-full p-3 pt-1">
        <div className="flex flex-row gap-8 rounded-xl justify-center h-full bg-gray-200/60 dark:bg-gray-900 py-2 px-3 border-2 dark:border-white border-black">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
