import { getSecret } from "@/lib/k8s";
import { auth } from "@/lib/auth";

export async function downloadConfig(): Promise<string | undefined> {
  "use server";

  const session = await auth();
  const user = session?.user;

  if (!user) {
    throw new Error("You must be signed in to perform this action");
  }

  const secret = await getSecret(user.id!);

  const config = `
apiVersion: v1
kind: Config
clusters:
  - name: default
    cluster:
      server: 'https://159.89.15.85:6443'
      certificate-authority-data: >-
        ${secret.data!["ca.crt"]}
users:
  - name: user
    user:
      token: >-
        ${base64decode(secret.data!.token)}
contexts:
  - name: default
    context:
      user: user
      cluster: default
      namespace: default
current-context: default
`;

  return config;
}

function base64decode(base64: string): string {
  return Buffer.from(base64, "base64").toString("utf-8");
}
