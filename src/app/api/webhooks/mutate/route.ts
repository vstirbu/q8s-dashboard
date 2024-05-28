export const runtime = "edge";

export async function POST(req: Request) {
  const body = await req.json();

  const {
    uid,
    userInfo: { username },
  } = body.request;

  //   console.log(body.request.object.metadata.labels["qubernetes.dev/user"]);

  const value = username.split(":").slice(-1)[0];

  const patch = [];

  if (!body.request.object.metadata.labels) {
    patch.push({
      op: "add",
      path: "/metadata/labels",
      value: {
        "qubernetes.dev/user": value,
      },
    });
  } else {
    patch.push({
      op: "replace",
      path: "/metadata/labels",
      value: {
        ...body.request.object.metadata.labels,
        "qubernetes.dev/user": value,
      },
    });
  }

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
