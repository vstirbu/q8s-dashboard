import { headers } from "next/headers";
import { z } from "zod";
import prisma from "@/lib/db";
import { track } from "@vercel/analytics/server";
import { getUserForServiceAccount } from "@/lib/k8s";

const schema = z.object({
  metadata: z.object({
    uid: z.string().uuid(),
    name: z.string(),
    labels: z.object({
      "qubernetes.dev/user": z.string(),
    }),
  }),
  status: z.object({
    startTime: z.string().datetime(),
    completionTime: z.string().datetime().optional(),
    conditions: z
      .array(
        z.object({
          type: z.string(),
          status: z.string(),
        })
      )
      .optional(),
  }),
});

export async function POST(req: Request) {
  const headersList = headers();

  if (
    headersList.get("Authorization") !==
    `Bearer ${process.env.OPERATOR_API_KEY}`
  ) {
    return new Response(null, {
      status: 403,
    });
  }

  const job = await req.json();

  const { data: validated, error } = schema.safeParse(job);

  if (!validated) {
    return new Response(null, {
      status: 400,
    });
  }

  await prisma.jobs.create({
    data: {
      ownerId: getUserForServiceAccount(
        validated.metadata.labels["qubernetes.dev/user"]
      ),
      clusterId: validated.metadata.uid,
      name: validated.metadata.name,
      startTime: validated.status.startTime,
      completionTime: validated.status.completionTime,
      status: validated.status.conditions?.map((c) => c.type)?.[0],
      description: job,
    },
  });

  await track("job-created");

  return new Response(null, {
    status: 200,
  });
}
