import Link from "next/link";
import {
  Bell,
  CircleUser,
  Home,
  LineChart,
  Menu,
  Moon,
  Package,
  Package2,
  Rotate3D,
  Search,
  ShoppingCart,
  Sun,
  Users,
} from "lucide-react";
import { auth } from "@/lib/auth";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SignOut } from "@/components/signout-button";
import ThemeToggle from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import GettingStarted, {
  // @ts-ignore
  frontmatter,
} from "@/app/account/getting-started/getting-started.mdx";
import { NavigationMenu } from "@/components/navigation-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserDropdownMenu } from "../../../components/user-dropdown-menu";

export default async function Dashboard() {
  const session = await auth();
  const user = session?.user;

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">
          {frontmatter.title}
        </h1>
      </div>

      {/* <div
            className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
            // x-chunk="dashboard-02-chunk-1"
          >
            <ScrollArea className="h-[700px] w-full max-w-3xl prose prose-md dark:prose-invert">
              <GettingStarted />
            </ScrollArea>
            <div className="flex flex-col p-4"></div>
          </div> */}
      <ScrollArea className="h-[600px] w-full rounded-md border p-4">
        <div className="mx-auto max-w-3xl px-4 md:px-6 lg:px-8">
          <div className="space-y-6 prose prose-md dark:prose-invert">
            <GettingStarted />
          </div>
        </div>
      </ScrollArea>
    </main>
  );
}
