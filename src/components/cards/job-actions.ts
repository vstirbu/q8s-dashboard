"use server";

import { auth } from "@/lib/auth";
import { deleteJob } from "@/lib/k8s";
import { revalidatePath } from "next/cache";

export async function deleteJobAction(formData: FormData) {
  const session = await auth();

  if (session === null) {
    return { message: "Unauthorized" };
  }

  const name = formData.get("name") as string;

  await deleteJob(name);

  revalidatePath("/account/jobs");

  return { message: "Job deleted successfully" };
}
