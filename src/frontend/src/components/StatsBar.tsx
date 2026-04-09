import { AlertTriangle, CheckCircle, ListTodo } from "lucide-react";

interface StatsBarProps {
  total: number;
  completed: number;
  overdue: number;
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  sub: string;
  valueClass: string;
  highlight?: boolean;
}

function StatCard({
  icon,
  label,
  value,
  sub,
  valueClass,
  highlight,
}: StatCardProps) {
  return (
    <div
      data-ocid="stat-card"
      className={`bg-card rounded-xl border p-5 shadow-sm transition-smooth flex flex-col gap-1 ${
        highlight ? "border-destructive/30" : "border-border"
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-sm font-medium text-muted-foreground">
          {label}
        </span>
        {icon}
      </div>
      <div className={`text-3xl font-display font-bold ${valueClass}`}>
        {value}
      </div>
      <div
        className={`text-xs ${highlight && value > 0 ? "text-destructive font-medium" : "text-muted-foreground"}`}
      >
        {sub}
      </div>
    </div>
  );
}

export function StatsBar({ total, completed, overdue }: StatsBarProps) {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
      data-ocid="stats-bar"
    >
      <StatCard
        icon={<ListTodo className="w-5 h-5 text-muted-foreground" />}
        label="Total Tasks"
        value={total}
        sub="Tasks tracked"
        valueClass="text-foreground"
      />
      <StatCard
        icon={<CheckCircle className="w-5 h-5 text-muted-foreground" />}
        label="Completed"
        value={completed}
        sub="Completed tasks"
        valueClass="text-[oklch(0.45_0.14_160)]"
      />
      <StatCard
        icon={<AlertTriangle className="w-5 h-5 text-destructive" />}
        label="Overdue"
        value={overdue}
        sub={overdue > 0 ? "Needs attention" : "All clear!"}
        valueClass="text-destructive"
        highlight={overdue > 0}
      />
    </div>
  );
}
