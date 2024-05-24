"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

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
      <ProgressBar
        // color="#29D"
        color="#666"
        // startPosition={0.3}
        height="4px"
        options={{
          showSpinner: false,
        }}
        shallowRouting
      />
    </ThemeProvider>
  );
}
