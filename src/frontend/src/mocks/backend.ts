import type { backendInterface, Task, TaskCategory, TaskStatus } from "../backend";

const now = BigInt(Date.now()) * BigInt(1_000_000);
const oneDay = BigInt(86_400_000_000_000);

const sampleTasks: Task[] = [
  {
    id: BigInt(1),
    title: "Pay Electricity Bill",
    description: "Monthly electricity bill due. Last payment was ₹1,240.",
    dueDate: now + oneDay * BigInt(2),
    category: "Bills" as unknown as TaskCategory,
    status: "Pending" as unknown as TaskStatus,
    userId: { _isPrincipal: true, toText: () => "aaaaa-aa" } as any,
    createdAt: now - oneDay * BigInt(5),
  },
  {
    id: BigInt(2),
    title: "Renew Car Insurance",
    description: "HDFC ERGO comprehensive policy expires soon. Compare quotes before renewing.",
    dueDate: now + oneDay * BigInt(5),
    category: "Insurance" as unknown as TaskCategory,
    status: "Pending" as unknown as TaskStatus,
    userId: { _isPrincipal: true, toText: () => "aaaaa-aa" } as any,
    createdAt: now - oneDay * BigInt(10),
  },
  {
    id: BigInt(3),
    title: "Update Aadhaar Address",
    description: "Update residential address on Aadhaar after moving to new apartment.",
    dueDate: now - oneDay * BigInt(1),
    category: "Documents" as unknown as TaskCategory,
    status: "Pending" as unknown as TaskStatus,
    userId: { _isPrincipal: true, toText: () => "aaaaa-aa" } as any,
    createdAt: now - oneDay * BigInt(20),
  },
  {
    id: BigInt(4),
    title: "Annual Health Checkup",
    description: "Schedule yearly preventive health checkup at Apollo Diagnostics.",
    dueDate: now + oneDay * BigInt(14),
    category: "Healthcare" as unknown as TaskCategory,
    status: "Pending" as unknown as TaskStatus,
    userId: { _isPrincipal: true, toText: () => "aaaaa-aa" } as any,
    createdAt: now - oneDay * BigInt(3),
  },
  {
    id: BigInt(5),
    title: "File ITR for FY 2025-26",
    description: "Income Tax Return filing deadline. Gather Form 16 and investment proofs.",
    dueDate: now + oneDay * BigInt(30),
    category: "Documents" as unknown as TaskCategory,
    status: "Pending" as unknown as TaskStatus,
    userId: { _isPrincipal: true, toText: () => "aaaaa-aa" } as any,
    createdAt: now - oneDay * BigInt(2),
  },
  {
    id: BigInt(6),
    title: "Renew Internet Subscription",
    description: "Jio Fiber annual plan renewal. Auto-pay may have lapsed.",
    dueDate: now + oneDay * BigInt(3),
    category: "Bills" as unknown as TaskCategory,
    status: "Completed" as unknown as TaskStatus,
    userId: { _isPrincipal: true, toText: () => "aaaaa-aa" } as any,
    createdAt: now - oneDay * BigInt(7),
  },
];

export const mockBackend: backendInterface = {
  getMyTasks: async () => sampleTasks,
  getMyUpcomingTasks: async () => sampleTasks.filter(t => t.status === ("Pending" as unknown as TaskStatus)),
  createTask: async (_title, _desc, _due, _cat) => BigInt(sampleTasks.length + 1),
  deleteTask: async (_id) => true,
  toggleTaskStatus: async (_id) => true,
  updateTask: async (_id, _title, _desc, _due, _cat) => true,
};
