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
    <main className="flex h-full w-full flex-col bg-white dark:bg-gray-950 font-virgil">
      <header className="flex h-16 items-center justify-center border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <h1 className="text-sm font-semibold text-gray-900 dark:text-gray-50">
            ⭐ Star us on{" "}
          </h1>
          <a href={GITHUB_REPO_URL} className="font-semibold text-gray-900 hover:underline dark:text-gray-50">
            GitHub
          </a>
        </div>
      </header>
      <div className="flex h-full w-full flex-col items-center justify-center px-4">
        <div className="flex flex-col items-center gap-8 max-w-2xl">
          <h1 className="text-5xl font-black text-gray-900 dark:text-gray-50 sm:text-6xl">
            Draw
          </h1>
          <p className="text-center text-xl font-medium leading-relaxed text-gray-700 dark:text-gray-300 sm:text-2xl">
            The digital drawing tool that enables you to create, edit, and share
            your drawings across all your devices.
          </p>
          <Button
            isLoading={isLoading}
            loadingText=""
            className="w-full sm:w-fit px-8 text-base font-semibold"
            onClick={() => action(data ? true : false)}
          >
            {data ? "View your pages" : "Sign In"}
          </Button>
        </div>
      </div>
      <footer className="flex h-16 items-center justify-center border-t border-gray-200 dark:border-gray-800">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Made by{" "}
          <a
            href="https://github.com/macintushar"
            className="font-semibold text-gray-900 hover:underline dark:text-gray-50"
          >
            Macintushar
          </a>
        </p>
      </footer>
    </main>
  );
}
