"use client";

import TimeAgo from "react-timeago";

interface TimeAgoProps {
  date: string;
}

export default function ClientTimeAgo(props: TimeAgoProps) {
  return <TimeAgo date={props.date} />;
}
