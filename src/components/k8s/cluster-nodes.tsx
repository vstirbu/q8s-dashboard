import TimeAgo from "@/components/time-ago";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getNodes } from "@/lib/k8s";
import { Cpu, Laptop, Server } from "lucide-react";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { type V1Node } from "@kubernetes/client-node";

const sleep = (value: number) =>
  new Promise((resolve) => setTimeout(resolve, value));

async function NodesList() {
  const nodes = await new Promise<V1Node[]>(async (resolve) => {
    const timeout = setTimeout(() => {}, 10000);

    getNodes().then(async (nodes) => {
      await sleep(1000);
      clearTimeout(timeout);
      resolve(nodes);
    });
  });

  return (
    <div className="grid gap-8">
      {nodes.map((node) => (
        <div key={node.metadata!.name} className="flex items-center gap-4">
          <Avatar className="hidden h-9 w-9 sm:flex">
            <AvatarImage src="/avatars/01.png" alt="Avatar" />
            <AvatarFallback>
              {
                // @ts-ignore
                node.metadata?.labels["nvidia.com/gpu.product"]?.includes(
                  "Laptop"
                ) ? (
                  <Laptop className="h-5 w-5" />
                ) : (
                  <Server className="h-5 w-5" />
                )
              }
            </AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <p className="text-sm font-medium leading-none">
              {node.metadata!.name}
            </p>
            <div className="flex items-center gap-1">
              <Cpu className="h-4 w-4" />
              <div className="text-sm text-muted-foreground">
                {node.status?.capacity?.cpu}{" "}
                {node.status?.nodeInfo?.architecture}
                {", "}
                {
                  // @ts-ignore
                  node.metadata?.labels["nvidia.com/gpu.product"]!
                }
              </div>
            </div>
          </div>
          <div className="ml-auto font-medium">
            <TimeAgo date={node.metadata?.creationTimestamp?.toUTCString()!} />
          </div>
        </div>
      ))}
    </div>
  );
}

function NodeSkeleton() {
  return (
    <div className="flex items-center gap-4">
      <Skeleton className="h-9 w-9 rounded-full" />
      {/* <Avatar className="hidden h-9 w-9 sm:flex">
        <AvatarImage src="/avatars/01.png" alt="Avatar" />
        <AvatarFallback>
          {
            // @ts-ignore
            node.metadata?.labels["nvidia.com/gpu.product"]?.includes(
              "Laptop"
            ) ? (
              <Laptop className="h-5 w-5" />
            ) : (
              <Server className="h-5 w-5" />
            )
          }
        </AvatarFallback>
      </Avatar> */}
      <div className="grid gap-1">
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="flex h-4 w-[200px]" />
      </div>
      <Skeleton className="ml-auto h-4 w-[100px]" />
      {/* <div className="ml-auto font-medium">
        <TimeAgo date={node.metadata?.creationTimestamp?.toUTCString()!} />
      </div> */}
    </div>
  );
}

export default function ClusterNodes() {
  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Cluster nodes</CardTitle>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<NodeSkeleton />}>
          <NodesList />
        </Suspense>
      </CardContent>
    </Card>
  );
}
