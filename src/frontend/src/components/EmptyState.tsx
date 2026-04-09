import { Button } from "@/components/ui/button";
import { ClipboardList } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title = "No tasks found",
  description = "You're all caught up! Add a new task to stay on top of your life admin.",
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div
      data-ocid="empty-state"
      className="flex flex-col items-center justify-center py-20 px-4 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-5 shadow-sm">
        <ClipboardList className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-base font-display font-semibold text-foreground mb-2">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground max-w-xs mb-6">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} data-ocid="empty-state-cta">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
