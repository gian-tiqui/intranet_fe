import { format, formatDistanceToNow } from "date-fns";

export function formatFullDateWithRelative(date: Date): string {
  const fullDate = format(date, "MMMM dd, yyyy");
  const relative = formatDistanceToNow(date, { addSuffix: true });
  return `${fullDate} (${relative})`;
}
