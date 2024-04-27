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

export async function getNodes(): Promise<k8s.V1Node[]> {
  const kc = getKubeConfig();

  const client = kc.makeApiClient(k8s.CoreV1Api);

  const response = await client.listNode();
  return response.body.items;
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
