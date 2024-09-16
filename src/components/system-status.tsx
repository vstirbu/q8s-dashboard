"use client";

import { FC } from "react";
import useSWR from "swr";

type SeverityLevel = "critical" | "warning" | "stable" | "operational";

interface SystemStatusProps {
  severity: SeverityLevel;
}

const severityConfig: Record<
  SeverityLevel,
  { color: string; description: string }
> = {
  critical: {
    color: "red-500",
    description: "Critical issue: QPU unavailable",
  },
  warning: { color: "yellow-500", description: "Potential issues" },
  stable: { color: "green-500", description: "Stable" },
  operational: { color: "blue-500", description: "All systems operational" },
};

export const SystemStatus: FC<SystemStatusProps> = ({ severity }) => {
  // const { color, description } = severityConfig[severity];

  const { data: { status, code } = { status: "success", code: 200 } } = useSWR<{
    status: "success" | "error";
    code: 200 | 500;
  }>("/api/status", async () => fetch("/api/status").then((res) => res.json()));

  const { color, description } =
    severityConfig[status === "success" ? "operational" : "critical"];

  return (
    // <div className="flex items-center space-x-2 p-4 bg-gray-100 rounded-lg shadow-md">
    <div className="flex items-center space-x-2">
      <div className={`w-3 h-3 rounded-full bg-${color}`} aria-hidden="true" />
      {/* <span className="font-medium text-gray-700">System Status:</span> */}
      {/* <span className="text-gray-600">{description}</span> */}
      <span className={`text-${color}`}>{description}</span>
      {/* <span className="text-blue-500">{description}</span> */}
    </div>
  );
};
