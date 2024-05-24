"use client";

import Link from "next/link";
import {
  Construction,
  FileStack,
  FlaskConical,
  Footprints,
  Home,
  Settings,
} from "lucide-react";
import { usePathname } from "next/navigation";

export type MenuOption = {
  title: string;
  icon: React.ElementType;
  href: string;
  selected?: boolean;
};

const menuOptions: Record<string, MenuOption[]> = {
  account: [
    {
      title: "Dashboard",
      icon: Home,
      href: "/account/dashboard",
    },
    {
      title: "Jobs",
      icon: FileStack,
      href: "/account/jobs",
    },
    { title: "Settings", icon: Settings, href: "/account/settings" },
    // { title: "Orders", icon: ShoppingCart, href: "#" },
    // { title: "Products", icon: Package, href: "#" },
    // { title: "Analytics", icon: LineChart, href: "#" },
  ],
  docs: [
    {
      title: "Getting started",
      icon: Footprints,
      href: "/docs/getting-started",
    },
    {
      title: "Custom images",
      icon: FlaskConical,
      href: "/docs/custom-images",
    },
    {
      title: "Limitations",
      icon: Construction,
      href: "/docs/limitations",
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
