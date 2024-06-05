"use server";

import { getSecret } from "@/lib/k8s";
import { track } from "@vercel/analytics/server";
import { protectedAction } from "./trpc";

function base64decode(base64: string): string {
  return Buffer.from(base64, "base64").toString("utf-8");
}

export const downloadConfig = protectedAction
  .meta({
    span: "downloadConfig",
  })
  .query(async ({ ctx }) => {
    const secret = await getSecret(ctx.user.id!);

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

    await track("downloaded-k8s-config", {
      user: ctx.user.id!,
    });

    return config.trim();
  });
