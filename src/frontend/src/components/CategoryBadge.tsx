import { cn } from "@/lib/utils";
import type { TaskCategory } from "../types";
import { CATEGORY_COLORS } from "../types";

interface CategoryBadgeProps {
  category: TaskCategory;
  size?: "sm" | "md";
}

export function CategoryBadge({ category, size = "sm" }: CategoryBadgeProps) {
  const colorClasses = CATEGORY_COLORS[category];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-medium transition-smooth",
        colorClasses,
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm",
      )}
    >
      {category}
    </span>
  );
}
