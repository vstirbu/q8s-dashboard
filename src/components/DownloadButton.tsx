"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useState } from "react";

export function DownloadButton(props: {
  downloadConfig: () => Promise<string | undefined>;
}) {
  const [pending, setPending] = useState(false);

  return (
    <Button
      size="sm"
      // variant="outline"
      type="submit"
      disabled={pending}
      onClick={async () => {
        setPending(true);
        const config = await props.downloadConfig();

        if (typeof config === "string") {
          const blob = new Blob([config], { type: "text/yaml" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "config";
          a.click();
          URL.revokeObjectURL(url);
        } else {
          console.error("Failed to download config");
        }

        setPending(false);
      }}
    >
      <Download className="mr-2 h-4 w-4" />
      Download
    </Button>
  );
}
