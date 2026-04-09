import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Task, TaskCategory } from "../types";

const CATEGORIES: TaskCategory[] = [
  "Bills",
  "Documents",
  "Insurance",
  "Healthcare",
  "Other",
];

export interface TaskFormData {
  title: string;
  description: string;
  dueDate: string;
  category: TaskCategory;
}

interface TaskModalProps {
  open: boolean;
  task?: Task | null;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => void;
  isLoading?: boolean;
}

function toDateInputValue(dueDateBigInt: bigint): string {
  const d = new Date(Number(dueDateBigInt));
  return d.toISOString().split("T")[0];
}

const EMPTY_FORM: TaskFormData = {
  title: "",
  description: "",
  dueDate: new Date().toISOString().split("T")[0],
  category: "Bills",
};

export function TaskModal({
  open,
  task,
  onClose,
  onSubmit,
  isLoading,
}: TaskModalProps) {
  const isEdit = !!task;
  const [form, setForm] = useState<TaskFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<
    Partial<Record<keyof TaskFormData, string>>
  >({});
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Populate form when modal opens
  useEffect(() => {
    if (!open) return;
    if (task) {
      setForm({
        title: task.title,
        description: task.description,
        dueDate: toDateInputValue(task.dueDate),
        category: task.category,
      });
    } else {
      setForm({
        ...EMPTY_FORM,
        dueDate: new Date().toISOString().split("T")[0],
      });
    }
    setErrors({});
    setTimeout(() => firstInputRef.current?.focus(), 50);
  }, [open, task]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof TaskFormData, string>> = {};
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.dueDate) newErrors.dueDate = "Due date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ ...form, title: form.title.trim() });
  };

  const setField = <K extends keyof TaskFormData>(
    key: K,
    value: TaskFormData[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        role="presentation"
        className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onClose();
        }}
        aria-hidden="true"
      />

      {/* Dialog panel */}
      <dialog
        open
        className="relative z-10 bg-card rounded-2xl shadow-xl border border-border w-full max-w-md m-0 p-0"
        aria-label={isEdit ? "Edit task" : "Create new task"}
        data-ocid="task-modal"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-base font-display font-semibold text-foreground">
            {isEdit ? "Edit Task" : "New Task"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            data-ocid="modal-close"
            className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="task-title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              ref={firstInputRef}
              id="task-title"
              data-ocid="task-title-input"
              placeholder="e.g. Pay electricity bill"
              value={form.title}
              onChange={(e) => setField("title", e.target.value)}
              className={cn(
                errors.title &&
                  "border-destructive focus-visible:ring-destructive/40",
              )}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="task-desc">Description</Label>
            <Textarea
              id="task-desc"
              data-ocid="task-desc-input"
              placeholder="Optional notes or details…"
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Due date + Category row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="task-due">
                Due Date <span className="text-destructive">*</span>
              </Label>
              <Input
                id="task-due"
                type="date"
                data-ocid="task-due-input"
                value={form.dueDate}
                onChange={(e) => setField("dueDate", e.target.value)}
                className={cn(
                  errors.dueDate &&
                    "border-destructive focus-visible:ring-destructive/40",
                )}
              />
              {errors.dueDate && (
                <p className="text-xs text-destructive">{errors.dueDate}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="task-category">Category</Label>
              <select
                id="task-category"
                data-ocid="task-category-select"
                value={form.category}
                onChange={(e) =>
                  setField("category", e.target.value as TaskCategory)
                }
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              data-ocid="modal-cancel"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" data-ocid="modal-submit" disabled={isLoading}>
              {isLoading ? "Saving…" : isEdit ? "Save changes" : "Create task"}
            </Button>
          </div>
        </form>
      </dialog>
    </div>
  );
}
