import { UserInfo } from "@/components/user-info";
import { auth } from "@/lib/auth";

export default async function Profile() {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return null;
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Profile</h1>
      </div>
      <div className="flex gap-4">
        <UserInfo user={user} className="max-w-md" />
      </div>
    </main>
  );
}
