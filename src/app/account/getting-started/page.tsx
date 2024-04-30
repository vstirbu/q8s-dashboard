import { auth } from "@/lib/auth";

import GettingStarted, {
  // @ts-ignore
  frontmatter,
} from "@/app/account/getting-started/getting-started-docker.mdx";
import { ScrollArea } from "@/components/ui/scroll-area";

export default async function Dashboard() {
  const session = await auth();
  const user = session?.user;

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">
          {frontmatter.title}
        </h1>
      </div>

      {/* <div
            className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
            // x-chunk="dashboard-02-chunk-1"
          >
            <ScrollArea className="h-[700px] w-full max-w-3xl prose prose-md dark:prose-invert">
              <GettingStarted />
            </ScrollArea>
            <div className="flex flex-col p-4"></div>
          </div> */}
      <ScrollArea className="h-[600px] w-full rounded-md border p-4">
        <div className="mx-auto max-w-3xl px-4 md:px-6 lg:px-8">
          <div className="space-y-6 prose prose-md dark:prose-invert">
            <GettingStarted />
          </div>
        </div>
      </ScrollArea>
    </main>
  );
}
