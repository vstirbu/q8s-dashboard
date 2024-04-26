import { signIn } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "./ui/button";

export function SignIn() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("auth0", {
          redirectTo: "/dash",
        });
      }}
    >
      <Button type="submit" variant="outline" className="w-full">
        Sign in
      </Button>
    </form>
  );
}
