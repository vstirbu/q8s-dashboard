import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET() {
  const session = await auth();

  if (!session) {
    return new Response(null, {
      status: 401,
    });
  }

  const total = await prisma.user.count();

  const jobs = await prisma.jobs.findMany({
    where: {
      startTime: {
        gte: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
      },
    },
  });

  const users = jobs.reduce((acc, job) => {
    if (!acc.includes(job.ownerId)) {
      acc.push(job.ownerId);
    }

    return acc;
  }, [] as string[]);

  return Response.json({
    total,
    users: users.length,
    jobs: jobs.length,
  });
}
