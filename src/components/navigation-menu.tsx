"use client";

import Link from "next/link";
import {
  Footprints,
  Home,
  LineChart,
  Package,
  Settings,
  ShoppingCart,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { usePathname } from "next/navigation";

const menuOptions = [
  {
    title: "Dashboard",
    icon: Home,
    href: "/account/dashboard",
    selected: true,
  },
  {
    title: "Getting Started",
    icon: Footprints,
    href: "/account/getting-started",
  },
  { title: "Settings", icon: Settings, href: "/account/settings" },
  // { title: "Orders", icon: ShoppingCart, href: "#" },
  // { title: "Products", icon: Package, href: "#" },
  // { title: "Analytics", icon: LineChart, href: "#" },
];

export function NavigationMenu() {
  const pathname = usePathname();

  menuOptions.map((option) => {
    if (option.href === pathname) {
      option.selected = true;
    } else {
      option.selected = false;
    }
  });

  return (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
      {menuOptions.map((option) => (
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
