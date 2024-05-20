// https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#server-side-validation-and-error-handling
// "use client";

// import * as k8s from "@kubernetes/client-node";
// import { deleteJobAction } from "./job-actions";
// import { DeleteJobButton } from "./job-delete-button";
// import { useActionState } from "react";

// export function JobDeleteForm(props: { job: k8s.V1Job }) {
//   const [state, formAction] = useActionState(deleteJobAction, {
//     message: "",
//   });

//   return (
//     <form action={formAction}>
//       <input type="hidden" name="name" value={props.job.metadata?.name} />
//       <DeleteJobButton />
//     </form>
//   );
// }
