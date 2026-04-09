export type TaskCategory =
  | "Bills"
  | "Documents"
  | "Insurance"
  | "Healthcare"
  | "Other";

export type TaskStatus = "Pending" | "Completed";

export interface Task {
  id: bigint;
  userId: string;
  title: string;
  description: string;
  dueDate: bigint;
  category: TaskCategory;
  status: TaskStatus;
  createdAt: bigint;
}

export type UrgencyLevel = "overdue" | "this-week" | "later";

export function getUrgency(dueDateMs: number): UrgencyLevel {
  const now = Date.now();
  const due = dueDateMs;
  const diffDays = (due - now) / (1000 * 60 * 60 * 24);
  if (diffDays < 0) return "overdue";
  if (diffDays <= 7) return "this-week";
  return "later";
}

export function formatDueDate(dueDateMs: number): string {
  return new Date(dueDateMs).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export const CATEGORY_COLORS: Record<TaskCategory, string> = {
  Bills:
    "bg-[oklch(0.95_0.04_25)] text-[oklch(0.45_0.18_25)] border-[oklch(0.85_0.08_25)]",
  Documents:
    "bg-[oklch(0.94_0.04_252)] text-[oklch(0.40_0.14_252)] border-[oklch(0.82_0.08_252)]",
  Insurance:
    "bg-[oklch(0.94_0.05_268)] text-[oklch(0.42_0.14_268)] border-[oklch(0.82_0.09_268)]",
  Healthcare:
    "bg-[oklch(0.94_0.04_160)] text-[oklch(0.40_0.14_160)] border-[oklch(0.82_0.08_160)]",
  Other:
    "bg-[oklch(0.93_0.01_0)] text-[oklch(0.40_0_0)] border-[oklch(0.84_0.01_0)]",
};
