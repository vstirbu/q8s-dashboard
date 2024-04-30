import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardFooter,
  Card,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { DownloadButton } from "../DownloadButton";
import { downloadConfig } from "@/actions/kubernetes";

export default function KubernetesConfig(props: { className?: string }) {
  return (
    <Card className={props.className}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Download className="h-5 w-5" />
          <CardTitle>Kubernetes Config</CardTitle>
        </div>
        <CardDescription>
          The configuration file allows you to connect to the cluster. Save it
          to your home folder: <code>.kube/config</code>.
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-end">
        <DownloadButton downloadConfig={downloadConfig} />
      </CardFooter>
    </Card>
  );
}
