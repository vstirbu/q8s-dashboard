export async function POST(req: Request) {
  const body = await req.json();

  const {
    uuid,
    userInfo: { username },
  } = body.request;

  return Response.json({
    apiVersion: "admission.k8s.io/v1",
    kind: "AdmissionReview",
    response: {
      uid: body.request.uid,
      allowed: true,
      patch: Buffer.from(
        JSON.stringify({
          op: "add",
          path: 'metadata.labels."qubernetes.dev/user"',
          value: username.split(":").slice(-1),
        })
      ).toString("base64"),
      patchType: "JSONPatch",
    },
  });
}
