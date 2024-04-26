import TimeAgo from "@/components/time-ago";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getNodes } from "@/lib/k8s";
import { Cpu, Laptop, Server } from "lucide-react";

export default async function ClusterNodes() {
  const nodes = await getNodes();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cluster nodes</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-8">
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
              <TimeAgo
                date={node.metadata?.creationTimestamp?.toUTCString()!}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
