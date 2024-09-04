import { Button } from "@/components/ui/button";
import isAuthenticated from "@/hooks/isAuthenticated";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

export default function HomePage() {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["user", "authenticated"],
    queryFn: () => isAuthenticated(),
  });

  function action(authenticated: boolean) {
    if (authenticated === true) {
      navigate({ to: "/pages" });
    } else {
      navigate({ to: "/login", replace: true });
    }
  }
  return (
    <main className="h-full w-full flex justify-center items-center p-2">
      <div className="sm:w-1/2 w-full flex items-center flex-col gap-y-8 h-fit ">
        <h1 className="text-6xl font-black">Draw</h1>
        <h1 className="text-5xl text-center font-medium">
          The digital drawing tool that enables you to create, edit, and share
          your drawings across all your devices.
        </h1>
        <Button
          isLoading={isLoading}
          loadingText=""
          className="w-2/3 font-semibold text-lg"
          onClick={() => action(data ? true : false)}
        >
          {data ? "View your pages" : "Sign In"}
        </Button>
      </div>
    </main>
  );
}
