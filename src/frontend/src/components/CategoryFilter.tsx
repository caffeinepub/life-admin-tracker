import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { TaskCategory } from "../types";

export type FilterCategory = "All" | TaskCategory;

const CATEGORIES: FilterCategory[] = [
  "All",
  "Bills",
  "Documents",
  "Insurance",
  "Healthcare",
  "Other",
];

interface CategoryFilterProps {
  active: FilterCategory;
  onChange: (category: FilterCategory) => void;
  counts: Record<FilterCategory, number>;
}

export function CategoryFilter({
  active,
  onChange,
  counts,
}: CategoryFilterProps) {
  return (
    <ScrollArea className="w-full" data-ocid="category-filter">
      <div className="flex items-center gap-1 pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => onChange(cat)}
            data-ocid={`filter-${cat.toLowerCase()}`}
            className={cn(
              "shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-smooth border",
              active === cat
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "bg-card text-muted-foreground border-border hover:text-foreground hover:bg-muted",
            )}
          >
            <span>{cat}</span>
            <span
              className={cn(
                "text-xs rounded-full px-1.5 py-0.5 font-semibold leading-none",
                active === cat
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {counts[cat]}
            </span>
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}
