export const runtime = "edge";

export async function POST(req: Request) {
  const body = await req.json();

  const {
    uid,
    userInfo: { username },
  } = body.request;

  const value = username.split(":").slice(-1);

  const patch = [
    {
      op: "add",
      path: 'metadata.labels["qubernetes.dev/user"]',
      value,
    },
  ];

  return Response.json({
    apiVersion: "admission.k8s.io/v1",
    kind: "AdmissionReview",
    request: body.request,
    response: {
      uid,
      allowed: true,
      patch: Buffer.from(JSON.stringify(patch)).toString("base64"),
      patchType: "JSONPatch",
    },
  });
}
