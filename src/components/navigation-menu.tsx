"use client";

import Link from "next/link";
import {
  Construction,
  FileStack,
  FlaskConical,
  Footprints,
  Home,
  Settings,
  User,
} from "lucide-react";
import { usePathname } from "next/navigation";

export type MenuOption = {
  title: string;
  icon: React.ElementType;
  href: string;
  selected?: boolean;
  target?: string;
};

const menuOptions: Record<string, MenuOption[]> = {
  account: [
    {
      title: "Profile",
      icon: Home,
      href: "/account",
    },
    {
      title: "Jobs",
      icon: FileStack,
      href: "/account/jobs",
    },
    { title: "Settings", icon: Settings, href: "/account/settings" },
  ],
  cluster: [
    {
      title: "My account",
      icon: User,
      href: "/account",
    },
    {
      title: "Getting started",
      icon: Footprints,
      href: "https://www.qubernetes.dev/jupyter/getting-started",
      target: "_blank",
    },
  ],
};

type keysOf<T> = T extends Record<infer K, any> ? K : never;

export function NavigationMenu({
  section,
}: {
  section: keysOf<typeof menuOptions>;
}) {
  const pathname = usePathname();

  menuOptions[section].map((option) => {
    if (option.href === pathname) {
      option.selected = true;
    } else {
      option.selected = false;
    }
  });

  return (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
      {menuOptions[section].map((option) => (
        <Link
          target={option.target || "_self"}
          href={option.href}
          className={
            option.selected
              ? "flex items-center gap-3 rounded-lg px-3 py-2 bg-muted text-foreground transition-all hover:text-primary"
              : "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
          }
          key={option.title}
        >
          <option.icon className="h-4 w-4" />
          {option.title}
        </Link>
      ))}
      {/* <Link
        href="#"
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
      >
        <ShoppingCart className="h-4 w-4" />
        Orders
        <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
          6
        </Badge>
      </Link> */}
    </nav>
  );
}
