import { Plus } from "lucide-react";

interface FloatingActionButtonProps {
  onClick: () => void;
  label?: string;
}

export function FloatingActionButton({
  onClick,
  label = "Add task",
}: FloatingActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-ocid="fab-add-task"
      aria-label={label}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-smooth flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
      <Plus className="w-6 h-6" />
    </button>
  );
}
