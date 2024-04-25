"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";

export default function Dashboard() {
  const { setTheme } = useTheme();

  return (
    <main className="flex min-h-screen flex-col items-center justify p-24">
      <h1>Dashboard</h1>
      <Button
        variant="outline"
        onClick={() => {
          setTheme("system");
        }}
      >
        Click me
      </Button>
    </main>
  );
}
