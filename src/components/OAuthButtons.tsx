import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { signInWithOAuth } from "@/db/auth";
import { useState } from "react";
import { toast } from "sonner";

export default function OAuthButtons() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function signInWithGoogle() {
    setIsLoading(true);
    const data = await signInWithOAuth("google");

    if (data.error) {
      setIsLoading(false);
      toast("An error occured", { description: data.error.message });
    }
  }

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex items-center gap-2">
        <Separator className="flex-1" />
        <span className="text-muted-foreground text-xs">OR</span>
        <Separator className="flex-1" />
      </div>
      <Button
        className="w-full"
        type="button"
        variant="outline"
        onClick={signInWithGoogle}
        isLoading={isLoading}
        loadingText="Redirecting"
      >
        Continue with Google
      </Button>
    </div>
  );
}
