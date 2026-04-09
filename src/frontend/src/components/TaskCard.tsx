import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  Calendar,
  CheckSquare,
  Clock,
  Pencil,
  Square,
  Trash2,
} from "lucide-react";
import type { Task, UrgencyLevel } from "../types";
import { formatDueDate, getUrgency } from "../types";
import { CategoryBadge } from "./CategoryBadge";

interface TaskCardProps {
  task: Task;
  onToggle: (id: bigint) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: bigint) => void;
}

const urgencyConfig: Record<
  UrgencyLevel,
  {
    borderClass: string;
    iconClass: string;
    labelClass: string;
    icon: typeof AlertTriangle;
    label: string;
  }
> = {
  overdue: {
    borderClass: "urgency-overdue",
    iconClass: "text-destructive",
    labelClass: "text-destructive",
    icon: AlertTriangle,
    label: "Overdue",
  },
  "this-week": {
    borderClass: "urgency-this-week",
    iconClass: "text-[oklch(0.62_0.16_64)]",
    labelClass: "text-[oklch(0.55_0.16_64)]",
    icon: Clock,
    label: "Due this week",
  },
  later: {
    borderClass: "urgency-later",
    iconClass: "text-accent",
    labelClass: "text-accent",
    icon: Calendar,
    label: "Upcoming",
  },
};

export function TaskCard({ task, onToggle, onEdit, onDelete }: TaskCardProps) {
  const dueDateMs = Number(task.dueDate);
  const urgency = getUrgency(dueDateMs);
  const {
    borderClass,
    iconClass,
    labelClass,
    icon: UrgencyIcon,
    label,
  } = urgencyConfig[urgency];
  const isCompleted = task.status === "Completed";

  return (
    <div
      data-ocid="task-card"
      className={cn(
        "bg-card rounded-lg p-4 shadow-sm border border-border transition-smooth hover:shadow-md",
        borderClass,
        isCompleted && "opacity-60",
      )}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3
          className={cn(
            "text-sm font-semibold text-foreground leading-snug flex-1 min-w-0",
            isCompleted && "line-through text-muted-foreground",
          )}
        >
          {task.title}
        </h3>
        <CategoryBadge category={task.category} />
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Due date + urgency */}
      <div className={cn("flex items-center gap-1 text-xs mb-3", labelClass)}>
        <UrgencyIcon className={cn("w-3 h-3", iconClass)} />
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground ml-1">
          · Due {formatDueDate(dueDateMs)}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <button
          data-ocid="task-toggle"
          type="button"
          onClick={() => onToggle(task.id)}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-smooth"
          aria-label={isCompleted ? "Mark as pending" : "Mark as complete"}
        >
          {isCompleted ? (
            <CheckSquare className="w-4 h-4 text-primary" />
          ) : (
            <Square className="w-4 h-4" />
          )}
          <span>{isCompleted ? "Completed" : "Mark done"}</span>
        </button>

        <div className="flex items-center gap-1">
          <Button
            data-ocid="task-edit"
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => onEdit(task)}
            aria-label="Edit task"
          >
            <Pencil className="w-3.5 h-3.5" />
          </Button>
          <Button
            data-ocid="task-delete"
            variant="ghost"
            size="icon"
            className="h-7 w-7 hover:text-destructive hover:bg-destructive/10"
            onClick={() => onDelete(task.id)}
            aria-label="Delete task"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
