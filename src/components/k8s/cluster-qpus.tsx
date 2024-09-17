import TimeAgo from "@/components/time-ago";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getNodes } from "@/lib/k8s";
import { Clock, Cpu, Laptop, MemoryStick, Orbit, Server } from "lucide-react";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { type V1Node } from "@kubernetes/client-node";
import { Badge } from "../ui/badge";

const sleep = (value: number) =>
  new Promise((resolve) => setTimeout(resolve, value));

async function NodesList() {
  const nodes = await new Promise<V1Node[]>(async (resolve) => {
    const timeout = setTimeout(() => {}, 10000);

    getNodes().then(async (nodes) => {
      await sleep(1000);
      clearTimeout(timeout);

      resolve(
        nodes.filter(
          (node) => node.status?.capacity?.["nvidia.com/gpu"] !== undefined
        )
      );
    });
  });

  return (
    <div className="grid gap-8">
      {nodes.map((node) => {
        const ready = node.status?.conditions?.some(
          (c) => c.type === "Ready" && c.reason === "KubeletReady"
        );

        return (
          <div
            key={node.metadata?.name}
            className={
              ready
                ? "flex items-center gap-4"
                : "flex items-center gap-4 text-muted-foreground"
            }
          >
            <Avatar className="hidden h-9 w-9 sm:flex">
              {/* <AvatarImage src="/avatars/01.png" alt="Avatar" /> */}
              <AvatarFallback>
                {/* {
                  // @ts-ignore
                  node.metadata?.labels["nvidia.com/gpu.product"]?.includes(
                    "Laptop"
                  ) ? (
                    <Laptop className="h-8 w-8" />
                  ) : (
                    <Server className="h-8 w-8" />
                  )
                } */}
                <Server className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <div className="flex items-center">
                <p className="text-lg font-medium leading-none">
                  {node.metadata?.name}
                </p>
                {ready ? (
                  <Badge
                    className="mx-2  bg-green-700 hover:bg-green-600 text-white text-xs"
                    variant="default"
                  >
                    Active
                  </Badge>
                ) : (
                  <Badge className="mx-2" variant="destructive">
                    Active
                  </Badge>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-1">
                  <Orbit className="h-4 w-4" />
                  <span className="text-sm">Qubits:</span>
                  <span>29</span>
                </div>
                <div className="flex items-center gap-1">
                  <Cpu className="h-4 w-4" />
                  <span className="text-sm">
                    Cores ({node.status?.nodeInfo?.architecture}):
                  </span>
                  <span>{node.status?.capacity?.cpu}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <MemoryStick className="h-4 w-4" />
                <div className="text-sm">
                  {
                    // @ts-ignore
                    node.metadata?.labels["nvidia.com/gpu.product"]
                  }
                </div>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <TimeAgo
                  date={
                    node.metadata?.creationTimestamp?.toUTCString() as string
                  }
                />
              </div>
            </div>
            <div className="ml-auto font-medium"></div>
          </div>
        );
      })}
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

export default function ClusterQPUs() {
  return (
    <>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<NodeSkeleton />}>
            <NodesList />
          </Suspense>
        </CardContent>
      </Card>
    </>
  );
}
