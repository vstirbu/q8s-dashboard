import { signIn } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "./ui/button";
import { Github } from "lucide-react";

export function SignIn() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("github", {
          redirectTo: "/dashboard",
        });
      }}
    >
      <Button type="submit" variant="outline" className="w-full">
        <Github className="w-5 h-5 mr-2" />
        Signin with GitHub
      </Button>
    </form>
  );
}
