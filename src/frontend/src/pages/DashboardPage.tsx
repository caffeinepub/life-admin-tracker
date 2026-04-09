import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, Calendar, Clock } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import type { TaskCategory } from "../backend";
import {
  CategoryFilter,
  type FilterCategory,
} from "../components/CategoryFilter";
import { EmptyState } from "../components/EmptyState";
import { FloatingActionButton } from "../components/FloatingActionButton";
import { Layout } from "../components/Layout";
import { SearchBar } from "../components/SearchBar";
import { StatsBar } from "../components/StatsBar";
import { TaskCard } from "../components/TaskCard";
import { type TaskFormData, TaskModal } from "../components/TaskModal";
import { useAuth } from "../hooks/useAuth";
import { useBackend } from "../hooks/useBackend";
import type { Task } from "../types";
import { getUrgency } from "../types";

// ---------------------------------------------------------------------------
// Sample / demo data shown when user is not yet authenticated
// ---------------------------------------------------------------------------
const SAMPLE_TASKS: Task[] = [
  {
    id: BigInt(1),
    userId: "sample",
    title: "Pay Electricity Bill",
    description: "Monthly electricity bill — BESCOM provider",
    dueDate: BigInt(Date.now() - 2 * 24 * 60 * 60 * 1000),
    category: "Bills",
    status: "Pending",
    createdAt: BigInt(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: BigInt(2),
    userId: "sample",
    title: "Renew Vehicle Insurance",
    description: "Two-wheeler insurance renewal with HDFC Ergo",
    dueDate: BigInt(Date.now() - 5 * 24 * 60 * 60 * 1000),
    category: "Insurance",
    status: "Pending",
    createdAt: BigInt(Date.now() - 30 * 24 * 60 * 60 * 1000),
  },
  {
    id: BigInt(3),
    userId: "sample",
    title: "Update Aadhaar Address",
    description: "Update residential address on Aadhaar after moving",
    dueDate: BigInt(Date.now() + 3 * 24 * 60 * 60 * 1000),
    category: "Documents",
    status: "Pending",
    createdAt: BigInt(Date.now() - 10 * 24 * 60 * 60 * 1000),
  },
  {
    id: BigInt(4),
    userId: "sample",
    title: "Book Annual Health Checkup",
    description: "Schedule preventive health screening at Apollo",
    dueDate: BigInt(Date.now() + 5 * 24 * 60 * 60 * 1000),
    category: "Healthcare",
    status: "Pending",
    createdAt: BigInt(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: BigInt(5),
    userId: "sample",
    title: "Renew Passport",
    description: "Current passport expires in 6 months — start renewal early",
    dueDate: BigInt(Date.now() + 25 * 24 * 60 * 60 * 1000),
    category: "Documents",
    status: "Pending",
    createdAt: BigInt(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: BigInt(6),
    userId: "sample",
    title: "File Income Tax Return",
    description: "ITR for FY 2025–26 — gather Form 16 and investment proofs",
    dueDate: BigInt(Date.now() + 45 * 24 * 60 * 60 * 1000),
    category: "Other",
    status: "Pending",
    createdAt: BigInt(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: BigInt(7),
    userId: "sample",
    title: "Pay Credit Card Bill",
    description: "HDFC credit card due — avoid late fee",
    dueDate: BigInt(Date.now() + 2 * 24 * 60 * 60 * 1000),
    category: "Bills",
    status: "Completed",
    createdAt: BigInt(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
];

let nextSampleId = BigInt(100);

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------
export default function DashboardPage() {
  const { loginStatus } = useAuth();
  const { backend } = useBackend();

  // Local task state (either sample or fetched from backend)
  const [tasks, setTasks] = useState<Task[]>(SAMPLE_TASKS);
  const [isFetchingTasks, setIsFetchingTasks] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<FilterCategory>("All");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch real tasks when backend becomes available
  useEffect(() => {
    if (!backend) return;
    let cancelled = false;
    async function fetchTasks() {
      if (!backend) return;
      setIsFetchingTasks(true);
      try {
        // @ts-expect-error — backend.d.ts is auto-generated and may not have these methods yet
        const result: Task[] = await backend.getMyTasks();
        if (!cancelled) {
          setTasks(result.length > 0 ? result : SAMPLE_TASKS);
        }
      } catch {
        // Backend not yet set up — keep sample tasks
      } finally {
        if (!cancelled) setIsFetchingTasks(false);
      }
    }
    fetchTasks();
    return () => {
      cancelled = true;
    };
  }, [backend]);

  // Debounce search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(
      () => setDebouncedSearch(searchQuery),
      300,
    );
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery]);

  // ---------------------------------------------------------------------------
  // Derived data
  // ---------------------------------------------------------------------------
  const filteredTasks = useMemo(() => {
    let list = tasks;
    if (activeCategory !== "All") {
      list = list.filter((t) => t.category === activeCategory);
    }
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q),
      );
    }
    return list;
  }, [tasks, activeCategory, debouncedSearch]);

  const pendingFiltered = filteredTasks.filter((t) => t.status === "Pending");
  const overdueTasks = pendingFiltered.filter(
    (t) => getUrgency(Number(t.dueDate)) === "overdue",
  );
  const thisWeekTasks = pendingFiltered.filter(
    (t) => getUrgency(Number(t.dueDate)) === "this-week",
  );
  const laterTasks = pendingFiltered.filter(
    (t) => getUrgency(Number(t.dueDate)) === "later",
  );

  const totalOverdue = tasks.filter(
    (t) =>
      t.status === "Pending" && getUrgency(Number(t.dueDate)) === "overdue",
  ).length;
  const totalCompleted = tasks.filter((t) => t.status === "Completed").length;

  // Category counts for filter tabs
  const categoryCounts = useMemo(() => {
    const base = tasks.filter((t) => {
      if (!debouncedSearch.trim()) return true;
      const q = debouncedSearch.toLowerCase();
      return (
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
      );
    });
    const counts: Record<FilterCategory, number> = {
      All: base.length,
      Bills: base.filter((t) => t.category === "Bills").length,
      Documents: base.filter((t) => t.category === "Documents").length,
      Insurance: base.filter((t) => t.category === "Insurance").length,
      Healthcare: base.filter((t) => t.category === "Healthcare").length,
      Other: base.filter((t) => t.category === "Other").length,
    };
    return counts;
  }, [tasks, debouncedSearch]);

  const hasAnyResults =
    overdueTasks.length + thisWeekTasks.length + laterTasks.length > 0;

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------
  const handleToggle = useCallback(
    async (id: bigint) => {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === id
            ? {
                ...t,
                status: t.status === "Completed" ? "Pending" : "Completed",
              }
            : t,
        ),
      );
      if (backend) {
        try {
          await backend.toggleTaskStatus(id);
        } catch {
          toast.error("Failed to update task");
        }
      }
      toast.success("Task status updated");
    },
    [backend],
  );

  const handleDelete = useCallback(
    async (id: bigint) => {
      setTasks((prev) => prev.filter((t) => t.id !== id));
      if (backend) {
        try {
          await backend.deleteTask(id);
        } catch {
          toast.error("Failed to delete task");
        }
      }
      toast.success("Task deleted");
    },
    [backend],
  );

  const handleEdit = useCallback((task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  }, []);

  const handleOpenCreate = useCallback(() => {
    setEditingTask(null);
    setModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setModalOpen(false);
    setEditingTask(null);
  }, []);

  const handleModalSubmit = useCallback(
    async (data: TaskFormData) => {
      setIsSaving(true);
      const dueDateMs = BigInt(new Date(data.dueDate).getTime());

      if (editingTask) {
        // Optimistic update
        setTasks((prev) =>
          prev.map((t) =>
            t.id === editingTask.id
              ? {
                  ...t,
                  title: data.title,
                  description: data.description,
                  dueDate: dueDateMs,
                  category: data.category as TaskCategory,
                }
              : t,
          ),
        );
        if (backend) {
          try {
            await backend.updateTask(
              editingTask.id,
              data.title,
              data.description,
              dueDateMs,
              data.category as TaskCategory,
            );
          } catch {
            toast.error("Failed to update task");
          }
        }
        toast.success("Task updated");
      } else {
        // Create task
        const newTask: Task = {
          id: nextSampleId++,
          userId: "local",
          title: data.title,
          description: data.description,
          dueDate: dueDateMs,
          category: data.category as TaskCategory,
          status: "Pending",
          createdAt: BigInt(Date.now()),
        };
        setTasks((prev) => [newTask, ...prev]);

        if (backend) {
          try {
            const id = await backend.createTask(
              data.title,
              data.description,
              dueDateMs,
              data.category as TaskCategory,
            );
            setTasks((prev) =>
              prev.map((t) =>
                t.id === newTask.id ? { ...t, id: BigInt(id) } : t,
              ),
            );
          } catch {
            toast.error("Failed to save task to backend");
          }
        }
        toast.success("Task created");
      }

      setIsSaving(false);
      handleModalClose();
    },
    [backend, editingTask, handleModalClose],
  );

  // ---------------------------------------------------------------------------
  // Loading skeleton
  // ---------------------------------------------------------------------------
  if (loginStatus === "initializing" || isFetchingTasks) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-9 w-full mb-4 rounded-lg" />
          <Skeleton className="h-9 w-full mb-6 rounded-full" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col gap-3">
                <Skeleton className="h-6 w-32" />
                {[1, 2].map((j) => (
                  <Skeleton key={j} className="h-32 rounded-lg" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  // ---------------------------------------------------------------------------
  // Full dashboard
  // ---------------------------------------------------------------------------
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        {/* Page header */}
        <div className="flex items-start justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground tracking-tight">
              Dashboard Overview
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Stats */}
        <StatsBar
          total={tasks.length}
          completed={totalCompleted}
          overdue={totalOverdue}
        />

        {/* Search + filter bar */}
        <div className="flex flex-col gap-3 mb-6">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <CategoryFilter
            active={activeCategory}
            onChange={setActiveCategory}
            counts={categoryCounts}
          />
        </div>

        {/* Task grid — 3 urgency columns */}
        {hasAnyResults ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TaskColumn
              title="Overdue"
              icon={<AlertTriangle className="w-4 h-4 text-destructive" />}
              tasks={overdueTasks}
              emptyLabel="No overdue tasks 🎉"
              onToggle={handleToggle}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
            <TaskColumn
              title="Due This Week"
              icon={<Clock className="w-4 h-4 text-[oklch(0.55_0.16_64)]" />}
              tasks={thisWeekTasks}
              emptyLabel="Nothing due this week"
              onToggle={handleToggle}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
            <TaskColumn
              title="Due Later"
              icon={<Calendar className="w-4 h-4 text-accent" />}
              tasks={laterTasks}
              emptyLabel="No upcoming tasks"
              onToggle={handleToggle}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        ) : (
          <EmptyState
            title={
              debouncedSearch
                ? `No tasks matching "${debouncedSearch}"`
                : activeCategory !== "All"
                  ? `No tasks in ${activeCategory}`
                  : "No tasks yet"
            }
            description={
              debouncedSearch || activeCategory !== "All"
                ? "Try a different search term or category."
                : "Add your first task using the + button below."
            }
            actionLabel="Add task"
            onAction={handleOpenCreate}
          />
        )}
      </div>

      {/* Create / Edit modal */}
      <TaskModal
        open={modalOpen}
        task={editingTask}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        isLoading={isSaving}
      />

      {/* Floating action button */}
      <FloatingActionButton onClick={handleOpenCreate} />
    </Layout>
  );
}

// ---------------------------------------------------------------------------
// TaskColumn sub-component
// ---------------------------------------------------------------------------
interface TaskColumnProps {
  title: string;
  icon: React.ReactNode;
  tasks: Task[];
  emptyLabel: string;
  onToggle: (id: bigint) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: bigint) => void;
}

function TaskColumn({
  title,
  icon,
  tasks,
  emptyLabel,
  onToggle,
  onEdit,
  onDelete,
}: TaskColumnProps) {
  return (
    <div data-ocid="task-column">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h2 className="text-sm font-display font-semibold text-foreground">
          {title}
        </h2>
        <span className="ml-auto text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5">
          {tasks.length}
        </span>
      </div>
      <div className="flex flex-col gap-3">
        {tasks.length === 0 ? (
          <div
            data-ocid="column-empty"
            className="bg-card border border-border rounded-lg p-6 text-center"
          >
            <p className="text-sm text-muted-foreground">{emptyLabel}</p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={String(task.id)}
              task={task}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}
