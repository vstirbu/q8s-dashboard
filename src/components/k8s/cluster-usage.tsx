"use client";

import { CalendarDatum, ResponsiveCalendar } from "@nivo/calendar";
import useSWR from "swr";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTheme } from "next-themes";

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
export function JobsCalendar() {
  const today = new Date();

  const {
    data: { jobsByDate: data } = {
      jobsByDate: [],
    },
  } = useSWR<{
    jobsByDate: CalendarDatum[];
  }>("/api/stats/yearly", async () =>
    fetch("/api/stats/yearly").then((res) => res.json())
  );

  const { resolvedTheme: theme } = useTheme();

  const isDark = theme === "dark";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Utilization</CardTitle>
        <CardDescription>Jobs run per day</CardDescription>
      </CardHeader>
      <CardContent className="w-full h-[200px]">
        <ResponsiveCalendar
          data={data}
          from={`${today.getFullYear()}-01-01`}
          to={`${today.getFullYear()}-12-31`}
          emptyColor={isDark ? "#222" : "#eeeeee"}
          colors={["#61cdbb", "#97e3d5", "#e8c1a0", "#f47560"]}
          margin={{ top: 0, right: 0, bottom: 0, left: 40 }}
          yearSpacing={40}
          monthBorderColor={isDark ? "#444" : "#fff"}
          dayBorderWidth={2}
          dayBorderColor={isDark ? "#333" : "#fff"}
          theme={{
            text: {
              fontSize: 13,
              fill: isDark ? "#aaa" : "#333",
            },
            tooltip: {
              container: {
                background: isDark ? "#444" : "#fff",
              },
            },
          }}
          // legends={[
          //   {
          //     anchor: "bottom-right",
          //     direction: "row",
          //     translateY: 36,
          //     itemCount: 4,
          //     itemWidth: 42,
          //     itemHeight: 36,
          //     itemsSpacing: 14,
          //     itemDirection: "right-to-left",
          //   },
          // ]}
        />
      </CardContent>
    </Card>
  );
}
