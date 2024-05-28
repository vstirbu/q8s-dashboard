export const runtime = "edge";

export async function POST(req: Request) {
  const body = await req.json();

  const {
    uid,
    userInfo: { username },
  } = body.request;

  //   console.log(body.request.object.metadata.labels["qubernetes.dev/user"]);

  const value = username.split(":").slice(-1)[0];

  console.log(`Setting user label to ${value}`);

  const patch = [];

  if (!body.request.object.metadata.labels) {
    console.log("No labels found, adding labels");

    patch.push({
      op: "add",
      path: "metadata.labels",
      value: {
        "qubernetes.dev/user": value,
      },
    });
  } else if (!body.request.object.metadata.labels["qubernetes.dev/user"]) {
    console.log("No user label found, adding user label");

    patch.push({
      op: "add",
      path: 'metadata.labels["qubernetes.dev/user"]',
      value,
    });
  } else {
    console.log("User label found, updating user label");

    patch.push({
      op: "replace",
      path: 'metadata.labels["qubernetes.dev/user"]',
      value,
    });
  }

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
