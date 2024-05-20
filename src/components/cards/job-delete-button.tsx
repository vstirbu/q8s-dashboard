"use client";

import { Button } from "../ui/button";
import { useFormStatus } from "react-dom";

export function DeleteJobButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant="destructive" disabled={pending}>
      Delete
    </Button>
  );
}
