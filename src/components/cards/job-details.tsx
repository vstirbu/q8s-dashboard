import * as k8s from "@kubernetes/client-node";
import { Package, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { DeleteJobButton } from "./job-delete-button";
import { deleteJobAction } from "./job-actions";

const getJobStatus = ({ status, spec }: k8s.V1Job) => {
  if (status?.succeeded! >= spec?.completions!) return "Completed";
  if (status?.failed! >= spec?.backoffLimit!) return "Failed";
  if (
    status?.conditions &&
    status.conditions.find(
      (cond) => cond.type === "Failed" && cond.reason === "DeadlineExceeded"
    )
  ) {
    return "DeadlineExceeded";
  }

  if (status?.active && !status.conditions) return "Pending";

  if (status?.active) return "Running";
  return "Unknown";
};

export function JobDetails({ job }: { job: k8s.V1Job }) {
  console.log(job);

  const status = getJobStatus(job);

  return (
    <div className="flex items-center justify-between border-b last:border-b-0 pb-4">
      <div className="flex items-center gap-2">
        <Package className="h-5 w-5 text-yellow-500" />
        <div>
          <h4 className="font-medium">{job.metadata?.name}</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">{status}</p>
        </div>
      </div>
      <div className="flex flex-grow"></div>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            size="icon"
            className="h-8 w-8 mr-8"
            variant="destructive"
            disabled={status !== "Pending"}
          >
            <Trash className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Job</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this job? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <form action={deleteJobAction}>
              <input type="hidden" name="name" value={job.metadata?.name} />
              <DeleteJobButton />
            </form>
            {/* <JobDeleteForm job={job} /> */}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="text-sm text-gray-500 dark:text-gray-400">
        <p>-</p>
        <p>
          {job.metadata?.creationTimestamp?.toLocaleTimeString([], {
            // hour: "2-digit",
            // minute: "2-digit",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          })}
        </p>
      </div>
    </div>
  );
}
