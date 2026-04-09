import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type UserId = Principal;
export type Timestamp = bigint;
export interface Task {
    id: bigint;
    status: TaskStatus;
    title: string;
    userId: UserId;
    createdAt: Timestamp;
    dueDate: bigint;
    description: string;
    category: TaskCategory;
}
export enum TaskCategory {
    Healthcare = "Healthcare",
    Insurance = "Insurance",
    Bills = "Bills",
    Documents = "Documents",
    Other = "Other"
}
export enum TaskStatus {
    Completed = "Completed",
    Pending = "Pending"
}
export interface backendInterface {
    createTask(title: string, description: string, dueDate: bigint, category: TaskCategory): Promise<bigint>;
    deleteTask(id: bigint): Promise<boolean>;
    getMyTasks(): Promise<Array<Task>>;
    getMyUpcomingTasks(): Promise<Array<Task>>;
    toggleTaskStatus(id: bigint): Promise<boolean>;
    updateTask(id: bigint, title: string, description: string, dueDate: bigint, category: TaskCategory): Promise<boolean>;
}
