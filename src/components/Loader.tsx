import { LoaderIcon } from "lucide-react";

export default function Loader() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <LoaderIcon className="h-6 w-6 animate-spin text-gray-900 dark:text-gray-50" />
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    </div>
  );
}
