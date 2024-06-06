import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

// export const dynamic = "force-dynamic";
// export const revalidate = 60 * 60 * 6;

export async function GET() {
  const session = await auth();

  if (!session) {
    return new Response(null, {
      status: 401,
    });
  }

  const today = new Date();

  const jobs = await prisma.jobs.findMany({
    where: {
      startTime: {
        gte: new Date(`${today.getFullYear()}-01-01`),
      },
    },
  });

  const jobsByDate = jobs.reduce((acc, job) => {
    // const jobDate = new Date(job.startTime).toLocaleDateString([], {
    //   year: "numeric",
    //   month: "short",
    //   day: "numeric",
    // });

    const jobDate = new Date(job.startTime).toISOString().split("T")[0];

    if (acc[jobDate]) {
      acc[jobDate] += 1;
    } else {
      acc[jobDate] = 1;
    }

    return acc;
  }, {} as Record<string, number>);

  console.log(jobsByDate);

  const data = Object.keys(jobsByDate)
    .map((key) => ({
      day: key,
      value: jobsByDate[key],
    }))
    .sort((a, b) => {
      const dateA = new Date(a.day);
      const dateB = new Date(b.day);

      return dateA.getTime() - dateB.getTime();
    });

  return Response.json({
    jobsByDate: data,
  });
}
