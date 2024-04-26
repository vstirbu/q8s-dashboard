import TimeAgo from "@/components/time-ago";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getNodes } from "@/lib/k8s";
import { Laptop, Server } from "lucide-react";

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
                {node.metadata?.labels["nvidia.com/gpu.product"]?.includes(
                  "Laptop"
                ) ? (
                  <Laptop className="h-5 w-5" />
                ) : (
                  <Server className="h-5 w-5" />
                )}
              </AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <p className="text-sm font-medium leading-none">
                {node.metadata!.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {node.status?.capacity?.cpu} CPU{" "}
                {node.status?.nodeInfo?.architecture}{" "}
                {node.metadata?.labels["nvidia.com/gpu.product"]!}
              </p>
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
