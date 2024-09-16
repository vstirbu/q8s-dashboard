import { getNodes } from "@/lib/k8s";

export async function GET() {
  const nodes = await getNodes("nvidia.com/gpu.count");

  const ready = nodes.filter((node) =>
    node.status?.conditions?.some(
      (c) => c.type === "Ready" && c.reason === "KubeletReady"
    )
  );

  return Response.json({
    status: ready.length === 0 ? "error" : "success",
    code: ready.length === 0 ? 500 : 200,
  });
}

export const revalidate = 60;
