import { Button } from "@/components/ui/button";
import { GITHUB_REPO_URL } from "@/constants";
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
    <main className="flex h-full w-full flex-col bg-gradient-to-r from-gray-900 via-gray-950 to-gray-900 p-2 font-virgil">
      <footer>
        <div className="flex h-16 w-full items-center justify-center">
          <div className="flex flex-row items-center justify-center align-middle">
            <h1 className="text-2xl text-white">
              ⭐ Star us on{" "}
              <a href={GITHUB_REPO_URL} className="font-semibold underline">
                GitHub
              </a>
            </h1>
          </div>
        </div>
      </footer>
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex h-fit w-full flex-col items-center gap-y-8 sm:w-1/2">
          <h1 className="text-6xl font-black">Draw</h1>
          <h1 className="text-center text-5xl font-medium">
            The digital drawing tool that enables you to create, edit, and share
            your drawings across all your devices.
          </h1>
          <Button
            isLoading={isLoading}
            loadingText=""
            className="w-2/3 text-lg font-semibold"
            onClick={() => action(data ? true : false)}
          >
            {data ? "View your pages" : "Sign In"}
          </Button>
        </div>
      </div>
      <footer>
        <div className="flex h-16 w-full items-center justify-center">
          <div className="flex flex-row items-center justify-center align-middle">
            <h1 className="text-lg text-white">
              Made by{" "}
              <a
                href="https://github.com/macintushar"
                className="font-semibold underline"
              >
                Macintushar
              </a>
            </h1>
          </div>
        </div>
      </footer>
    </main>
  );
}
