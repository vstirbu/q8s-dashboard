import { auth } from "@/lib/auth";
import { getJobs } from "@/lib/k8s";
import JobsList from "@/components/cards/jobs";
import prisma from "@/lib/db";
import { JobRuns } from "@/components/job-runs";

export default async function Jobs() {
  const session = await auth();
  const user = session?.user;

  const jobs = await getJobs(user?.id!);

  const completed = await prisma.jobs.findMany({
    where: {
      ownerId: user?.id,
    },
  });

  const data = completed.reduce((acc, job) => {
    const jobDate = new Date(job.startTime).toLocaleDateString([], {
      // year: "numeric",
      month: "short",
      day: "numeric",
    });

    if (acc[jobDate]) {
      acc[jobDate] += 1;
    } else {
      acc[jobDate] = 1;
    }

    return acc;
  }, arrayOfSevenDaysBeforeToday());

  const transformed = Object.keys(data)
    .map((key) => ({
      x: key,
      y: data[key],
    }))
    .sort((a, b) => {
      const dateA = new Date(a.x);
      const dateB = new Date(b.x);

      return dateA.getTime() - dateB.getTime();
    });

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Jobs</h1>
      </div>
      {/* <div className="flex gap-4">List of jobs</div> */}
      <JobsList jobs={jobs} />
      <JobRuns transformed={transformed} />
      {/* <div
            className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
            x-chunk="dashboard-02-chunk-1"
          >
            <div className="flex flex-col items-center gap-1 text-center">
              <h3 className="text-2xl font-bold tracking-tight">
                You have no products
              </h3>
              <p className="text-sm text-muted-foreground">
                You can start selling as soon as you add a product.
              </p>
              <Button className="mt-4">Add Product</Button>
            </div>
          </div> */}
    </main>
  );
}

function arrayOfSevenDaysBeforeToday() {
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
    });
  });

  return days.reverse().reduce((acc, day) => {
    acc[day] = 0;
    return acc;
  }, {} as Record<string, number>);
}
