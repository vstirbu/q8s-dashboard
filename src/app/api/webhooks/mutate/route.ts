export async function POST(req: Request) {
  const body = await req.json();

  const {
    uid,
    userInfo: { username },
  } = body.request;

  const value = username.split(":").slice(-1);

  console.log("username", value);

  return Response.json({
    apiVersion: "admission.k8s.io/v1",
    kind: "AdmissionReview",
    response: {
      uid,
      allowed: true,
      patch: [
        Buffer.from(
          JSON.stringify({
            op: "add",
            //   path: "metadata.labels.qubernetes.dev~1user",
            path: 'metadata/labels/"qubernetes.dev/user"',
            value,
          })
        ).toString("base64"),
      ],
      patchType: "JSONPatch",
    },
  });
}
