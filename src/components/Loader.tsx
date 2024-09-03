import { LoaderIcon } from "lucide-react";

export default function Loader() {
  return (
    <div className="h-full w-full flex justify-center items-center">
      <div className="flex flex-row gap-2">
        <LoaderIcon className="animate-spin" />
        <h1>Loading...</h1>
      </div>
    </div>
  );
}
