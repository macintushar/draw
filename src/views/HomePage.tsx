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
    <main className="h-full w-full">
      Hello!
      <Button
        isLoading={isLoading}
        loadingText=""
        onClick={() => action(data ? true : false)}
      >
        {data ? "View your pages" : "Sign In"}
      </Button>
    </main>
  );
}
