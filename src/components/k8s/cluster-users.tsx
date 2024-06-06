"use client";

/**
 * v0 by Vercel.
 * @see https://v0.dev/t/aJOW3Nr7cYC
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import useSWR from "swr";
import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card";
import { Skeleton } from "../ui/skeleton";

export default function UsersSummary() {
  const { data: { total, users } = {}, isLoading } = useSWR<{
    total: number;
    users: number;
  }>("/api/stats/weekly", async () =>
    fetch("/api/stats/weekly").then((res) => res.json())
  );

  if (isLoading) {
    return (
      <Card className="max-w-xs">
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-4 py-8">
          <Skeleton className="text-5xl h-12 w-[20px]" />
          <Skeleton className="h-3 w-[150px]" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-xs">
      <CardHeader>
        <CardTitle>Users</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center gap-4 py-8">
        <div className="text-5xl font-bold">{total}</div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <span className="font-medium">Average: </span>
          {users} users per week
        </div>
      </CardContent>
    </Card>
  );
}
