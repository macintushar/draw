import { LoaderIcon } from "lucide-react";

export default function Loader() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-row gap-2">
        <LoaderIcon className="animate-spin" />
        <h1>Loading...</h1>
      </div>
    </div>
  );
}
