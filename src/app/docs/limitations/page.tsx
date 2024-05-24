import GettingStarted, {
  // @ts-ignore
  frontmatter,
} from "@/app/docs/limitations/content.mdx";
import { ScrollArea } from "@/components/ui/scroll-area";

export default async function GettingStartedPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">
          {frontmatter.title}
        </h1>
      </div>
      <ScrollArea className="h-[650px] w-full rounded-md border p-4">
        <div className="mx-auto max-w-3xl px-4 md:px-6 lg:px-8">
          <div className="space-y-6 prose prose-md dark:prose-invert">
            <GettingStarted />
          </div>
        </div>
      </ScrollArea>
    </main>
  );
}
