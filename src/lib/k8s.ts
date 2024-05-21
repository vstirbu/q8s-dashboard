import * as k8s from "@kubernetes/client-node";
import * as yaml from "yaml";

function getKubeConfig() {
  const kc = new k8s.KubeConfig();
  kc.loadFromString(
    Buffer.from(process.env.KUBECONFIG!, "base64").toString("utf-8")
  );

  // console.log("KubeConfig loaded");
  return kc;
}

export async function getJobs(id: string): Promise<k8s.V1Job[]> {
  const kc = getKubeConfig();

  const client = kc.makeApiClient(k8s.BatchV1Api);

  const response = await client.listNamespacedJob(
    "default",
    undefined,
    undefined,
    undefined,
    undefined,
    [
      `qubernetes.dev/user=sa-for-user-${id}`,
      "qubernetes.dev/job.type=jupyter",
    ].join(",")
  );

  return response.body.items;
}

export async function deleteJob(name: string) {
  const kc = getKubeConfig();

  const batchClient = kc.makeApiClient(k8s.BatchV1Api);

  await batchClient.deleteNamespacedJob(
    name,
    "default",
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    {
      propagationPolicy: "Foreground",
    }
  );

  const coreClient = kc.makeApiClient(k8s.CoreV1Api);

  await coreClient.deleteNamespacedConfigMap(name, "default");
}

export async function getNodes(label?: string): Promise<k8s.V1Node[]> {
  const kc = getKubeConfig();

  const client = kc.makeApiClient(k8s.CoreV1Api);

  const response = await client.listNode(
    undefined,
    undefined,
    undefined,
    undefined,
    label
  );
  return response.body.items;
}

export async function getSecret(user: string): Promise<k8s.V1Secret> {
  const kc = getKubeConfig();

  const client = kc.makeApiClient(k8s.CoreV1Api);

  const response = await client.readNamespacedSecret(
    `token-${serviceAccountName(user)}`,
    "default"
  );

  return response.body;
}

/**
 * Replicate the functionality of `kubectl apply`.  That is, create the resources defined in the `specFile` if they do
 * not exist, patch them if they do exist.
 *
 * @param specPath File system path to a YAML Kubernetes spec.
 * @return Array of resources created
 */
export async function apply(
  specString: string
): Promise<k8s.KubernetesObject[]> {
  const kc = getKubeConfig();

  const client = k8s.KubernetesObjectApi.makeApiClient(kc);

  const specs: k8s.KubernetesObject[] = yaml
    .parseAllDocuments(specString)
    .map((s) => s.toJS());
  const validSpecs = specs.filter((s) => s && s.kind && s.metadata);
  const created: k8s.KubernetesObject[] = [];
  for (const spec of validSpecs) {
    // this is to convince the old version of TypeScript that metadata exists even though we already filtered specs
    // without metadata out
    spec.metadata = spec.metadata || {};
    spec.metadata.annotations = spec.metadata.annotations || {};
    delete spec.metadata.annotations[
      "kubectl.kubernetes.io/last-applied-configuration"
    ];
    spec.metadata.annotations[
      "kubectl.kubernetes.io/last-applied-configuration"
    ] = JSON.stringify(spec);
    try {
      // try to get the resource, if it does not exist an error will be thrown and we will end up in the catch
      // block.
      // @ts-ignore
      await client.read(spec);
      // we got the resource, so it exists, so patch it
      //
      // Note that this could fail if the spec refers to a custom resource. For custom resources you may need
      // to specify a different patch merge strategy in the content-type header.
      //
      // See: https://github.com/kubernetes/kubernetes/issues/97423
      const response = await client.patch(spec);
      created.push(response.body);
    } catch (e) {
      // we did not get the resource, so it does not exist, so create it
      const response = await client.create(spec);
      created.push(response.body);
    }
  }

  return created;
}

export async function createRoleBindingForUser(email: string) {
  const spec = `
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: oidc:${email}
subjects:
- kind: User
  name: oidc:${email}
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: ClusterRole
  name: q8s-user
  apiGroup: rbac.authorization.k8s.io
`;

  return apply(spec);
}

const serviceAccountName = (user: string) => `sa-for-user-${user}`;

export function getUserForServiceAccount(sa: string) {
  return sa.replace(/^sa-for-user-/, "");
}

export async function createServiceAccount(user: string) {
  const spec = `
apiversion: v1
kind: ServiceAccount
metadata:
  name: ${serviceAccountName(user)}
`;

  return apply(spec);
}

export async function createRoleBindingForServiceAccount(user: string) {
  const spec = `
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: q8s:${user}
subjects:
  - kind: ServiceAccount
    name: ${serviceAccountName(user)}
    namespace: default
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: q8s-user
`;

  return apply(spec);
}

export async function createSecret(user: string) {
  const spec = `
  apiVersion: v1
  kind: Secret
  metadata:
    name: token-sa-for-user-${user}
    annotations:
      kubernetes.io/service-account.name: ${serviceAccountName(user)}
  type: kubernetes.io/service-account-token
  `;

  return apply(spec);
}
