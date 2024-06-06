import { auth } from "@/lib/auth";

import KubernetesConfig from "@/components/cards/cluster-config";

export default async function Dashboard() {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return null;
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Settings</h1>
      </div>
      {/* <div
            className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
            x-chunk="dashboard-02-chunk-1"
          >
            <div className="flex flex-col items-center gap-1 text-center">
              <p className="text-sm text-muted-foreground">
                Download configuration files to get started.
              </p>
              <Button className="mt-4">Download</Button>
            </div>
          </div> */}
      <div className="flex gap-4">
        <KubernetesConfig className="max-w-md" />
      </div>
    </main>
  );
}
