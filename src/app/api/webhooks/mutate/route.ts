export async function POST(req: Request) {
  const body = await req.json();

  console.log(body);

  return Response.json({
    apiVersion: "admission.k8s.io/v1",
    kind: "AdmissionReview",
    response: {
      uid: body.request.uid,
      allowed: true,
    },
  });
}
