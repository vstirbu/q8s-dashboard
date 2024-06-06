import Link from "next/link";
import { Rotate3D } from "lucide-react";

export function Logo() {
  return (
    <Link
      href="/cluster/dashboard"
      className="flex items-center gap-2 font-semibold"
    >
      <Rotate3D className="h-6 w-6" />
      <span className="">Qubernetes</span>
    </Link>
  );
}
