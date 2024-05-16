/**
 * v0 by Vercel.
 * @see https://v0.dev/t/aJOW3Nr7cYC
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card";
import prisma from "@/lib/db";

export default async function UsersSummary() {
  const users = await prisma.user.count();

  return (
    <Card className="max-w-xs">
      <CardHeader>
        <CardTitle>Cluster Users</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center gap-4 py-8">
        <div className="text-5xl font-bold">{users}</div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <span className="font-medium">Average: </span>4 users per week
        </div>
      </CardContent>
    </Card>
  );
}
