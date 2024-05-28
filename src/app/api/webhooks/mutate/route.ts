export const runtime = "edge";

export async function POST(req: Request) {
  const body = await req.json();

  const {
    uid,
    userInfo: { username },
  } = body.request;

  //   console.log(body.request.object.metadata.labels["qubernetes.dev/user"]);

  const value = username.split(":").slice(-1);

  let op = "add";

  try {
    if (body.request.object.metadata.labels["qubernetes.dev/user"]) {
      op = "replace";
    }
  } catch (e) {}

  const patch = [
    {
      op,
      path: 'metadata.labels["qubernetes.dev/user"]',
      value,
    },
  ];

  console.log(JSON.stringify(patch, null, 2));

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
