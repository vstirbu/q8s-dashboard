import { signOut } from "@/lib/auth";

export function SignOut() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/" });
      }}
    >
      <button type="submit">Logout</button>
    </form>
  );
}
