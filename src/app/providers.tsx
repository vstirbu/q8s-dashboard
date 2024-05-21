"use client";

import { ThemeProvider } from "@/components/theme-provider";

// https://vercel.com/guides/react-context-state-management-nextjs#rendering-third-party-context-providers-in-server-components
export function Providers({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}
